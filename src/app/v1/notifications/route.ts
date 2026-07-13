import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/server/mongodb";
import { NotificationModel } from "@/lib/server/models";
import { getPagination, readJson, requireUser } from "@/lib/server/request";

function serialize(row: any) {
  return { id: String(row._id), title: row.title, subtitle: row.subtitle ?? "", type: row.type, href: row.href ?? null, read: Boolean(row.readAt), dateLabel: row.createdAt?.toISOString?.() ?? row.createdAt, createdAt: row.createdAt?.toISOString?.() ?? row.createdAt };
}

export async function GET(request: Request) {
  const auth = await requireUser(request); if (auth.error) return auth.error;
  const { page, limit, skip } = getPagination(request);
  const url = new URL(request.url);
  const filter: any = { userId: auth.user._id };
  if (url.searchParams.get("unread") === "true") filter.readAt = null;
  await connectMongo();
  const [rows, total, unread] = await Promise.all([
    NotificationModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    NotificationModel.countDocuments(filter),
    NotificationModel.countDocuments({ userId: auth.user._id, readAt: null }),
  ]);
  return NextResponse.json({ notifications: rows.map(serialize), page, limit, total, unread });
}

export async function PATCH(request: Request) {
  const auth = await requireUser(request); if (auth.error) return auth.error;
  const body = await readJson<any>(request);
  await connectMongo();
  if (body.markAllRead === true) await NotificationModel.updateMany({ userId: auth.user._id, readAt: null }, { readAt: new Date() });
  return NextResponse.json({ success: true });
}
