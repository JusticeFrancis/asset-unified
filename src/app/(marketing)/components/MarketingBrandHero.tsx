import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container } from "./shared";

type MarketingBrandHeroProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  body?: ReactNode;
  /** CTA buttons / links. */
  actions?: ReactNode;
  /** Right-side visual (polygon orb, illustration, image collage). */
  media?: ReactNode;
  /**
   * Floating stat pills that overlay the media at lg+. Each child should
   * use `lg:absolute lg:left-* lg:top-*` so it only floats on desktop.
   */
  floating?: ReactNode;
  /** Below-card overlay (e.g. avatar earnings strip). Hidden below lg. */
  bottomOverlay?: ReactNode;
  /** Override the rounded-card width (default: max-w-container). */
  containerClassName?: string;
  className?: string;
};

/**
 * Brand-coloured rounded hero card variant used by Independent Agent,
 * Partners, and Referral. Stacks text → media on mobile/tablet, becomes
 * side-by-side at lg+. Replaces the previous `lg:absolute` positioning
 * patterns that broke between md and lg.
 */
export function MarketingBrandHero({
  eyebrow,
  title,
  body,
  actions,
  media,
  floating,
  bottomOverlay,
  containerClassName,
  className,
}: MarketingBrandHeroProps) {
  return (
    <section
      className={cn(
        "bg-background pt-header pb-12 sm:pb-16 lg:pb-20",
        className,
      )}
    >
      <Container className={cn("max-w-[1350px]", containerClassName)}>
        <div className="relative overflow-hidden rounded-[24px] bg-brand px-6 py-10 sm:rounded-[32px] sm:px-8 sm:py-12 lg:px-12 lg:py-16">
          <div
            className={cn(
              "grid items-center gap-10 lg:gap-12",
              media ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,468px)]" : undefined,
            )}
          >
            <div className="max-w-[733px]">
              {eyebrow ? (
                <p className="text-eyebrow font-medium uppercase text-[#E7EBEE]">
                  {eyebrow}
                </p>
              ) : null}
              <h1
                className={cn(
                  "text-display font-medium text-white",
                  eyebrow ? "mt-2" : undefined,
                )}
              >
                {title}
              </h1>
              {body ? (
                <p className="mt-4 max-w-[700px] text-body-lg text-[#E7EBEE]">
                  {body}
                </p>
              ) : null}
              {actions ? (
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                  {actions}
                </div>
              ) : null}
            </div>

            {media ? (
              <div className="relative mx-auto w-full max-w-[420px] lg:max-w-none">
                {media}
                {floating ? (
                  <div
                    className="pointer-events-none absolute inset-0"
                    aria-hidden={false}
                  >
                    {floating}
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>

          {bottomOverlay ? (
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 hidden lg:block"
              aria-hidden={false}
            >
              {bottomOverlay}
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
