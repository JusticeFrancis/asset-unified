import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/server/mongodb";
import { CouponModel, CouponRedemptionModel } from "@/lib/server/models";
import { readJson, requireUser } from "@/lib/server/request";
import { apiError } from "@/lib/server/responses";

export async function POST(request: Request) {
  const auth = await requireUser(request); if (auth.error) return auth.error;
  const body = await readJson<any>(request);
  const code = String(body.code ?? "").trim().toUpperCase();
  if (!code) return apiError("VALIDATION_ERROR", "Coupon code is required", 422);
  await connectMongo();
  const now = new Date();
  const coupon = await CouponModel.findOne({
    code,
    status: "active",
    $and: [
      { $or: [{ startsAt: null }, { startsAt: { $lte: now } }] },
      { $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }] },
    ],
  });
  if (!coupon) return apiError("INVALID_COUPON", "This coupon is invalid or expired", 404);
  if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) return apiError("COUPON_LIMIT_REACHED", "This coupon has reached its usage limit", 409);
  if (Array.isArray(coupon.userIds) && coupon.userIds.length > 0 && !coupon.userIds.some((id: any) => String(id) === String(auth.user._id))) {
    return apiError("FORBIDDEN", "This coupon is not assigned to your account", 403);
  }
  const existing = await CouponRedemptionModel.findOne({ couponId: coupon._id, userId: auth.user._id });
  if (existing?.status === "used") return apiError("COUPON_ALREADY_USED", "This coupon has already been used", 409);
  if (existing?.status === "expired") return apiError("INVALID_COUPON", "This coupon is expired", 404);
  if (existing) {
    return NextResponse.json({ coupon: { id: String(existing._id), code: coupon.code, status: existing.status, discountType: coupon.discountType, discountValue: coupon.discountValue, asset: coupon.asset, dateCreated: existing.createdAt.toISOString(), expires: coupon.expiresAt?.toISOString?.() ?? null } });
  }
  const redemption = await CouponRedemptionModel.create({ couponId: coupon._id, userId: auth.user._id, status: "available" });
  await CouponModel.updateOne({ _id: coupon._id }, { $inc: { usageCount: 1 } });
  return NextResponse.json({ coupon: { id: String(redemption._id), code: coupon.code, status: "available", discountType: coupon.discountType, discountValue: coupon.discountValue, asset: coupon.asset, dateCreated: redemption.createdAt.toISOString(), expires: coupon.expiresAt?.toISOString?.() ?? null } }, { status: 201 });
}
