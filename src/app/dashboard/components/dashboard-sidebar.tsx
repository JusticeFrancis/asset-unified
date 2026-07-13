"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { DASHBOARD_ASSETS } from "@/app/dashboard/components/dashboard-assets";
import { useAuth } from "@/contexts/auth-provider";
import { cn } from "@/lib/utils";


type DashboardSidebarProps = {
  activeItem?: DashboardNavItem;
  /** When true the sidebar renders as a full-screen mobile drawer overlay. */
  mobileOpen?: boolean;
  onMobileClose?: () => void;
};

export type DashboardNavItem =
  | "Dashboard"
  | "Construction"
  | "Rental"
  | "P2P"
  | "Partner"
  | "Governance"
  | "Refer and Earn"
  | "Academy"
  | "Coupons"
  | "Live chat support"
  | "Faq"
  | "Terms"
  | "Settings";

const overviewNav: Array<{
  label: DashboardNavItem;
  href: string;
  iconSrc: string;
}> = [
  {
    label: "Dashboard",
    href: "/dashboard",
    iconSrc: DASHBOARD_ASSETS.sidebar.nav.dashboard,
  },
  {
    label: "Construction",
    href: "/dashboard/construction",
    iconSrc: DASHBOARD_ASSETS.sidebar.nav.construction,
  },
  {
    label: "Rental",
    href: "/dashboard/rental",
    iconSrc: DASHBOARD_ASSETS.sidebar.nav.rental,
  },
  {
    label: "P2P",
    href: "/dashboard/p2p",
    iconSrc: DASHBOARD_ASSETS.sidebar.nav.p2p,
  },
  {
    label: "Partner",
    href: "/dashboard/partner",
    iconSrc: DASHBOARD_ASSETS.sidebar.nav.partner,
  },
  {
    label: "Governance",
    href: "/dashboard/governance",
    iconSrc: DASHBOARD_ASSETS.sidebar.nav.governance,
  },
];

const rewardsNav: Array<{
  label: DashboardNavItem;
  href: string;
  iconSrc: string;
}> = [
  {
    label: "Refer and Earn",
    href: "/dashboard/refer-and-earn",
    iconSrc: DASHBOARD_ASSETS.sidebar.nav.refer,
  },
  {
    label: "Academy",
    href: "/dashboard/academy",
    iconSrc: DASHBOARD_ASSETS.sidebar.nav.academy,
  },
  {
    label: "Coupons",
    href: "/dashboard/coupons",
    iconSrc: DASHBOARD_ASSETS.sidebar.nav.coupons,
  },
];

const supportNav: Array<{
  label: DashboardNavItem;
  href: string;
  iconSrc: string;
}> = [
  {
    label: "Live chat support",
    href: "/dashboard/live-chat-support",
    iconSrc: DASHBOARD_ASSETS.sidebar.nav.liveChat,
  },
  {
    label: "Faq",
    href: "/dashboard/faq",
    iconSrc: DASHBOARD_ASSETS.sidebar.nav.faq,
  },
];

const activeIconFilter =
  "brightness(0) saturate(100%) invert(35%) sepia(30%) saturate(1597%) hue-rotate(209deg) brightness(91%) contrast(91%)";
const defaultIconFilter = "brightness(0) saturate(100%)";

function NavLinkRow({
  activeItem,
  href,
  iconSrc,
  label,
  noBg = false,
  onClick,
}: {
  activeItem?: DashboardNavItem;
  href: string;
  iconSrc: string;
  label: DashboardNavItem;
  noBg?: boolean;
  onClick?: () => void;
}) {
  const isActive = label === activeItem;
  return (
    <Link
      className={cn(
        "flex h-[34px] items-center gap-3 rounded-[8px] px-3 py-2 text-[14px] font-light",
        isActive ? "text-[#5c60cc] " : "text-[#050a0e]",
        !noBg && isActive
          ? "bg-white shadow-[0_1px_4px_rgba(12,12,13,0.05)]"
          : "",
      )}
      href={href}
      onClick={onClick}
    >
      <img
        alt=""
        aria-hidden
        className="size-4"
        src={iconSrc}
        style={{
          filter: isActive ? activeIconFilter : defaultIconFilter,
        }}
      />
      <span className={cn(isActive ? "text-[#5c60cc]" : "text-[#050a0e]")}>
        {label}
      </span>
    </Link>
  );
}

