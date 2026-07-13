import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/server/mongodb";
import { CouponModel } from "@/lib/server/models";
import { getPagination, readJson, requireAdmin } from "@/lib/server/request";
import { apiError } from "@/lib/server/responses";

function serialize(coupon: any) {
  return {
    id: String(coupon._id),
    code: coupon.code,
    status: coupon.status,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    asset: coupon.asset,
    startsAt: coupon.startsAt ?? null,
    expiresAt: coupon.expiresAt ?? null,
    usageLimit: coupon.usageLimit ?? null,
    usageCount: coupon.usageCount ?? 0,
    metadata: coupon.metadata ?? {},
    createdAt: coupon.createdAt,
    updatedAt: coupon.updatedAt,
  };
}

export async function GET(request: Request) {
  const denied = requireAdmin(request); if (denied) return denied;
  const { page, limit, skip } = getPagination(request);
  await connectMongo();
  const [rows, total] = await Promise.all([
    CouponModel.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    CouponModel.countDocuments({}),
  ]);
  return NextResponse.json({ coupons: rows.map(serialize), page, limit, total, pages: Math.max(1, Math.ceil(total / limit)) });
}

export async function POST(request: Request) {
  const denied = requireAdmin(request); if (denied) return denied;
  const body = await readJson<any>(request);
  const code = String(body.code ?? "").trim().toUpperCase();
  const discountType = String(body.discountType ?? "percent");
  const discountValue = Number(body.discountValue);
  if (!code) return apiError("VALIDATION_ERROR", "Coupon code is required", 422);
  if (!["percent", "fixed"].includes(discountType)) return apiError("VALIDATION_ERROR", "discountType must be percent or fixed", 422);
  if (!Number.isFinite(discountValue) || discountValue < 0) return apiError("VALIDATION_ERROR", "discountValue must be zero or greater", 422);
  await connectMongo();
  try {
    const coupon = await CouponModel.create({
      code,
      status: String(body.status ?? "active"),
      discountType,
      discountValue,
      asset: String(body.asset ?? "USDT").toUpperCase(),
      startsAt: body.startsAt ? new Date(body.startsAt) : undefined,
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined,
      usageLimit: body.usageLimit == null ? undefined : Number(body.usageLimit),
      userIds: Array.isArray(body.userIds) ? body.userIds : [],
      metadata: body.metadata && typeof body.metadata === "object" ? body.metadata : {},
    });
    return NextResponse.json(serialize(coupon), { status: 201 });
  } catch (error: any) {
    if (error?.code === 11000) return apiError("DUPLICATE_COUPON", "This coupon code already exists", 409);
    throw error;
  }
}
