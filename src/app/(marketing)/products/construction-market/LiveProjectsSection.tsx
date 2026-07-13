"use client";

import { useRecords } from "@/lib/api/queries/app";
import type { ApiRecord } from "@/lib/api/app.types";
import { Container, SectionHeading } from "../../components/shared";
import type { ConstructionProjectCard } from "./data";
import { ProjectCard } from "./ProjectCard";

function asObject(value: unknown): Record<string, any> { return value && typeof value === "object" ? value as Record<string, any> : {}; }
function toCard(record: ApiRecord): ConstructionProjectCard {
  const card = asObject(record.card); const detail = asObject(record.detail);
  const layers = Array.isArray(card.imageLayers) ? card.imageLayers.filter((value: unknown) => typeof value === "string") : [];
  const badge = String(card.badge ?? record.status ?? "funding");
  const status: ConstructionProjectCard["status"] = badge.includes("strategy") ? "strategy" : badge.includes("funded") ? "funded" : "funding";
  const collected = card.fundsCollected ?? detail.progressPercent ?? 0;
  return {
    name: String(card.title ?? record.title ?? ""), location: String(card.location ?? record.location ?? ""),
    apr: String(card.aprPercent ?? detail.projectedApr ?? "—"), funded: typeof collected === "number" ? `${collected}%` : String(collected),
    coOwners: String(card.coOwners ?? detail.investorsLabel ?? "0"), status,
    image: String(layers.at(-1) ?? detail.heroImage ?? record.image ?? "") || undefined,
  };
}

export function LiveProjectsSection() {
  const { data } = useRecords("construction-property", "limit=100");
  const projects = (data?.records ?? []).map(toCard);
  return (
    <section className="py-12 sm:py-16 md:py-20">
      <SectionHeading eyebrow="Live Markets" title={<>Construction projects open for investment <span className="text-brand">right now.</span></>} description="Every listing below is a real ownership stake in a real property." />
      <Container className="mt-10 grid gap-5 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => <ProjectCard key={`${project.name}-${index}`} {...project} />)}
      </Container>
    </section>
  );
}
