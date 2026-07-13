import Link from "next/link";

import { cn } from "@/lib/utils";

import type { PartnerListCard } from "@/app/dashboard/partner/data/partner-records";

type PartnerSummaryCardProps = PartnerListCard & {
  className?: string;
};

export function PartnerSummaryCard({
  className,
  slug,
  avatarSrc,
  name,
  category,
  serviceType,
  linkedTo,
  created,
  status,
}: PartnerSummaryCardProps) {
  return (
    <Link
      aria-label={`${name}, see more`}
      className={cn(
        "flex w-full max-w-[320px] flex-col items-center gap-4 justify-self-center rounded-[16px] bg-white p-4 shadow-[0_1px_4px_rgba(12,12,13,0.05)] transition-opacity hover:opacity-[0.98] sm:p-6",
        className,
      )}
      href={`/dashboard/partner/${slug}`}
    >
      <div className="flex flex-col items-center gap-2">
        <div className="relative size-[111.344px] shrink-0 overflow-hidden rounded-full">
          <img
            alt=""
            className="absolute inset-0 size-full object-cover"
            src={avatarSrc}
          />
        </div>
        <div className="flex h-[45px] flex-col items-center justify-between text-center">
          <p className="text-[19px] font-medium text-[#050a0e]">{name}</p>
          <p className="text-[12px] font-light text-[#6e6e6e]">{category}</p>
        </div>
      </div>

      <div className="flex w-full max-w-[252px] flex-col gap-2">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col items-center gap-1 rounded-[8px] bg-[#fafcfd] px-3 py-3 sm:px-6 sm:py-4">
            <p className="text-center text-[12px] font-light text-[#6e6e6e]">
              Service Type
            </p>
            <p className="text-balance text-center text-[14px] font-normal text-[#050a0e]">
              {serviceType}
            </p>
          </div>
          <div className="flex flex-col items-center gap-1 rounded-[8px] bg-[#fafcfd] px-3 py-3 sm:px-6 sm:py-4">
            <p className="text-center text-[12px] font-light text-[#6e6e6e]">
              Linked To
            </p>
            <p className="text-balance text-center text-[14px] font-normal text-[#050a0e]">
              {linkedTo}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col items-center gap-1 rounded-[8px] bg-[#fafcfd] px-3 py-3 sm:px-6 sm:py-4">
            <p className="text-center text-[12px] font-light text-[#6e6e6e]">
              Created
            </p>
            <p className="text-balance text-center text-[14px] font-normal text-[#050a0e]">
              {created}
            </p>
          </div>
          <div className="flex flex-col items-center gap-1 rounded-[8px] bg-[#fafcfd] px-3 py-3 sm:px-6 sm:py-4">
            <p className="text-center text-[12px] font-light text-[#6e6e6e]">
              Status
            </p>
            <p className="text-balance text-center text-[14px] font-normal text-[#050a0e]">
              {status}
            </p>
          </div>
        </div>
      </div>

      <span className="flex h-10 w-full items-center justify-center rounded-[12px] bg-[#d0d2f0] text-[12px] font-medium text-[#5c60cc]">
        See More
      </span>
    </Link>
  );
}
