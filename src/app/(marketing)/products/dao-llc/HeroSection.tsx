import Image from "next/image";
import { DaoLlcHeroStrip } from "@/lib/assets";
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
            You Own it.{" "}
            <span className="text-brand">
              You Decide What Happens to it.
            </span>
          </h1>
          <p className="mt-4 max-w-[707px] text-body-lg text-muted">
            Every property on Asset Union is co-owned by its token holders.
            That means you do not just earn from it - you vote on what happens
            to it.
          </p>
          <div className="mt-6 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:gap-4">
            <PrimaryButton href="/sign-in">Browse Projects</PrimaryButton>
            <SecondaryButton href="#how-it-works">How It Works</SecondaryButton>
          </div>
        </div>
      </Container>

      <Image
        src={DaoLlcHeroStrip}
        alt=""
        aria-hidden
        width={3164}
        height={4095}
        className="pointer-events-none absolute bottom-[-10%] right-0 z-0 hidden h-[122%] w-auto max-w-none object-cover object-top-left sm:block"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 hidden sm:block"
        style={{
          background:
            "linear-gradient(176deg, rgba(92,96,204,0) 76%, rgba(92,96,204,0.50) 94%)",
        }}
      />
    </section>
  );
}
