import Image from "next/image";
import {
  DevelopersHeroMarketingSavingsIcon,
  DevelopersHeroProperty,
  DevelopersHeroTotalRaisedIcon,
} from "@/lib/assets";
import { MarketingHero } from "../../components/MarketingHero";
import { PrimaryButton } from "../../components/shared";

export function HeroSection() {
  return (
    <MarketingHero
      eyebrow="For Developers"
      title={
        <>
          Sell your Projects Faster.{" "}
          <span className="text-brand">Cut your Marketing Cost.</span>
        </>
      }
      body="Asset Union gives real estate developers direct access to a global pool of 2,100+ verified co-investors. Tokenize your project and reach buyers you couldn’t afford to find alone."
      actions={
        <PrimaryButton href="/sign-in" className="w-full sm:w-auto">
          Apply as a Developer
        </PrimaryButton>
      }
      minHeightClassName="min-h-[420px] md:min-h-[520px] lg:min-h-[600px]"
      media={
        <div className="relative mx-auto w-full max-w-[555px] lg:mx-0">
          <div className="relative overflow-hidden rounded-[20px] border border-border">
            <Image
              src={DevelopersHeroProperty}
              alt="Modern residential development"
              width={555}
              height={367}
              sizes="(min-width: 1024px) 555px, (min-width: 640px) 80vw, 100vw"
              className="h-auto w-full"
              priority
            />
          </div>

          <div className="absolute -left-3 -top-3 rounded-[16px] border border-border bg-white px-3 py-2 shadow-[0_4px_4px_rgba(12,12,13,0.1),0_4px_4px_rgba(12,12,13,0.05)] sm:-left-4 sm:-top-4 sm:rounded-[20px] sm:px-4 sm:py-3 md:-left-6 md:-top-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand/15 sm:size-10">
                <Image
                  src={DevelopersHeroTotalRaisedIcon}
                  alt=""
                  aria-hidden
                  width={24}
                  height={24}
                  className="size-5 sm:size-6"
                />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium leading-none text-foreground sm:text-[17px]">
                  +$284K
                </p>
                <p className="mt-1 truncate text-[10px] leading-[1.2] text-[#919191] sm:text-[11px]">
                  Total Raised
                </p>
              </div>
            </div>
          </div>

          <div className="absolute -right-3 top-1/2 -translate-y-1/2 rounded-[16px] border border-border bg-white px-3 py-2 shadow-[0_4px_4px_rgba(12,12,13,0.1),0_4px_4px_rgba(12,12,13,0.05)] sm:-right-4 sm:rounded-[20px] sm:px-4 sm:py-3 md:-right-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#BF6A0226] sm:size-10">
                <Image
                  src={DevelopersHeroMarketingSavingsIcon}
                  alt=""
                  aria-hidden
                  width={24}
                  height={24}
                  className="size-5 sm:size-6"
                />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium leading-none text-foreground sm:text-[17px]">
                  +30%
                </p>
                <p className="mt-1 truncate text-[10px] leading-[1.2] text-[#919191] sm:text-[11px]">
                  Save up on marketing
                </p>
              </div>
            </div>
          </div>
        </div>
      }
    />
  );
}
