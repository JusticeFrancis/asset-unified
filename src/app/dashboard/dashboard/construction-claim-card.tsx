import Link from "next/link";
import { DASHBOARD_ASSETS } from "@/app/dashboard/components/dashboard-assets";
import { DaoWalletIcon } from "@/components/icons";

export function ConstructionClaimCard({ claimable = 0, onClaim, claiming = false }: { claimable?: number; onClaim?: () => void; claiming?: boolean }) {
  return (
    <div className="flex flex-col gap-3 rounded-[16px] bg-[#5c60cc] p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-2 sm:p-6">
      <div className="flex flex-col gap-2 text-[#f5f7f8]">
        <p className="text-[14px] font-light">Collected for claim</p>
        <p className="text-[24px] font-medium leading-none sm:text-[32px] md:text-[38px]">${claimable.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <button className="flex h-10 items-center justify-center gap-1 rounded-[12px] bg-[#f5f7f8] px-4 text-[12px] font-medium text-[#050a0e] disabled:opacity-50" disabled={claiming || claimable <= 0} type="button" onClick={onClaim}>
          <DaoWalletIcon className="size-4 text-foreground" />
          {claiming ? "Claiming..." : "Claim All"}
        </button>
        <Link className="flex h-10 items-center justify-center gap-1 rounded-[12px] bg-[rgba(250,252,253,0.15)] px-4 text-[12px] font-medium text-[#f5f7f8]" href="/dashboard/wallet">
          <img alt="" aria-hidden className="size-5" src={DASHBOARD_ASSETS.main.orderHistoryIcon} />
          Order History
        </Link>
      </div>
    </div>
  );
}
