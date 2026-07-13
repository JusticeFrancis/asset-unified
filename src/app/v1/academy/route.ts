import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/server/mongodb";
import { AcademyProfileModel, AppRecordModel, InvestmentModel, ReferralModel, UserModel } from "@/lib/server/models";
import { readJson, requireUser } from "@/lib/server/request";
import { apiError } from "@/lib/server/responses";
import { serializeRecord } from "@/lib/server/serializers";
import { ensureReferralCode } from "@/lib/server/referrals";

export async function GET(request: Request) {
  const auth = await requireUser(request); if (auth.error) return auth.error;
  await connectMongo();
  const [profile, quests, faq, rewards, leaders, investments, referrals] = await Promise.all([
    AcademyProfileModel.findOneAndUpdate({ userId: auth.user._id }, { $setOnInsert: { userId: auth.user._id } }, { upsert: true, new: true }).lean(),
    AppRecordModel.find({ resource: "academy-quest", published: true, status: "active" }).sort({ sortOrder: 1, createdAt: -1 }).lean(),
    AppRecordModel.find({ resource: "academy-faq", published: true, status: "active" }).sort({ sortOrder: 1, createdAt: -1 }).lean(),
    AppRecordModel.find({ resource: "academy-reward", published: true, status: { $in: ["active", "claimed"] } }).sort({ sortOrder: 1, createdAt: -1 }).lean(),
    AcademyProfileModel.find({}).sort({ totalPoints: -1, updatedAt: 1 }).limit(20).populate("userId", "fullName avatarUrl").lean(),
    InvestmentModel.find({ userId: auth.user._id, status: "completed" }).sort({ createdAt: -1 }).lean(),
    ReferralModel.find({ referrerId: auth.user._id }).lean(),
  ]);
  const propertyIds = [...new Set(investments.map((row: any) => String(row.propertyId)).filter(Boolean))];
  const properties = propertyIds.length ? await AppRecordModel.find({ _id: { $in: propertyIds } }).lean() : [];
  const propertyMap = new Map(properties.map((row: any) => [String(row._id), serializeRecord(row)]));
  const farmingAssets = investments.map((row: any) => {
    const property: any = propertyMap.get(String(row.propertyId));
    return {
      id: String(row._id),
      title: property?.title || property?.name || row.propertySlug,
      image: property?.image || property?.coverImage || property?.images?.[0] || null,
      shares: Number(row.shares || 0),
      availablePoints: Number(row.metadata?.claimablePoints || 0),
      claimed: Boolean(row.metadata?.farmingPointsClaimedAt),
    };
  });
  const rank = await AcademyProfileModel.countDocuments({ totalPoints: { $gt: Number(profile?.totalPoints || 0) } }) + 1;
  const referralCode = auth.user.referralCode || await ensureReferralCode(auth.user._id);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
  const registered = referrals.filter((row: any) => ["registered", "qualified", "rewarded"].includes(row.status)).length;
  const qualified = referrals.filter((row: any) => ["qualified", "rewarded"].includes(row.status)).length;
  const rewarded = referrals.filter((row: any) => row.status === "rewarded").length;
  const referralPoints = referrals.reduce((sum: number, row: any) => sum + Number(row.points || 0), 0);
  return NextResponse.json({
    profile: { totalPoints: Number(profile?.totalPoints || 0), questPoints: Number(profile?.questPoints || 0), farmingPoints: Number(profile?.farmingPoints || 0), referralPoints: Number(profile?.referralPoints || referralPoints || 0), rank, level: Number(profile?.level || 1), streak: Number(profile?.streak || 0), completedQuestSlugs: profile?.completedQuestSlugs ?? [] },
    quests: quests.map(serializeRecord),
    faq: faq.map(serializeRecord),
    rewards: rewards.map(serializeRecord),
    farmingAssets,
    referrals: { link: `${appUrl.replace(/\/$/, "")}/sign-in?ref=${encodeURIComponent(referralCode)}`, registered, qualified, rewarded, points: referralPoints },
    leaderboard: leaders.map((row: any, index: number) => ({ rank: index + 1, name: row.userId?.fullName || "Asset Union member", avatar: row.userId?.avatarUrl || null, points: Number(row.totalPoints || 0) })),
  });
}

export async function POST(request: Request) {
  const auth = await requireUser(request); if (auth.error) return auth.error;
  const body = await readJson<any>(request);
  await connectMongo();
  if (body.investmentId) {
    const investment = await InvestmentModel.findOne({ _id: String(body.investmentId), userId: auth.user._id, status: "completed" });
    if (!investment) return apiError("NOT_FOUND", "Investment not found", 404);
    const points = Number(investment.metadata?.claimablePoints || 0);
    if (points <= 0 || investment.metadata?.farmingPointsClaimedAt) return apiError("NOTHING_TO_CLAIM", "No farming points are available", 409);
    investment.metadata = { ...investment.metadata, farmingPointsClaimedAt: new Date(), claimablePoints: 0 };
    await investment.save();
    const profile = await AcademyProfileModel.findOneAndUpdate({ userId: auth.user._id }, { $inc: { totalPoints: points, farmingPoints: points }, $setOnInsert: { userId: auth.user._id } }, { upsert: true, new: true });
    return NextResponse.json({ claimed: points, totalPoints: Number(profile.totalPoints || 0) });
  }
  const questSlug = String(body.questSlug ?? "");
  if (!questSlug) return apiError("VALIDATION_ERROR", "Quest is required", 422);
  const quest = await AppRecordModel.findOne({ resource: "academy-quest", slug: questSlug, published: true, status: "active" }).lean();
  if (!quest) return apiError("NOT_FOUND", "Quest not found", 404);
  const points = Number(quest.data?.points ?? 0);
  if (!Number.isFinite(points) || points < 0) return apiError("QUEST_CONFIGURATION_ERROR", "Quest points are invalid", 409);
  const existing = await AcademyProfileModel.findOne({ userId: auth.user._id, completedQuestSlugs: questSlug });
  if (existing) return apiError("QUEST_ALREADY_COMPLETED", "You have already completed this quest", 409);
  const profile = await AcademyProfileModel.findOneAndUpdate(
    { userId: auth.user._id },
    { $inc: { totalPoints: points, questPoints: points }, $addToSet: { completedQuestSlugs: questSlug }, $setOnInsert: { userId: auth.user._id } },
    { upsert: true, new: true },
  );
  return NextResponse.json({ completed: questSlug, pointsAwarded: points, totalPoints: profile.totalPoints });
}
