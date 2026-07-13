import { NextRequest } from "next/server";
import { requireAdmin } from "@/admin/lib/server/auth";
import { handleRouteError, ok, readJson } from "@/admin/lib/server/http";
import { transitionProperty } from "@/admin/lib/server/property-transitions";

export async function POST(request: NextRequest, context: { params: Promise<{ propertyId: string }> }) {
  try {
    const { admin } = await requireAdmin(request, "properties.approve");
    const { propertyId } = await context.params;
    const body = await readJson<{ reason?: string }>(request);
    return ok((await transitionProperty({ request, admin, propertyId, to: "paused", allowedFrom: ["active"], action: "Paused property", reason: body.reason?.trim() })).result);
  } catch (error) { return handleRouteError(error); }
}
