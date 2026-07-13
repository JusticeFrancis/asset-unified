import { connectMongo } from "@/lib/server/mongodb";
import { RefreshTokenModel } from "@/lib/server/models";
import { hashValue } from "@/lib/server/auth";
export async function POST(request: Request) { const { refreshToken } = await request.json().catch(() => ({})); if (refreshToken) { await connectMongo(); await RefreshTokenModel.updateOne({ tokenHash: hashValue(refreshToken) }, { revokedAt: new Date() }); } return new Response(null, { status: 204 }); }
