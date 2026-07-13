"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { DASHBOARD_ASSETS } from "@/app/dashboard/components/dashboard-assets";
import { PolygonOnlyBadge, TetherBadgeStack } from "@/app/dashboard/wallet/components/wallet-shared";
import { appQueryKeys, useWallet } from "@/lib/api/queries/app";
import { claimWalletRewards } from "@/lib/api/requests/app";

type TxTab = "shares" | "funds";

const money = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value || 0);
const amount = (value: number) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 8 }).format(value || 0);

export default function WalletPage() {
  const [txTab, setTxTab] = useState<TxTab>("shares");
  const [claiming, setClaiming] = useState(false);
  const { data } = useWallet();
  const queryClient = useQueryClient();
  const balances = data?.balances ?? {};
  const usdt = Number(balances.USDT ?? 0);
  const pol = Number(balances.POL ?? balances.MATIC ?? 0);
  const cashback = Number(balances.CASHBACK ?? 0);
  const locked = Number(balances.LOCKED_USDT ?? 0);
  const total = Object.entries(balances).reduce((sum, [key, value]) => key.startsWith("LOCKED_") || key === "CASHBACK" ? sum : sum + Number(value || 0), 0);
  const transactions = useMemo(() => (data?.transactions ?? []).filter((tx) => txTab === "shares" ? ["investment", "share_purchase", "share_sale"].includes(tx.kind) : !["investment", "share_purchase", "share_sale"].includes(tx.kind)), [data?.transactions, txTab]);

  async function claimAll() {
    setClaiming(true);
    try {
      await Promise.allSettled([claimWalletRewards("rent"), claimWalletRewards("construction")]);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: appQueryKeys.wallet }),
        queryClient.invalidateQueries({ queryKey: appQueryKeys.overview }),
      ]);
    } finally {
      setClaiming(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-[1118px] flex-col gap-5 sm:gap-6">
      <div className="flex flex-col gap-8 rounded-[20px] bg-white p-4 sm:gap-12 sm:rounded-[32px] sm:p-6">
        <div className="flex w-full flex-col items-stretch gap-6 rounded-2xl bg-[#5c60cc] p-5 sm:p-6 lg:flex-row lg:items-stretch lg:justify-between lg:gap-10 lg:p-8">
          <div className="flex min-w-0 flex-1 flex-col items-center gap-5 lg:items-start lg:justify-between lg:gap-6 lg:pr-1">
            <div className="flex flex-col items-center gap-2 text-center text-[#f5f7f8] lg:items-start lg:text-left">
              <p className="text-[14px] font-normal" style={{ fontVariationSettings: "'opsz' 14" }}>Total balance in USD</p>
              <p className="text-[28px] font-medium tabular-nums sm:text-[38px]" style={{ fontVariationSettings: "'opsz' 14" }}>{money(total)}</p>
            </div>
            <div className="flex w-full max-w-[233px] gap-2 lg:max-w-none">
              <Link className="flex h-10 flex-1 items-center justify-center gap-1 rounded-xl bg-[#f5f7f8] px-4" href="/dashboard/wallet/withdraw">
                <img alt="" aria-hidden className="size-5 max-w-none" src={DASHBOARD_ASSETS.wallet.withdrawActionIcon} />
                <span className="text-[12px] font-medium text-[#050a0e]" style={{ fontVariationSettings: "'opsz' 14" }}>Withdraw</span>
              </Link>
              <Link className="flex h-10 flex-1 items-center justify-center gap-1 rounded-xl bg-[rgba(250,252,253,0.15)] px-4" href="/dashboard/wallet/deposit">
                <img alt="" aria-hidden className="size-6 max-w-none" src={DASHBOARD_ASSETS.wallet.depositActionIcon} />
                <span className="text-[12px] font-medium text-[#f5f7f8]" style={{ fontVariationSettings: "'opsz' 14" }}>Deposit</span>
              </Link>
            </div>
          </div>
          <div className="hidden w-px shrink-0 self-stretch bg-white/50 lg:block" aria-hidden />
          <div className="h-px w-full shrink-0 bg-white/50 lg:hidden" aria-hidden />
          <div className="flex min-w-0 flex-1 flex-col items-center gap-6 lg:items-start lg:justify-between lg:gap-6 lg:pl-1">
            <div className="flex w-full flex-wrap items-start justify-center gap-4 sm:gap-6 lg:justify-start">
              <div className="flex w-[139px] flex-col items-center gap-1 text-center text-[#f5f7f8] sm:whitespace-nowrap lg:items-start lg:text-left">
                <p className="text-[14px] font-normal" style={{ fontVariationSettings: "'opsz' 14" }}>Total Cashback</p>
                <p className="text-[28px] font-medium tabular-nums sm:text-[38px]" style={{ fontVariationSettings: "'opsz' 14" }}>{money(cashback)}</p>
              </div>
              <div className="flex min-h-[72px] w-[139px] items-center justify-center self-stretch rounded-xl bg-[rgba(250,252,253,0.15)] px-4">
                <div className="flex flex-col items-center gap-1 text-center text-[#f5f7f8] sm:whitespace-nowrap lg:items-start lg:text-left">
                  <p className="text-[12px] font-light" style={{ fontVariationSettings: "'opsz' 14" }}>Locked Balance</p>
                  <p className="text-[21px] font-medium tabular-nums" style={{ fontVariationSettings: "'opsz' 14" }}>{money(locked)}</p>
                </div>
              </div>
            </div>
            <button className="flex h-10 w-[146px] items-center justify-center gap-1 self-center rounded-xl bg-[#f5f7f8] px-4 disabled:opacity-60 lg:self-start" type="button" onClick={claimAll} disabled={claiming}>
              <img alt="" aria-hidden className="size-5 max-w-none" src={DASHBOARD_ASSETS.wallet.claimAllIcon} />
              <span className="text-[12px] font-medium text-[#050a0e]" style={{ fontVariationSettings: "'opsz' 14" }}>{claiming ? "Claiming..." : "Claim All"}</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex w-full items-center justify-between text-[14px] font-normal text-[#050a0e]"><p style={{ fontVariationSettings: "'opsz' 14" }}>Asset</p><p className="text-left" style={{ fontVariationSettings: "'opsz' 14" }}>Share Balances</p></div>
          <div className="flex items-center justify-between gap-3 rounded-2xl bg-[#f4f8fb] px-4 py-3 sm:gap-4 sm:px-6 sm:py-4">
            <div className="flex min-w-0 items-center gap-3"><TetherBadgeStack chainCorner={null} size={32} /><div className="flex min-w-0 flex-col gap-1"><p className="text-[14px] font-normal text-[#050a0e]" style={{ fontVariationSettings: "'opsz' 14" }}>Usdt (USDT)</p><div className="flex flex-wrap items-center gap-0.5 text-[#6e6e6e]"><span className="text-[10px] font-light" style={{ fontVariationSettings: "'opsz' 14" }}>USDT</span><span className="text-[12px] font-light">•</span><span className="text-[10px] font-light" style={{ fontVariationSettings: "'opsz' 14" }}>{money(usdt)}</span></div></div></div>
            <p className="shrink-0 text-[14px] font-normal text-[#050a0e]" style={{ fontVariationSettings: "'opsz' 14" }}>{amount(usdt)}</p>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-2xl bg-[#f4f8fb] px-4 py-3 sm:gap-4 sm:px-6 sm:py-4">
            <div className="flex min-w-0 items-center gap-3"><PolygonOnlyBadge size={32} /><div className="flex min-w-0 flex-col gap-1"><p className="text-[14px] font-normal text-[#050a0e]" style={{ fontVariationSettings: "'opsz' 14" }}>Pol (MATIC)</p><div className="flex flex-wrap items-center gap-0.5 text-[#6e6e6e]"><span className="text-[10px] font-light" style={{ fontVariationSettings: "'opsz' 14" }}>POL</span><span className="text-[12px] font-light">•</span><span className="text-[10px] font-light" style={{ fontVariationSettings: "'opsz' 14" }}>{money(pol)}</span></div></div></div>
            <p className="shrink-0 text-[14px] font-normal text-[#050a0e]" style={{ fontVariationSettings: "'opsz' 14" }}>{amount(pol)}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 rounded-[20px] bg-white p-4 sm:rounded-[32px] sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-[19px] font-medium text-[#050a0e]" style={{ fontVariationSettings: "'opsz' 14" }}>Transaction history</h2>
          <div className="flex w-fit rounded-[40px] bg-[#f5f7f8] p-1">
            <button className={`rounded-[40px] px-3 py-2 text-[14px] transition-colors ${txTab === "shares" ? "bg-white font-normal text-[#050a0e]" : "font-medium text-[#919191]"}`} style={{ fontVariationSettings: "'opsz' 14" }} type="button" onClick={() => setTxTab("shares")}>Property Shares</button>
            <button className={`rounded-[40px] px-3 py-2 text-[14px] transition-colors ${txTab === "funds" ? "bg-white font-normal text-[#050a0e]" : "font-medium text-[#919191]"}`} style={{ fontVariationSettings: "'opsz' 14" }} type="button" onClick={() => setTxTab("funds")}>Funds</button>
          </div>
        </div>
        <div className="flex min-h-[173px] flex-col justify-center rounded-2xl bg-[#f4f8fb] px-4 py-3 sm:px-6 sm:py-4">
          {transactions.length === 0 ? <p className="text-center text-[14px] font-light text-[#6e6e6e]" style={{ fontVariationSettings: "'opsz' 14" }}>You have no transaction at the moment.</p> : transactions.map((tx) => <div key={tx.id} className="flex items-center justify-between gap-4 border-b border-[#cfe2ec] py-3 last:border-b-0"><div className="min-w-0"><p className="truncate text-[14px] font-medium text-[#050a0e]">{tx.description || tx.kind}</p><p className="text-[10px] font-light text-[#919191]">{new Date(tx.createdAt).toLocaleString()}</p></div><div className="shrink-0 text-right"><p className="text-[14px] font-medium text-[#050a0e]">{tx.direction === "debit" ? "−" : "+"}{amount(tx.amount)} {tx.asset}</p><p className="text-[10px] font-light capitalize text-[#919191]">{tx.status}</p></div></div>)}
        </div>
      </div>
    </div>
  );
}
