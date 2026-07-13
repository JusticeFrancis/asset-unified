import { NextRequest } from "next/server";
import { requireAdmin } from "@/admin/lib/server/auth";
import { handleRouteError, ok } from "@/admin/lib/server/http";
import { transitionProperty } from "@/admin/lib/server/property-transitions";
import { beginPropertyProvisioning } from "@/admin/lib/server/integrations";

export async function POST(request: NextRequest, context: { params: Promise<{ propertyId: string }> }) {
  try {
    const { admin } = await requireAdmin(request, "properties.update");
    const { propertyId } = await context.params;
    const { result } = await transitionProperty({ request, admin, propertyId, to: "submitted", allowedFrom: ["draft", "rejected"], action: "Submitted property for review" });
    await beginPropertyProvisioning(propertyId);
    return ok(result);
  } catch (error) { return handleRouteError(error); }
}
