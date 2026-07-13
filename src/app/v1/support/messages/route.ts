import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/server/mongodb";
import { SupportMessageModel } from "@/lib/server/models";
import { readJson, requireUser } from "@/lib/server/request";
import { apiError } from "@/lib/server/responses";

function serialize(row: any) { return { id: String(row._id), sender: row.sender, body: row.body, createdAt: row.createdAt?.toISOString?.() ?? row.createdAt, read: Boolean(row.readAt) }; }

export async function GET(request: Request) {
  const auth = await requireUser(request); if (auth.error) return auth.error;
  await connectMongo();
  const rows = await SupportMessageModel.find({ userId: auth.user._id }).sort({ createdAt: 1 }).limit(500).lean();
  await SupportMessageModel.updateMany({ userId: auth.user._id, sender: "support", readAt: null }, { readAt: new Date() });
  return NextResponse.json({ messages: rows.map(serialize) });
}

export async function POST(request: Request) {
  const auth = await requireUser(request); if (auth.error) return auth.error;
  const body = await readJson<any>(request);
  const message = String(body.body ?? body.message ?? "").trim();
  if (!message) return apiError("VALIDATION_ERROR", "Message cannot be empty", 422);
  if (message.length > 4000) return apiError("VALIDATION_ERROR", "Message is too long", 422);
  await connectMongo();
  const row = await SupportMessageModel.create({ userId: auth.user._id, sender: "user", body: message });
  return NextResponse.json({ message: serialize(row) }, { status: 201 });
}
