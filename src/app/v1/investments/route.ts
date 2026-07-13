import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/server/mongodb";
import { AppRecordModel, CouponModel, CouponRedemptionModel, InvestmentModel, NotificationModel, WalletModel, WalletTransactionModel } from "@/lib/server/models";
import { readJson, requireUser } from "@/lib/server/request";
import { apiError } from "@/lib/server/responses";

function numericPrice(data: any) {
  const direct = Number(data.sharePriceValue ?? data.detail?.sharePriceValue);
  if (Number.isFinite(direct) && direct >= 0) return direct;
  const label = String(data.detail?.sharePrice ?? data.sharePrice ?? "");
  const parsed = Number(label.replace(/[^0-9.]/g, ""));
  return Number.isFinite(parsed) ? parsed : NaN;
}

export async function GET(request: Request) {
  const auth = await requireUser(request); if (auth.error) return auth.error;
  await connectMongo();
  const rows = await InvestmentModel.find({ userId: auth.user._id }).sort({ createdAt: -1 }).lean();
  const propertyIds = [...new Set(rows.map((row: any) => String(row.propertyId)).filter(Boolean))];
  const properties = await AppRecordModel.find({ _id: { $in: propertyIds } }).lean();
  const propertyMap = new Map(properties.map((property: any) => [String(property._id), property]));
  return NextResponse.json({ investments: rows.map((row: any) => {
    const property: any = propertyMap.get(String(row.propertyId));
    return {
      ...row,
      id: String(row._id),
      propertyId: String(row.propertyId),
      propertyTitle: property?.title ?? row.propertySlug,
      propertyLocation: property?.data?.location ?? property?.data?.country ?? "",
      _id: undefined,
    };
  }) });
}

export async function POST(request: Request) {
  const auth = await requireUser(request); if (auth.error) return auth.error;
  const body = await readJson<any>(request);
  const propertySlug = String(body.propertySlug ?? "").trim();
  const kind = String(body.propertyKind ?? body.kind ?? "").trim();
  const shares = Number(body.shares);
  const couponCode = String(body.couponCode ?? "").trim().toUpperCase();
  if (!propertySlug || !["rental", "construction"].includes(kind)) return apiError("VALIDATION_ERROR", "A valid property is required", 422);
  if (!Number.isInteger(shares) || shares < 1) return apiError("VALIDATION_ERROR", "Shares must be a positive whole number", 422);
  await connectMongo();
  const property = await AppRecordModel.findOne({ resource: `${kind}-property`, slug: propertySlug, published: true });
  if (!property) return apiError("NOT_FOUND", "Property not found", 404);
  const sharePrice = numericPrice(property.data);
  if (!Number.isFinite(sharePrice) || sharePrice <= 0) return apiError("PROPERTY_NOT_TRADABLE", "This property does not have a valid share price", 409);
  const grossAmount = sharePrice * shares;
  const asset = String(property.data?.asset ?? "USDT").toUpperCase();

  let couponRedemption: any = null;
  let discountAmount = 0;
  if (couponCode) {
    const coupon = await CouponModel.findOne({ code: couponCode, status: "active" });
    if (!coupon) return apiError("INVALID_COUPON", "This coupon is invalid or expired", 404);
    const now = new Date();
    if ((coupon.startsAt && coupon.startsAt > now) || (coupon.expiresAt && coupon.expiresAt <= now)) {
      return apiError("INVALID_COUPON", "This coupon is invalid or expired", 404);
    }
    const couponAsset = String(coupon.asset ?? asset).toUpperCase();
    const stableEquivalent = couponAsset === "USD" && ["USDT", "USDC"].includes(asset);
    if (couponAsset !== asset && !stableEquivalent) {
      return apiError("COUPON_ASSET_MISMATCH", `This coupon cannot be applied to ${asset} purchases`, 409);
    }
    couponRedemption = await CouponRedemptionModel.findOne({ couponId: coupon._id, userId: auth.user._id, status: "available" });
    if (!couponRedemption) return apiError("COUPON_NOT_AVAILABLE", "Add this coupon to your account before using it", 409);
    const value = Math.max(0, Number(coupon.discountValue ?? 0));
    discountAmount = coupon.discountType === "percent"
      ? grossAmount * Math.min(value, 100) / 100
      : Math.min(value, grossAmount);
  }

  const amount = Math.max(0, grossAmount - discountAmount);
  const wallet = await WalletModel.findOne({ userId: auth.user._id });
  if (!wallet || wallet.status !== "active") return apiError("WALLET_NOT_READY", "Connect and fund your wallet before investing", 409);
  const balance = Number(wallet.balances?.[asset] ?? 0);
  if (balance < amount) return apiError("INSUFFICIENT_FUNDS", "Your wallet balance is too low for this purchase", 409);

  let couponReserved = false;
  if (couponRedemption) {
    const reserved = await CouponRedemptionModel.findOneAndUpdate(
      { _id: couponRedemption._id, status: "available" },
      { $set: { status: "used", usedAt: new Date() } },
      { new: true },
    );
    if (!reserved) return apiError("COUPON_ALREADY_USED", "This coupon is no longer available", 409);
    couponReserved = true;
  }

  const debited = amount === 0
    ? wallet
    : await WalletModel.findOneAndUpdate(
        { _id: wallet._id, [`balances.${asset}`]: { $gte: amount } },
        { $inc: { [`balances.${asset}`]: -amount } },
        { new: true },
      );
  if (!debited) {
    if (couponReserved) await CouponRedemptionModel.updateOne({ _id: couponRedemption._id }, { $set: { status: "available", usedAt: null } });
    return apiError("INSUFFICIENT_FUNDS", "Your wallet balance changed before the purchase completed", 409);
  }
  try {
    const metadata = { grossAmount, discountAmount, couponCode: couponCode || undefined };
    const investment = await InvestmentModel.create({ userId: auth.user._id, propertyId: property._id, propertySlug, propertyKind: kind, shares, sharePrice, amount, asset, status: "completed", metadata });
    await Promise.all([
      WalletTransactionModel.create({ userId: auth.user._id, propertyId: property._id, kind: "investment", direction: "debit", asset, amount, status: "completed", description: `Purchased ${shares} share${shares === 1 ? "" : "s"} in ${property.title || propertySlug}`, completedAt: new Date(), metadata: { investmentId: String(investment._id), propertySlug, shares, grossAmount, discountAmount, couponCode: couponCode || undefined } }),
      NotificationModel.create({ userId: auth.user._id, type: "investment.completed", title: `Your purchase for ${property.title || propertySlug} is confirmed.`, subtitle: "You can now track this investment from your dashboard.", href: `/dashboard/${kind}/${propertySlug}` }),
    ]);
    return NextResponse.json({ investment: { id: String(investment._id), propertySlug, propertyKind: kind, shares, sharePrice, grossAmount, discountAmount, amount, asset, status: investment.status } }, { status: 201 });
  } catch (error) {
    if (amount > 0) await WalletModel.updateOne({ _id: wallet._id }, { $inc: { [`balances.${asset}`]: amount } });
    if (couponReserved) await CouponRedemptionModel.updateOne({ _id: couponRedemption._id }, { $set: { status: "available", usedAt: null } });
    throw error;
  }
}
