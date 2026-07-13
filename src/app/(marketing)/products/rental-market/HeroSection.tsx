import Image from "next/image";
import { RentalMarketHeroStrip } from "@/lib/assets";
import {
  Container,
  PrimaryButton,
  SecondaryButton,
} from "../../components/shared";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-brand/0 to-brand/20 pt-header pb-12 md:pb-16 lg:pb-20">
      <Container className="relative z-10 flex min-h-[420px] items-center md:min-h-[500px] lg:min-h-[600px]">
        <div className="max-w-[770px]">
          <h1 className="text-display font-medium leading-[1.05]">
            Own a Slice of a rental property.{" "}
            <span className="text-brand">Earn rent daily.</span>
          </h1>
          <p className="mt-4 max-w-[707px] text-body-lg text-brand">
            Rental properties on Asset Union are fully managed, legally
            structured, and generating income. You buy shares, the property
            manager handles everything else, and rent lands in your account
            every 24 hours.
          </p>
          <div className="mt-6 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:gap-4">
            <PrimaryButton href="/sign-in">Browse Properties</PrimaryButton>
            <SecondaryButton href="#how-it-works">How It Works</SecondaryButton>
          </div>
        </div>
      </Container>
      {/* Decorative hero strip — only sized in on tablet+ to avoid pushing
          phone layouts off-screen. */}
      <Image
        src={RentalMarketHeroStrip}
        alt=""
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-[-30%] z-0 hidden h-[105%] w-auto max-w-none object-cover object-right-top transform-[scaleX(-1)] sm:block sm:right-[-25%] md:right-[-12%] lg:right-[-8%]"
      />
    </section>
  );
}
