"use client";

import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

type DashboardDetailTabBarProps<T extends readonly string[]> = {
  tabs: T;
  activeTab: number;
  onSelect: (index: number) => void;
  /** Accessible label for the mobile <select>. */
  ariaLabel?: string;
};

/**
 * Tab bar for property detail views. The desktop pill bar can hold a lot of
 * tabs (rental: 7, construction: 9), which would force a horizontal scroll on
 * phones. Below `md` we render a native <select> instead so every option is
 * one tap away without scrolling.
 */
export function DashboardDetailTabBar<T extends readonly string[]>({
  tabs,
  activeTab,
  onSelect,
  ariaLabel = "Select section",
}: DashboardDetailTabBarProps<T>) {
  return (
    <>
      <div className="relative md:hidden">
        <select
          aria-label={ariaLabel}
          className="block h-12 w-full appearance-none rounded-[12px] border border-[#cfe2ec] bg-white px-4 pr-10 text-[14px] font-medium text-[#050a0e] outline-none focus-visible:ring-2 focus-visible:ring-[#5c60cc]/40"
          onChange={(event) => onSelect(Number(event.target.value))}
          value={activeTab}
        >
          {tabs.map((tab, index) => (
            <option key={tab} value={index}>
              {tab}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden
          className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#919191]"
        />
      </div>

      <div className="hidden gap-1 overflow-x-auto rounded-[40px] bg-[#edf4f8] p-1 md:flex">
        {tabs.map((tab, index) => (
          <button
            className={cn(
              "shrink-0 rounded-[40px] px-4 py-3 text-[16px] font-light transition-colors",
              index === activeTab
                ? "bg-white text-[#050a0e]"
                : "text-[#919191] hover:text-[#050a0e]",
            )}
            key={tab}
            onClick={() => onSelect(index)}
            type="button"
          >
            {tab}
          </button>
        ))}
      </div>
    </>
  );
}
