import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/server/mongodb";
import { OtpModel, RefreshTokenModel, ReferralModel, UserModel } from "@/lib/server/models";
import { accessExpiresAt, hashValue, publicUser, randomToken, signAccessToken } from "@/lib/server/auth";
import { apiError } from "@/lib/server/responses";
import { ensureReferralCode } from "@/lib/server/referrals";

export async function POST(request: Request) {
  const { otpSessionId, code, referralCode } = await request.json().catch(() => ({}));
  await connectMongo();
  const otp = await OtpModel.findById(otpSessionId).catch(() => null);
  if (!otp || otp.usedAt || otp.expiresAt < new Date()) return apiError("OTP_EXPIRED", "This verification code has expired", 422);
  if (otp.attempts >= 5 || otp.codeHash !== hashValue(String(code ?? ""))) {
    await OtpModel.updateOne({ _id: otp._id }, { $inc: { attempts: 1 } });
    return apiError("INVALID_OTP", "The verification code is incorrect", 422);
  }
  otp.usedAt = new Date(); await otp.save();
  let user = await UserModel.findOne({ email: otp.email });
  const isNewUser = !user;
  if (!user) {
    const referrer = referralCode ? await UserModel.findOne({ referralCode: String(referralCode).trim().toUpperCase(), status: "active" }) : null;
    user = await UserModel.create({ email: otp.email, emailVerifiedAt: new Date(), referredBy: referrer?._id ?? null });
    if (referrer) {
      await ReferralModel.findOneAndUpdate(
        { referrerId: referrer._id, email: otp.email },
        { $set: { referredUserId: user._id, status: "registered" }, $setOnInsert: { email: otp.email } },
        { upsert: true, new: true },
      );
    }
  }
  await ensureReferralCode(user);
  user.lastLoginAt = new Date(); await user.save();
  const refreshToken = randomToken();
  await RefreshTokenModel.create({
    userId: user._id,
    tokenHash: hashValue(refreshToken),
    expiresAt: new Date(Date.now() + 30 * 86400_000),
    userAgent: request.headers.get("user-agent") ?? undefined,
    ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? undefined,
    lastUsedAt: new Date(),
  });
  const serialized = publicUser(user);
  return NextResponse.json({ accessToken: signAccessToken(String(user._id)), refreshToken, expiresAt: accessExpiresAt(), isNewUser, profileComplete: serialized.profileComplete, user: serialized });
}
