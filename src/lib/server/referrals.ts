import crypto from "node:crypto";
import { UserModel } from "@/lib/server/models";

export async function ensureReferralCode(user: any) {
  if (user.referralCode) return user.referralCode as string;
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const code = `AU-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
    const exists = await UserModel.exists({ referralCode: code });
    if (!exists) {
      user.referralCode = code;
      await user.save();
      return code;
    }
  }
  throw new Error("Unable to create a unique referral code");
}
