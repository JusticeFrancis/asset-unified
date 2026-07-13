import { NextResponse } from "next/server";
import { authenticatedUser, publicUser } from "@/lib/server/auth";
import { apiError } from "@/lib/server/responses";
export async function GET(request: Request) { const user = await authenticatedUser(request); return user ? NextResponse.json(publicUser(user)) : apiError("UNAUTHORIZED", "Authentication required", 401); }
export async function PATCH(request: Request) {
  const user = await authenticatedUser(request); if (!user) return apiError("UNAUTHORIZED", "Authentication required", 401);
  const body = await request.json().catch(() => ({}));
  for (const key of ["fullName", "country", "phoneNumber"] as const) if (!String(body[key] ?? "").trim()) return apiError("VALIDATION_ERROR", `${key} is required`, 422);
  user.fullName = body.fullName.trim(); user.country = body.country.trim(); user.phoneNumber = body.phoneNumber.trim(); user.profileCompletedAt ??= new Date(); await user.save();
  return NextResponse.json(publicUser(user));
}
