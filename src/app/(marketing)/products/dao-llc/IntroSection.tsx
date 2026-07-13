import { Container, SectionHeading } from "../../components/shared";

export function IntroSection() {
  return (
    <section className="py-12 sm:py-16 md:py-20">
      <Container>
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
      </Container>
    </section>
  );
}
