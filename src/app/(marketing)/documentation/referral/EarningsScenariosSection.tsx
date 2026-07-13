"use client";

import { useRecords } from "@/lib/api/queries/app";
import { Container, SectionHeading } from "../../components/shared";

export function EarningsScenariosSection() {
  const { data } = useRecords("referral-earning-scenario", "limit=20");
  const scenarios = (data?.records ?? []).map((record) => ({
    id: record.id,
    amount: String(record.amount ?? ""),
    suffix: String(record.suffix ?? ""),
    label: String(record.label ?? record.title ?? ""),
    text: String(record.text ?? record.body ?? ""),
    formula: String(record.formula ?? ""),
    total: String(record.total ?? ""),
    avatars: Array.isArray(record.avatars) ? record.avatars.map(String).filter(Boolean) : [],
  }));

  return (
    <section className="bg-[#EDF4F8] py-12 sm:py-16 md:py-20">
      <Container>
        <SectionHeading
          eyebrow="EARNINGS SCENARIOS"
          title={<>How your <span className="text-brand">rewards</span> are calculated</>}
          description="Invite friends, track their investments, and see exactly how much you can earn."
          align="left"
        />

        <div className="mt-10 grid gap-5 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {scenarios.map((scenario) => (
            <article key={scenario.id} className="flex h-full flex-col justify-between rounded-[20px] border border-border bg-white px-5 py-6 sm:px-6 sm:py-8">
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-end gap-1">
                      <p className="text-h3 font-medium text-foreground">{scenario.amount}</p>
                      <p className="text-[10px] text-[#919191] sm:text-[11px]">{scenario.suffix}</p>
                    </div>
                    <p className="mt-1 text-xs text-brand">{scenario.label}</p>
                  </div>
                  <div className="flex shrink-0 -space-x-3">
                    {scenario.avatars.map((avatar, index) => (
                      <img key={`${scenario.id}-avatar-${index}`} src={avatar} alt="" aria-hidden className="size-7 rounded-full border border-white object-cover sm:size-8" />
                    ))}
                  </div>
                </div>
                <p className="mt-4 text-base leading-relaxed text-[#919191] sm:text-body-lg">{scenario.text}</p>
              </div>
              <div className="mt-6 border-t border-dashed border-border pt-4 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="truncate text-[#919191]">{scenario.formula}</span>
                  <span className="shrink-0 text-foreground">{scenario.total}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
