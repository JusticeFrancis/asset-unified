import Link from "next/link";
import { DASHBOARD_ASSETS } from "@/app/dashboard/components/dashboard-assets";

export function RentalBalanceCard({ balance = 0 }: { balance?: number }) {
  return (
    <div className="flex flex-col gap-3 rounded-[16px] bg-[#5c60cc] p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-2 sm:p-6">
      <div className="flex flex-col gap-2 text-[#f5f7f8]">
        <p className="text-[14px] font-light">Total Rent Balance</p>
        <p className="text-[28px] font-medium leading-none sm:text-[38px]">${balance.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 })}</p>
      </div>
      <div className="flex gap-2">
        <Link className="inline-flex h-10 items-center justify-center gap-1 rounded-[12px] bg-[#f5f7f8] px-4 text-[12px] font-medium leading-none text-[#050a0e]" href="/dashboard/wallet/withdraw">
          <span className="inline-flex size-4 shrink-0 items-center justify-center"><img alt="" aria-hidden className="size-4" src={DASHBOARD_ASSETS.main.withdrawRentIcon} /></span>
          Withdraw Rent
        </Link>
      </div>
    </div>
  );
}
