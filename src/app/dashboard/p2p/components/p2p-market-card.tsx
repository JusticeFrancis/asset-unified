import { DASHBOARD_ASSETS } from "@/app/dashboard/components/dashboard-assets";

export type P2pMarketCardProps = {
  title?: string;
  location?: string;
  propertyPrice?: string;
  availableShares?: string;
  sharePrice?: string;
  aprPercent?: string;
  aprDelta?: string;
  image?: string;
  onBuy?: () => void;
  onSell?: () => void;
};

export function P2pMarketCard({
  title = "",
  location = "",
  propertyPrice = "—",
  availableShares = "0 Shares",
  sharePrice = "—",
  aprPercent = "—",
  aprDelta = "",
  image,
  onBuy,
  onSell,
}: P2pMarketCardProps) {
  return (
    <article className="flex w-full min-w-0 max-w-[342px] flex-col gap-5 justify-self-center rounded-[20px] bg-white p-2 shadow-[0_1px_4px_rgba(12,12,13,0.05)]">
      <div className="relative h-44 w-full shrink-0 overflow-hidden rounded-[12px] bg-[#f4f8fb] sm:h-52 md:h-56 lg:h-[221px]">
        {image ? <img alt={title} className="absolute inset-0 size-full object-cover" src={image} /> : null}
      </div>

      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 flex-1 flex-col gap-1 px-3">
          <p className="truncate text-[16px] font-medium leading-normal text-[#050a0e]">
            {title}
          </p>
          <p className="truncate text-[12px] font-medium leading-normal text-[#919191]">
            {location}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1 pr-3 text-right">
          <p className="text-[12px] font-medium leading-normal text-[#919191]">
            Property price
          </p>
          <p className="text-[19px] font-medium leading-normal text-[#5c60cc]">
            {propertyPrice}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-1 px-3">
        <div className="flex min-w-0 flex-col gap-1 text-[12px] leading-normal">
          <p className="font-medium text-[#919191]">Available to buy</p>
          <p className="font-semibold text-[#8672ca]">{availableShares}</p>
        </div>
        <div className="flex h-[52px] shrink-0 items-center self-stretch px-0.5">
          <div className="flex h-full w-0 items-center justify-center">
            <div className="h-0 w-[52px] -rotate-90">
              <img
                alt=""
                aria-hidden
                className="block size-full min-w-[52px]"
                src={DASHBOARD_ASSETS.p2p.cardColumnDivider}
              />
            </div>
          </div>
        </div>
        <div className="flex min-w-0 flex-col gap-1 text-[12px] leading-normal">
          <p className="font-medium text-[#919191]">Share price</p>
          <p className="font-semibold text-[#8672ca]">{sharePrice}</p>
        </div>
        <div className="flex h-[52px] shrink-0 items-center self-stretch px-0.5">
          <div className="flex h-full w-0 items-center justify-center">
            <div className="h-0 w-[52px] -rotate-90">
              <img
                alt=""
                aria-hidden
                className="block size-full min-w-[52px]"
                src={DASHBOARD_ASSETS.p2p.cardColumnDivider}
              />
            </div>
          </div>
        </div>
        <div className="flex min-w-0 flex-col gap-1 text-[12px] leading-normal">
          <p className="font-medium leading-normal text-[#919191]">APR</p>
          <p className="font-semibold leading-none text-[#8672ca]">
            <span className="leading-normal">{aprPercent}</span>
            <span className="align-super text-[7.74px] leading-normal">
              {aprDelta}
            </span>
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <button
          className="flex h-10 w-full cursor-pointer items-center justify-center rounded-[12px] bg-[#5c60cc] text-[12px] font-medium leading-none text-[#f5f7f8] transition-opacity hover:opacity-95"
          type="button"
          onClick={onBuy}
        >
          Buy
        </button>
        <button
          className="flex h-10 w-full cursor-pointer items-center justify-center rounded-[12px] bg-[#d0d2f0] text-[12px] font-medium leading-none text-[#5c60cc] transition-opacity hover:opacity-95"
          type="button"
          onClick={onSell}
        >
          Sell
        </button>
      </div>
    </article>
  );
}
