import { Container, SectionHeading } from "../../components/shared";
import { LegalSecurityTimeline } from "./LegalSecurityTimeline";
import { LegalSecurityWyomingCard } from "./LegalSecurityWyomingCard";

export function LegalSecuritySection() {
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24">
      <Container className="space-y-10 sm:space-y-12 lg:space-y-16">
        <SectionHeading
          eyebrow="How It Works"
          title={
            <>
              How is <span className="text-brand">legal security</span> ensured
              on the platform?
            </>
          }
          description="A U.S.-registered DAO LLC with verified smart contracts delivers blockchain transparency, legal protection, and secure ownership for every co-investor."
        />

        <div className="grid gap-8 lg:grid-cols-[minmax(0,527px)_minmax(0,605px)]">
          <LegalSecurityTimeline />
          <LegalSecurityWyomingCard />
        </div>
      </Container>
    </section>
  );
}
