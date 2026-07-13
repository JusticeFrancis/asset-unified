import { StatColumnDivider } from "./stat-column-divider";

export function RentalStatsRow({ accountValue = 0, propertiesOwned = 0, totalRentClaimed = 0, totalPropertyValue = 0 }: { accountValue?: number; propertiesOwned?: number; totalRentClaimed?: number; totalPropertyValue?: number }) {
  return (
    <div className="flex min-h-[123px] flex-col items-stretch justify-center gap-4 rounded-[16px] bg-[#dcddf4] px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-12 sm:py-6">
      <div className="flex flex-1 flex-col items-center gap-2 whitespace-nowrap text-center"><p className="text-[24px] font-medium text-[#050a0e]">${accountValue.toLocaleString()}</p><p className="text-[14px] font-light text-[#050a0e]">Current Account Value</p></div>
      <StatColumnDivider />
      <div className="flex flex-1 flex-col items-center gap-2 whitespace-nowrap text-center"><p className="text-[24px] font-medium text-[#050a0e]">{propertiesOwned.toLocaleString()}</p><p className="text-[14px] font-light text-[#050a0e]">Properties Owned</p></div>
      <StatColumnDivider />
      <div className="flex flex-1 flex-col items-center gap-2 whitespace-nowrap text-center"><p className="text-[24px] font-medium text-[#050a0e]">+ ${totalRentClaimed.toLocaleString()}</p><p className="text-[14px] font-light text-[#050a0e]">Total Rent Claimed</p></div>
      <StatColumnDivider />
      <div className="flex flex-1 flex-col items-center gap-2 whitespace-nowrap text-center"><p className="text-[24px] font-medium text-[#050a0e]">${totalPropertyValue.toLocaleString()}</p><p className="text-[14px] font-light text-[#050a0e]">Total Property Value</p></div>
    </div>
  );
}
