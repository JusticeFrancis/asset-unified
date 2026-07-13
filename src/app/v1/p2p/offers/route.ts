import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/server/mongodb";
import { AppRecordModel, P2POrderModel } from "@/lib/server/models";
import { requireUser } from "@/lib/server/request";
import { serializeRecord } from "@/lib/server/serializers";

export async function GET(request: Request) {
  const auth = await requireUser(request); if (auth.error) return auth.error;
  const url = new URL(request.url); const side = url.searchParams.get("side");
  const query: any = { resource: "p2p-offer", published: true, status: "active" };
  if (side) query["data.side"] = side;
  await connectMongo();
  const monthStart = new Date(); monthStart.setDate(monthStart.getDate() - 30);
  const [offers, orders, volumeRows, participantRows, completedRows] = await Promise.all([
    AppRecordModel.find(query).sort({ sortOrder: 1, createdAt: -1 }).lean(),
    P2POrderModel.find({ $or: [{ buyerId: auth.user._id }, { sellerId: auth.user._id }] }).sort({ createdAt: -1 }).lean(),
    P2POrderModel.aggregate([{ $match: { createdAt: { $gte: monthStart }, status: { $in: ["completed", "sold", "settled"] } } }, { $group: { _id: null, total: { $sum: "$fiatAmount" } } }]),
    P2POrderModel.aggregate([{ $project: { people: ["$buyerId", "$sellerId"] } }, { $unwind: "$people" }, { $group: { _id: "$people" } }, { $count: "total" }]),
    P2POrderModel.aggregate([{ $match: { status: { $in: ["completed", "sold", "settled"] }, completedAt: { $type: "date" } } }, { $project: { hours: { $divide: [{ $subtract: ["$completedAt", "$createdAt"] }, 3600000] } } }, { $group: { _id: null, average: { $avg: "$hours" } } }]),
  ]);
  return NextResponse.json({
    offers: offers.map(serializeRecord),
    orders: orders.map((row: any) => ({ id: String(row._id), offerId: String(row.offerId), asset: row.asset, fiatCurrency: row.fiatCurrency, assetAmount: Number(row.assetAmount || 0), fiatAmount: Number(row.fiatAmount || 0), price: Number(row.price || 0), side: row.side, status: row.status, providerId: row.metadata?.transactionHash ?? row.metadata?.providerId ?? null, createdAt: row.createdAt })),
    stats: { monthlyVolume: Number(volumeRows[0]?.total || 0), averageSellHours: Math.round(Number(completedRows[0]?.average || 0)), participants: Number(participantRows[0]?.total || 0) },
  });
}
