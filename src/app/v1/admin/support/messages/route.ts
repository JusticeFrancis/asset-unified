import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/server/mongodb";
import { SupportMessageModel, UserModel } from "@/lib/server/models";
import { getPagination, readJson, requireAdmin } from "@/lib/server/request";
import { apiError } from "@/lib/server/responses";

export async function GET(request: Request) {
  const denied = requireAdmin(request); if (denied) return denied;
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId");
  const { page, limit, skip } = getPagination(request, 200);
  const query = userId ? { userId } : {};
  await connectMongo();
  const rows = await SupportMessageModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).populate("userId", "fullName email").lean();
  return NextResponse.json({ messages: rows.map((row: any) => ({ id: String(row._id), userId: String(row.userId?._id ?? row.userId), user: row.userId ? { fullName: row.userId.fullName, email: row.userId.email } : null, sender: row.sender, body: row.body, readAt: row.readAt ?? null, createdAt: row.createdAt })) });
}

export async function POST(request: Request) {
  const denied = requireAdmin(request); if (denied) return denied;
  const body = await readJson<any>(request);
  const text = String(body.body ?? "").trim();
  if (!body.userId || !text) return apiError("VALIDATION_ERROR", "userId and body are required", 422);
  await connectMongo();
  const user = await UserModel.findById(body.userId).select("_id");
  if (!user) return apiError("NOT_FOUND", "User not found", 404);
  const message = await SupportMessageModel.create({ userId: user._id, sender: "support", body: text });
  return NextResponse.json({ message: { id: String(message._id), userId: String(user._id), sender: message.sender, body: message.body, createdAt: message.createdAt } }, { status: 201 });
}
