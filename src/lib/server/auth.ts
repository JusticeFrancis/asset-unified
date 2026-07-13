import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { connectMongo } from "./mongodb";
import { UserModel } from "./models";

const secret = () => {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) throw new Error("JWT_SECRET must contain at least 32 characters");
  return process.env.JWT_SECRET;
};
export const hashValue = (value: string) => crypto.createHash("sha256").update(value).digest("hex");
export const randomToken = () => crypto.randomBytes(48).toString("base64url");
export const signAccessToken = (userId: string) => jwt.sign({ userId, type: "access" }, secret(), { expiresIn: "15m" });
export const accessExpiresAt = () => Date.now() + 15 * 60 * 1000;
export function verifyAccessToken(token: string) { return jwt.verify(token, secret()) as { userId: string; type: string }; }
export async function authenticatedUser(request: Request) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return null;
  try {
    const payload = verifyAccessToken(token);
    await connectMongo();
    return await UserModel.findById(payload.userId);
  } catch { return null; }
}
export function publicUser(user: any) {
  return {
    id: String(user._id), email: user.email, fullName: user.fullName ?? null,
    country: user.country, phoneNumber: user.phoneNumber, avatarUrl: user.avatarUrl ?? null,
    referralCode: user.referralCode ?? null, twoFactorEnabled: Boolean(user.twoFactorEnabled),
    profileComplete: Boolean(user.fullName && user.country && user.phoneNumber),
    profileCompletedAt: user.profileCompletedAt?.getTime(), status: user.status,
    kycStatus: user.kycStatus, walletStatus: user.walletStatus,
    emailVerifiedAt: user.emailVerifiedAt?.getTime(), createdAt: user.createdAt?.getTime(),
  };
}
