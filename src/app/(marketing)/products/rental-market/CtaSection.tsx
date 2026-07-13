import Image from "next/image";
import Link from "next/link";
import { RentalMarketCtaSphere } from "@/lib/assets";
import { MarketingCtaCard } from "../../components/MarketingCtaCard";
import { PrimaryButton } from "../../components/shared";

export function CtaSection() {
  return (
    <MarketingCtaCard
      title="The rental property that doesn't ask you to be a landlord."
      body="Start with $50. Own a piece of a real property. Earn rent every single day."
      decorations={
        <>
          <Image
            src={RentalMarketCtaSphere}
            alt=""
            aria-hidden
            className="absolute -right-[127px] -top-[48px] size-[384px]"
          />
          <Image
            src={RentalMarketCtaSphere}
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
