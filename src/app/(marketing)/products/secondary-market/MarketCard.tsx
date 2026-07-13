import { PrimaryButton, SecondaryButton } from "../../components/shared";
import type { SecondaryMarketCard } from "./data";

// Note: this card needs three stats with vertical hairline dividers and a
// Buy/Sell button pair, neither of which the shared MarketingCard primitive
// models cleanly. We keep the local layout but standardise typography,
// image heights, and CTA buttons against the design tokens.

type MarketCardProps = SecondaryMarketCard;

export function MarketCard({
  name,
  location,
  propertyPrice,
  shares,
  sharePrice,
  apr,
  aprDelta,
  image,
}: MarketCardProps) {
  return (
    <article className="w-full rounded-[20px] bg-white p-2">
      {image ? <img src={image} alt={name} className="h-44 w-full rounded-xl object-cover sm:h-52 md:h-56 lg:h-[220px]" /> : <div className="h-44 w-full rounded-xl bg-[#f4f8fb] sm:h-52 md:h-56 lg:h-[220px]" />}
      <div className="mt-4 flex items-start justify-between gap-3 px-3 sm:mt-5">
        <div className="min-w-0">
          <h3 className="truncate text-base font-medium text-foreground">
            {name}
          </h3>
          <p className="mt-1 truncate text-xs text-[#919191]">{location}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-xs text-[#919191]">Property price</p>
          <p className="text-base font-medium text-brand sm:text-[19px]">
            {propertyPrice}
          </p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 px-3">
        <Stat label="Available to buy" value={shares} />
        <span className="h-8 w-px bg-border" aria-hidden />
        <Stat label="Share price" value={sharePrice} />
        <span className="h-8 w-px bg-border" aria-hidden />
        <Stat
          label="APR"
          value={
            <>
              {apr}
              <span className="text-[8px]">{aprDelta}</span>
            </>
          }
        />
      </div>
      <div className="mt-5 flex flex-col gap-2 px-1">
        <PrimaryButton href="/sign-in" size="sm" className="w-full sm:w-full">
          Buy
        </PrimaryButton>
        <SecondaryButton href="/sign-in" size="sm" className="w-full sm:w-full">
          Sell
        </SecondaryButton>
      </div>
    </article>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <p className="truncate text-xs text-[#919191]">{label}</p>
      <p className="text-xs font-semibold text-accent">{value}</p>
    </div>
  );
}
