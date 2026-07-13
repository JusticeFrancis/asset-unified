"use client";

import { useRecords } from "@/lib/api/queries/app";
import type { ApiRecord } from "@/lib/api/app.types";
import { Container, SectionHeading } from "../../components/shared";
import type { SecondaryMarketCard } from "./data";
import { MarketCard } from "./MarketCard";

function toCard(record: ApiRecord): SecondaryMarketCard {
  const value = (key: string, fallback: unknown = "") => record[key] ?? fallback;
  const currency = String(value("fiatCurrency", "USD"));
  const money = (amount: unknown) => new Intl.NumberFormat("en-US", { style: "currency", currency }).format(Number(amount || 0));
  return {
    name: String(value("propertyTitle", record.title ?? "")), location: String(value("location")),
    propertyPrice: money(value("propertyPrice")), shares: `${Number(value("availableAmount", 0)).toLocaleString()} Shares`,
    sharePrice: money(value("price")), apr: value("aprPercent") === "" ? "—" : `${value("aprPercent")}%`,
    aprDelta: value("aprDelta") ? String(value("aprDelta")) : "", image: String(value("image", value("imageUrl", value("coverImage")))) || undefined,
  };
}

export function LiveMarketsSection() {
  const { data } = useRecords("p2p-offer", "status=active&limit=100");
  const cards = (data?.records ?? []).map(toCard);
  return (
    <section className="py-12 sm:py-16 md:py-20">
      <SectionHeading eyebrow="Live Markets" title={<><span className="text-brand">Shares listed</span> right now by other investors.</>} description="Every listing below is a real ownership stake in a real property. Prices are set by the seller. Rent keeps flowing to whoever holds the shares." />
      <Container className="mt-10 grid gap-5 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, index) => <MarketCard key={`${card.name}-${index}`} {...card} />)}
      </Container>
    </section>
  );
}
