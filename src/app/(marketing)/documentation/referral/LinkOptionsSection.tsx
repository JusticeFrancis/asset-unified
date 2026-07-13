"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ReferralCopyLightIcon } from "@/lib/assets";
import { Container, SectionHeading } from "../../components/shared";
import { referralLinkCards } from "./data";

/**
 * Renders a single decorative "browser preview" mock for a card.
 * The visual is purely cosmetic — kept compact and centred so it never
 * overflows the card when the grid collapses to one or two columns.
 */
function LinkPreview({ tone, index }: { tone: string; index: number }) {
  return (
    <div className="relative h-[170px] overflow-hidden sm:h-[200px] lg:h-[213px]">
      <div className={`absolute inset-0 ${tone}`} aria-hidden />
      <div className="absolute left-1/2 top-1/2 w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-[8px] bg-white p-3 shadow-[0_1px_4px_rgba(12,12,13,0.1),0_1px_4px_rgba(12,12,13,0.05)] sm:p-4">
        <div className={`h-2 w-1/3 rounded-[4px] ${tone}`} aria-hidden />
        <div className="mt-3 space-y-1">
          <div
            className="h-1 rounded-[4px] bg-[#CFE2EC]"
            style={{ width: index === 0 ? "85%" : "70%" }}
          />
          <div
            className="h-1 rounded-[4px] bg-[#CFE2EC]"
            style={{ width: index === 0 ? "75%" : "55%" }}
          />
          {index === 0 ? (
            <div className="h-1 w-[45%] rounded-[4px] bg-[#CFE2EC]" />
          ) : null}
        </div>
        <div
          className={`mt-3 h-3 w-1/2 rounded-[4px] ${tone}`}
          aria-hidden
        />
      </div>
    </div>
  );
}

export function LinkOptionsSection() {
  const [referralEntryUrl, setReferralEntryUrl] = useState("/sign-in?callbackUrl=/dashboard/refer-and-earn");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    setReferralEntryUrl(`${window.location.origin}/sign-in?callbackUrl=${encodeURIComponent("/dashboard/refer-and-earn")}`);
  }, []);

  const copy = async (index: number) => {
    await navigator.clipboard.writeText(referralEntryUrl);
    setCopiedIndex(index);
    window.setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <section className="bg-brand py-12 sm:py-16 md:py-20">
      <Container>
        <SectionHeading
          eyebrow="LINK OPTIONS"
          title="What referral links can you share?"
          description="Match your link to where your contact is in their decision journey. Each link type earns the same 3% reward."
          tone="light"
        />
        <div className="mt-10 grid gap-5 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
          {referralLinkCards.map((card, index) => (
            <article
              key={card.title}
              className="flex flex-col overflow-hidden rounded-[20px] bg-[#EDF4F8]"
            >
              <LinkPreview tone={card.tone} index={index} />
              <div className="flex-1 px-5 pb-4 pt-4 sm:px-6">
                <p className="text-[10px] uppercase tracking-wide text-[#919191] sm:text-[11px]">
                  {card.kicker}
                </p>
                <h3 className="mt-1 text-base font-medium text-foreground sm:text-lg">
                  {card.title}
                </h3>
                <p className="mt-1 text-sm leading-snug text-[#919191] sm:text-[13px]">
                  {card.body}
                </p>
              </div>
              <div className="flex">
                <div className="min-w-0 flex-1 truncate bg-background px-3 py-3 text-center text-sm font-medium text-[#919191] sm:px-4 sm:text-base">
                  {referralEntryUrl}
                </div>
                <button
                  type="button"
                  aria-label="Copy referral link"
                  onClick={() => void copy(index)}
                  className="inline-flex min-h-tap shrink-0 items-center justify-center bg-brand/15 px-4 py-3 sm:px-6"
                >
                  <Image
                    src={ReferralCopyLightIcon}
                    alt=""
                    aria-hidden
                    width={20}
                    height={20}
                    className="size-5"
                  />
                  <span className="sr-only">{copiedIndex === index ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
