import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/server/mongodb";
import { requireUser } from "@/lib/server/request";
import { apiError } from "@/lib/server/responses";
import { readPrivateKey } from "@/lib/server/vault";

export async function POST(request: Request) {
  const auth = await requireUser(request); if (auth.error) return auth.error;
  if (!auth.user.twoFactorEnabled) return apiError("TWO_FACTOR_REQUIRED", "Enable two-factor authentication before revealing your wallet key", 403);
  await connectMongo();
  try {
    const privateKey = await readPrivateKey(auth.user._id);
    if (!privateKey) return apiError("WALLET_KEY_UNAVAILABLE", "This wallet does not expose a private key", 404);
    return NextResponse.json({ privateKey });
  } catch (error) {
    if (error instanceof Error && error.message.includes("WALLET_ENCRYPTION_KEY")) return apiError("WALLET_KEY_UNAVAILABLE", "Wallet key export is not configured", 503);
    throw error;
  }
}
