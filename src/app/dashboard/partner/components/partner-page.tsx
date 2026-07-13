"use client";

import { useRecords } from "@/lib/api/queries/app";
import type { PartnerListCard } from "@/app/dashboard/partner/data/partner-records";
import { PartnerSummaryCard } from "./partner-summary-card";

export default function PartnerPage() {
  const { data } = useRecords("partner", "limit=100");
  const cards = (data?.records ?? []) as unknown as PartnerListCard[];
  return (
    <div className="mx-auto flex w-full max-w-[1118px] flex-col gap-5">
      <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(min(100%,320px),1fr))] gap-5">
        {cards.map((card) => <PartnerSummaryCard key={card.slug} {...card} />)}
      </div>
    </div>
  );
}
