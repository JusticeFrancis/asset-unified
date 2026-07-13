import { PropertyCard } from "./property-card";
import type { RentalPropertyRecord } from "@/app/dashboard/rental/data/rental-properties";

export function RentalEmptyProperties({ properties = [] }: { properties?: RentalPropertyRecord[] }) {
  if (properties.length > 0) {
    return (
      <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(min(100%,342px),1fr))] gap-5 pb-8">
        {properties.map((property) => <PropertyCard key={property.slug} {...property.card} href={`/dashboard/rental/${property.slug}`} />)}
      </div>
    );
  }
  return <p className="py-16 text-center text-[19px] font-medium text-[#919191]">You don&apos;t have any properties yet</p>;
}
