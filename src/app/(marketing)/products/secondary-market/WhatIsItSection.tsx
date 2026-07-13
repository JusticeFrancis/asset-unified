import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  SecondaryMarketWhatIsComplianceIcon,
  SecondaryMarketWhatIsLegalTransferIcon,
  SecondaryMarketWhatIsNoLockupIcon,
  SecondaryMarketWhatIsPeerIcon,
} from "@/lib/assets";
import { Container, SectionHeading } from "../../components/shared";
import { secondaryValueCards } from "./data";

const iconMap = {
  blocks: SecondaryMarketWhatIsPeerIcon,
  liquidity: SecondaryMarketWhatIsNoLockupIcon,
  legal: SecondaryMarketWhatIsLegalTransferIcon,
  shield: SecondaryMarketWhatIsComplianceIcon,
};

export function WhatIsItSection() {
  return (
    <section id="properties" className="py-12 sm:py-16 md:py-20">
      <SectionHeading
        eyebrow="What Is It"
        title={
          <>
            <span className="text-brand">A marketplace</span> where investors
            trade shares with each other.
          </>
        }
        description="When you buy property shares on Asset Union, you're not locked in. The secondary market is a peer-to-peer exchange where existing investors can sell shares directly to new buyers — at any time, without any involvement from the platform."
      />
      <Container className="mt-10 grid gap-5 sm:mt-12 sm:gap-6 md:grid-cols-2">
        {secondaryValueCards.map((item) => {
          const icon = iconMap[item.icon];
          const isHighlighted = Boolean(item.highlighted);
          return (
            <article
              key={item.title}
              className={cn(
                "rounded-[20px] border border-border p-5 sm:p-6",
                isHighlighted ? "bg-brand text-white" : "bg-surface",
              )}
            >
              <span className="inline-flex size-10 items-center justify-center sm:size-12">
                <Image
                  src={icon}
                  alt=""
                  aria-hidden
                  className="size-8 sm:size-10"
                />
              </span>
              <h3 className="mt-4 text-h3 font-medium leading-tight sm:mt-5">
                {item.title}
              </h3>
              <p
                className={cn(
                  "mt-3 text-base leading-relaxed sm:mt-4 sm:text-body-lg",
                  isHighlighted ? "text-[#E7EBEE]" : "text-muted",
                )}
              >
                {item.body}
              </p>
            </article>
          );
        })}
      </Container>
    </section>
  );
}
