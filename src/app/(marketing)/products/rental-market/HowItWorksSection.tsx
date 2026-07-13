"use client";

import Image from "next/image";
import { RentalMarketInfoIcon } from "@/lib/assets";
import { useRecord } from "@/lib/api/queries/app";
import { Container } from "../../components/shared";
import { StatList } from "../../components/StatList";
import { rentalHowItWorksSteps } from "./data";

export function HowItWorksSection() {
  const { data: example } = useRecord("rental-ownership-example", "default");
  const stats = Array.isArray(example?.stats)
    ? example.stats.flatMap((item) => {
        if (!item || typeof item !== "object") return [];
        const row = item as Record<string, unknown>;
        const label = String(row.label ?? "").trim();
        const value = String(row.value ?? "").trim();
        if (!label || !value) return [];
        return [{
          label,
          value: row.highlight ? <span className="text-[#14AE5C]">{value}</span> : value,
        }];
      })
    : [];

  return (
    <section id="how-it-works" className="py-12 sm:py-16 md:py-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,597px)] lg:gap-10">
          <div>
            <p className="text-eyebrow font-medium uppercase text-brand">How It Works</p>
            <h2 className="mt-2 text-h1 font-medium text-foreground">
              <span className="text-brand">A rental property,</span> split into shares anyone can own.
            </h2>
            <p className="mt-4 max-w-[632px] text-base text-muted sm:text-body-lg">
              Each rental property on Asset Union is placed inside its own legal LLC. Shares in that LLC are tokenized and offered to verified investors. Owning shares means owning part of the company that owns the property.
            </p>

            <div className="relative mt-8 pl-12 sm:mt-10 sm:pl-[58px]">
              <div className="space-y-7 sm:space-y-9">
                {rentalHowItWorksSteps.map((step, index) => (
                  <article
                    key={step.id}
                    className={`relative after:absolute after:-left-[33px] after:top-9 after:w-px after:bg-border after:content-[''] sm:after:-left-[41px] sm:after:top-[35px] ${index === rentalHowItWorksSteps.length - 1 ? "after:h-[calc(100%-36px)]" : "after:h-full"}`}
                  >
                    <span className="absolute -left-12 top-0 inline-flex size-9 items-center justify-center rounded-full bg-brand/15 text-sm font-medium text-brand sm:-left-[58px] sm:size-[35px] sm:text-[17px]">{step.id}</span>
                    <h3 className="text-h3 font-medium text-foreground">{step.title}</h3>
                    <p className="mt-2 text-base text-muted sm:mt-3 sm:text-body-lg">{step.body}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>

          <aside className="h-fit rounded-[20px] border border-border bg-surface p-6 sm:p-8">
            <h3 className="text-h3 font-medium text-foreground">
              {String(example?.title ?? "What owning shares actually means")}
            </h3>
            <p className="mt-1 text-sm text-[#919191] sm:text-base">
              {String(example?.description ?? "")}
            </p>
            <div className="mt-5">
              <StatList items={stats} />
            </div>

            {example?.disclaimer ? (
              <p className="mt-6 flex items-start gap-3 rounded-[20px] bg-brand p-5 text-sm leading-relaxed text-[#E7EBEE] sm:p-6 sm:text-base">
                <Image src={RentalMarketInfoIcon} alt="" aria-hidden className="size-5 shrink-0" />
                {String(example.disclaimer)}
              </p>
            ) : null}
          </aside>
        </div>
      </Container>
    </section>
  );
}
