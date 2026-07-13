import { Container, SectionHeading } from "../../components/shared";
import { DatabaseFaqList } from "../../components/DatabaseFaqList";

export function FaqSection() {
  return (
    <section id="faq" className="bg-surface py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="FAQ"
          title={
            <>
              What investors ask before buying their first{" "}
              <span className="text-brand">rental share.</span>
            </>
          }
        />
        <DatabaseFaqList idPrefix="rental-faq" resource="rental-market-faq" />
      </Container>
    </section>
  );
}
