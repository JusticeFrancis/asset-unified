import { DASHBOARD_ASSETS } from "@/app/dashboard/components/dashboard-assets";
import { cn } from "@/lib/utils";

export type PropertyBadgeVariant = "construction" | "funded" | "strategy";

const BADGE_CONFIG: Record<
  PropertyBadgeVariant,
  { src: string; label: string }
> = {
  construction: {
    src: DASHBOARD_ASSETS.main.badgeConstruction,
    label: "Construction Funding",
  },
  funded: {
    src: DASHBOARD_ASSETS.main.badgeFunded,
    label: "Funded",
  },
  strategy: {
    src: DASHBOARD_ASSETS.main.badgeStrategy,
    label: "Strategy Executed",
  },
};

type PropertyBadgeProps = {
  variant: PropertyBadgeVariant;
  /** When set, replaces default absolute positioning (e.g. stack with Instant Income). */
  className?: string;
};

export function PropertyBadge({ variant, className }: PropertyBadgeProps) {
  const config = BADGE_CONFIG[variant];
  return (
    <div
      className={cn(
        "flex items-center gap-1 rounded-[40px] bg-[#f5f7f8] px-2 py-0.5",
        className ?? "absolute left-[10px] top-[10px]",
      )}
    >
      <span className="inline-flex size-3 shrink-0 items-center justify-center">
        <img
          alt=""
          aria-hidden
          className="size-3 max-h-3 max-w-3 object-contain"
          src={config.src}
        />
      </span>
      <span className="text-[8px] font-medium leading-none text-[#5c60cc]">
        {config.label}
      </span>
    </div>
  );
}
