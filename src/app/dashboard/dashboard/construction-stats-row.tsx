import { StatColumnDivider } from "./stat-column-divider";

export function ConstructionStatsRow({ overallClaimed = 0, sharesOnSale = 0, sharesSold = 0 }: { overallClaimed?: number; sharesOnSale?: number; sharesSold?: number }) {
  return (
    <div className="flex min-h-[123px] flex-col items-stretch justify-center gap-4 rounded-[16px] bg-[#dcddf4] px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-12 sm:py-6">
      <div className="flex flex-1 flex-col items-center gap-2 whitespace-nowrap text-center"><p className="text-[24px] font-medium text-[#050a0e]">${overallClaimed.toLocaleString()}</p><p className="text-[14px] font-light text-[#050a0e]">Overall claimed:</p></div>
      <StatColumnDivider />
      <div className="flex flex-1 flex-col items-center gap-2 whitespace-nowrap text-center"><p className="text-[24px] font-medium text-[#050a0e]">{sharesOnSale.toLocaleString()}</p><p className="text-[14px] font-light text-[#050a0e]">Shares on sale</p></div>
      <StatColumnDivider />
      <div className="flex flex-1 flex-col items-center gap-2 whitespace-nowrap text-center"><p className="text-[24px] font-medium text-[#050a0e]">{sharesSold.toLocaleString()}</p><p className="text-[14px] font-light text-[#050a0e]">Shares sold</p></div>
    </div>
  );
}
