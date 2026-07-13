"use client";

import {
  HomeAppStoreBadgeIcon,
  HomeGooglePlayBadgeIcon,
} from "@/components/icons";
import { useRecord } from "@/lib/api/queries/app";
import { appShowcaseImage } from "./data";
import { Container } from "../components/shared";

function text(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

export function AppDownloadSection() {
  const { data } = useRecord("site-config", "default");
  const appStoreUrl = text(data?.appStoreUrl);
  const googlePlayUrl = text(data?.googlePlayUrl);
  const title = text(data?.mobileAppTitle, "Download Our Mobile App");
  const description = text(data?.mobileAppDescription);
  const preview = text(data?.appShowcaseImageUrl, appShowcaseImage);
  const badgeClass = "flex w-full min-h-tap items-center gap-3 rounded-lg border border-[#2C373F] bg-[#050A0E] px-3 py-2 text-left sm:w-[195px]";

  return (
    <section className="py-12 sm:py-16 md:py-24">
      <Container>
        <div className="relative overflow-hidden rounded-[20px] bg-brand px-6 py-8 sm:px-8 sm:py-10 md:px-10">
          <div aria-hidden className="pointer-events-none absolute -right-[170px] -top-[168px] hidden size-[384px] rounded-full bg-white/10 sm:block" />
          <div aria-hidden className="pointer-events-none absolute -bottom-[341px] left-[551px] hidden size-[384px] rounded-full bg-white/10 sm:block" />
          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,562px)_minmax(0,1fr)]">
            <div className="h-64 overflow-hidden rounded-xl bg-white/8 sm:h-80 md:h-96 lg:h-[420px]">
              <img src={preview} alt="Asset Union mobile app preview" className="size-full object-cover opacity-90" />
            </div>
            <div>
              <h2 className="text-h1 font-semibold leading-tight text-[#F4F6F6]">{title}</h2>
              {description ? <p className="mt-4 max-w-[514px] text-base leading-relaxed text-[#F4F6F6] sm:text-body-lg">{description}</p> : null}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
                {appStoreUrl ? <a href={appStoreUrl} target="_blank" rel="noopener noreferrer" className={badgeClass}><HomeAppStoreBadgeIcon className="size-8" /><span className="text-base leading-tight text-[#F4F6F6]"><span className="block font-light">Download on the</span><span className="block font-medium">App Store</span></span></a> : <button type="button" disabled aria-disabled="true" className={badgeClass}><HomeAppStoreBadgeIcon className="size-8" /><span className="text-base leading-tight text-[#F4F6F6]"><span className="block font-light">Download on the</span><span className="block font-medium">App Store</span></span></button>}
                {googlePlayUrl ? <a href={googlePlayUrl} target="_blank" rel="noopener noreferrer" className={badgeClass}><HomeGooglePlayBadgeIcon className="h-8 w-7" /><span className="text-base leading-tight text-[#F4F6F6]"><span className="block font-light">Get it on</span><span className="block font-medium">Google play</span></span></a> : <button type="button" disabled aria-disabled="true" className={badgeClass}><HomeGooglePlayBadgeIcon className="h-8 w-7" /><span className="text-base leading-tight text-[#F4F6F6]"><span className="block font-light">Get it on</span><span className="block font-medium">Google play</span></span></button>}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
