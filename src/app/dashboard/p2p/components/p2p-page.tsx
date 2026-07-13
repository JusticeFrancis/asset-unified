"use client";

import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { appQueryKeys, useP2POffers } from "@/lib/api/queries/app";
import { createP2POrder } from "@/lib/api/requests/app";

import { DASHBOARD_ASSETS } from "@/app/dashboard/components/dashboard-assets";
import {
  DashboardModal,
  DashboardModalErrorIcon,
  DashboardModalProcessingIcon,
  DashboardModalWalletIcon,
} from "@/app/dashboard/components/dashboard-modal";

import { P2pMarketCard } from "./p2p-market-card";

type ModalKind = "none" | "confirm" | "processing" | "error";

const money = (value: number, currency = "USD") => new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value || 0);


export default function P2pPage() {
  const [modal, setModal] = useState<ModalKind>("none");
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [selectedSide, setSelectedSide] = useState<"buy" | "sell">("buy");
  const [errorMessage, setErrorMessage] = useState("");
  const { data } = useP2POffers();
  const queryClient = useQueryClient();
  const offers = data?.offers ?? [];
  const orders = data?.orders ?? [];
  const stats = data?.stats ?? { monthlyVolume: 0, averageSellHours: 0, participants: 0 };

  const openConfirm = useCallback((offer?: any, side: "buy" | "sell" = "buy") => {
    if (offer) setSelectedOffer(offer);
    setSelectedSide(side);
    setModal("confirm");
  }, []);
  const openProcessing = useCallback(() => setModal("processing"), []);
  const closeAll = useCallback(() => setModal("none"), []);

  const confirmBuy = useCallback(async () => {
    if (!selectedOffer?.id) {
      setErrorMessage("Select a valid market offer.");
      return setModal("error");
    }
    setModal("processing");
    try {
      await createP2POrder({ offerId: selectedOffer.id, assetAmount: Number(selectedOffer.minAmount || 1), side: selectedSide });
      await queryClient.invalidateQueries({ queryKey: appQueryKeys.p2p });
      setModal("none");
    } catch (cause) {
      setErrorMessage(cause instanceof Error ? cause.message : "The order could not be submitted.");
      setModal("error");
    }
  }, [queryClient, selectedOffer, selectedSide]);

  return (
    <div className="mx-auto flex w-full max-w-[1118px] flex-col gap-5">
      <div className="flex flex-col gap-4 rounded-2xl bg-[#dcddf4] px-4 py-5 sm:gap-6 sm:px-12 sm:py-6">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between sm:gap-4">
          <div className="flex flex-col items-center gap-2 text-center text-[#050a0e]">
            <p className="text-[24px] font-medium leading-normal">{money(stats.monthlyVolume)}</p>
            <p className="text-[14px] font-light leading-normal">
              Monthly trading volume
            </p>
          </div>
          <div className="hidden h-[69px] w-0 shrink-0 items-center sm:flex">
            <div className="h-0 w-[69px] -rotate-90 sm:rotate-0">
              <img
                alt=""
                aria-hidden
                className="block size-full min-w-[69px]"
                src={DASHBOARD_ASSETS.p2p.statDivider}
              />
            </div>
          </div>
          <div className="flex flex-col items-center gap-2 text-center text-[#050a0e]">
            <p className="text-[24px] font-medium leading-normal">{stats.averageSellHours}</p>
            <p className="text-[14px] font-light leading-normal">
              Average share sell time
            </p>
          </div>
          <div className="hidden h-[69px] w-0 shrink-0 items-center sm:flex">
            <div className="h-0 w-[69px] -rotate-90 sm:rotate-0">
              <img
                alt=""
                aria-hidden
                className="block size-full min-w-[69px]"
                src={DASHBOARD_ASSETS.p2p.statDivider}
              />
            </div>
          </div>
          <div className="flex flex-col items-center gap-2 text-center text-[#050a0e]">
            <p className="text-[24px] font-medium leading-normal">{stats.participants}</p>
            <p className="text-[14px] font-light leading-normal">
              Market participants
            </p>
          </div>
        </div>
      </div>

      <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(min(100%,342px),1fr))] gap-5">
        {offers.map((offer: any) => (
          <P2pMarketCard
            key={offer.id}
            title={offer.title || offer.propertyTitle || ""}
            location={offer.location || ""}
            propertyPrice={money(Number(offer.propertyPrice || offer.price || 0), offer.fiatCurrency || "USD")}
            availableShares={`${Number(offer.availableAmount || 0).toLocaleString()} Shares`}
            sharePrice={money(Number(offer.price || 0), offer.fiatCurrency || "USD")}
            aprPercent={offer.aprPercent != null ? `${offer.aprPercent}%` : "—"}
            aprDelta={offer.aprDelta ? `(${offer.aprDelta})` : ""}
            image={offer.image || offer.imageUrl || offer.coverImage || undefined}
            onBuy={() => openConfirm(offer, "buy")}
            onSell={() => openConfirm(offer, "sell")}
          />
        ))}
      </div>

      <section className="flex flex-col gap-5 rounded-[20px] border border-[#cfe2ec] bg-white p-4 shadow-[0_1px_4px_rgba(12,12,13,0.05)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-[19px] font-medium leading-normal text-[#050a0e]">
            Transaction history
          </h2>

        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[860px]">
            <div className="flex items-center justify-between gap-2 border-b border-transparent pb-3">
              <div className="w-[181px] shrink-0 px-3">
                <p className="text-[12px] font-medium uppercase leading-normal text-[#919191]">
                  Asset name
                </p>
              </div>
              <div className="flex w-[117px] shrink-0 justify-center">
                <p className="text-[12px] font-medium uppercase leading-normal text-[#919191]">
                  Transaction hash
                </p>
              </div>
              <div className="w-[96px] shrink-0 px-3 text-right">
                <p className="text-[12px] font-medium uppercase leading-normal text-[#919191]">
                  Date
                </p>
              </div>
              <div className="w-[96px] shrink-0 px-3 text-right">
                <p className="text-[12px] font-medium uppercase leading-normal text-[#919191]">
                  Order size
                </p>
              </div>
              <div className="w-[96px] shrink-0 px-3 text-right">
                <p className="text-[12px] font-medium uppercase leading-normal text-[#919191]">
                  Share price
                </p>
              </div>
              <div className="w-[96px] shrink-0 px-3 text-right">
                <p className="text-[12px] font-medium uppercase leading-normal text-[#919191]">
                  Order volume
                </p>
              </div>
              <div className="w-[91px] shrink-0 px-3 text-right">
                <p className="text-[12px] font-medium uppercase leading-normal text-[#919191]">
                  Order status
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {orders.map((row: any, index: number) => {
                const created = new Date(row.createdAt);
                return (
                <div
                  className="flex items-center justify-between gap-2"
                  key={row.id ?? index}
                >
                  <div className="w-[181px] shrink-0 px-3">
                    <p className="text-[14px] font-medium leading-normal text-[#5c60cc]">
                      {row.asset}
                    </p>
                  </div>
                  <div className="flex w-[117px] shrink-0 justify-center">
                    <span className="inline-flex items-center gap-1 text-[12px] font-medium text-[#050a0e]">
                      {row.providerId ? `${String(row.providerId).slice(0, 6)}...${String(row.providerId).slice(-4)}` : "Pending"}
                    </span>
                  </div>
                  <div className="flex w-[96px] shrink-0 flex-col items-end px-3 text-[12px] font-medium">
                    <span className="text-[#050a0e]">{created.toLocaleDateString()}</span>
                    <span className="text-[#919191]">{created.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                  <div className="w-[96px] shrink-0 px-3 text-right">
                    <p className="text-[12px] font-medium text-[#050a0e]">
                      {`${Number(row.assetAmount || 0).toLocaleString()} ${row.asset}`}
                    </p>
                  </div>
                  <div className="w-[96px] shrink-0 px-3 text-right">
                    <p className="text-[12px] font-medium text-[#050a0e]">
                      {money(Number(row.price || 0), row.fiatCurrency || "USD")}
                    </p>
                  </div>
                  <div className="w-[96px] shrink-0 px-3 text-right">
                    <p className="text-[12px] font-medium text-[#050a0e]">
                      {money(Number(row.fiatAmount || 0), row.fiatCurrency || "USD")}
                    </p>
                  </div>
                  <div className="flex w-[91px] shrink-0 justify-end px-3">
                    <span className="inline-flex rounded-[40px] border border-[#34c759] bg-[rgba(52,199,89,0.15)] px-1.5 py-px text-[10px] font-medium text-[#289a45]">
                      {row.status}
                    </span>
                  </div>
                </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <DashboardModal
        actions={[
          {
            label: "Cancel",
            variant: "secondary",
            onClick: closeAll,
          },
          {
            label: "Buy",
            variant: "primary",
            onClick: confirmBuy,
          },
        ]}
        callout={{
          title: "Important",
          body: "Confirmed actions are final and irreversible.",
        }}
        description={
          <>
            <p className="mb-0">
              This transaction will be processed immediately after
            </p>
            <p>confirmation.</p>
          </>
        }
        icon={<DashboardModalWalletIcon />}
        open={modal === "confirm"}
        title="Transaction Confirmation"
        onOpenChange={(open) => {
          if (!open) closeAll();
        }}
      />

      <DashboardModal
        actions={[
          {
            label: "Okay, Got it",
            variant: "secondary",
            onClick: closeAll,
          },
        ]}
        callout={{
          title: "Tip",
          body: "The order is being submitted. Its status will appear in your transaction history when accepted.",
        }}
        description={
          <>
            <p className="mb-0">
              Your order is being validated against the live offer and
            </p>
            <p>recorded in the transaction system.</p>
          </>
        }
        icon={<DashboardModalProcessingIcon />}
        open={modal === "processing"}
        title="Processing your request..."
        onOpenChange={(open) => {
          if (!open) closeAll();
        }}
      />

      <DashboardModal
        actions={[
          {
            label: "Close",
            variant: "secondary",
            onClick: closeAll,
          },
          {
            label: "Go to wallet",
            variant: "primary",
            onClick: closeAll,
          },
        ]}
        description={
          <>
            <p className="mb-0">
              {errorMessage || "The order could not be submitted."}
            </p>
          </>
        }
        icon={<DashboardModalErrorIcon />}
        open={modal === "error"}
        title="Transaction could not be completed"
        onOpenChange={(open) => {
          if (!open) closeAll();
        }}
      />
    </div>
  );
}
