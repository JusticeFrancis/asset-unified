import Image from "next/image";
import { ConstructionMarketModelBackground } from "@/lib/assets";
import { Container, SectionHeading } from "../../components/shared";
import { StatList } from "../../components/StatList";

const modelStats = [
  { label: "During construction", value: "No income - capital appreciation only" },
  {
    label: "On completion",
    value: <span className="text-brand">Daily rental income begins</span>,
  },
  { label: "Token value", value: "Rises as property transitions to rental" },
  { label: "Exit", value: "Secondary market at any time" },
  { label: "Typical target yield", value: "7-10% APR post-completion" },
];

export function ModelSection() {
  return (
    <section className="py-12 sm:py-16 md:py-20">
      <SectionHeading
        eyebrow="Our Model"
        title={
          <>
            <span className="text-brand">Projects offer return</span> after
            construction is completed.
          </>
        }
        description="When you invest in a construction project on Asset Union, the exit outcome is determined by the project structure."
      />

      <Container className="mt-10 sm:mt-12">
        {/* Phone/tablet: vertically stacked image then card. lg+: original
            overlay treatment. */}
        <div className="overflow-hidden rounded-[20px] lg:relative">
          <Image
            src={ConstructionMarketModelBackground}
            alt=""
            aria-hidden
            className="h-48 w-full object-cover sm:h-64 md:h-80 lg:h-[812px]"
          />
          <div className="rounded-[20px] border border-border bg-surface p-6 sm:p-8 lg:absolute lg:right-6 lg:top-1/2 lg:w-full lg:max-w-[663px] lg:-translate-y-1/2 lg:rounded-[20px] xl:right-10">
            <span className="inline-flex rounded-[40px] bg-brand-soft px-2 py-px text-[10px] text-[#8672CA]">
              Build to Rent
            </span>
            <h3 className="mt-4 text-h3 font-medium text-foreground sm:mt-5">
              You fund the build. Then earn rent when it&apos;s complete.
            </h3>
            <p className="mt-4 text-base text-muted sm:mt-5 sm:text-body-lg">
              The property is built, then transferred into a rental LLC once
              construction finishes. Token holders begin receiving daily
              rental income from the first tenancy. Your token also
              appreciates in value as the asset matures.
            </p>
            <div className="mt-6">
              <StatList items={modelStats} />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
