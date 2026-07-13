import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/server/mongodb";
import { AppRecordModel, GovernanceVoteModel, InvestmentModel } from "@/lib/server/models";
import { readJson, requireUser } from "@/lib/server/request";
import { apiError } from "@/lib/server/responses";

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const auth = await requireUser(request); if (auth.error) return auth.error;
  const { slug } = await params; const body = await readJson<any>(request);
  const choice = String(body.choice ?? "");
  if (!["for", "against", "abstain"].includes(choice)) return apiError("VALIDATION_ERROR", "Select a valid vote", 422);
  await connectMongo();
  const proposal = await AppRecordModel.findOne({ resource: "governance-proposal", slug, published: true, status: "active" });
  if (!proposal) return apiError("NOT_FOUND", "Active proposal not found", 404);
  const closesAt = proposal.data?.closesAt ? new Date(proposal.data.closesAt) : null;
  if (closesAt && closesAt <= new Date()) return apiError("VOTING_CLOSED", "Voting has closed for this proposal", 409);
  const result = await InvestmentModel.aggregate([{ $match: { userId: auth.user._id, status: "completed", ...(proposal.data?.propertySlug ? { propertySlug: proposal.data.propertySlug } : {}) } }, { $group: { _id: null, total: { $sum: "$shares" } } }]);
  const weight = Number(result[0]?.total || 0);
  if (weight <= 0) return apiError("NO_VOTING_POWER", "You do not have eligible shares for this proposal", 403);
  try {
    const vote = await GovernanceVoteModel.create({ proposalId: proposal._id, userId: auth.user._id, choice, weight });
    return NextResponse.json({ vote: { id: String(vote._id), choice, weight, createdAt: vote.createdAt.toISOString() } }, { status: 201 });
  } catch (error: any) {
    if (error?.code === 11000) return apiError("ALREADY_VOTED", "You have already voted on this proposal", 409);
    throw error;
  }
}
