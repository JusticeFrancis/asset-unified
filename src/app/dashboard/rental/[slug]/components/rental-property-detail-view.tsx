"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { DASHBOARD_ASSETS } from "@/app/dashboard/components/dashboard-assets";
import { DashboardDetailTabBar } from "@/app/dashboard/components/dashboard-detail-tab-bar";
import { DetailTabDocPdfIcon } from "@/app/dashboard/construction/[slug]/components/detail-tabs/detail-tab-icons";
import { cn } from "@/lib/utils";
import { appQueryKeys, useWallet } from "@/lib/api/queries/app";
import { createInvestment, redeemCoupon } from "@/lib/api/requests/app";

import type { RentalPropertyRecord } from "@/app/dashboard/rental/data/rental-properties";

import { RENTAL_DETAIL_TABS } from "./rental-detail-tab-definitions";
import { RentalDetailTabPanels } from "./rental-detail-tab-panels";

type RentalPropertyDetailViewProps = {
  property: RentalPropertyRecord;
};

export function RentalPropertyDetailView({
  property,
}: RentalPropertyDetailViewProps) {
  const { card, detail } = property;
  const heading = detail.displayTitle ?? card.title;
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: wallet } = useWallet();
  const [mainIndex, setMainIndex] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [shares, setShares] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCouponCode, setAppliedCouponCode] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [isBuying, setIsBuying] = useState(false);

  const mainSrc = detail.gallery[mainIndex] ?? detail.heroImage;
  const asset = String(property.asset ?? "USDT").toUpperCase();
  const sharePrice = Number(detail.sharePriceValue ?? String(detail.sharePrice).replace(/[^0-9.]/g, ""));
  const balance = Number(wallet?.balances?.[asset] ?? 0);
  const liveBalance = `${balance.toLocaleString("en-US", { maximumFractionDigits: 2 })} ${asset}`;
  const maxShares = sharePrice > 0 ? Math.floor(balance / sharePrice) : 0;

  const applyCoupon = async () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) return;
    setIsApplyingCoupon(true);
    try {
      const response = await redeemCoupon(code);
      setAppliedCouponCode(response.coupon.code);
      setCouponCode(response.coupon.code);
      await queryClient.invalidateQueries({ queryKey: appQueryKeys.coupons });
      window.alert("Coupon applied to your account.");
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Unable to apply this coupon.");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const buyShares = async () => {
    if (!Number.isInteger(shares) || shares < 1) {
      window.alert("Select at least one share.");
      return;
    }
    setIsBuying(true);
    try {
      const response = await createInvestment({
        propertySlug: property.slug,
        propertyKind: "rental",
        shares,
        couponCode: appliedCouponCode || undefined,
      });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: appQueryKeys.wallet }),
        queryClient.invalidateQueries({ queryKey: appQueryKeys.investments }),
        queryClient.invalidateQueries({ queryKey: appQueryKeys.overview }),
        queryClient.invalidateQueries({ queryKey: appQueryKeys.coupons }),
      ]);
      setShares(0);
      setCouponCode("");
      setAppliedCouponCode("");
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
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-[18px] font-light text-[#050a0e] md:text-[20px]">
                  {heading}
                </h2>
                <p className="mt-1 text-[12px] font-medium text-[#919191]">
                  {card.location}
                </p>
              </div>
              <div className="flex flex-wrap gap-1">
                <span className="flex items-center gap-1 rounded-[40px] bg-[#f5f7f8] px-2 py-0.5">
                  <DetailTabDocPdfIcon
                    aria-hidden
                    className="size-3 shrink-0 text-[#5c60cc]"
                  />
                  <span className="text-[8px] font-medium text-[#5c60cc]">
                    {detail.investorsCount}
                  </span>
                </span>
                <span className="flex items-center gap-1 rounded-[40px] bg-[#f5f7f8] px-2 py-0.5">
                  <img
                    alt=""
                    aria-hidden
                    className="size-3 shrink-0"
                    src={DASHBOARD_ASSETS.main.badgeConstruction}
                  />
                  <span className="text-[8px] font-medium text-[#5c60cc]">
                    {detail.statusBadgeLabel}
                  </span>
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-4 rounded-[16px] bg-[#dcddf4] px-3 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="px-1">
                <p className="text-[12px] font-medium text-[#919191]">
                  Property Price
                </p>
                <p className="text-[19px] font-medium text-[#5c60cc]">
                  {detail.propertyPrice}
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:items-end">
                <div className="flex items-center gap-2 px-1">
                  <span className="text-[12px] font-medium text-[#919191]">
                    APR
                  </span>
                  <span className="text-[12px] font-light text-[#5c60cc]">
                    {detail.aprPercent}
                  </span>
                  <img
                    alt=""
                    aria-hidden
                    className="size-3"
                    src={DASHBOARD_ASSETS.main.aprTrend}
                  />
                </div>
                <div className="flex items-center gap-2 px-1">
                  <span className="text-[12px] font-medium text-[#919191]">
                    ECA
                  </span>
                  <span className="text-[12px] font-light text-[#5c60cc]">
                    {detail.ecaLabel}
                  </span>
                  <img
                    alt=""
                    aria-hidden
                    className="size-3"
                    src={DASHBOARD_ASSETS.main.aprTrend}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2 px-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-[12px] text-[#919191]">
                  Share Price:{" "}
                  <span className="font-normal text-[#5c60cc]">
                    {detail.sharePrice}
                  </span>
                </p>
                <p className="text-[12px] font-medium">
                  <span className="text-[#919191]">Collected:</span>{" "}
                  <span className="text-[#050a0e]">
                    {detail.collectedPercent}%
                  </span>
                </p>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-[#f5f7f8]">
                <div
                  className="h-full rounded-full bg-[#5c60cc]"
                  style={{ width: `${detail.collectedPercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="border-t border-[#edf4f8] pt-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-[12px]">
              <span className="font-medium text-[#919191]">Buy amount</span>
              <span className="font-medium text-[#919191]">
                Your balance:{" "}
                <span className="font-light text-[#050a0e]">
                  {liveBalance}
                </span>
              </span>
            </div>
            <div className="flex h-10 items-center justify-between rounded-[12px] border border-[#edf4f8] px-4 text-[12px] font-medium">
              <input
                className="min-w-0 flex-1 bg-transparent text-[#050a0e] outline-none"
                inputMode="numeric"
                min={0}
                onChange={(event) => setShares(Math.max(0, Math.floor(Number(event.target.value) || 0)))}
                type="number"
                value={shares}
              />
              <button className="text-[#5c60cc]" onClick={() => setShares(maxShares)} type="button">
                Max
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {detail.quickShareOptions.map((opt) => (
                <button
                  className="flex flex-col items-center gap-0.5 rounded-[12px] bg-[#fafcfd] px-4 py-2 text-center"
                  key={opt.shares}
                  onClick={() => setShares(opt.shares)}
                  type="button"
                >
                  <span className="text-[12px] font-normal text-[#050a0e]">
                    {opt.shares} Shares
                  </span>
                  <span className="text-[12px] font-medium text-[#919191]">
                    {opt.usdLabel}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-4 flex h-10 items-center justify-between rounded-[12px] border border-[#edf4f8] px-4 text-[12px] font-medium">
              <input
                className="min-w-0 flex-1 bg-transparent text-[#050a0e] outline-none placeholder:text-[#bdbdbd]"
                onChange={(event) => {
                  setCouponCode(event.target.value.toUpperCase());
                  setAppliedCouponCode("");
                }}
                placeholder="paste coupon here"
                type="text"
                value={couponCode}
              />
              <button className="text-[#5c60cc]" disabled={isApplyingCoupon} onClick={applyCoupon} type="button">
                {isApplyingCoupon ? "Applying..." : appliedCouponCode ? "Applied" : "Apply Code"}
              </button>
            </div>

            <button
              className="mt-4 flex h-10 w-full items-center justify-center rounded-[12px] bg-[#5c60cc] text-[12px] font-medium text-[#f5f7f8]"
              disabled={isBuying}
              onClick={buyShares}
              type="button"
            >
              {isBuying ? "Processing..." : detail.primaryCtaLabel}
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 rounded-[16px] bg-white p-4 shadow-[0_1px_4px_rgba(12,12,13,0.05)] lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:p-5">
        <div className="flex min-w-0 flex-1 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-start gap-2">
            <div className="size-[47px] shrink-0 rounded-lg bg-[#edf4f8]" />
            <div className="min-w-0">
              <p className="text-[14px] font-normal text-[#050a0e]">
                {detail.managerPrompt}
              </p>
              <p className="text-[12px] font-medium text-[#919191]">
                {detail.managerName} · {detail.managerRole}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 gap-2">
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

        <div className="flex min-w-0 flex-1 flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex size-[47px] shrink-0 items-center justify-center rounded-lg bg-[#f5f7f8] text-[10px] font-medium text-brand">
              Logo
            </div>
            <div>
              <p className="text-[14px] font-normal text-[#050a0e]">
                {detail.managementCompanyName}
              </p>
              <p className="text-[12px] font-medium text-[#919191]">
                Management
              </p>
            </div>
          </div>
          <span className="rounded-[40px] bg-[#f5f7f8] px-3 py-1 text-[10px] font-medium text-[#919191]">
            {detail.companyTag}
          </span>
        </div>
      </div>

      <DashboardDetailTabBar
        activeTab={activeTab}
        ariaLabel="Select rental property section"
        onSelect={setActiveTab}
        tabs={RENTAL_DETAIL_TABS}
      />

      <RentalDetailTabPanels activeTab={activeTab} property={property} />
    </div>
  );
}
