import Image from "next/image";
import Link from "next/link";
import { SecondaryMarketCtaSphere } from "@/lib/assets";
import { MarketingCtaCard } from "../../components/MarketingCtaCard";
import { PrimaryButton } from "../../components/shared";

export function CtaSection() {
  return (
    <MarketingCtaCard
      className="py-16 sm:py-20"
      title="The exit has always been the problem with real estate. We solved it."
      body="Create your account and start investing in properties you can actually leave when you want to."
      decorations={
        <>
          <Image
            src={SecondaryMarketCtaSphere}
            alt=""
            aria-hidden
            className="absolute -right-[127px] -top-[48px] size-[384px]"
          />
          <Image
            src={SecondaryMarketCtaSphere}
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
