import { PropertyCard } from "./property-card";
import type { ConstructionPropertyRecord } from "@/app/dashboard/construction/data/construction-properties";

export function ConstructionPropertyGrid({ properties = [] }: { properties?: ConstructionPropertyRecord[] }) {
  return (
    <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(min(100%,342px),1fr))] gap-5 pb-8">
      {properties.map((property) => (
        <PropertyCard key={property.slug} {...property.card} href={`/dashboard/construction/${property.slug}`} />
      ))}
    </div>
  );
}
