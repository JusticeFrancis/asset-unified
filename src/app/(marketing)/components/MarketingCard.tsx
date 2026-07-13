import type { StaticImageData } from "next/image";
import { Fragment, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type StatusPillTone = "default" | "brand" | "success";

type StatusPillProps = {
  icon?: ReactNode;
  label: string;
  tone?: StatusPillTone;
  className?: string;
};

const statusPillToneClass: Record<StatusPillTone, string> = {
  default: "bg-background text-brand",
  brand: "bg-brand text-white",
  success: "bg-[#AFF4C6] text-[#009951]",
};

export function StatusPill({
  icon,
  label,
  tone = "default",
  className,
}: StatusPillProps) {
  return (
    <span
      className={cn(
        // Bumped from text-[8px] to text-xs for legibility on phones.
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        statusPillToneClass[tone],
        className,
      )}
    >
      {icon ? (
        <span className="inline-flex size-3 shrink-0 items-center justify-center">
          {icon}
        </span>
      ) : null}
      <span>{label}</span>
    </span>
  );
}

export type MarketingCardStat = {
  label: string;
  value: ReactNode;
};

type MarketingCardImageRatio = "landscape" | "tall" | "square";

type MarketingCardProps = {
  name: string;
  location?: string;
  image?: string | StaticImageData;
  imageAlt?: string;
  /** Ratio determines responsive image height. Default `landscape` (16:10-ish). */
  imageRatio?: MarketingCardImageRatio;
  /** Status pills layered over the top-left of the image. */
  pills?: Array<{ icon?: ReactNode; label: string; tone?: StatusPillTone }>;
  /** Top-right metadata (e.g. APR with trend icon). */
  topRight?: ReactNode;
  /** Up to 3 inline stats below the title row, divided by hairlines. */
  stats?: MarketingCardStat[];
  /** Stacked CTA buttons. Use components from `./shared`. */
  actions: ReactNode;
  className?: string;
};

const imageHeightClass: Record<MarketingCardImageRatio, string> = {
  // Phone-friendly heights that scale up — replaces fixed `h-[324px]` etc.
  landscape: "h-44 sm:h-52 md:h-56 lg:h-[260px]",
  tall: "h-56 sm:h-64 md:h-72 lg:h-[324px]",
  square: "aspect-square",
};

export function MarketingCard({
  name,
  location,
  image,
  imageAlt,
  imageRatio = "landscape",
  pills,
  topRight,
  stats,
  actions,
  className,
}: MarketingCardProps) {
  return (
    <article className={cn("w-full rounded-[20px] bg-white p-2", className)}>
      <div className="relative">
        {image ? (
          <img
            src={typeof image === "string" ? image : image.src}
            alt={imageAlt ?? name}
            className={cn(
              "w-full rounded-xl object-cover",
              imageHeightClass[imageRatio],
            )}
          />
        ) : (
          <div className={cn("w-full rounded-xl bg-[#f4f8fb]", imageHeightClass[imageRatio])} />
        )}
        {pills && pills.length > 0 ? (
          <div className="absolute left-2.5 top-2.5 flex flex-col gap-1.5">
            {pills.map((pill, index) => (
              <StatusPill key={index} {...pill} />
            ))}
          </div>
        ) : null}
      </div>

      <div className="mt-4 flex items-start justify-between gap-3 px-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-medium text-foreground">
            {name}
          </h3>
          {location ? (
            <p className="mt-1 truncate text-xs text-[#919191]">{location}</p>
          ) : null}
        </div>
        {topRight ? (
          <div className="text-right shrink-0">{topRight}</div>
        ) : null}
      </div>

      {stats && stats.length > 0 ? (
        <div className="mt-4 flex items-center px-3 text-xs">
          {stats.map((stat, index) => {
            const isFirst = index === 0;
            const isLast = index === stats.length - 1;
            return (
              <Fragment key={stat.label}>
                <div
                  className={cn(
                    "flex flex-1 items-center",
                    isFirst && !isLast && "justify-start",
                    isLast && !isFirst && "justify-end",
                    !isFirst && !isLast && "justify-center",
                  )}
                >
                  <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-1">
                    <span className="text-[#919191]">{stat.label}</span>
                    <span className="font-medium text-foreground">
                      {stat.value}
                    </span>
                  </div>
                </div>
                {!isLast ? (
                  <span className="h-5 w-px shrink-0 bg-border" aria-hidden />
                ) : null}
              </Fragment>
            );
          })}
        </div>
      ) : null}

      <div className="mt-4 flex flex-col gap-2 px-1">{actions}</div>
    </article>
  );
}
