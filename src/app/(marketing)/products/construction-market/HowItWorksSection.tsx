import { cn } from "@/lib/utils";
import { Container, SectionHeading } from "../../components/shared";
import { constructionHowItWorksSteps } from "./data";

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
            From funding to returns -{" "}
            <span className="text-brand">what happens</span> at each stage.
          </>
        }
        description="The lifecycle is transparent from the first funding dollar to final income distribution."
      />

      <Container className="mt-10 grid gap-8 sm:mt-12 sm:grid-cols-2 sm:gap-10 lg:grid-cols-4 lg:gap-6">
        {constructionHowItWorksSteps.map((step, index) => {
          const isLast = index === constructionHowItWorksSteps.length - 1;
          return (
            <article
              key={step.id}
              className={cn(
                "relative",
                // Connecting line only at lg+ between adjacent badges, and
                // only when this isn't the last step in the row.
                !isLast &&
                  "lg:after:absolute lg:after:left-14 lg:after:top-7 lg:after:h-px lg:after:w-[calc(100%-45px)] lg:after:bg-border lg:after:content-['']",
              )}
            >
              <span
                className={cn(
                  "inline-flex size-12 items-center justify-center rounded-full text-2xl font-medium sm:size-14 sm:text-3xl lg:size-[69px] lg:text-[34px]",
                  index === 0 ? "bg-brand text-white" : "bg-brand/15 text-brand",
                )}
              >
                {step.id}
              </span>
              <h3 className="mt-4 text-base font-medium text-foreground sm:mt-5 sm:text-[20px]">
                {step.title}
              </h3>
              <p className="mt-3 text-sm text-muted sm:mt-4 sm:text-body-lg">
                {step.body}
              </p>
            </article>
          );
        })}
      </Container>
    </section>
  );
}
