"use client";

import { useParams } from "next/navigation";
import { RentalPropertyDetailView } from "./components/rental-property-detail-view";
import { useRecord } from "@/lib/api/queries/app";
import type { RentalPropertyRecord } from "@/app/dashboard/rental/data/rental-properties";

export default function RentalPropertyPage() {
  const params = useParams<{ slug: string }>();
  const { data, isLoading } = useRecord("rental-property", params.slug);
  if (isLoading) return null;
  if (!data) return <p className="py-16 text-center text-[19px] font-medium text-[#919191]">Property not found</p>;
  return <RentalPropertyDetailView property={data as unknown as RentalPropertyRecord} />;
}
