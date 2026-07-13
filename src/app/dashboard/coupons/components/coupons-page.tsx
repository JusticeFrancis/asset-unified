"use client";

import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { AddCouponModal } from "@/app/dashboard/coupons/components/add-coupon-modal";
import { DASHBOARD_ASSETS } from "@/app/dashboard/components/dashboard-assets";
import { type CouponRecord, type CouponTab } from "@/app/dashboard/coupons/data/coupon-records";
import { useCoupons, appQueryKeys } from "@/lib/api/queries/app";
import { redeemCoupon } from "@/lib/api/requests/app";

const TABS: { id: CouponTab; label: string }[] = [
  { id: "available", label: "Available Coupons" },
  { id: "used", label: "Used Coupons" },
  { id: "expired", label: "Expired Coupons" },
];

export default function CouponsPage() {
  const [tab, setTab] = useState<CouponTab>("available");
  const [addOpen, setAddOpen] = useState(false);
  const queryClient = useQueryClient();
  const { data } = useCoupons();
  const rows = useMemo(() => {
    const coupons = (data?.coupons ?? []) as CouponRecord[];
    return coupons.filter((coupon) => (coupon.status ?? "available") === tab).map((coupon) => ({
      ...coupon,
      dateCreated: coupon.dateCreated ? new Date(coupon.dateCreated).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "—",
      expires: coupon.expires ? new Date(coupon.expires).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "—",
    }));
  }, [tab, data]);

  return (
    <div className="mx-auto flex w-full max-w-[1118px] flex-col">
      <div className="flex flex-col gap-2 rounded-[20px] bg-white p-4 sm:rounded-[32px] sm:p-6">
        <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h1
            className="shrink-0 text-[19px] font-medium text-[#050a0e]"
            style={{ fontVariationSettings: "'opsz' 14" }}
          >
            Coupons
          </h1>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2">
            <div className="flex w-fit rounded-[40px] bg-[#f5f7f8] p-0.5">
              {TABS.map((item) => {
                const active = tab === item.id;
                return (
                  <button
                    key={item.id}
                    className={`rounded-[40px] px-3 py-2 text-[14px] transition-colors ${
                      active
                        ? "bg-white font-normal text-[#050a0e]"
                        : "font-medium text-[#919191]"
                    }`}
                    style={{ fontVariationSettings: "'opsz' 14" }}
                    type="button"
                    onClick={() => setTab(item.id)}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
            <button
              className="flex h-10 w-fit shrink-0 items-center justify-center gap-1 rounded-[12px] bg-[#5c60cc] px-3 text-[12px] font-medium text-[#f5f7f8] transition-opacity hover:opacity-95"
              style={{ fontVariationSettings: "'opsz' 14" }}
              type="button"
              onClick={() => setAddOpen(true)}
            >
              <img
                alt=""
                aria-hidden
                className="block size-2 max-w-none"
                src={DASHBOARD_ASSETS.coupons.addCouponIcon}
              />
              Add New Coupon
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 flex-1 items-center">
              <p
                className="text-[12px] font-medium uppercase text-[#919191]"
                style={{ fontVariationSettings: "'opsz' 14" }}
              >
                coupon code
              </p>
            </div>
            <div className="flex min-w-0 flex-1 items-center">
              <p
                className="text-[12px] font-medium uppercase text-[#919191]"
                style={{ fontVariationSettings: "'opsz' 14" }}
              >
                date created
              </p>
            </div>
            <div className="flex min-w-0 flex-1 items-center">
              <p
                className="text-[12px] font-medium uppercase text-[#919191]"
                style={{ fontVariationSettings: "'opsz' 14" }}
              >
                Expires
              </p>
            </div>
          </div>
          <div className="relative h-px w-full shrink-0">
            <img
              alt=""
              className="block size-full max-w-none"
              src={DASHBOARD_ASSETS.refer.tableHeaderRule}
            />
          </div>
        </div>

        {rows.length === 0 ? (
          <p
            className="flex h-9 items-center text-[12px] font-normal text-[#919191]"
            style={{ fontVariationSettings: "'opsz' 14" }}
          >
            No coupons in this list yet.
          </p>
        ) : (
          rows.map((row, index) => (
            <div
              className="flex h-9 items-center justify-between gap-4 text-[12px] font-normal text-[#050a0e]"
              key={`${row.code}-${index}`}
            >
              <p
                className="min-w-0 flex-1 truncate"
                style={{ fontVariationSettings: "'opsz' 14" }}
              >
                {row.code}
              </p>
              <p
                className="min-w-0 flex-1 truncate"
                style={{ fontVariationSettings: "'opsz' 14" }}
              >
                {row.dateCreated}
              </p>
              <p
                className="min-w-0 flex-1 truncate"
                style={{ fontVariationSettings: "'opsz' 14" }}
              >
                {row.expires}
              </p>
            </div>
          ))
        )}
      </div>

      <AddCouponModal
        open={addOpen}
        onConfirm={async (couponCode) => {
          await redeemCoupon(couponCode);
          await queryClient.invalidateQueries({ queryKey: appQueryKeys.coupons });
        }}
        onOpenChange={setAddOpen}
      />
    </div>
  );
}
