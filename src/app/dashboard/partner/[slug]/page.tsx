"use client";

import { useParams } from "next/navigation";
import { PartnerDetailView } from "@/app/dashboard/partner/components/partner-detail-view";
import type { PartnerDetailRecord } from "@/app/dashboard/partner/data/partner-records";
import { useRecord } from "@/lib/api/queries/app";

export default function PartnerDetailPage() {
  const params = useParams<{ slug: string }>();
  const { data, isLoading } = useRecord("partner", params.slug);
  if (isLoading) return null;
  if (!data) return <p className="py-16 text-center text-[19px] font-medium text-[#919191]">Partner not found</p>;
  return <PartnerDetailView partner={data as unknown as PartnerDetailRecord} />;
}
