import Image from "next/image";
import Link from "next/link";
import { ConstructionMarketCtaSphere } from "@/lib/assets";
import { MarketingCtaCard } from "../../components/MarketingCtaCard";
import { PrimaryButton } from "../../components/shared";

export function CtaSection() {
  return (
    <MarketingCtaCard
      title="Get in before the building exists. That's where the upside is."
      body="Browse live construction projects. Invest from $50. Track every milestone."
      decorations={
        <>
          <Image
            src={ConstructionMarketCtaSphere}
            alt=""
            aria-hidden
            className="absolute -right-[127px] -top-[48px] size-[384px]"
          />
          <Image
            src={ConstructionMarketCtaSphere}
            alt=""
            aria-hidden
            className="absolute -bottom-[220px] left-[10px] size-[384px]"
          />
        </>
      }
      actions={
        <>
          <PrimaryButton
            href="/sign-in"
            className="bg-white text-brand hover:opacity-95 sm:w-[224px]"
          >
            Create Your Account
          </PrimaryButton>
          <Link
            href="/sign-in"
            className="text-sm font-medium text-white underline underline-offset-2 sm:text-base"
          >
            <span className="text-white">Already Investing? Sign In</span>
          </Link>
        </>
      }
    />
  );
}
