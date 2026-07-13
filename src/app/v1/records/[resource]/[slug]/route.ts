import { NextResponse } from "next/server";
import { connectMongo } from "@/lib/server/mongodb";
import { AppRecordModel } from "@/lib/server/models";
import { apiError } from "@/lib/server/responses";
import { serializeRecord } from "@/lib/server/serializers";

export async function GET(_request: Request, { params }: { params: Promise<{ resource: string; slug: string }> }) {
  const { resource, slug } = await params;
  await connectMongo();
  const record = await AppRecordModel.findOne({ resource, slug, published: true }).lean();
  if (!record) return apiError("NOT_FOUND", "Record not found", 404);
  return NextResponse.json(serializeRecord(record));
}
