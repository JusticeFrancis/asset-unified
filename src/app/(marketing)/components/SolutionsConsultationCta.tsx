import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container } from "./shared";

type SolutionsConsultationCtaProps = {
  title: ReactNode;
  body: ReactNode;
  /** Icon shown to the left of the dark CTA button. */
  buttonIcon: string | StaticImageData;
  buttonLabel?: string;
  /** Destination for the consultation CTA. Defaults to `/sign-in`. */
  buttonHref?: string;
  /** Decorative chat illustration that overlays the right side at lg+. */
  illustration: string | StaticImageData;
  illustrationAlt?: string;
  className?: string;
};

/**
 * The recurring "Need Help in Cutting down Marketing Cost?" CTA card used
 * across every `solutions/*` page. The illustration is hidden below `lg` so
 * the title + body + button stack cleanly on phones and tablets.
 */
export function SolutionsConsultationCta({
  title,
  body,
  buttonIcon,
  buttonLabel = "Get a free consultation",
  buttonHref = "/sign-in",
  illustration,
  illustrationAlt = "",
  className,
}: SolutionsConsultationCtaProps) {
  return (
    <section className={cn("py-12 sm:py-16 md:py-20", className)}>
      <Container className="max-w-[1240px]">
        <div className="relative overflow-hidden rounded-[20px] bg-brand sm:rounded-[24px]">
          <div
            className={cn(
              "relative z-10",
              "px-6 py-10 sm:px-10 sm:py-14 md:px-12 md:py-16",
              // At lg+, the copy column is fixed-width so the illustration
              // can overlap on the right without colliding.
              "lg:min-h-[437px] lg:w-[598px] lg:py-0 lg:pr-0 lg:pt-[98px]",
            )}
          >
            <h2 className="text-h1 font-medium leading-tight text-white">
              {title}
            </h2>
            <p className="mt-4 max-w-[480px] text-base leading-relaxed text-[#E7EBEE] sm:text-body-lg">
              {body}
            </p>
            <Link
              href={buttonHref}
              className="mt-6 inline-flex min-h-tap w-full items-center justify-center gap-1 rounded-xl bg-[#050A0E] px-4 text-sm font-medium text-background sm:mt-8 sm:w-auto sm:px-6 sm:text-base"
            >
              <Image
                src={buttonIcon}
                alt=""
                aria-hidden
                width={20}
                height={20}
                className="size-5"
              />
              <span className="text-background">{buttonLabel}</span>
            </Link>
          </div>

          {/* Decorative chat illustration — desktop-only to keep mobile clean. */}
          <Image
            src={illustration}
            alt={illustrationAlt}
            aria-hidden={illustrationAlt === ""}
            width={676}
            height={676}
            className="pointer-events-none absolute -right-[46px] -top-[141px] hidden max-w-none object-contain lg:block"
          />
        </div>
      </Container>
    </section>
  );
}
