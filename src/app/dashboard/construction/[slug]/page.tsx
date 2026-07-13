"use client";

import { useParams } from "next/navigation";
import { ConstructionPropertyDetailView } from "./components/construction-property-detail-view";
import { useRecord } from "@/lib/api/queries/app";
import type { ConstructionPropertyRecord } from "@/app/dashboard/construction/data/construction-properties";

export default function ConstructionPropertyPage() {
  const params = useParams<{ slug: string }>();
  const { data, isLoading } = useRecord("construction-property", params.slug);
  if (isLoading) return null;
  if (!data) return <p className="py-16 text-center text-[19px] font-medium text-[#919191]">Property not found</p>;
  return <ConstructionPropertyDetailView property={data as unknown as ConstructionPropertyRecord} />;
}
