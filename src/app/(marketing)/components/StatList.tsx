import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type StatItem = {
  label: ReactNode;
  value: ReactNode;
  /** Pinned status pill on the right (overrides `value`'s alignment). */
  pill?: ReactNode;
};

type StatListProps = {
  items: StatItem[];
  /** Show a hairline divider below each row except the last. */
  dividers?: boolean;
  /**
   * - `default` (recommended) — label and value share a row at sm+, stack on phones.
   * - `inline` — always on one row (use for short labels only).
   */
  variant?: "default" | "inline";
  /** Pass `light` over dark backgrounds. */
  tone?: "default" | "light";
  className?: string;
};

export function StatList({
  items,
  dividers = true,
  variant = "default",
  tone = "default",
  className,
}: StatListProps) {
  const isLight = tone === "light";

  return (
    <dl className={cn("w-full", className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div
            key={index}
            className={cn(
              variant === "inline"
                ? "flex flex-row items-center justify-between gap-3"
                : "flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-6",
              dividers && !isLast
                ? cn(
                    "pb-3 mb-3 border-b",
                    isLight ? "border-white/15" : "border-border",
                  )
                : undefined,
            )}
          >
            <dt
              className={cn(
                "text-xs sm:text-sm font-light",
                isLight ? "text-white/70" : "text-[#919191]",
              )}
            >
              {item.label}
            </dt>
            {item.pill ? (
              <dd className="flex justify-start sm:justify-end">{item.pill}</dd>
            ) : (
              <dd
                className={cn(
                  "text-sm sm:text-right",
                  isLight ? "text-white" : "text-foreground",
                )}
              >
                {item.value}
              </dd>
            )}
          </div>
        );
      })}
    </dl>
  );
}
