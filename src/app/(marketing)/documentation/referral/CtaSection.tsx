import Image from "next/image";
import Link from "next/link";
import { ReferralCtaSphere } from "@/lib/assets";
import { MarketingCtaCard } from "../../components/MarketingCtaCard";
import { PrimaryButton } from "../../components/shared";

export function CtaSection() {
  return (
    <MarketingCtaCard
      title="Build income-generating capital - for you and your network"
      body="Verified real estate, full ownership rights, and 3% on every investment your referrals make. Starting from just $50."
      actions={
        <>
          <PrimaryButton
            href="/sign-in"
            className="bg-white text-brand sm:w-auto sm:px-8 hover:bg-white/95 hover:opacity-100"
          >
            Create Your Account
          </PrimaryButton>
          <Link
            href="/sign-in"
            className="text-sm font-medium text-white underline underline-offset-4 sm:text-base"
          >
            <span className="text-white">Already Investing? Sign In</span>
          </Link>
        </>
      }
      decorations={
        <>
          <Image
            src={ReferralCtaSphere}
            alt=""
            aria-hidden
            width={384}
            height={384}
            className="pointer-events-none absolute -right-[128px] -top-12"
          />
          <Image
            src={ReferralCtaSphere}
            alt=""
            aria-hidden
            width={384}
            height={384}
            className="pointer-events-none absolute -bottom-[220px] left-2"
          />
        </>
      }
    />
  );
}
