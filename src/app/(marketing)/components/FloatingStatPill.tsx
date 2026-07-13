import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type FloatingStatPillProps = {
  /** Icon node, sized 24px (size-6) by default. */
  icon: ReactNode;
  value: ReactNode;
  label: ReactNode;
  /**
   * Caller is responsible for positioning. Pass things like
   * `lg:absolute lg:left-[-7%] lg:top-[65%]` so the pill only floats
   * at lg+ and doesn't break mobile layouts.
   */
  className?: string;
};

/**
 * Small absolutely-positioned stat card that overlays a hero illustration.
 * Caller controls position via `className`. Below the breakpoint where
 * positioning kicks in, the pill should sit inline within the document flow.
 */
export function FloatingStatPill({
  icon,
  value,
  label,
  className,
}: FloatingStatPillProps) {
  return (
    <div
      className={cn(
        "w-fit max-w-[200px] rounded-2xl border border-border bg-white px-3 py-2 shadow-[0_4px_4px_rgba(12,12,13,0.1),0_4px_4px_rgba(12,12,13,0.05)] sm:px-4 sm:py-3",
        className,
      )}
    >
      <div className="flex items-center gap-2 sm:gap-3">
        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand/15 text-brand sm:size-10">
          {icon}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground sm:text-base">
            {value}
          </p>
          <p className="mt-0.5 truncate text-[11px] leading-none text-[#919191] sm:text-xs">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}
