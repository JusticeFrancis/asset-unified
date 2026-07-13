"use client";

import { PropertyCard } from "@/app/dashboard/dashboard/property-card";
import { useRecords } from "@/lib/api/queries/app";
import type { RentalPropertyRecord } from "@/app/dashboard/rental/data/rental-properties";
import { RentalFeaturedCard } from "./rental-featured-card";

export default function RentalPage() {
  const { data } = useRecords("rental-property", "limit=100");
  const properties = (data?.records ?? []) as unknown as RentalPropertyRecord[];
  const featured = properties.find((property) => property.isFeatured || property.featured);
  const remaining = featured
    ? properties.filter((property) => property.slug !== featured.slug)
    : properties;
  const topRowSide = remaining[0];
  const gridRest = remaining.slice(topRowSide ? 1 : 0);

  return (
    <div className="mx-auto flex w-full max-w-[1118px] flex-col gap-5">
      {featured ? (
        <div className="flex flex-col gap-5 lg:flex-row lg:items-stretch lg:gap-5">
          <RentalFeaturedCard className="min-w-0 flex-1" property={featured} />
          {topRowSide ? (
            <div className="mx-auto w-full max-w-[342px] shrink-0 justify-self-center lg:mx-0">
              <PropertyCard {...topRowSide.card} href={`/dashboard/rental/${topRowSide.slug}`} />
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(min(100%,342px),1fr))] gap-5">
        {(featured ? gridRest : remaining).map((property) => (
          <PropertyCard key={property.slug} {...property.card} href={`/dashboard/rental/${property.slug}`} />
        ))}
      </div>
    </div>
  );
}
