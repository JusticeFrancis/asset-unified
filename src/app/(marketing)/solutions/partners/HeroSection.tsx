import Image from "next/image";
import Link from "next/link";
import {
  PartnersHeroPolygonInner,
  PartnersHeroPolygonOuter,
  PartnersHeroTotalRaisedIcon,
} from "@/lib/assets";
import { FloatingStatPill } from "../../components/FloatingStatPill";
import { MarketingBrandHero } from "../../components/MarketingBrandHero";

export function HeroSection() {
  return (
    <MarketingBrandHero
      title="The Properties on our Platform need your Skills."
      body="Every tokenized property on Asset Union is co-owned by dozens of investors - and they expect it to be professionally managed, legally protected, and properly maintained."
      actions={
        <Link
          href="/sign-in"
          className="inline-flex min-h-tap w-full items-center justify-center rounded-xl bg-[#050A0E] px-5 text-sm font-medium text-background sm:w-56 sm:text-base"
        >
          <span className="text-background">Apply as Partner</span>
        </Link>
      }
      media={
        <div className="relative mx-auto aspect-square w-full max-w-[360px] sm:max-w-[420px] lg:max-w-[450px]">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="-rotate-90">
              <Image
                src={PartnersHeroPolygonOuter}
                alt=""
                aria-hidden
                width={450}
                height={450}
                className="size-[320px] sm:size-[400px] lg:size-[420px]"
              />
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="-rotate-90">
              <Image
                src={PartnersHeroPolygonInner}
                alt="Asset Union partner-ready property"
                width={430}
                height={430}
                className="size-[304px] sm:size-[380px] lg:size-[400px]"
                priority
              />
            </div>
          </div>
        </div>
      }
      floating={
        <FloatingStatPill
          icon={
            <Image
              src={PartnersHeroTotalRaisedIcon}
              alt=""
              aria-hidden
              width={24}
              height={24}
              className="size-5 sm:size-6"
            />
          }
          value="+$284K"
          label="Total Raised"
          className="absolute left-2 top-2 sm:left-4 sm:top-6 lg:left-0 lg:top-[55%]"
        />
      }
    />
  );
}
