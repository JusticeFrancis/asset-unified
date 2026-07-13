import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/server/mongodb";
import { AppRecordModel, P2POrderModel } from "@/lib/server/models";
import { readJson, requireUser } from "@/lib/server/request";
import { apiError } from "@/lib/server/responses";

export async function GET(request: Request) {
  const auth = await requireUser(request); if (auth.error) return auth.error;
  await connectMongo();
  const rows = await P2POrderModel.find({ $or: [{ buyerId: auth.user._id }, { sellerId: auth.user._id }] }).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ orders: rows.map((r: any) => ({ ...r, id: String(r._id), _id: undefined, offerId: String(r.offerId), buyerId: String(r.buyerId), sellerId: String(r.sellerId) })) });
}

export async function POST(request: Request) {
  const auth = await requireUser(request); if (auth.error) return auth.error;
  const body = await readJson<any>(request); const offerId = String(body.offerId ?? "");
  const assetAmount = Number(body.assetAmount ?? body.amount); const side = String(body.side ?? "buy");
  if (!offerId || !Number.isFinite(assetAmount) || assetAmount <= 0 || !["buy", "sell"].includes(side)) return apiError("VALIDATION_ERROR", "Offer, amount, and side are required", 422);
  await connectMongo();
  const offer = await AppRecordModel.findOne({ _id: offerId, resource: "p2p-offer", published: true, status: "active" });
  if (!offer) return apiError("NOT_FOUND", "P2P offer not found", 404);
  const data = offer.data ?? {}; const available = Number(data.availableAmount ?? 0); const min = Number(data.minAmount ?? 0); const max = Number(data.maxAmount ?? available);
  if (assetAmount < min || (max > 0 && assetAmount > max) || (available > 0 && assetAmount > available)) return apiError("AMOUNT_OUT_OF_RANGE", "The amount is outside this offer's limits", 422);
  const ownerId = offer.ownerId ?? data.ownerId;
  if (!ownerId) return apiError("OFFER_CONFIGURATION_ERROR", "This offer has no owner", 409);
  if (String(ownerId) === String(auth.user._id)) return apiError("VALIDATION_ERROR", "You cannot trade against your own offer", 422);
  const price = Number(data.price);
  if (!Number.isFinite(price) || price <= 0) return apiError("OFFER_CONFIGURATION_ERROR", "This offer has no valid price", 409);
  const order = await P2POrderModel.create({
    offerId: offer._id,
    buyerId: side === "buy" ? auth.user._id : ownerId,
    sellerId: side === "sell" ? auth.user._id : ownerId,
    asset: String(data.asset ?? "USDT"),
    fiatCurrency: String(data.fiatCurrency ?? "USD"),
    assetAmount,
    fiatAmount: assetAmount * price,
    price,
    side,
    status: "pending",
  });
  return NextResponse.json({ order: { id: String(order._id), status: order.status, asset: order.asset, fiatCurrency: order.fiatCurrency, assetAmount, fiatAmount: order.fiatAmount, price, side } }, { status: 201 });
}
