import Image from "next/image";
import {
  RentalMarketOwnershipAgreementIcon,
  RentalMarketOwnershipDualRecordIcon,
  RentalMarketOwnershipLiabilityIcon,
  RentalMarketOwnershipSecondaryIcon,
} from "@/lib/assets";
import { Container, SectionHeading } from "../../components/shared";
import { rentalOwnershipCards } from "./data";

const iconMap = {
  agreement: RentalMarketOwnershipAgreementIcon,
  "secondary-market": RentalMarketOwnershipSecondaryIcon,
  liability: RentalMarketOwnershipLiabilityIcon,
  "dual-record": RentalMarketOwnershipDualRecordIcon,
};

export function OwnershipSection() {
  return (
    <section className="py-12 sm:py-16 md:py-20">
      <SectionHeading
        eyebrow="Ownership"
        title={
          <>
            Shares aren&apos;t a receipt. They&apos;re a legal{" "}
            <span className="text-brand">ownership stake.</span>
          </>
        }
        description="A lot of platforms say 'own real estate' and mean a certificate. On Asset Union, owning shares means you're a member of a registered LLC with documented, enforceable rights."
      />

      <Container className="mt-10 grid gap-8 sm:mt-12 sm:gap-10 md:grid-cols-2">
        {rentalOwnershipCards.map((item) => {
          const icon = iconMap[item.icon];
          return (
            <article key={item.title} className="max-w-[527px]">
              <Image
                src={icon}
                alt=""
                aria-hidden
                className="size-10 sm:size-12"
              />
              <h3 className="mt-4 text-h3 font-medium text-foreground sm:mt-5">
                {item.title}
              </h3>
              <p className="mt-3 text-base text-muted sm:mt-4 sm:text-body-lg">
                {item.body}
              </p>
            </article>
          );
        })}
      </Container>
    </section>
  );
}
