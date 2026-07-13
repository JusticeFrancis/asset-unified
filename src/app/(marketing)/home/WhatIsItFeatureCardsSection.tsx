"use client";

import {
  FeatureBarrierIcon,
  FeatureDailyRentIcon,
  FeatureLegalOwnershipIcon,
  FeatureLiquidityIcon,
} from "@/components/icons";
import { valueProps } from "./data";
import { useRecord } from "@/lib/api/queries/app";
import { Container, PrimaryButton, SectionHeading } from "../components/shared";

export function WhatIsItFeatureCardsSection() {
  const { data: platformStats } = useRecord("marketing-section", "home-platform-stats");
  const featureIcons = [
    FeatureDailyRentIcon,
    FeatureLiquidityIcon,
    FeatureLegalOwnershipIcon,
    FeatureBarrierIcon,
  ];

  return (
    // pt-28 reserves space for the brand-endorsements bar that overflows the
    // hero into this section. Bumped on md+ where the bar is taller.
    <section
      id="what-different"
      className="pb-12 pt-24 sm:pt-28 md:pb-20 md:pt-32"
    >
      <SectionHeading
        eyebrow="What's Different"
        title={
          <>
            Real Estate Was Never Built for Regular Investors.
            <span className="text-brand"> We Fixed That.</span>
          </>
        }
        description="Six-figure minimums. Months of paperwork. Income you see once a quarter if you're lucky. That was the old model. Here's what we replaced it with."
      />
      <Container>
        <div className="mt-8 flex justify-center">
          <PrimaryButton href="/sign-in" className="sm:w-[171px]">
            Start Investing
          </PrimaryButton>
        </div>

        <div className="mt-12 grid gap-10 sm:gap-12 md:grid-cols-2 md:gap-x-16 lg:gap-x-24 xl:gap-x-44">
          {valueProps.map((item, index) => {
            const Icon = featureIcons[index] ?? FeatureDailyRentIcon;

            return (
              <article key={item.title}>
                <div className="mb-5 inline-flex size-12 items-center justify-center rounded-xl bg-background text-brand">
                  <Icon className="size-8 sm:size-10" />
                </div>
                <h3 className="text-h2 font-medium leading-tight text-foreground">
                  {item.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-muted sm:text-body-lg">
                  {item.body}
                </p>
              </article>
            );
          })}
        </div>
        {platformStats ? (
          <p className="mx-auto mt-12 max-w-3xl text-center text-base text-foreground sm:mt-14 sm:text-xl md:text-2xl">
            {platformStats.propertyValue ? <><span className="font-medium text-brand">{String(platformStats.propertyValue)}</span> in property value tokenized. </> : null}
            {platformStats.investorCount ? <><span className="font-medium text-brand">{String(platformStats.investorCount)} verified investors.</span>{" "}</> : null}
            {String(platformStats.trailingText ?? "")}
          </p>
        ) : null}
      </Container>
    </section>
  );
}
