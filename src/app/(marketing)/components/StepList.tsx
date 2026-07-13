import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type Step = {
  id: number | string;
  title: ReactNode;
  body: ReactNode;
};

type StepDirection = "vertical" | "grid";
type StepSize = "sm" | "md" | "lg";
type StepTone = "default" | "light";

type StepListProps = {
  steps: Step[];
  /**
   * - `vertical` (default): stacked, badge to the left of the text.
   * - `grid`: 1 col → 2 cols at md → 3 cols at lg, badge above the text.
   */
  direction?: StepDirection;
  /** Badge size. Affects badge dimensions and number font-size only. */
  size?: StepSize;
  /** Render the first step's badge in solid brand instead of brand-tinted. */
  highlightFirst?: boolean;
  /** Use `light` over dark / brand backgrounds. */
  tone?: StepTone;
  className?: string;
};

const badgeSizeClass: Record<StepSize, string> = {
  sm: "size-9 text-base",
  md: "size-12 text-xl",
  lg: "size-14 sm:size-[60px] text-2xl sm:text-[28px]",
};

const titleSizeClass: Record<StepSize, string> = {
  sm: "text-base sm:text-lg",
  md: "text-h3",
  lg: "text-h2",
};

export function StepList({
  steps,
  direction = "vertical",
  size = "md",
  highlightFirst = false,
  tone = "default",
  className,
}: StepListProps) {
  const isLight = tone === "light";

  const wrapperClass =
    direction === "grid"
      ? "grid gap-8 sm:gap-10 md:grid-cols-2 lg:grid-cols-3"
      : "flex flex-col gap-6 sm:gap-8";

  return (
    <ol className={cn(wrapperClass, className)}>
      {steps.map((step, index) => {
        const isFirstHighlighted = highlightFirst && index === 0;
        const badgeBg = isFirstHighlighted
          ? "bg-brand text-white"
          : isLight
            ? "bg-white/15 text-white"
            : "bg-brand/15 text-brand";

        const itemClass =
          direction === "grid"
            ? "flex flex-col items-start gap-4"
            : "flex items-start gap-4";

        return (
          <li key={step.id} className={itemClass}>
            <span
              className={cn(
                "inline-flex shrink-0 items-center justify-center rounded-xl font-medium leading-none",
                badgeSizeClass[size],
                badgeBg,
              )}
              aria-hidden="true"
            >
              {step.id}
            </span>
            <div>
              <h3
                className={cn(
                  "font-medium leading-tight",
                  titleSizeClass[size],
                  isLight ? "text-white" : "text-foreground",
                )}
              >
                {step.title}
              </h3>
              <p
                className={cn(
                  "mt-2 text-sm sm:text-base leading-relaxed",
                  isLight ? "text-[#E7EBEE]" : "text-muted",
                )}
              >
                {step.body}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
