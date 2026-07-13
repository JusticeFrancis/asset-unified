import Image from "next/image";
import {
  ConstructionMarketHeroStrip,
  ConstructionMarketHeroVector,
} from "@/lib/assets";
import {
  Container,
  PrimaryButton,
  SecondaryButton,
} from "../../components/shared";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-brand/0 via-brand/5 to-brand/25 pt-header pb-12 md:pb-16 lg:pb-20">
      <Container className="relative z-10 flex min-h-[420px] items-center md:min-h-[500px] lg:min-h-[600px]">
        <div className="max-w-[770px]">
          <h1 className="text-display font-medium leading-[1.05]">
            Invest Before the building Exists.{" "}
            <span className="text-brand">Profit When it Does.</span>
          </h1>
          <p className="mt-4 max-w-[645px] text-body-lg text-brand">
            Construction projects on Asset Union let you get in early, before
            the property is built. You fund the development, the developer
            builds it, and you earn returns when it&apos;s rented out or sold.
            Earlier entry means higher upside.
          </p>
          <div className="mt-6 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:gap-4">
            <PrimaryButton href="/sign-in">Browse Projects</PrimaryButton>
            <SecondaryButton href="#how-it-works">How It Works</SecondaryButton>
          </div>
        </div>
      </Container>

      <Image
        src={ConstructionMarketHeroStrip}
        alt=""
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-[-30%] z-0 hidden h-[106%] w-auto max-w-none object-cover object-right-top sm:block sm:right-[-25%] md:right-[-14%] lg:right-[-4%]"
      />
      <Image
        src={ConstructionMarketHeroVector}
        alt=""
        aria-hidden
        className="pointer-events-none absolute -bottom-[34%] right-[-22%] z-0 hidden w-[58%] max-w-none sm:block md:-bottom-[28%]"
      />
    </section>
  );
}
