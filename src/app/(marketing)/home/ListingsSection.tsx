"use client";

import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { AprTrendIcon } from "@/components/icons";
import { useRecords } from "@/lib/api/queries/app";
import type { ApiRecord } from "@/lib/api/app.types";
import { Container, PrimaryButton, SectionHeading } from "../components/shared";
import { MarketingCard } from "../components/MarketingCard";

function asObject(value: unknown): Record<string, any> {
  return value && typeof value === "object" ? value as Record<string, any> : {};
}

function listingFromRecord(record: ApiRecord) {
  const card = asObject(record.card);
  const detail = asObject(record.detail);
  const images = Array.isArray(card.imageLayers) ? card.imageLayers.filter((value: unknown) => typeof value === "string") : [];
  const rightColumn = String(card.rightColumn ?? "apr");
  return {
    id: record.id,
    status: String(card.statusLabel ?? detail.statusBadgeLabel ?? detail.statusBadge ?? record.status ?? ""),
    name: String(card.title ?? record.title ?? ""),
    location: String(card.location ?? record.location ?? ""),
    metricLabel: rightColumn === "constructionEnd" ? "Construction end" : "APR",
    metricValue: String(rightColumn === "constructionEnd" ? card.constructionEndQuarter ?? detail.expectedExit ?? "—" : card.aprPercent ?? detail.aprPercent ?? detail.projectedApr ?? "—"),
    funds: String(card.fundsCollected ?? detail.collectedPercent ?? detail.progressPercent ?? "0"),
    owners: String(card.coOwners ?? detail.investorsCount ?? detail.investorsLabel ?? "0"),
    image: String(images.at(-1) ?? detail.heroImage ?? record.image ?? ""),
  };
}

export function ListingsSection() {
  const { data } = useRecords("rental-property", "featured=true&limit=3");
  const listings = (data?.records ?? []).map(listingFromRecord);

  return (
    <section id="properties" className="bg-brand py-12 sm:py-16 md:py-20">
      <Container>
        <SectionHeading
          eyebrow="Our Properties"
          title={<>Pick a Property. Read the <span className="hidden lg:inline"><br /></span>Numbers. Decide for Yourself.</>}
          description="Every property listed here is a live investment opportunity. Fully vetted. Legally structured. Generating rental income."
          tone="light"
        />

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <MarketingCard
              key={listing.id}
              name={listing.name}
              location={listing.location}
              image={listing.image || undefined}
              imageRatio="tall"
              pills={listing.status ? [{ label: listing.status, tone: "default" }] : []}
              topRight={<div><p className="inline-flex items-center justify-end gap-1 text-xs text-[#919191]">{listing.metricLabel === "APR" ? <AprTrendIcon className="size-4 text-brand" /> : null}{listing.metricLabel}</p><p className="text-sm font-medium text-brand">{listing.metricValue}</p></div>}
              stats={[{ label: "Funds Collected:", value: listing.funds }, { label: "Co-owners:", value: listing.owners }]}
              actions={<Link href="/products/rental-market" className="inline-flex min-h-tap w-full items-center justify-center rounded-xl bg-brand px-4 text-sm font-medium text-white transition hover:opacity-95"><span className="text-white">View Property</span></Link>}
              className="bg-surface"
            />
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <PrimaryButton href="/products/rental-market" className="bg-white text-brand sm:w-[251px]"><span className="text-brand">Choose Your Properties</span><ArrowRightIcon className="size-4 ml-2 text-brand" /></PrimaryButton>
        </div>
      </Container>
    </section>
  );
}
