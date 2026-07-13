import { ReactNode } from "react";

import { DashboardLayoutShell } from "@/app/dashboard/components/dashboard-layout-shell";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return <DashboardLayoutShell>{children}</DashboardLayoutShell>;
}
