import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/server/mongodb";
import { CouponModel } from "@/lib/server/models";
import { readJson, requireAdmin } from "@/lib/server/request";
import { apiError } from "@/lib/server/responses";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = requireAdmin(request); if (denied) return denied;
  const { id } = await params;
  const body = await readJson<any>(request);
  const update: Record<string, unknown> = {};
  for (const key of ["status", "discountType", "discountValue", "asset", "usageLimit", "metadata", "userIds"] as const) {
    if (body[key] !== undefined) update[key] = key === "asset" ? String(body[key]).toUpperCase() : body[key];
  }
  if (body.code !== undefined) update.code = String(body.code).trim().toUpperCase();
  if (body.startsAt !== undefined) update.startsAt = body.startsAt ? new Date(body.startsAt) : null;
  if (body.expiresAt !== undefined) update.expiresAt = body.expiresAt ? new Date(body.expiresAt) : null;
  await connectMongo();
  const coupon = await CouponModel.findByIdAndUpdate(id, update, { new: true, runValidators: true });
  if (!coupon) return apiError("NOT_FOUND", "Coupon not found", 404);
  return NextResponse.json({ id: String(coupon._id), code: coupon.code, status: coupon.status });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = requireAdmin(request); if (denied) return denied;
  const { id } = await params;
  await connectMongo();
  const coupon = await CouponModel.findByIdAndDelete(id);
  if (!coupon) return apiError("NOT_FOUND", "Coupon not found", 404);
  return new Response(null, { status: 204 });
}
