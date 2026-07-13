"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { DashboardDetailTabBar } from "@/app/dashboard/components/dashboard-detail-tab-bar";
import { DashboardTimelinePtFundedIcon } from "@/components/icons/construction-timeline-icons";
import { cn } from "@/lib/utils";
import { appQueryKeys, useWallet } from "@/lib/api/queries/app";
import { createInvestment } from "@/lib/api/requests/app";

import type { ConstructionPropertyRecord } from "@/app/dashboard/construction/data/construction-properties";

import { CONSTRUCTION_DETAIL_TABS } from "./detail-tabs/detail-tab-definitions";
import { ConstructionDetailTabPanels } from "./detail-tabs/construction-detail-tab-panels";

type ConstructionPropertyDetailViewProps = {
  property: ConstructionPropertyRecord;
};

export function ConstructionPropertyDetailView({
  property,
}: ConstructionPropertyDetailViewProps) {
  const { card, detail } = property;
  const heading = detail.displayTitle ?? card.title;
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: wallet } = useWallet();
  const [mainIndex, setMainIndex] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [amount, setAmount] = useState("");
  const [isBuying, setIsBuying] = useState(false);

  const mainSrc = detail.gallery[mainIndex] ?? detail.heroImage;
  const asset = String(property.asset ?? "USDT").toUpperCase();
  const sharePrice = Number(detail.sharePriceValue ?? String(detail.sharePrice).replace(/[^0-9.]/g, ""));
  const balance = Number(wallet?.balances?.[asset] ?? 0);
  const liveBalance = `${balance.toLocaleString("en-US", { maximumFractionDigits: 2 })} ${asset}`;

  const buyShares = async () => {
    const requestedAmount = Number(amount);
    const shares = Number.isFinite(requestedAmount) && sharePrice > 0
      ? Math.floor(requestedAmount / sharePrice)
      : 0;
    if (shares < 1) {
      window.alert("Enter an amount that can purchase at least one share.");
      return;
    }
    setIsBuying(true);
    try {
      const response = await createInvestment({ propertySlug: property.slug, propertyKind: "construction", shares });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: appQueryKeys.wallet }),
        queryClient.invalidateQueries({ queryKey: appQueryKeys.investments }),
        queryClient.invalidateQueries({ queryKey: appQueryKeys.overview }),
      ]);
      setAmount("");
      window.alert(`Purchase confirmed: ${response.investment.shares} share${response.investment.shares === 1 ? "" : "s"}.`);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Unable to complete this purchase.");
    } finally {
      setIsBuying(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-[1118px] flex-col gap-5">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
        <div className="w-full shrink-0 rounded-[20px] bg-white p-2 pb-4 lg:max-w-[613px]">
          <div className="relative h-[280px] w-full overflow-hidden rounded-t-[12px] rounded-b-[20px] sm:h-[360px] lg:h-[411px]">
            <img alt="" className="size-full object-cover" src={mainSrc} />
          </div>
          <div className="mt-4 flex w-full items-center justify-center gap-2 overflow-x-auto">
            {detail.gallery.map((src, i) => (
              <button
                className={cn(
                  "h-[90px] w-[90px] shrink-0 overflow-hidden rounded-lg border-2 transition-colors",
                  i === mainIndex
                    ? "border-[#5c60cc]"
                    : "border-transparent opacity-80 hover:opacity-100",
                )}
                key={`${src}-${i}`}
                onClick={() => setMainIndex(i)}
                type="button"
              >
                <img alt="" className="size-full object-cover" src={src} />
              </button>
            ))}
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-4 rounded-[20px] bg-white p-4 shadow-[0_1px_4px_rgba(12,12,13,0.05)] sm:p-6">
          <div className="flex w-full flex-wrap items-start justify-between gap-1">
            <h2 className="text-[20px] font-medium text-[#050a0e] md:text-[22px]">
              {heading}
            </h2>
            <div className="flex w-full items-center justify-between">
              <p className="text-[14px] font-light text-[#919191]">
                {card.location}
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="flex items-center gap-1 rounded-[40px] bg-[#f5f7f8] px-2 py-1 text-[12px] font-medium text-brand">
                  <DashboardTimelinePtFundedIcon
                    aria-hidden
                    className="size-3.5"
                  />
                  {detail.investorsLabel}
                </span>
                <span className="flex items-center gap-1 rounded-[40px] bg-[#f5f7f8] px-2 py-1 text-[12px] font-medium text-brand">
                  <DashboardTimelinePtFundedIcon
                    aria-hidden
                    className="size-3.5"
                  />
                  {detail.statusBadge}
                </span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-end justify-between gap-2">
              <p className="text-[14px] font-light text-[#050a0e]">
                Total raised:{" "}
                <span className="font-medium">
                  {detail.totalRaised} / {detail.raisedGoal}
                </span>
              </p>
              <span className="text-[14px] font-medium text-brand">
                {detail.progressPercent}%
              </span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#edf4f8]">
              <div
                className="h-full rounded-full bg-brand"
                style={{ width: `${detail.progressPercent}%` }}
              />
            </div>
          </div>

          <div className="grid gap-3 border-t border-[#edf4f8] pt-4 sm:grid-cols-3">
            <div>
              <p className="text-[12px] font-light text-[#919191]">
                Expected Exit
              </p>
              <p className="text-[14px] font-medium text-[#050a0e]">
                {detail.expectedExit}
              </p>
            </div>
            <div>
              <p className="text-[12px] font-light text-[#919191]">
                Projected ROI
              </p>
              <p className="text-[14px] font-medium text-[#050a0e]">
                {detail.projectedRoi}
              </p>
            </div>
            <div>
              <p className="text-[12px] font-light text-[#919191]">
                Projected APR
              </p>
              <p className="text-[14px] font-medium text-[#050a0e]">
                {detail.projectedApr}
              </p>
            </div>
          </div>

          <div className="space-y-3 border-t border-[#edf4f8] pt-4">
            <div className="flex flex-wrap justify-between gap-2 text-[14px]">
              <span className="font-light text-[#050a0e]">
                Share price:{" "}
                <span className="font-medium">{detail.sharePrice}</span>
              </span>
              <span className="font-light text-[#919191]">
                Your balance:{" "}
                <span className="font-medium text-[#050a0e]">
                  {liveBalance}
                </span>
              </span>
            </div>
            <div className="flex gap-2">
              <div className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-[12px] border border-[#cfe2ec] px-3">
                <span className="text-[12px] text-[#919191]">Amount</span>
                <input
                  className="min-w-0 flex-1 bg-transparent text-[14px] text-[#050a0e] outline-none"
                  inputMode="decimal"
                  onChange={(event) => setAmount(event.target.value.replace(/[^0-9.]/g, ""))}
                  placeholder="0"
                  type="text"
                  value={amount}
                />
              </div>
              <button
                className="h-11 shrink-0 rounded-[12px] border border-[#cfe2ec] px-4 text-[12px] font-medium text-brand"
                onClick={() => setAmount(String(balance))}
                type="button"
              >
                Max
              </button>
            </div>
            <button
              className="flex h-11 w-full items-center justify-center rounded-[12px] bg-[#5c60cc] text-[14px] font-medium text-[#f5f7f8]"
              disabled={isBuying}
              onClick={buyShares}
              type="button"
            >
              {isBuying ? "Processing..." : "Buy Shares"}
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 rounded-[16px] bg-white p-4 shadow-[0_1px_4px_rgba(12,12,13,0.05)] lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:p-5">
        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="size-12 shrink-0 rounded-full bg-[#edf4f8] sm:size-14" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-medium text-[#050a0e] sm:text-[16px]">
                {detail.managerName}
              </p>
              <p className="truncate text-[12px] font-light text-[#919191]">
                {detail.managerRole}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            <button
              className="rounded-[12px] border border-[#cfe2ec] px-4 py-2 text-[12px] font-medium text-[#050a0e]"
              onClick={() => router.push("/dashboard/live-chat-support")}
              type="button"
            >
              Chat Us
            </button>
            <button
              className="rounded-[12px] border border-[#cfe2ec] px-4 py-2 text-[12px] font-medium text-[#050a0e]"
              onClick={() => {
                const phone = String((detail as typeof detail & { managerPhone?: string }).managerPhone ?? "").trim();
                if (phone) window.location.href = `tel:${phone}`;
                else router.push("/dashboard/live-chat-support");
              }}
              type="button"
            >
              Call Us
            </button>
          </div>
        </div>

        <div className="hidden h-8 w-px shrink-0 bg-[#deebf2] lg:block" />

        <div className="flex min-w-0 flex-1 items-center gap-3 border-t border-[#edf4f8] pt-4 sm:gap-4 lg:border-t-0 lg:pt-0">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-[8px] bg-[#f5f7f8] text-[10px] font-medium text-brand sm:size-14">
            Logo
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14px] font-medium text-[#050a0e] sm:text-[16px]">
              {detail.companyName}
            </p>
            <p className="truncate text-[12px] font-light text-[#919191]">
              Management
            </p>
          </div>
          <span className="shrink-0 rounded-[40px] bg-[#f5f7f8] px-2 py-1 text-[10px] font-medium text-brand">
            {detail.companyTag}
          </span>
        </div>
      </div>

      <DashboardDetailTabBar
        activeTab={activeTab}
        ariaLabel="Select construction property section"
        onSelect={setActiveTab}
        tabs={CONSTRUCTION_DETAIL_TABS}
      />

      <ConstructionDetailTabPanels activeTab={activeTab} property={property} />
    </div>
  );
}
