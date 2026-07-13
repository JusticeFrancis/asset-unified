import Link from "next/link";
import { Zap } from "lucide-react";
import { FireIcon, InstantIncomeIcon } from "@/components/icons";

import { DASHBOARD_ASSETS } from "@/app/dashboard/components/dashboard-assets";
import { cn } from "@/lib/utils";

import type { RentalPropertyRecord } from "@/app/dashboard/rental/data/rental-properties";

type RentalFeaturedCardProps = {
  property: RentalPropertyRecord;
  className?: string;
};

export function RentalFeaturedCard({
  property,
  className,
}: RentalFeaturedCardProps) {
  const { card, detail, featuredMeta, slug } = property;
  const meta = featuredMeta ?? {
    coOwners: card.coOwners,
    fundsCollected: card.fundsCollected,
    aprPercent: card.aprPercent ?? "—",
  };

  return (
    <Link
      aria-label={`View ${card.title}`}
      className={cn(
        "flex min-w-0 flex-1 flex-col gap-4 rounded-[20px] pb-4 shadow-[0_1px_4px_rgba(12,12,13,0.05)] transition-opacity hover:opacity-[0.98]",
        className,
      )}
      href={`/dashboard/rental/${slug}`}
      style={{
        backgroundImage:
          "linear-gradient(102deg, #fcedc2 12.76%, #e9d6b1 44.43%, #fcedc2 59.92%, #e9d6b1 83.28%, #d5bb9b 106.64%)",
      }}
    >
      <div className="relative h-[280px] w-full shrink-0 overflow-hidden rounded-t-[12px] rounded-b-[20px] shadow-[0_16px_32px_rgba(12,12,13,0.1),0_4px_4px_rgba(12,12,13,0.05)] sm:h-[360px] lg:h-[411px]">
        <img
          alt=""
          className="absolute inset-0 size-full object-cover"
          src={detail.heroImage}
        />
        <div
          aria-hidden
          className="absolute inset-0 rounded-t-[12px] rounded-b-[20px]"
          style={{
            background:
              "linear-gradient(2deg, rgba(0,0,0,0) 60.7%, rgba(0,0,0,0.2) 97.66%)",
          }}
        />
        <div className="absolute left-[10px] top-[10px] flex items-center gap-1 rounded-[40px] bg-[#f5f7f8] px-2 py-0.5">
          <InstantIncomeIcon
            aria-hidden
            className="size-3 shrink-0 text-[#5c60cc]"
          />
          <span className="text-[8px] font-medium text-[#5c60cc]">
            Instant Income
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4 px-3 sm:flex-row sm:items-end sm:justify-between sm:pr-4">
        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex w-fit items-center gap-1 rounded-[40px] bg-linear-to-br from-[#f8d572] to-[#927e43] px-2 py-0.5">
            <FireIcon aria-hidden className="size-3 shrink-0 text-[#050a0e]" />
            <span className="text-[8px] font-medium text-[#050a0e]">
              HOT SALE
            </span>
          </div>
          <p className="text-[18px] font-medium text-[#050a0e]">{card.title}</p>
        </div>

        <div className="flex justify-center md:justify-end shrink-0 flex-wrap gap-2">
          <div className="flex min-h-[52px] flex-col items-center justify-center rounded px-3 py-1 bg-[rgba(250,252,253,0.3)]">
            <p className="text-[14px] font-medium text-[#050a0e]">
              {meta.coOwners}
            </p>
            <p className="text-[12px] font-medium text-[#919191]">Co-owners</p>
          </div>
          <div className="flex min-h-[52px] flex-col items-center justify-center rounded px-3 py-1 bg-[rgba(250,252,253,0.3)]">
            <p className="text-[14px] font-medium text-[#050a0e]">
              {meta.fundsCollected}
            </p>
            <p className="text-[12px] font-medium text-[#919191]">
              Funds Collected
            </p>
          </div>
          <div className="flex min-h-[52px] flex-col items-center justify-center rounded px-3 py-1 bg-[rgba(250,252,253,0.3)]">
            <p className="text-[14px] font-medium text-[#050a0e]">
              {meta.aprPercent}
            </p>
            <div className="flex items-center gap-2">
              <img
                alt=""
                aria-hidden
                className="size-3"
                src={DASHBOARD_ASSETS.main.aprTrend}
              />
              <p className="text-[12px] font-medium text-[#919191]">APR</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
