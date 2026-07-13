import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/server/mongodb";
import { NotificationModel } from "@/lib/server/models";
import { readJson, requireUser } from "@/lib/server/request";
import { apiError } from "@/lib/server/responses";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireUser(request); if (auth.error) return auth.error;
  const { id } = await params; const body = await readJson<any>(request);
  await connectMongo();
  const row = await NotificationModel.findOneAndUpdate({ _id: id, userId: auth.user._id }, { readAt: body.read === false ? null : new Date() }, { new: true });
  if (!row) return apiError("NOT_FOUND", "Notification not found", 404);
  return NextResponse.json({ id: String(row._id), read: Boolean(row.readAt) });
}
