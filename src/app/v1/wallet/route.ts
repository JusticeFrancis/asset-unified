import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/server/mongodb";
import { WalletModel, WalletTransactionModel } from "@/lib/server/models";
import { requireUser } from "@/lib/server/request";
import { serializeTransaction } from "@/lib/server/serializers";
import { serializeWalletDepositInstructions } from "@/lib/server/wallet";

export async function GET(request: Request) {
  const auth = await requireUser(request); if (auth.error) return auth.error;
  await connectMongo();
  const [wallet, transactions] = await Promise.all([
    WalletModel.findOneAndUpdate(
      { userId: auth.user._id },
      { $setOnInsert: { userId: auth.user._id, status: auth.user.walletStatus ?? "not_connected", balances: {} } },
      { upsert: true, new: true },
    ).lean(),
    WalletTransactionModel.find({ userId: auth.user._id }).sort({ createdAt: -1 }).limit(100).lean(),
  ]);
  return NextResponse.json({
    id: String(wallet._id),
    provider: wallet.provider,
    status: wallet.status,
    address: wallet.address ?? null,
    balances: wallet.balances ?? {},
    depositInstructions: serializeWalletDepositInstructions(wallet.depositInstructions, wallet.address ?? null),
    transactions: transactions.map(serializeTransaction),
  });
}
