import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/server/mongodb";
import { UserModel, WalletModel } from "@/lib/server/models";
import { readJson, requireAdmin } from "@/lib/server/request";
import { apiError } from "@/lib/server/responses";

export async function GET(request: Request, { params }: { params: Promise<{ userId: string }> }) {
  const denied = requireAdmin(request); if (denied) return denied;
  const { userId } = await params;
  await connectMongo();
  const wallet = await WalletModel.findOne({ userId }).lean();
  if (!wallet) return apiError("NOT_FOUND", "Wallet not found", 404);
  return NextResponse.json({ id: String(wallet._id), userId: String(wallet.userId), provider: wallet.provider, providerCustomerId: wallet.providerCustomerId ?? null, providerWalletId: wallet.providerWalletId ?? null, address: wallet.address ?? null, status: wallet.status, balances: wallet.balances ?? {}, depositInstructions: wallet.depositInstructions ?? {} });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ userId: string }> }) {
  const denied = requireAdmin(request); if (denied) return denied;
  const { userId } = await params;
  const body = await readJson<any>(request);
  await connectMongo();
  const user = await UserModel.findById(userId).select("_id");
  if (!user) return apiError("NOT_FOUND", "User not found", 404);
  const update: Record<string, unknown> = {};
  for (const key of ["provider", "providerCustomerId", "providerWalletId", "address", "status", "depositInstructions"] as const) {
    if (body[key] !== undefined) update[key] = body[key];
  }
  const wallet = await WalletModel.findOneAndUpdate({ userId: user._id }, { $set: update, $setOnInsert: { userId: user._id } }, { upsert: true, new: true });
  return NextResponse.json({ id: String(wallet._id), userId, status: wallet.status, address: wallet.address ?? null, depositInstructions: wallet.depositInstructions ?? {} });
}
