import Image from "next/image";
import Link from "next/link";
import {
  IndependentAgentHeroPolygonInner,
  IndependentAgentHeroPolygonOuter,
  IndependentAgentHeroTotalRaisedIcon,
} from "@/lib/assets";
import { FloatingStatPill } from "../../components/FloatingStatPill";
import { MarketingBrandHero } from "../../components/MarketingBrandHero";

export function HeroSection() {
  return (
    <MarketingBrandHero
      title={
        <>
          Refer clients. Earn on every investment they make.
        </>
      }
      body="You do not need to be part of an agency, hold a broker license, or have technical knowledge. If you know people who would invest in premium international real estate, Asset Union gives you a commission structure to earn from those introductions."
      actions={
        <Link
          href="/sign-in"
          className="inline-flex min-h-tap w-full items-center justify-center rounded-xl bg-[#050A0E] px-5 text-sm font-medium text-background sm:w-auto sm:px-6 sm:text-base"
        >
          <span className="text-background">Apply as Independent Agent</span>
        </Link>
      }
      media={
        <div className="relative mx-auto aspect-square w-full max-w-[360px] sm:max-w-[420px] lg:max-w-[468px]">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="-rotate-90">
              <Image
                src={IndependentAgentHeroPolygonOuter}
                alt=""
                aria-hidden
                width={468}
                height={468}
                className="size-[320px] sm:size-[400px] lg:size-[420px]"
              />
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="-rotate-90">
              <Image
                src={IndependentAgentHeroPolygonInner}
                alt="Asset Union independent agent property"
                width={447}
                height={447}
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
              src={IndependentAgentHeroTotalRaisedIcon}
              alt=""
              aria-hidden
              width={24}
              height={24}
              className="size-5 sm:size-6"
            />
          }
          value="+$284K"
          label="Total Raised"
          className="absolute left-2 top-2 sm:left-4 sm:top-6 lg:left-[-16px] lg:top-[55%]"
        />
      }
    />
  );
}
