import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container } from "./shared";

type HeroAlign = "left" | "center";
type HeroTone = "default" | "brand" | "soft";

type MarketingHeroProps = {
  /** Small uppercase label above the title (e.g. "For Developers"). */
  eyebrow?: ReactNode;
  /** Main heading. Pass plain string or ReactNode for `<span className="text-brand">`. */
  title: ReactNode;
  /** Subhead paragraph. */
  body?: ReactNode;
  /**
   * Render-prop area for the CTA buttons. Compose with PrimaryButton /
   * SecondaryButton from `./shared`. Buttons stack vertically below `sm`
   * automatically — no need for `flex-col` boilerplate.
   */
  actions?: ReactNode;
  /**
   * Right-hand visual (image, illustration, mockup). Stacks below the text
   * on mobile and tablets; sits beside it at `lg+`.
   */
  media?: ReactNode;
  /**
   * Decorative absolutely-positioned layer rendered behind the content.
   * Hidden below `sm` by default — pass your own visibility classes on
   * the inner element if you want it to show on phones too.
   */
  background?: ReactNode;
  /**
   * Slot for floating stat cards / pills positioned over the hero (or
   * over the media). Caller is responsible for positioning each child
   * with `absolute` + offsets. Wrapped in a `relative` container.
   */
  floating?: ReactNode;
  tone?: HeroTone;
  align?: HeroAlign;
  /** Override the default text column max-width (default 770px). */
  textMaxWidthClassName?: string;
  /** Override the default min-height ramp. */
  minHeightClassName?: string;
  className?: string;
  containerClassName?: string;
};

const toneClass: Record<HeroTone, string> = {
  default:
    "bg-background bg-linear-to-b from-brand/0 to-brand/10 text-foreground",
  soft: "bg-linear-to-b from-brand/0 to-brand/20 text-foreground",
  brand: "bg-brand text-white",
};

export function MarketingHero({
  eyebrow,
  title,
  body,
  actions,
  media,
  background,
  floating,
  tone = "default",
  align = "left",
  textMaxWidthClassName,
  minHeightClassName,
  className,
  containerClassName,
}: MarketingHeroProps) {
  const isCentered = align === "center";
  const isBrand = tone === "brand";

  return (
    <section
      className={cn(
        "relative overflow-hidden pt-header pb-12 sm:pb-16 lg:pb-20",
        // Sensible default min-heights that ramp up at each breakpoint.
        // Override via `minHeightClassName` when a hero needs to be taller
        // (e.g. one with a tall right-side illustration on desktop).
        minHeightClassName ?? "min-h-[480px] md:min-h-[600px] lg:min-h-[760px]",
        toneClass[tone],
        className,
      )}
    >
      {background ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 hidden sm:block"
        >
          {background}
        </div>
      ) : null}

      <Container className={cn("relative z-10", containerClassName)}>
        <div
          className={cn(
            "grid items-center gap-10 lg:gap-12",
            // Two-column at lg only when there's actual right-side media.
            media
              ? "lg:grid-cols-[minmax(0,608px)_minmax(0,1fr)]"
              : undefined,
            isCentered && !media ? "place-items-center text-center" : undefined,
          )}
        >
          <div
            className={cn(
              "flex flex-col",
              textMaxWidthClassName ?? "max-w-[770px]",
              isCentered && !media ? "items-center text-center" : undefined,
            )}
          >
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

            <h1
              className={cn(
                "text-display font-medium",
                eyebrow ? "mt-2" : undefined,
                isBrand ? "text-white" : "text-foreground",
              )}
            >
              {title}
            </h1>

            {body ? (
              <p
                className={cn(
                  "mt-4 max-w-[707px] text-body-lg",
                  isBrand ? "text-[#E7EBEE]" : "text-muted",
                )}
              >
                {body}
              </p>
            ) : null}

            {actions ? (
              <div
                className={cn(
                  "mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4",
                  isCentered && !media ? "sm:justify-center" : undefined,
                )}
              >
                {actions}
              </div>
            ) : null}
          </div>

          {media ? (
            <div className="relative w-full">
              {media}
              {floating ? (
                <div
                  aria-hidden={false}
                  className="pointer-events-none absolute inset-0"
                >
                  {/* Caller positions each child with `absolute` + offsets.
                      Keep pointer events on by setting `pointer-events-auto`
                      on the floating child if it needs to be interactive. */}
                  {floating}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>

        {/* When there's no media slot, floating pills layer over the
            container itself (e.g. for centered heroes). */}
        {!media && floating ? (
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden={false}
          >
            {floating}
          </div>
        ) : null}
      </Container>
    </section>
  );
}
