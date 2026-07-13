import { DASHBOARD_ASSETS } from "@/app/dashboard/components/dashboard-assets";
import type { ConstructionSharePriceTabContent } from "@/app/dashboard/construction/data/construction-properties";

type ConstructionSharePriceTabPanelProps = {
  sharePrice: ConstructionSharePriceTabContent;
};

export function ConstructionSharePriceTabPanel({
  sharePrice,
}: ConstructionSharePriceTabPanelProps) {
  return (
    <div className="rounded-[16px] bg-white px-4 py-6 shadow-[0_1px_4px_rgba(12,12,13,0.05)] sm:px-6 sm:py-12 md:px-[100px]">
      <h3 className="mb-4 text-[19px] font-medium text-[#050a0e]">
        Share Price
      </h3>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4 py-2 text-[16px] font-normal">
          <span className="text-[#919191]">Initial price</span>
          <span className="text-[#050a0e]">{sharePrice.initialPrice}</span>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-[16px] bg-[rgba(92,96,204,0.15)] px-4 py-2">
          <div className="flex flex-col gap-1">
            <p className="text-[14px] font-normal text-[#919191]">
              Current price
            </p>
            <p className="text-[24px] font-normal text-[#5c60cc]">
              {sharePrice.currentPrice}
            </p>
          </div>
          <img
            alt=""
            aria-hidden
            className="h-[61px] w-[110px] shrink-0 object-contain"
            height={61}
            src={DASHBOARD_ASSETS.detailTabs.sharePriceChart}
            width={110}
          />
        </div>

        <div className="flex items-center justify-between gap-4 rounded-[16px] bg-[#f5f7f8] px-4 py-2 text-[16px] font-normal">
          <span className="text-[#919191]">
            Share price at the end of construction
          </span>
          <span className="shrink-0 whitespace-nowrap text-[#050a0e]">
            {sharePrice.endConstructionPrice}
          </span>
        </div>
      </div>
    </div>
  );
}
