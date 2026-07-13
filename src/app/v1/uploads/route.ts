import { NextResponse } from "next/server";
import { authenticatedUser } from "@/lib/server/auth";
import { uploadBuffer } from "@/lib/server/cloudinary";
import { apiError } from "@/lib/server/responses";
export async function POST(request: Request) {
  if (!(await authenticatedUser(request))) return apiError("UNAUTHORIZED", "Authentication required", 401);
  const form = await request.formData(); const file = form.get("file");
  if (!(file instanceof File)) return apiError("FILE_REQUIRED", "Select a file to upload", 422);
  if (file.size > 15 * 1024 * 1024) return apiError("FILE_TOO_LARGE", "Files must be 15 MB or smaller", 413);
  const result = await uploadBuffer(Buffer.from(await file.arrayBuffer()), String(form.get("folder") ?? "asset-union"));
  return NextResponse.json(result, { status: 201 });
}
