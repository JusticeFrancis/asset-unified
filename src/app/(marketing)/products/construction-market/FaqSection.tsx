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
              What investors ask before their first{" "}
              <span className="text-brand">construction investment.</span>
            </>
          }
        />
        <DatabaseFaqList
          idPrefix="construction-faq"
          resource="construction-market-faq"
        />
      </Container>
    </section>
  );
}
