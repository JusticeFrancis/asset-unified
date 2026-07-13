import { NextRequest, NextResponse } from "next/server";
import { handleRouteError } from "@/admin/lib/server/http";
import { rotateRefreshToken, serializeAdmin, setAuthCookies } from "@/admin/lib/server/auth";

export async function POST(request: NextRequest) {
  try {
    const result = await rotateRefreshToken(request);
    const response = NextResponse.json({ admin: serializeAdmin(result.admin), expiresAt: result.expiresAt });
    setAuthCookies(response, result.accessToken, result.refreshToken);
    return response;
  } catch (error) {
    return handleRouteError(error);
  }
}
