"use client";

import { cn } from "@/lib/utils";

export type DashboardHomeMode = "rental" | "construction";

type DashboardModeToggleProps = {
  mode: DashboardHomeMode;
  onModeChange: (mode: DashboardHomeMode) => void;
};

export function DashboardModeToggle({
  mode,
  onModeChange,
}: DashboardModeToggleProps) {
  return (
    <div className="flex justify-center">
      <div className="flex items-center gap-5 rounded-[40px] bg-[#f5f7f8] p-1">
        <button
          className={cn(
            "rounded-[40px] px-3 py-2 text-[14px] transition-colors",
            mode === "rental"
              ? "bg-white font-normal text-[#050a0e]"
              : "font-medium text-[#919191]",
          )}
          onClick={() => onModeChange("rental")}
          type="button"
        >
          Rental
        </button>
        <button
          className={cn(
            "rounded-[40px] px-3 py-2 text-[14px] transition-colors",
            mode === "construction"
              ? "bg-white font-normal text-[#050a0e]"
              : "font-medium text-[#919191]",
          )}
          onClick={() => onModeChange("construction")}
          type="button"
        >
          Construction
        </button>
      </div>
    </div>
  );
}
