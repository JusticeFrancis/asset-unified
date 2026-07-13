"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import {
  DashboardNavItem,
  DashboardSidebar,
} from "@/app/dashboard/components/dashboard-sidebar";
import {
  DashboardTopNav,
  type DashboardBreadcrumbSegment,
} from "@/app/dashboard/components/dashboard-top-nav";

type DashboardLayoutShellProps = {
  children: ReactNode;
};

function normalizePathname(pathname: string) {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

function getPageConfig(pathname: string): {
  title: string;
  breadcrumb?: DashboardBreadcrumbSegment[];
  activeItem?: DashboardNavItem;
  contentTopPaddingClass: string;
} {
  const path = normalizePathname(pathname);
  if (path === "/dashboard") {
    return {
      title: "Dashboard",
      activeItem: "Dashboard",
      contentTopPaddingClass: "pt-[23px]",
    };
  }

  const constructionDetailMatch = path.match(
    /^\/dashboard\/construction\/([^/]+)$/,
  );
  if (constructionDetailMatch) {
    const slug = constructionDetailMatch[1];
    const breadcrumb: DashboardBreadcrumbSegment[] = [
      { label: "Construction", href: "/dashboard/construction" },
      {
        label: slug.replace(/-/g, " "),
      },
    ];
    return {
      title: "",
      breadcrumb,
      activeItem: "Construction",
      contentTopPaddingClass: "pt-[23px]",
    };
  }
  if (path === "/dashboard/construction") {
    return {
      title: "Construction",
      activeItem: "Construction",
      contentTopPaddingClass: "pt-[23px]",
    };
  }

  const rentalDetailMatch = path.match(/^\/dashboard\/rental\/([^/]+)$/);
  if (rentalDetailMatch) {
    const slug = rentalDetailMatch[1];
    const breadcrumb: DashboardBreadcrumbSegment[] = [
      { label: "Rental", href: "/dashboard/rental" },
      {
        label: slug.replace(/-/g, " "),
      },
    ];
    return {
      title: "",
      breadcrumb,
      activeItem: "Rental",
      contentTopPaddingClass: "pt-[23px]",
    };
  }
  if (path === "/dashboard/rental") {
    return {
      title: "Rental",
      activeItem: "Rental",
      contentTopPaddingClass: "pt-[23px]",
    };
  }
  if (path.startsWith("/dashboard/p2p")) {
    return {
      title: "P2P Market",
      activeItem: "P2P",
      contentTopPaddingClass: "pt-[23px]",
    };
  }

  const partnerDetailMatch = path.match(/^\/dashboard\/partner\/([^/]+)$/);
  if (partnerDetailMatch) {
    const slug = partnerDetailMatch[1];
    const breadcrumb: DashboardBreadcrumbSegment[] = [
      { label: "Partner", href: "/dashboard/partner" },
      {
        label: slug.replace(/-/g, " "),
      },
    ];
    return {
      title: "",
      breadcrumb,
      activeItem: "Partner",
      contentTopPaddingClass: "pt-[23px]",
    };
  }
  if (path === "/dashboard/partner") {
    return {
      title: "Partner",
      activeItem: "Partner",
      contentTopPaddingClass: "pt-[23px]",
    };
  }

  const governanceProposalMatch = path.match(
    /^\/dashboard\/governance\/proposal\/([^/]+)$/,
  );
  if (governanceProposalMatch) {
    const slug = governanceProposalMatch[1];
    const breadcrumb: DashboardBreadcrumbSegment[] = [
      { label: "Governance", href: "/dashboard/governance" },
      {
        label: slug.replace(/-/g, " "),
      },
    ];
    return {
      title: "",
      breadcrumb,
      activeItem: "Governance",
      contentTopPaddingClass: "pt-[23px]",
    };
  }
  if (path === "/dashboard/governance/create") {
    const breadcrumb: DashboardBreadcrumbSegment[] = [
      { label: "Governance", href: "/dashboard/governance" },
      { label: "Create proposal" },
    ];
    return {
      title: "",
      breadcrumb,
      activeItem: "Governance",
      contentTopPaddingClass: "pt-[23px]",
    };
  }
  if (path === "/dashboard/governance") {
    return {
      title: "Governance",
      activeItem: "Governance",
      contentTopPaddingClass: "pt-[23px]",
    };
  }
  if (path.startsWith("/dashboard/governance")) {
    return {
      title: "Governance",
      activeItem: "Governance",
      contentTopPaddingClass: "pt-[23px]",
    };
  }
  if (path.startsWith("/dashboard/refer-and-earn")) {
    return {
      title: "Refer and Earn",
      activeItem: "Refer and Earn",
      contentTopPaddingClass: "pt-[23px]",
    };
  }
  if (path.startsWith("/dashboard/academy")) {
    return {
      title: "Academy",
      activeItem: "Academy",
      contentTopPaddingClass: "pt-[23px]",
    };
  }
  if (path.startsWith("/dashboard/coupons")) {
    return {
      title: "Coupons",
      activeItem: "Coupons",
      contentTopPaddingClass: "pt-[23px]",
    };
  }
  if (path.startsWith("/dashboard/notifications")) {
    return {
      title: "Notification",
      contentTopPaddingClass: "pt-[23px]",
    };
  }
  if (path.startsWith("/dashboard/live-chat-support")) {
    return {
      title: "Live chat support",
      activeItem: "Live chat support",
      contentTopPaddingClass: "pt-[23px]",
    };
  }
  if (path.startsWith("/dashboard/faq")) {
    return {
      title: "Faq",
      activeItem: "Faq",
      contentTopPaddingClass: "pt-[23px]",
    };
  }
  if (path.startsWith("/dashboard/terms")) {
    return {
      title: "Terms",
      activeItem: "Terms",
      contentTopPaddingClass: "pt-[23px]",
    };
  }
  if (path.startsWith("/dashboard/settings")) {
    return {
      title: "Settings",
      activeItem: "Settings",
      contentTopPaddingClass: "pt-[23px]",
    };
  }
  if (path === "/dashboard/wallet") {
    return {
      title: "Wallet",
      contentTopPaddingClass: "pt-[23px]",
    };
  }
  if (path === "/dashboard/wallet/deposit") {
    return {
      title: "",
      breadcrumb: [
        { label: "Wallet", href: "/dashboard/wallet" },
        { label: "Deposit" },
      ],
      contentTopPaddingClass: "pt-[23px]",
    };
  }
  if (path === "/dashboard/wallet/withdraw") {
    return {
      title: "",
      breadcrumb: [
        { label: "Wallet", href: "/dashboard/wallet" },
        { label: "Withdraw" },
      ],
      contentTopPaddingClass: "pt-[23px]",
    };
  }
  return {
    title: "Dashboard",
    activeItem: "Dashboard",
    contentTopPaddingClass: "pt-[23px]",
  };
}

export function DashboardLayoutShell({ children }: DashboardLayoutShellProps) {
  const pathname = usePathname();
  const pageConfig = getPageConfig(pathname);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Auto-close the mobile drawer whenever the route changes so a tap on a
  // sidebar link transitions cleanly into the new page.
  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  return (
    <main className="min-h-screen bg-[#edf4f8]">
      <div className="min-h-screen w-full bg-[#edf4f8]">
        <DashboardSidebar
          activeItem={pageConfig.activeItem}
          mobileOpen={mobileNavOpen}
          onMobileClose={() => setMobileNavOpen(false)}
        />
        <section className="min-h-screen min-w-0 pt-[67px] md:ml-[282px] md:border-l md:border-[#cfe2ec]">
          <DashboardTopNav
            breadcrumb={pageConfig.breadcrumb}
            title={pageConfig.title}
            onMenuOpen={() => setMobileNavOpen(true)}
          />
          <div
            className={`min-w-0 px-3 pb-5 sm:px-5 ${pageConfig.contentTopPaddingClass}`}
          >
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
