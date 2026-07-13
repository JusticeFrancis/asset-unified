import { DatabaseFaqList } from "../../components/DatabaseFaqList";
import { Container, SectionHeading } from "../../components/shared";

export function FaqSection() {
  return (
    <section className="bg-[#EDF4F8] py-12 sm:py-16 md:py-20">
      <Container>
        <SectionHeading
          eyebrow="FAQ"
          title={
            <>
              Frequently asked questions about{" "}
              <span className="text-brand">referral rewards</span>
            </>
          }
        />
        <DatabaseFaqList idPrefix="referral-faq" resource="referral-faq" />
      </Container>
    </section>
  );
}
