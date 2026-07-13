import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/server/mongodb";
import { OtpModel, UserModel } from "@/lib/server/models";
import { hashValue } from "@/lib/server/auth";
import { apiError } from "@/lib/server/responses";
import { gmailIsConfigured, sendOtpEmail } from "@/lib/server/email";

export async function POST(request: Request) {
  const { email: rawEmail, referralCode } = await request.json().catch(() => ({}));
  const email = String(rawEmail ?? "").trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email)) return apiError("INVALID_EMAIL", "Enter a valid email address", 422);
  await connectMongo();
  const existing = await UserModel.exists({ email });
  const code = String(crypto.randomInt(100000, 1000000));
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  const session = await OtpModel.create({ email, codeHash: hashValue(code), expiresAt });
  if (gmailIsConfigured()) {
    try {
      await sendOtpEmail(email, code);
    } catch (error) {
      await OtpModel.deleteOne({ _id: session._id });
      console.error("Failed to send OTP email", error);
      return apiError("EMAIL_DELIVERY_FAILED", "We could not send the verification email. Please try again.", 502);
    }
  } else if (process.env.NODE_ENV !== "production") {
    console.info(`[Asset Union development OTP] ${email}: ${code}`);
  }
  const [name, domain] = email.split("@");
  return NextResponse.json({ otpSessionId: String(session._id), expiresAt: expiresAt.getTime(), maskedEmail: `${name.slice(0, 2)}***@${domain}`, isExistingUser: Boolean(existing), ...(process.env.NODE_ENV !== "production" && !gmailIsConfigured() ? { developmentCode: code } : {}) });
}
