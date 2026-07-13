"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  ReferralCopyLightIcon,
  ReferralShareLinkIcon,
  ReferralTelegramIcon,
  ReferralWhatsappIcon,
} from "@/lib/assets";
import { CopyLinkInput } from "../../components/CopyLinkInput";
import { Container, SectionHeading } from "../../components/shared";
import { howToStartSteps } from "./data";

const shareButtons = [
  { label: "Whatsapp", icon: ReferralWhatsappIcon },
  { label: "Telegram", icon: ReferralTelegramIcon },
  { label: "Share link", icon: ReferralShareLinkIcon },
];

export function HowToStartSection() {
  const [referralEntryUrl, setReferralEntryUrl] = useState("/sign-in?callbackUrl=/dashboard/refer-and-earn");

  useEffect(() => {
    setReferralEntryUrl(`${window.location.origin}/sign-in?callbackUrl=${encodeURIComponent("/dashboard/refer-and-earn")}`);
  }, []);

  const share = async (channel: string) => {
    const message = `Join Asset Union and create your referral link: ${referralEntryUrl}`;
    if (channel === "Whatsapp") {
      window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
      return;
    }
    if (channel === "Telegram") {
      window.open(`https://t.me/share/url?url=${encodeURIComponent(referralEntryUrl)}&text=${encodeURIComponent("Create your Asset Union referral link")}`, "_blank", "noopener,noreferrer");
      return;
    }
    if (navigator.share) {
      await navigator.share({ title: "Asset Union", text: "Create your Asset Union referral link", url: referralEntryUrl });
      return;
    }
    await navigator.clipboard.writeText(referralEntryUrl);
  };

  return (
    <section className="py-12 sm:py-16 md:py-20">
      <Container>
        <SectionHeading
          eyebrow="TWO SIMPLE STEPS"
          title="How to start earning today"
          description="Invite your network to invest in verified real estate and earn a percentage automatically."
        />
        <div className="mt-10 grid gap-5 sm:mt-12 sm:gap-6 lg:grid-cols-2">
          <article className="relative flex h-full flex-col justify-between rounded-[20px] border border-border bg-white px-5 pb-6 pt-10 sm:px-8 sm:pb-8 sm:pt-12">
            <div>
              <h3 className="max-w-[80%] text-h3 font-medium text-foreground">
                {howToStartSteps[0].title}
              </h3>
              <p className="mt-6 text-base leading-relaxed text-[#919191] sm:mt-8 sm:text-body-lg">
                {howToStartSteps[0].body}
              </p>
            </div>
            <div className="mt-6 border-t border-dashed border-border pt-4 sm:mt-8">
              <CopyLinkInput
                tone="inverse"
                link={referralEntryUrl}
                buttonLabel="Get my Link"
                buttonIcon={
                  <Image
                    src={ReferralCopyLightIcon}
                    alt=""
                    aria-hidden
                    width={20}
                    height={20}
                    className="size-5"
                  />
                }
              />
            </div>
            <span className="absolute right-5 top-5 text-2xl font-medium text-foreground/10 sm:right-8 sm:top-8 sm:text-[33px]">
              01
            </span>
          </article>

          <article className="relative flex h-full flex-col justify-between rounded-[20px] border border-border bg-white px-5 pb-6 pt-10 sm:px-8 sm:pb-8 sm:pt-12">
            <div>
              <h3 className="max-w-[80%] text-h3 font-medium text-foreground">
                {howToStartSteps[1].title}
              </h3>
              <p className="mt-6 text-base leading-relaxed text-[#919191] sm:mt-8 sm:text-body-lg">
                {howToStartSteps[1].body}
              </p>
            </div>
            <div className="mt-6 border-t border-dashed border-border pt-4 sm:mt-8">
              <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
                {shareButtons.map((channel) => (
                  <button
                    key={channel.label}
                    type="button"
                    onClick={() => void share(channel.label)}
                    className="inline-flex min-h-tap items-center justify-center gap-2 rounded-xl bg-[#EDF4F8] px-4 py-3 text-sm font-medium text-brand sm:px-6 sm:text-base"
                  >
                    <Image
                      src={channel.icon}
                      alt=""
                      aria-hidden
                      width={20}
                      height={20}
                      className="size-5"
                    />
                    {channel.label}
                  </button>
                ))}
              </div>
            </div>
            <span className="absolute right-5 top-5 text-2xl font-medium text-foreground/10 sm:right-8 sm:top-8 sm:text-[33px]">
              02
            </span>
          </article>
        </div>
      </Container>
    </section>
  );
}
