"use client";

import { DashboardPagePlaceholder } from "@/app/dashboard/components/dashboard-page-placeholder";
import { useRecord } from "@/lib/api/queries/app";
import { FaqMarketingLink } from "./faq-marketing-link";

export default function FaqPage() {
  const { data } = useRecord("dashboard-page", "faq");
  return (
    <div className="space-y-4">
      <DashboardPagePlaceholder
        description={String(data?.description ?? "")}
        title={String(data?.title ?? "Faq")}
      />
      <FaqMarketingLink />
    </div>
  );
}
