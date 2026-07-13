"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  ReferralCopyDarkIcon,
  ReferralHeroPolygonInner,
  ReferralHeroPolygonOuter,
  ReferralIncomeIcon,
} from "@/lib/assets";
import { useRecord } from "@/lib/api/queries/app";
import { CopyLinkInput } from "../../components/CopyLinkInput";
import { FloatingStatPill } from "../../components/FloatingStatPill";
import { MarketingBrandHero } from "../../components/MarketingBrandHero";

function text(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

export function HeroSection() {
  const { data } = useRecord("referral-program", "default");
  const [referralEntryUrl, setReferralEntryUrl] = useState("/sign-in?callbackUrl=/dashboard/refer-and-earn");

  useEffect(() => {
    setReferralEntryUrl(`${window.location.origin}/sign-in?callbackUrl=${encodeURIComponent("/dashboard/refer-and-earn")}`);
  }, []);

  return (
    <MarketingBrandHero
      title={text(data?.heroTitle, "Earn when your referrals invest")}
      body={text(data?.heroDescription, "Sign in to generate your unique referral link and track eligible rewards from your account.")}
      actions={
        <CopyLinkInput
          link={referralEntryUrl}
          buttonLabel="Get my Link"
          buttonIcon={<Image src={ReferralCopyDarkIcon} alt="" aria-hidden width={20} height={20} className="size-5" />}
        />
      }
      media={
        <div className="relative mx-auto aspect-square w-full max-w-[360px] sm:max-w-[420px] lg:max-w-[450px]">
          <div className="absolute inset-0 flex items-center justify-center"><div className="-rotate-90"><Image src={ReferralHeroPolygonOuter} alt="" aria-hidden width={540} height={540} className="size-[320px] sm:size-[400px] lg:size-[420px]" /></div></div>
          <div className="absolute inset-0 flex items-center justify-center"><div className="-rotate-90"><Image src={ReferralHeroPolygonInner} alt="" aria-hidden width={515} height={515} className="size-[304px] sm:size-[380px] lg:size-[400px]" priority /></div></div>
        </div>
      }
      floating={
        <FloatingStatPill
          icon={<Image src={ReferralIncomeIcon} alt="" aria-hidden width={24} height={24} className="size-5 sm:size-6" />}
          value={text(data?.incomeDisplay, "—")}
          label={text(data?.incomeLabel, "Referral earnings")}
          className="absolute left-2 top-2 sm:left-4 sm:top-6 lg:left-[-7%] lg:top-[65%]"
        />
      }
    />
  );
}
