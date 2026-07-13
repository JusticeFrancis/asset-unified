import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/server/mongodb";
import { RefreshTokenModel, UserModel, VaultModel, WalletModel } from "@/lib/server/models";
import { publicUser } from "@/lib/server/auth";
import { readJson, requireUser } from "@/lib/server/request";
import { apiError } from "@/lib/server/responses";

export async function GET(request: Request) {
  const auth = await requireUser(request); if (auth.error) return auth.error;
  await connectMongo();
  const [sessions, wallet] = await Promise.all([
    RefreshTokenModel.find({ userId: auth.user._id, revokedAt: null, expiresAt: { $gt: new Date() } }).sort({ lastUsedAt: -1, createdAt: -1 }).lean(),
    WalletModel.findOne({ userId: auth.user._id }).select("address status").lean(),
  ]);
  return NextResponse.json({
    user: publicUser(auth.user),
    wallet: { address: wallet?.address ?? null, status: wallet?.status ?? "not_connected" },
    devices: sessions.map((session: any, index: number) => ({
      id: String(session._id),
      location: session.locationLabel || session.ipAddress || "Unknown location",
      status: index === 0 ? "Active Now" : (session.lastUsedAt || session.createdAt)?.toISOString?.() ?? "Previously active",
      statusTone: index === 0 ? "active" : "muted",
      browser: session.browserLabel || browserName(session.userAgent),
      browserIcon: /brave/i.test(session.userAgent || "") ? "brave" : "chrome",
      showLogOut: index !== 0,
    })),
  });
}

function browserName(userAgent?: string) {
  const ua = userAgent || "";
  if (/Brave/i.test(ua)) return "Brave Browser";
  if (/Edg/i.test(ua)) return "Edge Browser";
  if (/Firefox/i.test(ua)) return "Firefox Browser";
  if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) return "Safari Browser";
  if (/Chrome/i.test(ua)) return "Chrome Browser";
  return "Unknown Browser";
}

export async function PATCH(request: Request) {
  const auth = await requireUser(request); if (auth.error) return auth.error;
  const body = await readJson<any>(request);
  const update: Record<string, unknown> = {};
  if (body.fullName !== undefined) {
    const fullName = String(body.fullName).trim();
    if (!fullName) return apiError("VALIDATION_ERROR", "Full name is required", 422);
    update.fullName = fullName;
  }
  if (body.email !== undefined) {
    const email = String(body.email).trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(email)) return apiError("VALIDATION_ERROR", "Enter a valid email address", 422);
    const inUse = await UserModel.exists({ email, _id: { $ne: auth.user._id } });
    if (inUse) return apiError("EMAIL_IN_USE", "This email address is already in use", 409);
    update.email = email;
    if (email !== auth.user.email) update.emailVerifiedAt = null;
  }
  if (body.phoneNumber !== undefined) update.phoneNumber = String(body.phoneNumber).trim();
  if (body.country !== undefined) update.country = String(body.country).trim();
  if (body.avatarUrl !== undefined) update.avatarUrl = String(body.avatarUrl).trim() || null;
  if (body.twoFactorEnabled !== undefined) update.twoFactorEnabled = Boolean(body.twoFactorEnabled);
  await connectMongo();
  const user = await UserModel.findOneAndUpdate({ _id: auth.user._id, status: "active" }, update, { new: true, runValidators: true });
  if (!user) return apiError("NOT_FOUND", "User not found", 404);
  return NextResponse.json(publicUser(user));
}

export async function DELETE(request: Request) {
  const auth = await requireUser(request); if (auth.error) return auth.error;
  await connectMongo();
  await Promise.all([
    UserModel.updateOne({ _id: auth.user._id }, { status: "deleted", deletedAt: new Date(), email: `deleted+${auth.user._id}@invalid.local`, phoneNumber: null, fullName: "Deleted User", avatarUrl: null }),
    RefreshTokenModel.updateMany({ userId: auth.user._id, revokedAt: null }, { revokedAt: new Date() }),
    VaultModel.deleteOne({ userId: auth.user._id }),
  ]);
  return new Response(null, { status: 204 });
}
