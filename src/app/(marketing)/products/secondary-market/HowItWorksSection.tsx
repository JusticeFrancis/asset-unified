import { cn } from "@/lib/utils";
import { Container, SectionHeading } from "../../components/shared";
import { secondaryHowItWorksSteps } from "./data";

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="bg-surface py-12 sm:py-16 md:py-20 lg:py-24"
    >
      <SectionHeading
        eyebrow="How It Works"
        title={
          <>
            Buying shares from another investor takes{" "}
            <span className="text-brand">about 5 minutes.</span>
          </>
        }
        description="The secondary market works just like the primary, except inventory comes from other investors, not new property offerings."
      />
      <Container className="mt-10 grid gap-10 sm:mt-12 sm:gap-x-12 sm:gap-y-12 md:grid-cols-2 md:gap-x-16 lg:gap-x-24">
        {secondaryHowItWorksSteps.map((step, index) => (
          <article key={step.id}>
            <div
              className={cn(
                "inline-flex items-center justify-center rounded-lg px-3 py-2",
                index === 0 ? "bg-brand text-white" : "bg-brand/15 text-brand",
              )}
            >
              <span className="text-2xl font-medium leading-none sm:text-3xl md:text-[34px]">
                {step.id}
              </span>
            </div>
            <h3 className="mt-4 text-h2 font-medium leading-tight text-foreground sm:mt-5">
              {step.title}
            </h3>
            <p className="mt-3 text-base leading-relaxed text-muted sm:mt-4 sm:text-body-lg">
              {step.body}
            </p>
          </article>
        ))}
      </Container>
    </section>
  );
}
