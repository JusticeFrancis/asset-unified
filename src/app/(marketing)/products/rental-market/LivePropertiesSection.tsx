"use client";

import { useRecords } from "@/lib/api/queries/app";
import type { ApiRecord } from "@/lib/api/app.types";
import { Container, SectionHeading } from "../../components/shared";
import type { RentalPropertyCard } from "./data";
import { PropertyCard } from "./PropertyCard";

function asObject(value: unknown): Record<string, any> { return value && typeof value === "object" ? value as Record<string, any> : {}; }
function toCard(record: ApiRecord): RentalPropertyCard {
  const card = asObject(record.card); const detail = asObject(record.detail);
  const layers = Array.isArray(card.imageLayers) ? card.imageLayers.filter((value: unknown) => typeof value === "string") : [];
  const collected = card.fundsCollected ?? detail.collectedPercent ?? 0;
  return {
    name: String(card.title ?? record.title ?? ""),
    location: String(card.location ?? record.location ?? ""),
    apr: String(card.aprPercent ?? detail.aprPercent ?? "—"),
    funded: typeof collected === "number" ? `${collected}%` : String(collected),
    coOwners: String(card.coOwners ?? detail.investorsCount ?? "0"),
    statuses: [card.instantIncome ? "income" : null, String(card.badge ?? record.status).includes("fund") ? "funded" : null].filter(Boolean) as ("income" | "funded")[],
    image: String(layers.at(-1) ?? detail.heroImage ?? record.image ?? "") || undefined,
  };
}

export function LivePropertiesSection() {
  const { data } = useRecords("rental-property", "limit=100");
  const properties = (data?.records ?? []).map(toCard);
  return (
    <section className="bg-surface py-12 sm:py-16 md:py-20 lg:py-24">
      <SectionHeading eyebrow="Live Properties" title={<>Rental properties open for investment <span className="text-brand">right now.</span></>} description="Every property below has been vetted, legally structured, and is either actively generating rental income or approaching its funding target. Sign up to invest from $50." />
      <Container className="mt-10 grid gap-5 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((property, index) => <PropertyCard key={`${property.name}-${index}`} {...property} />)}
      </Container>
    </section>
  );
}
