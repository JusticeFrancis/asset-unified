import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/server/mongodb";
import { WalletModel, WalletTransactionModel } from "@/lib/server/models";
import { bridgeRequest } from "@/lib/server/bridge";
import { readJson, requireUser } from "@/lib/server/request";
import { apiError } from "@/lib/server/responses";
import { serializeTransaction } from "@/lib/server/serializers";

export async function POST(request: Request) {
  const auth = await requireUser(request);
  if (auth.error) return auth.error;
  const body = await readJson<any>(request);
  const amount = Number(body.amount);
  const asset = String(body.asset ?? "USDT").toUpperCase();
  const destinationAddress = String(body.destinationAddress ?? body.toAddress ?? "").trim();
  const network = String(body.network ?? "").trim();
  if (!Number.isFinite(amount) || amount <= 0) return apiError("VALIDATION_ERROR", "Enter a valid withdrawal amount", 422);
  if (!destinationAddress) return apiError("VALIDATION_ERROR", "Destination address is required", 422);
  if (!network) return apiError("VALIDATION_ERROR", "Select a withdrawal network", 422);

  await connectMongo();
  const wallet = await WalletModel.findOne({ userId: auth.user._id });
  if (!wallet || wallet.status !== "active") return apiError("WALLET_NOT_READY", "Complete wallet setup before withdrawing", 409);

  const reservedWallet = await WalletModel.findOneAndUpdate(
    { _id: wallet._id, [`balances.${asset}`]: { $gte: amount } },
    { $inc: { [`balances.${asset}`]: -amount } },
    { new: true },
  );
  if (!reservedWallet) return apiError("INSUFFICIENT_FUNDS", "Your wallet balance is too low", 409);

  let tx: any;
  try {
    tx = await WalletTransactionModel.create({
      userId: auth.user._id,
      kind: "withdrawal",
      direction: "debit",
      asset,
      amount,
      status: "pending",
      provider: "bridge",
      description: `Withdraw ${asset}`,
      metadata: { destinationAddress, network },
    });
  } catch (error) {
    await WalletModel.updateOne({ _id: wallet._id }, { $inc: { [`balances.${asset}`]: amount } });
    throw error;
  }

  try {
    const providerBody = body.bridgePayload ?? {
      amount: String(amount),
      currency: asset.toLowerCase(),
      destination: { payment_rail: network, address: destinationAddress, currency: asset.toLowerCase() },
      source: wallet.providerWalletId
        ? { payment_rail: "bridge_wallet", bridge_wallet_id: wallet.providerWalletId, currency: asset.toLowerCase() }
        : undefined,
    };
    const provider = await bridgeRequest("/transfers", request, providerBody);
    if (provider.status < 200 || provider.status >= 300) {
      await WalletModel.updateOne({ _id: wallet._id }, { $inc: { [`balances.${asset}`]: amount } });
      tx.status = "failed";
      tx.metadata = { ...tx.metadata, providerError: provider.data, fundsReleased: true };
      await tx.save();
      return NextResponse.json(
        { error: { code: "TRANSFER_FAILED", message: "Bridge rejected the withdrawal", details: provider.data } },
        { status: provider.status || 502 },
      );
    }

    tx.providerId = String(provider.data?.id ?? provider.data?.transfer_id ?? "");
    tx.status = String(provider.data?.state ?? provider.data?.status ?? "processing");
    tx.metadata = { ...tx.metadata, providerResponse: provider.data };
    await tx.save();
    return NextResponse.json({ transaction: serializeTransaction(tx), provider: provider.data }, { status: 201 });
  } catch (error) {
    await WalletModel.updateOne({ _id: wallet._id }, { $inc: { [`balances.${asset}`]: amount } });
    tx.status = "failed";
    tx.metadata = {
      ...tx.metadata,
      error: error instanceof Error ? error.message : "Unknown transfer error",
      fundsReleased: true,
    };
    await tx.save();
    return apiError("TRANSFER_FAILED", error instanceof Error ? error.message : "The transfer could not be submitted", 502);
  }
}
