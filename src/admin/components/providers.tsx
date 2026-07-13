"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

import { AdminAuthProvider } from "@/admin/contexts/admin-auth-provider";
import { OrganizationAuthProvider } from "@/admin/contexts/organization-auth-provider";
import { createQueryClient } from "@/admin/lib/api/query-client";

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AdminAuthProvider>
        <OrganizationAuthProvider>{children}</OrganizationAuthProvider>
      </AdminAuthProvider>
    </QueryClientProvider>
  );
}
