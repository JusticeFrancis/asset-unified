"use client";

import { ChevronDown } from "lucide-react";

import { useNotifications } from "@/lib/api/queries/app";
import type { NotificationRecord } from "@/app/dashboard/notifications/data/notification-records";

const DATE_RANGE_OPTIONS = [
  { value: "", label: "Select date range" },
  { value: "today", label: "Today" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "all", label: "All time" },
] as const;

export default function NotificationsPage() {
  const { data } = useNotifications();
  const notifications = (data?.notifications ?? []) as NotificationRecord[];
  return (
    <div className="mx-auto flex w-full max-w-[1119px] flex-col">
      <div className="flex flex-col gap-4 rounded-[20px] bg-white p-4 sm:rounded-[32px] sm:p-6">
        <div className="flex w-full min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <p
            className="shrink-0 text-[18px] font-normal text-[#050a0e]"
            style={{ fontVariationSettings: "'opsz' 14" }}
          >
            Today
          </p>
          <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <p
              className="shrink-0 text-[14px] font-normal text-[#050a0e]"
              style={{ fontVariationSettings: "'opsz' 14" }}
            >
              Filter
            </p>
            <div className="relative min-w-0 sm:max-w-[min(100%,280px)] sm:shrink-0">
              <select
                aria-label="Filter notifications by date range"
                className="h-10 w-full min-w-0 cursor-pointer appearance-none rounded-[12px] border border-[#cfe2ec] bg-white py-2 pl-3 pr-10 text-left text-[12px] font-medium text-[#919191] outline-none ring-[#5c60cc] ring-offset-2 focus-visible:ring-2"
                defaultValue=""
                style={{ fontVariationSettings: "'opsz' 14" }}
              >
                {DATE_RANGE_OPTIONS.map((opt) => (
                  <option key={opt.value || "all-placeholder"} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                aria-hidden
                className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#050a0e]"
                strokeWidth={2}
              />
            </div>
          </div>
        </div>

        <div className="flex w-full min-w-0 flex-col gap-3 sm:gap-4">
          {notifications.map((item) => (
            <div
              className="flex w-full min-w-0 flex-col gap-3 rounded-[16px] bg-[#f4f8fb] px-4 py-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4 sm:px-6 sm:py-4"
              key={item.id}
            >
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <p
                  className="text-[14px] font-normal leading-snug text-[#050a0e] [overflow-wrap:anywhere]"
                  style={{ fontVariationSettings: "'opsz' 14" }}
                >
                  {item.title}
                </p>
                <p
                  className="text-[10px] font-light leading-relaxed text-[#6e6e6e] [overflow-wrap:anywhere]"
                  style={{ fontVariationSettings: "'opsz' 14" }}
                >
                  {item.subtitle}
                </p>
              </div>
              <p
                className="shrink-0 text-[14px] font-normal leading-snug text-[#050a0e] sm:pt-0.5 sm:text-right"
                style={{ fontVariationSettings: "'opsz' 14" }}
              >
                {item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : item.dateLabel}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
