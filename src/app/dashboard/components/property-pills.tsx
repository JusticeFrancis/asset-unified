import { Coins, Flame } from "lucide-react";

import { cn } from "@/lib/utils";

/** 12×12 icon frame — matches Figma “Card-mini-info” icons (node 878:21308). */
const iconFrame =
  "flex size-3 shrink-0 items-center justify-center overflow-hidden";

/**
 * Rental / property “Instant Income” pill — Figma: gap 4px, px 8 py 2, 12px icon.
 * @see https://www.figma.com/design/vhvOO9q29GRDXKMWWhxF1C/Asset-Union--Copy-?node-id=878-57418&m=dev
 */
export function InstantIncomePill({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "inline-flex w-fit items-center gap-1 rounded-[40px] bg-[#f5f7f8] px-2 py-0.5",
        className,
      )}
    >
      <span aria-hidden className={iconFrame}>
        <Coins className="size-3 text-[#5c60cc]" strokeWidth={1.75} />
      </span>
      <span className="text-[8px] font-medium leading-none text-[#5c60cc]">
        Instant Income
      </span>
    </div>
  );
}

/**
 * Featured “HOT SALE” pill — Figma gradient + flame-style mark.
 * @see https://www.figma.com/design/vhvOO9q29GRDXKMWWhxF1C/Asset-Union--Copy-?node-id=878-57396&m=dev
 */
export function HotSalePill({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "inline-flex w-fit items-center gap-1 rounded-[40px] px-2 py-0.5",
        className,
      )}
      style={{
        backgroundImage:
          "linear-gradient(120.85deg, rgb(248, 213, 114) 43.99%, rgb(146, 126, 67) 152.36%)",
      }}
    >
      <span aria-hidden className={iconFrame}>
        <Flame className="size-3 text-[#050a0e]" strokeWidth={1.75} />
      </span>
      <span className="text-[8px] font-medium leading-none text-[#050a0e]">
        HOT SALE
      </span>
    </div>
  );
}
