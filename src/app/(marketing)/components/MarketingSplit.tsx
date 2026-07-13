import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container } from "./shared";

type SplitTone = "default" | "surface" | "brand";

type MarketingSplitProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  body?: ReactNode;
  /** Sits below the body, above the media on stacked layouts. */
  actions?: ReactNode;
  /** Right-side (or left-side, with `reverse`) media slot. */
  media: ReactNode;
  /** Render media on the left at lg+ instead of the right. */
  reverse?: boolean;
  tone?: SplitTone;
  /** Shared list / supporting block rendered under the body (e.g. StepList). */
  supporting?: ReactNode;
  className?: string;
  containerClassName?: string;
};

const splitToneClass: Record<SplitTone, string> = {
  default: "bg-background text-foreground",
  surface: "bg-surface text-foreground",
  brand: "bg-brand text-white",
};

/**
 * Generic two-column section: text on one side, media on the other.
 * Always single-column at md and below — no fixed-pixel column widths
 * that break in the lg → xl gap.
 */
export function MarketingSplit({
  eyebrow,
  title,
  body,
  actions,
  media,
  reverse = false,
  tone = "default",
  supporting,
  className,
  containerClassName,
}: MarketingSplitProps) {
  const isBrand = tone === "brand";

  return (
    <section
      className={cn(
        "py-12 sm:py-16 md:py-20 lg:py-24",
        splitToneClass[tone],
        className,
      )}
    >
      <Container className={containerClassName}>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className={cn(reverse ? "lg:order-2" : "lg:order-1")}>
            {eyebrow ? (
              <p
                className={cn(
                  "text-eyebrow font-medium uppercase",
                  isBrand ? "text-[#E7EBEE]" : "text-brand",
                )}
              >
                {eyebrow}
              </p>
            ) : null}
            <h2
              className={cn(
                "text-h1 font-medium",
                eyebrow ? "mt-2" : undefined,
                isBrand ? "text-white" : "text-foreground",
              )}
            >
              {title}
            </h2>
            {body ? (
              <p
                className={cn(
                  "mt-4 max-w-[575px] text-body-lg",
                  isBrand ? "text-[#E7EBEE]" : "text-muted",
                )}
              >
                {body}
              </p>
            ) : null}
            {supporting ? <div className="mt-8 sm:mt-10">{supporting}</div> : null}
            {actions ? (
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                {actions}
              </div>
            ) : null}
          </div>
          <div className={cn(reverse ? "lg:order-1" : "lg:order-2")}>
            {media}
          </div>
        </div>
      </Container>
    </section>
  );
}
