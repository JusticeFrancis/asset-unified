import Image from "next/image";
import Link from "next/link";
import { DaoLlcCtaSphere } from "@/lib/assets";
import { MarketingCtaCard } from "../../components/MarketingCtaCard";
import { PrimaryButton } from "../../components/shared";

export function CtaSection() {
  return (
    <MarketingCtaCard
      title="Build your income-generating real estate portfolio"
      body="Verified properties, full ownership rights, and transparent legal protection - starting from just $50."
      decorations={
        <>
          <Image
            src={DaoLlcCtaSphere}
            alt=""
            aria-hidden
            className="absolute -right-[127px] -top-[48px] size-[384px]"
          />
          <Image
            src={DaoLlcCtaSphere}
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
