"use client";

import { PropertyCard } from "@/app/dashboard/dashboard/property-card";
import { useRecords } from "@/lib/api/queries/app";
import type { ConstructionPropertyRecord } from "@/app/dashboard/construction/data/construction-properties";

export function ConstructionPropertiesGrid() {
  const { data } = useRecords("construction-property", "limit=100");
  const properties = (data?.records ?? []) as unknown as ConstructionPropertyRecord[];

  return (
    <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(min(100%,342px),1fr))] gap-5">
      {properties.map((property) => (
        <PropertyCard
          key={property.slug}
          {...property.card}
          href={`/dashboard/construction/${property.slug}`}
        />
      ))}
    </div>
  );
}
