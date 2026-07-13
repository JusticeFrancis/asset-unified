import Image from "next/image";
import { SecondaryMarketHeroStrip } from "@/lib/assets";
import {
  Container,
  PrimaryButton,
  SecondaryButton,
} from "../../components/shared";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-indigo-500/0 to-indigo-500/20 pt-header pb-12 md:pb-16 lg:pb-20">
      <Container className="relative z-10 flex min-h-[420px] items-center md:min-h-[500px] lg:min-h-[600px]">
        <div className="max-w-[770px]">
          <h1 className="text-display font-medium leading-[1.05]">
            Real Estate You Can Sell{" "}
            <span className="text-brand">Whenever You Want.</span>
          </h1>
          <p className="mt-4 max-w-[770px] text-body-lg text-brand">
            Every property on our platform is held in its own LLC and broken
            into tokens you can buy, sell, and earn from. Purchase a fraction
            of a rental property in minutes.
          </p>
          <div className="mt-6 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:gap-4">
            <PrimaryButton href="/sign-in" className="sm:w-[171px]">
              Start Investing
            </PrimaryButton>
            <SecondaryButton
              href="/products/rental-market"
              className="sm:w-[190px]"
            >
              Explore Properties
            </SecondaryButton>
          </div>
        </div>
      </Container>
      <Image
        src={SecondaryMarketHeroStrip}
        alt=""
        aria-hidden
        className="pointer-events-none absolute -bottom-[17%] -right-[28.5%] z-0 hidden h-full w-full max-w-none object-cover object-top transform-[scaleX(-1)] sm:block"
      />
    </section>
  );
}
