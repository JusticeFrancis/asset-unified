import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/server/mongodb";
import { WalletModel, WalletTransactionModel } from "@/lib/server/models";
import { readJson, requireUser } from "@/lib/server/request";
import { apiError } from "@/lib/server/responses";

export async function POST(request: Request) {
  const auth = await requireUser(request); if (auth.error) return auth.error;
  const body = await readJson<any>(request); const category = String(body.category ?? body.kind ?? "");
  if (!['rent', 'construction'].includes(category)) return apiError("VALIDATION_ERROR", "Claim category must be rent or construction", 422);
  const accrualKind = category === 'rent' ? 'rent_accrual' : 'construction_accrual';
  const claimKind = category === 'rent' ? 'rent_withdrawal' : 'construction_claim';
  await connectMongo();
  const rows = await WalletTransactionModel.find({ userId: auth.user._id, kind: { $in: [accrualKind, claimKind] }, status: 'completed' }).lean();
  const available = rows.reduce((sum: number, row: any) => sum + (row.kind === accrualKind ? Number(row.amount || 0) : -Number(row.amount || 0)), 0);
  if (available <= 0) return apiError("NOTHING_TO_CLAIM", "There is no available balance to claim", 409);
  const asset = String(body.asset ?? 'USDT').toUpperCase();
  await WalletModel.findOneAndUpdate({ userId: auth.user._id }, { $inc: { [`balances.${asset}`]: available }, $setOnInsert: { userId: auth.user._id, status: 'active' } }, { upsert: true, new: true });
  const tx = await WalletTransactionModel.create({ userId: auth.user._id, kind: claimKind, direction: 'credit', asset, amount: available, status: 'completed', description: category === 'rent' ? 'Rent claimed' : 'Construction earnings claimed', completedAt: new Date() });
  return NextResponse.json({ amount: available, asset, transactionId: String(tx._id) }, { status: 201 });
}