export function DashboardSidebar({
  activeItem,
  mobileOpen = false,
  onMobileClose,
}: DashboardSidebarProps) {
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    onMobileClose?.();
    setIsLoggingOut(true);
    try {
      await logout();
    } catch {
      setIsLoggingOut(false);
    }
  };

  // When the mobile drawer is open, lock body scroll and close on Escape /
  // resize past the md breakpoint, mirroring the marketing MobileNavSheet.
  useEffect(() => {
    if (!mobileOpen) return;

    document.body.dataset.scrollLocked = "true";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onMobileClose?.();
    };
    const onResize = () => {
      if (window.matchMedia("(min-width: 768px)").matches) onMobileClose?.();
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);

    return () => {
      delete document.body.dataset.scrollLocked;
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, [mobileOpen, onMobileClose]);

  // The same nav body is rendered for both the desktop sidebar and the mobile
  // drawer. The wrapping <aside> below decides positioning + visibility.
  const handleNavClick = onMobileClose ?? undefined;

  const navBody = (
    <>
      <div className="pt-5">
        <div className="flex items-center justify-between">
          <Link
            className="flex items-center gap-px"
            href="/"
            onClick={handleNavClick}
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

          {/* Desktop collapse button (visual only for now). */}
          <button
            className="hidden size-4 items-center justify-center md:flex"
            type="button"
            aria-label="Collapse sidebar"
          >
            <img
              alt=""
              aria-hidden
              className="size-4"
              src={DASHBOARD_ASSETS.sidebar.collapse}
            />
          </button>

          {/* Mobile close button. */}
          <button
            className="inline-flex size-tap items-center justify-center rounded-lg text-[#050a0e] hover:bg-white/60 md:hidden"
            type="button"
            aria-label="Close navigation"
            onClick={onMobileClose}
          >
            <X className="size-6" />
          </button>
        </div>
      </div>

      <div className="mt-4 border-b border-[#cfe2ec]" />

      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pt-4 pb-4">
        <div>
          <p className="px-3 text-[9px] font-light uppercase text-[#575757]">
            Overview
          </p>
          <nav className="mt-2 flex flex-col gap-2">
            {overviewNav.map((item) => (
              <NavLinkRow
                activeItem={activeItem}
                href={item.href}
                iconSrc={item.iconSrc}
                key={item.label}
                label={item.label}
                onClick={handleNavClick}
              />
            ))}
          </nav>
        </div>

        <div>
          <p className="px-3 text-[9px] font-light uppercase text-[#575757]">
            Rewards
          </p>
          <nav className="mt-2 flex flex-col gap-2">
            {rewardsNav.map((item) => (
              <NavLinkRow
                activeItem={activeItem}
                href={item.href}
                iconSrc={item.iconSrc}
                key={item.label}
                label={item.label}
                onClick={handleNavClick}
              />
            ))}
          </nav>
        </div>

        <div>
          <p className="px-3 text-[9px] font-light uppercase text-[#575757]">
            Support
          </p>
          <nav className="mt-2 flex flex-col gap-2">
            {supportNav.map((item) => (
              <NavLinkRow
                activeItem={activeItem}
                href={item.href}
                iconSrc={item.iconSrc}
                key={item.label}
                label={item.label}
                onClick={handleNavClick}
              />
            ))}
          </nav>
        </div>
      </div>

      <div className="pb-5">
        <div className="flex flex-col gap-2">
          <NavLinkRow
            noBg
            activeItem={activeItem}
            href="/dashboard/terms"
            iconSrc={DASHBOARD_ASSETS.sidebar.utility.terms}
            label="Terms"
            onClick={handleNavClick}
          />
          <NavLinkRow
            noBg
            activeItem={activeItem}
            href="/dashboard/settings"
            iconSrc={DASHBOARD_ASSETS.sidebar.utility.settings}
            label="Settings"
            onClick={handleNavClick}
          />
          <button
            className="flex h-[34px] items-center gap-3 rounded-[8px] px-3 py-2 text-left text-[14px] font-light text-[#ec3434] disabled:cursor-not-allowed disabled:opacity-50"
            type="button"
            disabled={isLoggingOut}
            onClick={handleLogout}
          >
            <img
              alt=""
              aria-hidden
              className="size-4"
              src={DASHBOARD_ASSETS.sidebar.utility.logout}
              style={{
                filter:
                  "brightness(0) saturate(100%) invert(31%) sepia(99%) saturate(2693%) hue-rotate(346deg) brightness(98%) contrast(91%)",
              }}
            />
            Log Out{isLoggingOut ? "…" : ""}
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop fixed sidebar (≥ md). */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden h-screen w-[282px] flex-col border-r border-[#cfe2ec] bg-[#edf4f8] px-4 md:flex">
        {navBody}
      </aside>

      {/* Mobile full-screen drawer (< md). */}
      {mobileOpen ? (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-[#edf4f8] px-4 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Dashboard navigation"
        >
          {navBody}
        </div>
      ) : null}
    </>
  );
}
