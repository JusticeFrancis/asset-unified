import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/server/mongodb";
import { WalletModel, WalletTransactionModel } from "@/lib/server/models";
import { readJson, requireUser } from "@/lib/server/request";
import { apiError } from "@/lib/server/responses";
import { serializeTransaction } from "@/lib/server/serializers";
import { serializeWalletDepositInstructions } from "@/lib/server/wallet";

export async function GET(request: Request) {
  const auth = await requireUser(request); if (auth.error) return auth.error;
  await connectMongo();
  const wallet = await WalletModel.findOne({ userId: auth.user._id }).lean();
  return NextResponse.json({
    status: wallet?.status ?? "not_connected",
    address: wallet?.address ?? null,
    instructions: serializeWalletDepositInstructions(wallet?.depositInstructions, wallet?.address ?? null),
  });
}

export async function POST(request: Request) {
  const auth = await requireUser(request); if (auth.error) return auth.error;
  const body = await readJson<any>(request);
  const amount = Number(body.amount);
  const asset = String(body.asset ?? "USDT").toUpperCase();
  if (!Number.isFinite(amount) || amount <= 0) return apiError("VALIDATION_ERROR", "Enter a valid deposit amount", 422);
  await connectMongo();
  const wallet = await WalletModel.findOne({ userId: auth.user._id }).lean();
  if (!wallet || wallet.status !== "active") return apiError("WALLET_NOT_READY", "Complete wallet setup before depositing", 409);
  const tx = await WalletTransactionModel.create({
    userId: auth.user._id,
    kind: "deposit",
    direction: "credit",
    asset,
    amount,
    status: "pending",
    provider: wallet.provider,
    description: `Deposit ${asset}`,
    metadata: { method: body.method ?? null, currency: body.currency ?? null },
  });
  return NextResponse.json({
    transaction: serializeTransaction(tx),
    instructions: serializeWalletDepositInstructions(wallet.depositInstructions, wallet.address ?? null),
  }, { status: 201 });
}
