"use client";

import { useState } from "react";

import type { ConstructionFaqItem } from "@/app/dashboard/construction/data/construction-properties";

import {
  DetailTabFaqCircleMinusIcon,
  DetailTabFaqCirclePlusIcon,
} from "./detail-tab-icons";

type ConstructionFaqTabPanelProps = {
  items: ConstructionFaqItem[];
};

export function ConstructionFaqTabPanel({
  items,
}: ConstructionFaqTabPanelProps) {
  const firstOpenId = items.find((i) => i.answer)?.id ?? items[0]?.id;
  const [openId, setOpenId] = useState<string | null>(firstOpenId ?? null);

  return (
    <div className="rounded-[16px] bg-white px-4 py-6 shadow-[0_1px_4px_rgba(12,12,13,0.05)] sm:px-6 sm:py-12 md:px-[100px]">
      <h3 className="mb-4 text-[19px] font-medium text-[#050a0e]">
        Frequently Asked Questions
      </h3>
      <div className="flex flex-col gap-4">
        {items.map((item) => {
          const expanded = openId === item.id;
          return (
            <div
              className="flex items-center justify-between gap-4 rounded-[16px] bg-[#fafcfd] px-4 py-3 sm:px-6 sm:py-4"
              key={item.id}
            >
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-normal text-[#050a0e]">
                  {item.question}
                </p>
                {expanded && item.answer ? (
                  <p className="mt-1 text-[12px] font-light leading-normal text-[#6e6e6e]">
                    {item.answer}
                  </p>
                ) : null}
              </div>
              <button
                aria-expanded={expanded}
                aria-label={expanded ? "Collapse answer" : "Expand answer"}
                className="shrink-0 text-brand"
                onClick={() => setOpenId(expanded ? null : item.id)}
                type="button"
              >
                {expanded ? (
                  <DetailTabFaqCircleMinusIcon aria-hidden className="size-6" />
                ) : (
                  <DetailTabFaqCirclePlusIcon aria-hidden className="size-6" />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
