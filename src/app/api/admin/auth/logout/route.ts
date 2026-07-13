import { NextRequest, NextResponse } from "next/server";
import { clearAuthCookies, requireAdmin, revokeRefreshToken } from "@/admin/lib/server/auth";
import { handleRouteError } from "@/admin/lib/server/http";
import { recordActivity } from "@/admin/lib/server/activity";

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdmin(request).catch(() => null);
    await revokeRefreshToken(request.cookies.get("au_admin_refresh_token")?.value);
    const response = NextResponse.json({ success: true });
    clearAuthCookies(response);
    if (auth?.admin) await recordActivity({ request, admin: auth.admin, action: "Signed out", operation: "auth", resourceType: "admin_session", resourceId: String(auth.admin._id) });
    return response;
  } catch (error) {
    return handleRouteError(error);
  }
}
