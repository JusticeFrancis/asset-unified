import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/server/mongodb";
import { RefreshTokenModel, UserModel } from "@/lib/server/models";
import { accessExpiresAt, hashValue, randomToken, signAccessToken } from "@/lib/server/auth";
import { apiError } from "@/lib/server/responses";
export async function POST(request: Request) {
  const { refreshToken } = await request.json().catch(() => ({})); await connectMongo();
  const session = await RefreshTokenModel.findOne({ tokenHash: hashValue(String(refreshToken ?? "")), revokedAt: null, expiresAt: { $gt: new Date() } });
  if (!session || !(await UserModel.exists({ _id: session.userId, status: "active" }))) return apiError("UNAUTHORIZED", "Invalid refresh token", 401);
  session.revokedAt = new Date(); await session.save(); const nextToken = randomToken();
  await RefreshTokenModel.create({
    userId: session.userId,
    tokenHash: hashValue(nextToken),
    expiresAt: new Date(Date.now() + 30 * 86400_000),
    userAgent: request.headers.get("user-agent") ?? session.userAgent,
    ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? session.ipAddress,
    lastUsedAt: new Date(),
  });
  return NextResponse.json({ accessToken: signAccessToken(String(session.userId)), refreshToken: nextToken, expiresAt: accessExpiresAt() });
}
