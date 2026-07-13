import type { ConstructionPropertyActivityRow } from "@/app/dashboard/construction/data/construction-properties";

import {
  DetailTabExternalLinkIcon,
  DetailTabPropertyActivityDocIcon,
} from "./detail-tab-icons";
import Link from "next/link";

type ConstructionPropertyActivitiesTabPanelProps = {
  activities: ConstructionPropertyActivityRow[];
  /** Vertical guide between row icons (rental Property tab — Figma 878:64719). */
  showTimelineConnector?: boolean;
};

export function ConstructionPropertyActivitiesTabPanel({
  activities,
  showTimelineConnector = false,
}: ConstructionPropertyActivitiesTabPanelProps) {
  return (
    <div className="rounded-[16px] bg-white px-4 py-6 shadow-[0_1px_4px_rgba(12,12,13,0.05)] sm:px-6 sm:py-12 md:px-[100px]">
      <h3 className="mb-4 text-[19px] font-medium text-[#050a0e]">
        Property Activities
      </h3>
      <div className="flex flex-col">
        {activities.map((row, index) => (
          <div
            className="relative flex items-stretch gap-2 border-t border-transparent py-4 first:border-t-0 first:pt-0"
            key={row.id}
          >
            <div className="relative flex w-6 shrink-0 justify-center">
              <div className="relative z-1 flex flex-col items-center">
                <DetailTabPropertyActivityDocIcon
                  aria-hidden
                  className="size-6 shrink-0 text-[#b8c5ce]"
                />
              </div>
              {showTimelineConnector && index < activities.length - 1 ? (
                <div
                  aria-hidden
                  className="absolute top-[22px] bottom-0 left-1/2 w-px -translate-x-1/2 bg-[#cfe2ec]"
                />
              ) : null}
            </div>

            <div className="flex min-w-0 flex-1 items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-normal text-[#050a0e]">
                  {row.title}
                </p>
                <p className="max-w-[min(100%,725px)] mt-1 text-[12px] font-light leading-normal text-[#6e6e6e]">
                  {row.description}
                </p>
                {row.transactionHashUrl ? (
                  <Link
                    className="mt-1 inline-flex items-center gap-1 text-[12px] font-light text-brand hover:underline"
                    href={row.transactionHashUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <span className="text-brand">Transaction Hash</span>
                    <DetailTabExternalLinkIcon
                      aria-hidden
                      className="size-3 shrink-0 text-brand"
                    />
                  </Link>
                ) : null}
              </div>

              {row.dateMonth && row.dateDay ? (
                <div className="flex shrink-0 flex-col items-center gap-1 text-center text-[#919191]">
                  <span className="text-[12px] font-light">
                    {row.dateMonth}
                  </span>
                  <span className="text-[14px] font-normal">{row.dateDay}</span>
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
