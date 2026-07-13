import Link from "next/link";
import { Zap } from "lucide-react";

import { DASHBOARD_ASSETS } from "@/app/dashboard/components/dashboard-assets";

import { CardRowDivider } from "./card-row-divider";
import { PropertyBadge, type PropertyBadgeVariant } from "./property-badge";
import { InstantIncomeIcon } from "@/components/icons";

export type PropertyCardProps = {
  imageLayers: string[];
  badge: PropertyBadgeVariant;
  rightColumn: "apr" | "constructionEnd";
  title?: string;
  location?: string;
  fundsCollected?: string;
  coOwners?: string;
  aprPercent?: string;
  constructionEndQuarter?: string;
  href?: string;
  /** Rental-style “Instant Income” pill above the status badge. */
  instantIncome?: boolean;
};

export function PropertyCard({
  imageLayers,
  badge,
  rightColumn,
  title = "",
  location = "",
  fundsCollected = "0%",
  coOwners = "0",
  aprPercent = "0%",
  constructionEndQuarter = "—",
  href,
  instantIncome = false,
}: PropertyCardProps) {
  const ctaClasses =
    "flex h-10 w-full cursor-pointer items-center justify-center rounded-[12px] bg-[#5c60cc] text-center text-[12px] font-medium text-[#f5f7f8]";

  const body = (
    <>
      <div className="relative h-56 w-full shrink-0 sm:h-64 md:h-72 lg:h-[324px]">
        <div className="absolute inset-0 overflow-hidden rounded-[12px]">
          {imageLayers.map((src) => (
            <img
              alt=""
              className="absolute inset-0 size-full object-cover"
              key={src}
              src={src}
            />
          ))}
        </div>
        {instantIncome ? (
          <div className="absolute left-[10px] top-[10px] z-5 flex flex-col gap-1">
            <div className="flex w-fit items-center gap-1 rounded-[40px] bg-[#f5f7f8] px-2 py-0.5">
              <InstantIncomeIcon
                aria-hidden
                className="size-3 shrink-0 text-[#5c60cc]"
              />
              <span className="text-[8px] font-medium text-[#5c60cc]">
                Instant Income
              </span>
            </div>
            <PropertyBadge className="relative" variant={badge} />
          </div>
        ) : (
          <PropertyBadge variant={badge} />
        )}
      </div>
      <div className="flex w-full items-start justify-between px-3">
        <div className="min-w-0 flex-1 flex-col gap-1">
          <p className="truncate text-[16px] font-medium text-[#050a0e]">
            {title}
          </p>
          <p className="truncate text-[12px] font-medium text-[#919191]">
            {location}
          </p>
        </div>
        {rightColumn === "apr" ? (
          <div className="flex shrink-0 flex-col items-center gap-1 px-3">
            <div className="flex items-start gap-1">
              <img
                alt=""
                aria-hidden
                className="size-3"
                src={DASHBOARD_ASSETS.main.aprTrend}
              />
              <span className="text-[12px] font-medium text-[#919191]">
                APR
              </span>
            </div>
            <p className="text-[14px] font-medium text-[#5c60cc]">
              {aprPercent}
            </p>
          </div>
        ) : (
          <div className="flex shrink-0 flex-col items-end gap-1 px-3">
            <span className="text-[12px] font-medium text-[#919191]">
              Construction end
            </span>
            <p className="text-[14px] font-medium text-[#5c60cc]">
              {constructionEndQuarter}
            </p>
          </div>
        )}
      </div>
      <div className="flex items-center px-3">
        <div className="flex min-w-0 flex-1 items-center justify-start gap-1 text-[12px] font-medium">
          <span className="text-[#919191]">Funds Collected:</span>
          <span className="text-[#050a0e]">{fundsCollected}</span>
        </div>
        <CardRowDivider />
        <div className="flex min-w-0 flex-1 items-center justify-end gap-1 text-[12px] font-medium whitespace-nowrap">
          <span className="text-[#919191]">Co-owners:</span>
          <span className="text-[#050a0e]">{coOwners}</span>
        </div>
      </div>
      {href ? (
        <span className={ctaClasses}>View More</span>
      ) : (
        <span className={ctaClasses} aria-disabled="true">
          View More
        </span>
      )}
    </>
  );

  const articleClass =
    "flex w-full min-w-0 max-w-[342px] flex-col gap-4 justify-self-center rounded-[20px] bg-white p-2 shadow-[0_1px_4px_rgba(12,12,13,0.05)] transition-opacity hover:opacity-[0.98]";

  if (href) {
    return (
      <Link aria-label={`View ${title}`} className={articleClass} href={href}>
        {body}
      </Link>
    );
  }

  return <article className={articleClass}>{body}</article>;
}
