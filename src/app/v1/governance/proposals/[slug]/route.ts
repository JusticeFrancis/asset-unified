import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/server/mongodb";
import { AppRecordModel, GovernanceVoteModel, InvestmentModel } from "@/lib/server/models";
import { requireUser } from "@/lib/server/request";
import { apiError } from "@/lib/server/responses";
import { serializeRecord } from "@/lib/server/serializers";

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const auth = await requireUser(request); if (auth.error) return auth.error;
  const { slug } = await params;
  await connectMongo();
  const proposal = await AppRecordModel.findOne({ resource: "governance-proposal", slug, published: true }).lean();
  if (!proposal) return apiError("NOT_FOUND", "Proposal not found", 404);
  const [votes, userVote, votingPower] = await Promise.all([
    GovernanceVoteModel.aggregate([{ $match: { proposalId: proposal._id } }, { $group: { _id: "$choice", count: { $sum: "$weight" } } }]),
    GovernanceVoteModel.findOne({ proposalId: proposal._id, userId: auth.user._id }).lean(),
    InvestmentModel.aggregate([{ $match: { userId: auth.user._id, status: "completed", ...(proposal.data?.propertySlug ? { propertySlug: proposal.data.propertySlug } : {}) } }, { $group: { _id: null, total: { $sum: "$shares" } } }]),
  ]);
  const tally: any = { for: 0, against: 0, abstain: 0 }; votes.forEach((v: any) => { tally[v._id] = Number(v.count || 0); });
  const total = tally.for + tally.against + tally.abstain; const pct = (v: number) => total ? Math.round(v / total * 100) : 0;
  return NextResponse.json({
    ...serializeRecord(proposal),
    forPct: pct(tally.for), againstPct: pct(tally.against), abstainPct: pct(tally.abstain),
    voteTally: { for: { count: tally.for, pct: pct(tally.for) }, against: { count: tally.against, pct: pct(tally.against) }, abstain: { count: tally.abstain, pct: pct(tally.abstain) } },
    userVotingPower: Number(votingPower[0]?.total || 0),
    seedHasVoted: Boolean(userVote),
    userVoteSummary: userVote ? { choice: userVote.choice, votes: userVote.weight, dateLabel: userVote.createdAt?.toISOString?.() ?? userVote.createdAt } : undefined,
  });
}
