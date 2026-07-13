import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/server/mongodb";
import { WalletModel, WalletTransactionModel } from "@/lib/server/models";
import { apiError } from "@/lib/server/responses";

function safeEqual(a: string, b: string) {
  const aa = Buffer.from(a); const bb = Buffer.from(b);
  return aa.length === bb.length && crypto.timingSafeEqual(aa, bb);
}

export async function POST(request: Request) {
  const secret = process.env.BRIDGE_WEBHOOK_SECRET;
  if (!secret) return apiError("WEBHOOK_NOT_CONFIGURED", "Bridge webhook secret is not configured", 503);
  const supplied = request.headers.get("x-bridge-webhook-secret") ?? request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  if (!safeEqual(supplied, secret)) return apiError("UNAUTHORIZED", "Invalid webhook signature", 401);
  const body = await request.json().catch(() => null);
  if (!body) return apiError("INVALID_PAYLOAD", "Webhook payload is required", 422);
  await connectMongo();
  const providerId = String(body.id ?? body.transfer_id ?? body.data?.id ?? "");
  const status = String(body.state ?? body.status ?? body.data?.state ?? body.data?.status ?? "");
  const type = String(body.type ?? body.event_type ?? "");
  if (providerId) {
    const tx = await WalletTransactionModel.findOne({ providerId });
    if (tx) {
      const wasCompleted = tx.status === "completed";
      tx.status = status || tx.status;
      tx.metadata = { ...tx.metadata, lastWebhook: body };
      if (["completed", "paid", "settled"].includes(status) && !wasCompleted) {
        tx.status = "completed"; tx.completedAt = new Date();
        if (tx.direction === "credit") await WalletModel.updateOne({ userId: tx.userId }, { $inc: { [`balances.${tx.asset}`]: tx.amount } });
      }
      await tx.save();
    }
  }
  if (/customer|wallet|kyc/i.test(type)) {
    const userId = body.metadata?.userId ?? body.data?.metadata?.userId;
    if (userId) await WalletModel.findOneAndUpdate(
      { userId },
      { $set: {
        status: body.data?.status ?? body.status ?? "active",
        providerCustomerId: body.data?.customer_id ?? body.customer_id,
        providerWalletId: body.data?.wallet_id ?? body.wallet_id,
        address: body.data?.address ?? body.address,
        depositInstructions: body.data?.deposit_instructions ?? body.deposit_instructions ?? {},
      } },
      { upsert: true },
    );
  }
  return NextResponse.json({ received: true });
}
