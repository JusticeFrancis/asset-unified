import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ContainerProps = {
  children: ReactNode;
  className?: string;
};

type SectionHeadingProps = {
  eyebrow: string;
  title: ReactNode;
  description?: string | ReactNode;
  align?: "left" | "center";
  tone?: "default" | "light";
  className?: string;
};

export function Container({ children, className }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-container px-4 sm:px-6 lg:px-8",
        className,
      )}
    >
      {children}
    </div>
  );
}

type SectionTone = "default" | "surface" | "brand" | "footer";
type SectionSpacing = "default" | "compact" | "flush";

type SectionProps = {
  children: ReactNode;
  id?: string;
  className?: string;
  tone?: SectionTone;
  spacing?: SectionSpacing;
};

const sectionToneClass: Record<SectionTone, string> = {
  default: "bg-background",
  surface: "bg-surface",
  brand: "bg-brand text-white",
  footer: "bg-footer text-white",
};

const sectionSpacingClass: Record<SectionSpacing, string> = {
  // Standard vertical rhythm — every marketing section should use this
  // unless it has a structural reason to differ.
  default: "py-12 sm:py-16 md:py-20 lg:py-24",
  compact: "py-8 sm:py-10 md:py-14 lg:py-16",
  flush: "",
};

export function Section({
  children,
  id,
  className,
  tone = "default",
  spacing = "default",
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(sectionToneClass[tone], sectionSpacingClass[spacing], className)}
    >
      {children}
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  tone = "default",
  className,
}: SectionHeadingProps) {
  const isLight = tone === "light";

  return (
    <div
      className={cn(
        align === "center"
          ? "mx-auto w-full max-w-[778px] text-center"
          : "w-full max-w-[778px] text-left",
        className,
      )}
    >
      <p
        className={cn(
          "text-eyebrow font-medium uppercase",
          isLight ? "text-[#E7EBEE]" : "text-brand",
        )}
      >
        {eyebrow}
      </p>
      <h2
        className={cn(
          "mt-2 text-h1 font-medium",
          isLight ? "text-white" : "text-foreground",
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-4 text-body-lg",
            isLight ? "text-[#E7EBEE]" : "text-muted",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

type ButtonSize = "default" | "sm";
type ButtonProps = {
  children: ReactNode;
  className?: string;
  size?: ButtonSize;
  /** When set, the button renders as a `<Link>` (or `<a>` for external URLs). */
  href?: string;
  /** Anchor target — ignored unless `href` is set. */
  target?: "_self" | "_blank";
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
};

// Buttons are full-width on the smallest viewports so two-CTA rows never
// overflow narrow phones, then become auto-sized at sm+. Pass an explicit
// `w-*` (e.g. `sm:w-[171px]`) when the design calls for a fixed pill width.
const buttonBase =
  "cursor-pointer inline-flex items-center justify-center rounded-xl font-medium transition w-full sm:w-auto";

const buttonSize: Record<ButtonSize, string> = {
  default: "min-h-tap md:min-h-[53px] px-6 py-3 text-sm md:text-base",
  sm: "min-h-tap px-4 py-2 text-sm",
};

const isExternalHref = (href: string) =>
  /^(https?:|mailto:|tel:)/i.test(href);

type RenderProps = {
  href?: string;
  target?: "_self" | "_blank";
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  className: string;
  /** Tailwind text color class applied to the auto-wrapping span when a string
   * label is rendered inside a link element (e.g. "text-white"). */
  textColorClass?: string;
  children: ReactNode;
};

// When a button is rendered as a link and its children are a single string,
// auto-wrap the label in a <span> so the text node has its own element with the
// parent link's text color class. Mixed content (icon + text) is left untouched
// and the caller is expected to wrap the text portion at the call site.
function renderLinkChildren(
  children: ReactNode,
  textColorClass?: string,
): ReactNode {
  if (typeof children === "string" || typeof children === "number") {
    return <span className={textColorClass}>{children}</span>;
  }
  return children;
}

function ButtonOrLink({
  href,
  target,
  type = "button",
  onClick,
  className,
  textColorClass,
  children,
}: RenderProps) {
  if (href) {
    if (isExternalHref(href)) {
      return (
        <a
          href={href}
          target={target}
          rel={target === "_blank" ? "noopener noreferrer" : undefined}
          onClick={onClick}
          className={className}
        >
          {renderLinkChildren(children, textColorClass)}
        </a>
      );
    }
    return (
      <Link
        href={href}
        target={target}
        onClick={onClick}
        className={className}
      >
        {renderLinkChildren(children, textColorClass)}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} className={className}>
      {children}
    </button>
  );
}

// Pull the last `text-*` utility out of a className string so the auto-wrapper
// uses the caller's color override instead of the variant default. Tailwind's
// "last token wins" rule means the rightmost match is the effective color.
function pickTextColor(
  defaultClass: string,
  overrideClass: string | undefined,
): string {
  const combined = `${defaultClass} ${overrideClass ?? ""}`;
  const matches = combined.match(/(?:^|\s)text-[^\s]+/g);
  if (!matches || matches.length === 0) return defaultClass;
  return matches[matches.length - 1].trim();
}

export function PrimaryButton({
  children,
  className,
  size = "default",
  href,
  target,
  type = "button",
  onClick,
}: ButtonProps) {
  const baseColor = "text-white";
  return (
    <ButtonOrLink
      href={href}
      target={target}
      type={type}
      onClick={onClick}
      className={cn(
        buttonBase,
        buttonSize[size],
        "bg-brand text-white hover:opacity-95",
        className,
      )}
      textColorClass={pickTextColor(baseColor, className)}
    >
      {children}
    </ButtonOrLink>
  );
}

export function SecondaryButton({
  children,
  className,
  size = "default",
  href,
  target,
  type = "button",
  onClick,
}: ButtonProps) {
  const baseColor = "text-brand";
  return (
    <ButtonOrLink
      href={href}
      target={target}
      type={type}
      onClick={onClick}
      className={cn(
        buttonBase,
        buttonSize[size],
        "bg-brand/20 text-brand hover:bg-brand/25",
        className,
      )}
      textColorClass={pickTextColor(baseColor, className)}
    >
      {children}
    </ButtonOrLink>
  );
}
