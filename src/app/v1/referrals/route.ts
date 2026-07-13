import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/server/mongodb";
import { ReferralModel, UserModel } from "@/lib/server/models";
import { ensureReferralCode } from "@/lib/server/referrals";
import { readJson, requireUser } from "@/lib/server/request";
import { apiError } from "@/lib/server/responses";

export async function GET(request: Request) {
  const auth = await requireUser(request); if (auth.error) return auth.error;
  await connectMongo();
  const referralCode = await ensureReferralCode(auth.user);
  const rows = await ReferralModel.find({ referrerId: auth.user._id }).populate("referredUserId", "fullName email avatarUrl createdAt").sort({ createdAt: -1 }).lean();
  const origin = new URL(request.url).origin;
  const referrals = rows.map((row: any) => ({
    id: String(row._id),
    name: row.referredUserId?.fullName ?? "Pending invitation",
    email: row.referredUserId?.email ?? row.email ?? "",
    avatarSrc: row.referredUserId?.avatarUrl ?? null,
    signUpDate: row.referredUserId?.createdAt?.toISOString?.() ?? row.createdAt?.toISOString?.() ?? row.createdAt,
    status: row.status,
    rewardAmount: Number(row.rewardAmount || 0),
    rewardAsset: row.rewardAsset,
    points: Number(row.points || 0),
  }));
  return NextResponse.json({
    referralCode,
    referralLink: `${origin}/sign-in?ref=${encodeURIComponent(referralCode)}`,
    referrals,
    stats: {
      total: referrals.length,
      qualified: referrals.filter((r: any) => ["qualified", "rewarded"].includes(r.status)).length,
      rewards: referrals.reduce((sum: number, r: any) => sum + r.rewardAmount, 0),
      availableRewards: referrals.filter((r: any) => r.status === "qualified").reduce((sum: number, r: any) => sum + r.rewardAmount, 0),
      claimedRewards: referrals.filter((r: any) => r.status === "rewarded").reduce((sum: number, r: any) => sum + r.rewardAmount, 0),
      lockedRewards: referrals.filter((r: any) => ["invited", "registered"].includes(r.status)).reduce((sum: number, r: any) => sum + r.rewardAmount, 0),
      points: referrals.reduce((sum: number, r: any) => sum + r.points, 0),
    },
  });
}

export async function POST(request: Request) {
  const auth = await requireUser(request); if (auth.error) return auth.error;
  const body = await readJson<any>(request);
  const email = String(body.email ?? "").trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email)) return apiError("INVALID_EMAIL", "Enter a valid email address", 422);
  if (email === auth.user.email) return apiError("VALIDATION_ERROR", "You cannot refer your own email address", 422);
  await connectMongo();
  const existingUser = await UserModel.findOne({ email }).lean();
  const referral = await ReferralModel.findOneAndUpdate(
    { referrerId: auth.user._id, email },
    { $setOnInsert: { referrerId: auth.user._id, email, referredUserId: existingUser?._id ?? null, status: existingUser ? "registered" : "invited" } },
    { upsert: true, new: true },
  );
  return NextResponse.json({ referral: { id: String(referral._id), email, status: referral.status } }, { status: 201 });
}
