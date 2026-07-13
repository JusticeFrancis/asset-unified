import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/server/mongodb";
import { AppRecordModel, InvestmentModel, WalletModel, WalletTransactionModel } from "@/lib/server/models";
import { requireUser } from "@/lib/server/request";
import { serializeRecord } from "@/lib/server/serializers";

function amountFromBalance(wallet: any, asset = "USDT") {
  return Number(wallet?.balances?.[asset] ?? 0) || 0;
}

export async function GET(request: Request) {
  const auth = await requireUser(request); if (auth.error) return auth.error;
  await connectMongo();
  const userId = auth.user._id;
  const [wallet, investments, transactions, constructionProperties] = await Promise.all([
    WalletModel.findOne({ userId }).lean(),
    InvestmentModel.find({ userId, status: { $in: ["pending", "completed"] } }).lean(),
    WalletTransactionModel.find({ userId, status: "completed" }).lean(),
    AppRecordModel.find({ resource: "construction-property", published: true }).sort({ sortOrder: 1, createdAt: -1 }).limit(20).lean(),
  ]);

  const byKind = (kind: string) => investments.filter((i: any) => i.propertyKind === kind);
  const rental = byKind("rental");
  const construction = byKind("construction");
  const rentalPropertyDocs = rental.length
    ? await AppRecordModel.find({ _id: { $in: rental.map((item: any) => item.propertyId) }, resource: "rental-property", published: true }).lean()
    : [];
  const total = (rows: any[], key: string) => rows.reduce((sum, row) => sum + (Number(row[key]) || 0), 0);
  const txAmount = (kind: string) => transactions.filter((t: any) => t.kind === kind).reduce((sum: number, t: any) => sum + (Number(t.amount) || 0), 0);

  return NextResponse.json({
    wallet: { asset: "USDT", balance: amountFromBalance(wallet), status: wallet?.status ?? "not_connected" },
    rental: {
      rentBalance: txAmount("rent_accrual") - txAmount("rent_withdrawal"),
      accountValue: total(rental, "amount"),
      propertiesOwned: new Set(rental.map((i: any) => i.propertySlug)).size,
      totalRentClaimed: txAmount("rent_withdrawal"),
      totalPropertyValue: total(rental, "amount"),
      properties: rentalPropertyDocs.map(serializeRecord),
    },
    construction: {
      claimable: txAmount("construction_accrual") - txAmount("construction_claim"),
      overallClaimed: txAmount("construction_claim"),
      sharesOnSale: construction.filter((i: any) => i.status === "pending").reduce((sum: number, i: any) => sum + Number(i.shares || 0), 0),
      sharesSold: construction.filter((i: any) => i.status === "completed").reduce((sum: number, i: any) => sum + Number(i.shares || 0), 0),
      properties: constructionProperties.map(serializeRecord),
    },
  });
}
