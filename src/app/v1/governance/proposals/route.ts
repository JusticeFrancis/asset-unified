import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/server/mongodb";
import { AppRecordModel, GovernanceVoteModel, InvestmentModel } from "@/lib/server/models";
import { cleanSlug, readJson, requireUser } from "@/lib/server/request";
import { apiError } from "@/lib/server/responses";
import { serializeRecord } from "@/lib/server/serializers";

async function withVoteData(records: any[], userId: unknown) {
  const ids = records.map((r) => r._id);
  const [votes, userVotes] = await Promise.all([
    GovernanceVoteModel.aggregate([
      { $match: { proposalId: { $in: ids } } },
      { $group: { _id: { proposalId: "$proposalId", choice: "$choice" }, count: { $sum: "$weight" } } },
    ]),
    GovernanceVoteModel.find({ proposalId: { $in: ids }, userId }).lean(),
  ]);
  const totals = new Map<string, Record<string, number>>();
  for (const row of votes) {
    const id = String(row._id.proposalId); const current = totals.get(id) ?? { for: 0, against: 0, abstain: 0 };
    current[row._id.choice] = Number(row.count || 0); totals.set(id, current);
  }
  const byUser = new Map(userVotes.map((v: any) => [String(v.proposalId), v]));
  return records.map((record) => {
    const base = serializeRecord(record);
    const tally = totals.get(String(record._id)) ?? { for: 0, against: 0, abstain: 0 };
    const total = tally.for + tally.against + tally.abstain;
    const pct = (value: number) => total > 0 ? Math.round((value / total) * 100) : 0;
    const userVote: any = byUser.get(String(record._id));
    return {
      ...base,
      forPct: pct(tally.for), againstPct: pct(tally.against), abstainPct: pct(tally.abstain),
      voteTally: {
        for: { count: tally.for, pct: pct(tally.for) },
        against: { count: tally.against, pct: pct(tally.against) },
        abstain: { count: tally.abstain, pct: pct(tally.abstain) },
      },
      seedHasVoted: Boolean(userVote),
      userVoteSummary: userVote ? { choice: userVote.choice, votes: userVote.weight, dateLabel: userVote.createdAt?.toISOString?.() ?? userVote.createdAt } : undefined,
    };
  });
}

export async function GET(request: Request) {
  const auth = await requireUser(request); if (auth.error) return auth.error;
  const url = new URL(request.url); const status = url.searchParams.get("status");
  const query: any = { resource: "governance-proposal", published: true };
  if (status && status !== "all") query.status = status;
  await connectMongo();
  const [records, powerRows] = await Promise.all([
    AppRecordModel.find(query).sort({ createdAt: -1 }).lean(),
    InvestmentModel.aggregate([{ $match: { userId: auth.user._id, status: "completed" } }, { $group: { _id: null, total: { $sum: "$shares" } } }]),
  ]);
  const proposals = await withVoteData(records, auth.user._id);
  return NextResponse.json({
    proposals,
    stats: {
      activeCount: proposals.filter((proposal: any) => proposal.status === "active").length,
      passedCount: proposals.filter((proposal: any) => proposal.status === "closed" && proposal.forPct > proposal.againstPct).length,
      votedCount: proposals.filter((proposal: any) => proposal.seedHasVoted).length,
      votingPower: Number(powerRows[0]?.total || 0),
    },
  });
}

export async function POST(request: Request) {
  const auth = await requireUser(request); if (auth.error) return auth.error;
  const body = await readJson<any>(request);
  const title = String(body.title ?? "").trim();
  const description = String(body.description ?? "").trim();
  if (!title || !description) return apiError("VALIDATION_ERROR", "Title and description are required", 422);
  await connectMongo();
  const votingPower = await InvestmentModel.aggregate([
    { $match: { userId: auth.user._id, status: "completed" } },
    { $group: { _id: null, total: { $sum: "$shares" } } },
  ]);
  if (Number(votingPower[0]?.total || 0) <= 0) return apiError("NO_VOTING_POWER", "You need completed property shares to create a proposal", 403);
  const baseSlug = cleanSlug(body.slug || title);
  let slug = baseSlug; let suffix = 1;
  while (await AppRecordModel.exists({ resource: "governance-proposal", slug })) slug = `${baseSlug}-${suffix++}`;
  const closesAt = body.closesAt ? new Date(body.closesAt) : new Date(Date.now() + 7 * 86400_000);
  const data = {
    breadcrumbLabel: String(body.breadcrumbLabel ?? title),
    title,
    propertyLine: String(body.propertyLine ?? body.property ?? ""),
    propertyShort: String(body.propertyShort ?? body.property ?? ""),
    propertySlug: body.propertySlug ?? null,
    categoryLabel: String(body.categoryLabel ?? body.type ?? "General"),
    proposerNote: auth.user.fullName || auth.user.email,
    eligibleVotes: Number(body.eligibleVotes ?? votingPower[0]?.total ?? 0),
    daysLeft: null,
    locationDetail: String(body.locationDetail ?? ""),
    description,
    proposedBy: auth.user.fullName || auth.user.email,
    dateSubmitted: new Date().toISOString(),
    votingCloses: closesAt.toISOString(),
    closesAt: closesAt.toISOString(),
    cost: String(body.cost ?? "—"),
    quorumRequired: String(body.quorumRequired ?? "51% of eligible votes"),
    castSummary: "0 votes cast",
    quorumMessage: "Quorum has not been reached.",
    userVotingPower: Number(votingPower[0]?.total ?? 0),
    voteBlurbs: body.voteBlurbs ?? { for: "Approve this proposal", against: "Reject this proposal", abstain: "Count toward quorum only" },
  };
  const record = await AppRecordModel.create({ resource: "governance-proposal", slug, title, status: "active", published: true, ownerId: auth.user._id, data });
  return NextResponse.json(serializeRecord(record), { status: 201 });
}
