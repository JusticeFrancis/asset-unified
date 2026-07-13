"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, Menu } from "lucide-react";

import { DASHBOARD_ASSETS } from "@/app/dashboard/components/dashboard-assets";
import { FlagUs } from "@/lib/assets";
import { cn } from "@/lib/utils";


export type DashboardBreadcrumbSegment = {
  label: string;
  href?: string;
};

type DashboardTopNavProps = {
  title: string;
  breadcrumb?: DashboardBreadcrumbSegment[];
  /** Click handler that opens the mobile sidebar drawer. */
  onMenuOpen?: () => void;
};

export function DashboardTopNav({
  title,
  breadcrumb,
  onMenuOpen,
}: DashboardTopNavProps) {
  const pathname = usePathname();
  const walletActive = pathname.startsWith("/dashboard/wallet");
  const showCrumb = breadcrumb && breadcrumb.length > 0;
  // First crumb with an href is the natural "parent" page to back out to on
  // mobile (e.g. /dashboard/construction from a property detail page).
  const backCrumb = breadcrumb?.find((segment) => Boolean(segment.href));
  const leafLabel = breadcrumb?.[breadcrumb.length - 1]?.label ?? title;

  return (
    <header className="fixed top-0 left-0 right-0 z-10 flex h-[67px] shrink-0 items-center justify-between gap-2 border-b border-[#cfe2ec] bg-[#edf4f8] px-4 md:left-[282px] md:px-5">
      {/* Mobile: brand logo replaces the title/breadcrumb (matches Figma). */}
      {backCrumb?.href ? (
        <Link
          aria-label={`Back to ${backCrumb.label}`}
          className="flex min-w-0 items-center gap-2 md:hidden"
          href={backCrumb.href}
        >
          <span className="flex size-[34px] shrink-0 items-center justify-center rounded-full bg-white">
            <ChevronLeft className="size-[18px] text-[#050a0e]" />
          </span>
          {leafLabel ? (
            <span className="min-w-0 truncate text-[14px] font-medium text-[#050a0e]">
              {leafLabel}
            </span>
          ) : null}
        </Link>
      ) : (
        <Link
          className="flex items-center gap-px md:hidden"
          href="/dashbo"
          aria-label="Dashboard home"
        >
          <img
            alt=""
            aria-hidden
            className="h-7 w-auto shrink-0 object-contain"
            src={DASHBOARD_ASSETS.branding.logoFull}
          />
          <span
            className={cn(
              "font-geologica",
              "text-[12px] font-semibold uppercase leading-none tracking-[-0.24px] text-[#5651b5]",
            )}
          >
            Asset Union
          </span>
        </Link>
      )}

      {/* Desktop: page title or breadcrumb. */}
      <div className="hidden min-w-0 md:block">
        {showCrumb ? (
          <nav
            aria-label="Breadcrumb"
            className="flex min-w-0 flex-wrap items-center gap-2 text-[16px] font-light"
          >
            {breadcrumb.map((segment, index) => (
              <span
                className="flex min-w-0 items-center gap-2"
                key={`${index}-${segment.label}`}
              >
                {index > 0 ? (
                  <span className="shrink-0 text-[#919191]">/</span>
                ) : null}
                {segment.href ? (
                  <Link
                    className="shrink-0 text-[#919191] transition-colors hover:text-[#050a0e]"
                    href={segment.href}
                  >
                    <span className="text-[#919191]">{segment.label}</span>
                  </Link>
                ) : (
                  <span className="min-w-0 truncate text-[#050a0e]">
                    {segment.label}
                  </span>
                )}
              </span>
            ))}
          </nav>
        ) : (
          <h1 className="text-[19px] font-medium leading-none text-[#050a0e]">
            {title}
          </h1>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {/* Language pill: desktop only. */}
        <div className="hidden items-center gap-1 rounded-full bg-white px-2 py-2 md:flex">
          <img
            alt=""
            aria-hidden
            className="h-2 w-[11px] rounded-[2px] object-cover"
            height={8}
            src={FlagUs}
            width={11}
          />
          <span className="text-[10px] font-light text-[#050a0e]">EN</span>
        </div>

        <Link
          aria-label="Notifications"
          className="flex size-[34px] items-center justify-center rounded-full bg-white"
          href="/dashboard/notifications"
        >
          <img
            alt=""
            aria-hidden
            className="size-[18px]"
            src={DASHBOARD_ASSETS.topNav.bell}
          />
        </Link>
        <Link
          aria-label="Wallet"
          className={`flex size-[34px] items-center justify-center rounded-full bg-white ${
            walletActive ? "ring-1 ring-[#5c60cc]/40" : ""
          }`}
          href="/dashboard/wallet"
        >
          <img
            alt=""
            aria-hidden
            className="size-[18px]"
            src={DASHBOARD_ASSETS.topNav.wallet}
          />
        </Link>

        {/* Wallet ID + avatar pill: desktop only. */}
        <Link
          aria-label="Wallet 0x2dc…79d7"
          className="hidden shrink-0 items-center gap-2 rounded-[40px] bg-white p-2 md:flex"
          href="/dashboard/wallet"
        >
          <span className="max-w-[72px] truncate text-[12px] font-light leading-none text-[#050a0e]">
            0x2dc...79d7
          </span>
          <span className="relative size-6 shrink-0 overflow-hidden rounded-full bg-[#5c60cc]">
            <Image
              alt=""
              className="object-cover"
              height={24}
              src={DASHBOARD_ASSETS.settings.profileAvatar}
              width={24}
            />
          </span>
        </Link>

        {/* Hamburger: mobile only. */}
        <button
          type="button"
          aria-label="Open navigation"
          onClick={onMenuOpen}
          className="flex size-[34px] items-center justify-center rounded-full bg-white md:hidden"
        >
          <Menu className="size-[18px] text-[#050a0e]" />
        </button>
      </div>
    </header>
  );
}
