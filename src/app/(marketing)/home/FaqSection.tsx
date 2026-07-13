import { DatabaseFaqList } from "../components/DatabaseFaqList";
import { Container, SectionHeading } from "../components/shared";

export function FaqSection() {
  return (
    <section id="faq" className="bg-white py-12 sm:py-16 md:py-24">
      <Container>
        <SectionHeading
          eyebrow="FAQ"
          title="Common questions about the secondary market."
        />
        <DatabaseFaqList
          idPrefix="home-faq"
          maxWidthClassName="max-w-[875px]"
          resource="home-faq"
        />
      </Container>
    </section>
  );
}
