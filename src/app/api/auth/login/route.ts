import { NextRequest, NextResponse } from "next/server";
import { authenticator } from "otplib";

import { Admin } from "@/admin/models";
import { connectDb } from "@/admin/lib/server/db";
import { decryptSecret } from "@/admin/lib/server/crypto";
import { createSession, ensureBootstrapSuperAdmin, serializeAdmin, setAuthCookies, verifyPassword } from "@/admin/lib/server/auth";
import { handleRouteError, HttpError, readJson } from "@/admin/lib/server/http";
import { requestContext } from "@/admin/lib/server/request-context";
import { recordActivity } from "@/admin/lib/server/activity";

export async function POST(request: NextRequest) {
  try {
    await ensureBootstrapSuperAdmin();
    await connectDb();
    const body = await readJson<{ email?: string; password?: string; twoFactorCode?: string }>(request);
    const email = body.email?.trim().toLowerCase();
    if (!email || !body.password) throw new HttpError(400, "VALIDATION_ERROR", "Email and password are required.");
    const admin = await Admin.findOne({ email }).select("+passwordHash +twoFactorSecret");
    if (!admin || !admin.passwordHash || !(await verifyPassword(body.password, admin.passwordHash))) {
      throw new HttpError(401, "INVALID_CREDENTIALS", "Email or password is incorrect.");
    }
    if (admin.status !== "active") throw new HttpError(403, "ACCOUNT_INACTIVE", "This admin account is not active.");
    if (admin.twoFactorEnabled) {
      if (!body.twoFactorCode) throw new HttpError(401, "TWO_FACTOR_REQUIRED", "Enter your authenticator code.");
      if (!admin.twoFactorSecret || !authenticator.check(body.twoFactorCode.replace(/\s/g, ""), decryptSecret(admin.twoFactorSecret))) {
        throw new HttpError(401, "INVALID_TWO_FACTOR_CODE", "The authenticator code is invalid.");
      }
    }
    const context = requestContext(request);
    const session = await createSession(admin, context);
    admin.lastLoginAt = new Date();
    await admin.save();
    const response = NextResponse.json({ admin: serializeAdmin(admin), expiresAt: session.expiresAt });
    setAuthCookies(response, session.accessToken, session.refreshToken);
    await recordActivity({ request, admin, action: "Signed in", operation: "auth", resourceType: "admin_session", resourceId: String(session.session._id) });
    return response;
  } catch (error) {
    return handleRouteError(error);
  }
}
