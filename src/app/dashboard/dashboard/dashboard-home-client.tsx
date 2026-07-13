"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ConstructionClaimCard } from "./construction-claim-card";
import { ConstructionPropertyGrid } from "./construction-property-grid";
import { ConstructionStatsRow } from "./construction-stats-row";
import { DashboardModeToggle, type DashboardHomeMode } from "./dashboard-mode-toggle";
import { RentalBalanceCard } from "./rental-balance-card";
import { RentalEmptyProperties } from "./rental-empty-properties";
import { RentalStatsRow } from "./rental-stats-row";
import { appQueryKeys, useDashboardOverview } from "@/lib/api/queries/app";
import { claimWalletRewards } from "@/lib/api/requests/app";
import type { ConstructionPropertyRecord } from "@/app/dashboard/construction/data/construction-properties";
import type { RentalPropertyRecord } from "@/app/dashboard/rental/data/rental-properties";

export function DashboardHomeClient() {
  const [mode, setMode] = useState<DashboardHomeMode>("rental");
  const [claiming, setClaiming] = useState(false);
  const queryClient = useQueryClient();
  const { data } = useDashboardOverview();
  const rental = data?.rental;
  const construction = data?.construction;

  async function claimAll() {
    setClaiming(true);
    try {
      await claimWalletRewards("construction");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: appQueryKeys.overview }),
        queryClient.invalidateQueries({ queryKey: appQueryKeys.wallet }),
      ]);
    } finally {
      setClaiming(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-[1118px] flex-col gap-4">
      <div className="flex flex-col gap-4 rounded-[24px] bg-white p-4 sm:rounded-[32px] sm:p-6">
        <DashboardModeToggle mode={mode} onModeChange={setMode} />
        {mode === "rental" ? (
          <>
            <RentalBalanceCard balance={rental?.rentBalance ?? 0} />
            <RentalStatsRow accountValue={rental?.accountValue ?? 0} propertiesOwned={rental?.propertiesOwned ?? 0} totalRentClaimed={rental?.totalRentClaimed ?? 0} totalPropertyValue={rental?.totalPropertyValue ?? 0} />
          </>
        ) : (
          <>
            <ConstructionClaimCard claimable={construction?.claimable ?? 0} claiming={claiming} onClaim={claimAll} />
            <ConstructionStatsRow overallClaimed={construction?.overallClaimed ?? 0} sharesOnSale={construction?.sharesOnSale ?? 0} sharesSold={construction?.sharesSold ?? 0} />
          </>
        )}
      </div>
      {mode === "rental" ? (
        <RentalEmptyProperties properties={(rental?.properties ?? []) as unknown as RentalPropertyRecord[]} />
      ) : (
        <ConstructionPropertyGrid properties={(construction?.properties ?? []) as unknown as ConstructionPropertyRecord[]} />
      )}
    </div>
  );
}
