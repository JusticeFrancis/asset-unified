import { connectMongo } from "@/lib/server/mongodb";
import { RefreshTokenModel } from "@/lib/server/models";
import { requireUser } from "@/lib/server/request";
import { apiError } from "@/lib/server/responses";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireUser(request); if (auth.error) return auth.error;
  const { id } = await params;
  await connectMongo();
  const result = await RefreshTokenModel.updateOne({ _id: id, userId: auth.user._id, revokedAt: null }, { revokedAt: new Date() });
  if (!result.matchedCount) return apiError("NOT_FOUND", "Device session not found", 404);
  return new Response(null, { status: 204 });
}
