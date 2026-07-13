import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/server/mongodb";
import { AppRecordModel } from "@/lib/server/models";
import { cleanSlug, getPagination, readJson, requireAdmin } from "@/lib/server/request";
import { apiError } from "@/lib/server/responses";
import { serializeRecord } from "@/lib/server/serializers";

export async function GET(request: Request, { params }: { params: Promise<{ resource: string }> }) {
  const denied = requireAdmin(request); if (denied) return denied;
  const { resource } = await params;
  const { page, limit, skip } = getPagination(request);
  await connectMongo();
  const [records, total] = await Promise.all([
    AppRecordModel.find({ resource }).sort({ sortOrder: 1, createdAt: -1 }).skip(skip).limit(limit).lean(),
    AppRecordModel.countDocuments({ resource }),
  ]);
  return NextResponse.json({ records: records.map(serializeRecord), page, limit, total, pages: Math.max(1, Math.ceil(total / limit)) });
}

export async function POST(request: Request, { params }: { params: Promise<{ resource: string }> }) {
  const denied = requireAdmin(request); if (denied) return denied;
  const { resource } = await params;
  const body = await readJson<any>(request);
  const slug = cleanSlug(body.slug || body.title);
  if (!slug) return apiError("VALIDATION_ERROR", "slug or title is required", 422);
  if (!body.data || typeof body.data !== "object") return apiError("VALIDATION_ERROR", "data must be an object", 422);
  await connectMongo();
  try {
    const record = await AppRecordModel.create({
      resource,
      slug,
      title: String(body.title ?? body.data?.title ?? ""),
      status: String(body.status ?? "draft"),
      published: body.published === true,
      featured: body.featured === true,
      sortOrder: Number(body.sortOrder ?? 0) || 0,
      data: body.data,
    });
    return NextResponse.json(serializeRecord(record), { status: 201 });
  } catch (error: any) {
    if (error?.code === 11000) return apiError("DUPLICATE_SLUG", "A record with this slug already exists", 409);
    throw error;
  }
}
