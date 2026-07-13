import { NextRequest, NextResponse } from "next/server";
import { Property } from "@/admin/models";
import { requireAdmin } from "@/admin/lib/server/auth";
import { getDoolaDocument } from "@/admin/lib/server/integrations";
import { handleRouteError, HttpError } from "@/admin/lib/server/http";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ propertyId: string; documentId: string }> },
) {
  try {
    await requireAdmin(request, "properties.view");
    const { propertyId, documentId } = await context.params;
    const property = await Property.findById(propertyId);
    if (!property) throw new HttpError(404, "NOT_FOUND", "Property not found.");
    if (!property.legalEntity?.companyId) {
      throw new HttpError(409, "LEGAL_ENTITY_NOT_READY", "The property does not have a legal entity yet.");
    }

    const knownDocument = (property.legalEntity.documents || []).find(
      (document: any) => document.providerDocumentId === documentId,
    );
    if (!knownDocument) throw new HttpError(404, "NOT_FOUND", "Legal document not found.");

    const document = await getDoolaDocument(property.legalEntity.companyId, documentId);
    const downloadUrl = document.downloadUrl || document.url || document.fileUrl || "";
    if (!downloadUrl) {
      throw new HttpError(502, "DOWNLOAD_URL_MISSING", "The legal provider did not return a document URL.");
    }
    return NextResponse.redirect(downloadUrl);
  } catch (error) {
    return handleRouteError(error);
  }
}
