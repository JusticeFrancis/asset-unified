import { cn } from "@/lib/utils";

const STAGES = [
  { step: "01", label: "Permitting" },
  { step: "02", label: "Groundbreaking" },
  { step: "03", label: "Structure" },
  { step: "04", label: "Handover" },
] as const;

type ConstructionStagesRowProps = {
  /**
   * `inline` renders the row in normal flow (used on mobile, where the absolute
   * variant collides with the centered hero title). `floating` keeps the
   * original Figma layout pinned to the bottom of the hero banner on `md+`.
   */
  variant: "inline" | "floating";
};

export function ConstructionStagesRow({ variant }: ConstructionStagesRowProps) {
  return (
    <div
      className={cn(
        "grid w-full max-w-full grid-cols-2 place-items-center gap-2 px-4 sm:grid-cols-4",
        variant === "floating" &&
          "absolute bottom-5 left-1/2 -translate-x-1/2 sm:gap-4 md:flex md:flex-wrap md:items-center md:justify-center md:gap-10",
      )}
    >
      {STAGES.map(({ step, label }) => (
        <div
          className="flex w-full items-center justify-center gap-2 rounded-[80px] bg-[rgba(33,33,33,0.4)] px-3 py-1 backdrop-blur-[2px] md:w-auto"
          key={label}
        >
          <span className="text-[14px] font-light text-[#cfd9dd] md:text-[18px]">
            {step}
          </span>
          <span className="truncate text-[14px] font-medium text-[#f5f7f8] md:text-[19px]">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
