import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/server/mongodb";
import { UserModel, WalletModel, WalletTransactionModel } from "@/lib/server/models";
import { readJson, requireAdmin } from "@/lib/server/request";
import { apiError } from "@/lib/server/responses";

export async function POST(request: Request, { params }: { params: Promise<{ userId: string }> }) {
  const denied = requireAdmin(request); if (denied) return denied;
  const { userId } = await params;
  const body = await readJson<any>(request);
  const asset = String(body.asset ?? "USDT").toUpperCase();
  const amount = Number(body.amount);
  const direction = String(body.direction ?? "credit");
  if (!Number.isFinite(amount) || amount <= 0) return apiError("VALIDATION_ERROR", "amount must be greater than zero", 422);
  if (!["credit", "debit"].includes(direction)) return apiError("VALIDATION_ERROR", "direction must be credit or debit", 422);
  await connectMongo();
  const user = await UserModel.findById(userId).select("_id");
  if (!user) return apiError("NOT_FOUND", "User not found", 404);
  const delta = direction === "credit" ? amount : -amount;
  const wallet = direction === "credit"
    ? await WalletModel.findOneAndUpdate({ userId: user._id }, { $inc: { [`balances.${asset}`]: delta }, $setOnInsert: { userId: user._id, status: "active" } }, { upsert: true, new: true })
    : await WalletModel.findOneAndUpdate({ userId: user._id, [`balances.${asset}`]: { $gte: amount } }, { $inc: { [`balances.${asset}`]: delta } }, { new: true });
  if (!wallet) return apiError("INSUFFICIENT_FUNDS", "Wallet balance is too low", 409);
  const tx = await WalletTransactionModel.create({ userId: user._id, kind: String(body.kind ?? "admin_adjustment"), direction, asset, amount, status: "completed", provider: "admin", description: String(body.description ?? "Wallet adjustment"), completedAt: new Date(), metadata: body.metadata && typeof body.metadata === "object" ? body.metadata : {} });
  return NextResponse.json({ transaction: { id: String(tx._id), direction, asset, amount, status: tx.status }, balances: wallet.balances ?? {} }, { status: 201 });
}
