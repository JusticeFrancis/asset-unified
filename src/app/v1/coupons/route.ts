import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/server/mongodb";
import { CouponModel, CouponRedemptionModel } from "@/lib/server/models";
import { requireUser } from "@/lib/server/request";

export async function GET(request: Request) {
  const auth = await requireUser(request); if (auth.error) return auth.error;
  await connectMongo();
  const now = new Date();
  await CouponRedemptionModel.updateMany(
    { userId: auth.user._id, status: "available" },
    [{ $set: { status: { $cond: [{ $lt: ["$expiresAt", now] }, "expired", "$status"] } } }],
  ).catch(() => undefined);
  const rows = await CouponRedemptionModel.find({ userId: auth.user._id }).populate("couponId").sort({ createdAt: -1 }).lean();
  const coupons = rows.flatMap((row: any) => {
    const coupon = row.couponId;
    if (!coupon) return [];
    const expired = coupon.expiresAt && new Date(coupon.expiresAt) < now;
    return [{
      id: String(row._id),
      code: coupon.code,
      status: expired && row.status === "available" ? "expired" : row.status,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      asset: coupon.asset,
      dateCreated: row.createdAt?.toISOString?.() ?? row.createdAt,
      expires: coupon.expiresAt?.toISOString?.() ?? coupon.expiresAt ?? null,
      usedAt: row.usedAt?.toISOString?.() ?? row.usedAt ?? null,
    }];
  });
  return NextResponse.json({ coupons });
}
