import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container } from "./shared";

type CtaCardTone = "brand" | "dark";

type MarketingCtaCardProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  body?: ReactNode;
  /** CTA buttons / links — typically PrimaryButton + a text link. */
  actions: ReactNode;
  /**
   * Decorative absolutely-positioned layer (e.g. brand spheres). Hidden below
   * `sm` to keep mobile layouts clean. Pass `<> ... </>` with multiple Image
   * children. Each child should be `pointer-events-none absolute …`.
   */
  decorations?: ReactNode;
  tone?: CtaCardTone;
  /** Override the rounded-card vertical padding (rare). */
  paddingClassName?: string;
  /** Container className (use to widen the section, e.g. `max-w-[1350px]`). */
  containerClassName?: string;
  className?: string;
};

const ctaToneClass: Record<CtaCardTone, string> = {
  brand: "bg-brand text-white",
  dark: "bg-foreground text-white",
};

/**
 * The recurring "rounded brand-coloured card with a centered headline and
 * decorative spheres" CTA pattern that closes most marketing pages. Mobile
 * keeps the decorations hidden so the title and CTA dominate the viewport;
 * sm+ shows them. No fixed `h-[455px]` — the card grows with content.
 */
export function MarketingCtaCard({
  eyebrow,
  title,
  body,
  actions,
  decorations,
  tone = "brand",
  paddingClassName,
  containerClassName,
  className,
}: MarketingCtaCardProps) {
  return (
    <section className={cn("py-12 sm:py-16 md:py-20", className)}>
      <Container className={containerClassName}>
        <div
          className={cn(
            "relative overflow-hidden rounded-[20px] sm:rounded-[28px]",
            ctaToneClass[tone],
            paddingClassName ??
              "px-6 py-12 sm:px-10 sm:py-16 md:px-16 md:py-20",
          )}
        >
          {decorations ? (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 hidden sm:block"
            >
              {decorations}
            </div>
          ) : null}

          <div className="relative z-10 mx-auto flex max-w-[936px] flex-col items-center gap-6 text-center">
            {eyebrow ? (
              <p className="text-eyebrow font-medium uppercase text-[#E7EBEE]">
                {eyebrow}
              </p>
            ) : null}
            <h2 className="text-h1 font-medium leading-tight">{title}</h2>
            {body ? (
              <p className="max-w-[734px] text-body-lg text-[#E7EBEE]">
                {body}
              </p>
            ) : null}
            <div className="mt-2 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4">
              {actions}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
