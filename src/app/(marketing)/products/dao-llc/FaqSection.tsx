import { Container, SectionHeading } from "../../components/shared";
import { DatabaseFaqList } from "../../components/DatabaseFaqList";

export function FaqSection() {
  return (
    <section className="bg-surface py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="FAQ"
          title={
            <>
              Questions from investors about the{" "}
              <span className="text-brand">Asset Union legal model</span>
            </>
          }
        />
        <DatabaseFaqList idPrefix="dao-llc-faq" resource="dao-llc-faq" />
      </Container>
    </section>
  );
}
