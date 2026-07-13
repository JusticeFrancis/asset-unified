import {
  ProtectionComplianceIcon,
  ProtectionLlcIcon,
  ProtectionSecurityIcon,
} from "@/components/icons";
import { protectionCards } from "./data";
import { Container, SectionHeading } from "../components/shared";

export function ProtectionSection() {
  const protectionIcons = [
    ProtectionLlcIcon,
    ProtectionComplianceIcon,
    ProtectionSecurityIcon,
  ];

  return (
    <section id="protection" className="pb-12 sm:pb-16 md:pb-24">
      <Container>
        <SectionHeading
          eyebrow="Why Us?"
          title={
            <>
              How Your Investment Is{" "}
              <span className="text-brand">Protected</span>
            </>
          }
          description="Two ways to invest in real estate. Same asset class. Completely different experience."
        />
        <div className="mt-6 flex justify-center">
          <div
            className="inline-flex w-full max-w-xs items-center gap-1 rounded-full bg-surface p-1 sm:w-auto sm:gap-3"
            role="tablist"
            aria-label="Protection view"
          >
            <button
              type="button"
              role="tab"
              aria-selected="true"
              className="min-h-tap flex-1 rounded-full bg-[#050A0E] px-4 text-sm text-white sm:flex-none"
            >
              Trust Structure
            </button>
            <button
              type="button"
              role="tab"
              aria-selected="false"
              className="min-h-tap flex-1 rounded-full px-4 text-sm text-muted/70 sm:flex-none"
            >
              Advantages
            </button>
          </div>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {protectionCards.map((card, index) => {
            const Icon = protectionIcons[index] ?? ProtectionLlcIcon;

            return (
              <article
                key={card.title}
                className="rounded-[20px] border border-border bg-white p-6 sm:p-8"
              >
                <div className="mb-5 inline-flex size-12 items-center justify-center rounded-xl text-brand">
                  <Icon className="size-8 sm:size-10" />
                </div>
                <h3 className="text-h2 font-medium text-foreground">
                  {card.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-muted/70 sm:text-body-lg">
                  {card.body}
                </p>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
