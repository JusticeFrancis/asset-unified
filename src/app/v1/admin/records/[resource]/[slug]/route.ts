import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/server/mongodb";
import { AppRecordModel } from "@/lib/server/models";
import { cleanSlug, readJson, requireAdmin } from "@/lib/server/request";
import { apiError } from "@/lib/server/responses";
import { serializeRecord } from "@/lib/server/serializers";

export async function GET(request: Request, { params }: { params: Promise<{ resource: string; slug: string }> }) {
  const denied = requireAdmin(request); if (denied) return denied;
  const { resource, slug } = await params;
  await connectMongo();
  const record = await AppRecordModel.findOne({ resource, slug }).lean();
  if (!record) return apiError("NOT_FOUND", "Record not found", 404);
  return NextResponse.json(serializeRecord(record));
}

export async function PATCH(request: Request, { params }: { params: Promise<{ resource: string; slug: string }> }) {
  const denied = requireAdmin(request); if (denied) return denied;
  const { resource, slug } = await params;
  const body = await readJson<any>(request);
  const update: Record<string, unknown> = {};
  for (const key of ["title", "status", "published", "featured", "sortOrder", "data"] as const) {
    if (body[key] !== undefined) update[key] = body[key];
  }
  if (body.slug !== undefined) update.slug = cleanSlug(body.slug);
  await connectMongo();
  try {
    const record = await AppRecordModel.findOneAndUpdate({ resource, slug }, update, { new: true, runValidators: true });
    if (!record) return apiError("NOT_FOUND", "Record not found", 404);
    return NextResponse.json(serializeRecord(record));
  } catch (error: any) {
    if (error?.code === 11000) return apiError("DUPLICATE_SLUG", "A record with this slug already exists", 409);
    throw error;
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ resource: string; slug: string }> }) {
  const denied = requireAdmin(request); if (denied) return denied;
  const { resource, slug } = await params;
  await connectMongo();
  const deleted = await AppRecordModel.findOneAndDelete({ resource, slug });
  if (!deleted) return apiError("NOT_FOUND", "Record not found", 404);
  return new Response(null, { status: 204 });
}
