"use client";

import { DashboardPagePlaceholder } from "@/app/dashboard/components/dashboard-page-placeholder";
import { useRecord } from "@/lib/api/queries/app";
import { TermsLegalLink } from "./terms-legal-link";

export default function TermsPage() {
  const { data } = useRecord("legal-document", "terms-of-use");
  const description = String(data?.summary ?? data?.description ?? "");
  return (
    <div className="space-y-4">
      <DashboardPagePlaceholder
        description={description}
        title={String(data?.title ?? "Terms")}
      />
      <TermsLegalLink />
    </div>
  );
}
