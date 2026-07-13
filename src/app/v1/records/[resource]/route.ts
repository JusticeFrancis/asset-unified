import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/server/mongodb";
import { AppRecordModel } from "@/lib/server/models";
import { getPagination } from "@/lib/server/request";
import { serializeRecord } from "@/lib/server/serializers";

export async function GET(request: Request, { params }: { params: Promise<{ resource: string }> }) {
  const { resource } = await params;
  const url = new URL(request.url);
  const { page, limit, skip } = getPagination(request);
  const query: Record<string, unknown> = { resource, published: true };
  const status = url.searchParams.get("status");
  const featured = url.searchParams.get("featured");
  if (status) query.status = status;
  if (featured === "true") query.featured = true;
  await connectMongo();
  const [records, total] = await Promise.all([
    AppRecordModel.find(query).sort({ sortOrder: 1, createdAt: -1 }).skip(skip).limit(limit).lean(),
    AppRecordModel.countDocuments(query),
  ]);
  return NextResponse.json({ records: records.map(serializeRecord), page, limit, total, pages: Math.max(1, Math.ceil(total / limit)) });
}
