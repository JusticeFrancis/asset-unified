import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/server/mongodb";
import { NotificationModel, UserModel } from "@/lib/server/models";
import { readJson, requireAdmin } from "@/lib/server/request";
import { apiError } from "@/lib/server/responses";

export async function POST(request: Request) {
  const denied = requireAdmin(request); if (denied) return denied;
  const body = await readJson<any>(request);
  const title = String(body.title ?? "").trim();
  if (!title) return apiError("VALIDATION_ERROR", "Notification title is required", 422);
  await connectMongo();
  let users: any[] = [];
  if (body.allActive === true) users = await UserModel.find({ status: "active" }).select("_id").lean();
  else if (body.userId) users = await UserModel.find({ _id: body.userId }).select("_id").lean();
  else if (body.email) users = await UserModel.find({ email: String(body.email).trim().toLowerCase() }).select("_id").lean();
  else return apiError("VALIDATION_ERROR", "Provide userId, email, or allActive=true", 422);
  if (!users.length) return apiError("NOT_FOUND", "No matching users found", 404);
  const rows = users.map((user) => ({
    userId: user._id,
    type: String(body.type ?? "general"),
    title,
    subtitle: String(body.subtitle ?? ""),
    href: body.href ? String(body.href) : undefined,
    metadata: body.metadata && typeof body.metadata === "object" ? body.metadata : {},
  }));
  await NotificationModel.insertMany(rows);
  return NextResponse.json({ created: rows.length }, { status: 201 });
}
