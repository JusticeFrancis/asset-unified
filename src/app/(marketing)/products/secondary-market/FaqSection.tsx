import { Container, SectionHeading } from "../../components/shared";
import { DatabaseFaqList } from "../../components/DatabaseFaqList";

export function FaqSection() {
  return (
    <section id="faq" className="bg-surface py-16 md:py-24">
      <Container>
        <SectionHeading
          eyebrow="FAQ"
          title="Common questions about the secondary market."
        />
        <DatabaseFaqList
          idPrefix="secondary-faq"
          maxWidthClassName="max-w-[875px]"
          resource="secondary-market-faq"
        />
      </Container>
    </section>
  );
}
