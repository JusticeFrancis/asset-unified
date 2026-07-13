"use client";

import { useQuery } from "@tanstack/react-query";
import * as requests from "@/lib/api/requests/app";

const isBrowser = typeof window !== "undefined";

export const appQueryKeys = {
  overview: ["app", "overview"] as const,
  records: (resource: string, query = "") => ["app", "records", resource, query] as const,
  record: (resource: string, slug: string) => ["app", "record", resource, slug] as const,
  wallet: ["app", "wallet"] as const,
  investments: ["app", "investments"] as const,
  coupons: ["app", "coupons"] as const,
  referrals: ["app", "referrals"] as const,
  notifications: ["app", "notifications"] as const,
  support: ["app", "support"] as const,
  settings: ["app", "settings"] as const,
  governance: (status = "all") => ["app", "governance", status] as const,
  proposal: (slug: string) => ["app", "proposal", slug] as const,
  p2p: ["app", "p2p"] as const,
  academy: ["app", "academy"] as const,
};

export const useDashboardOverview = () => useQuery({ queryKey: appQueryKeys.overview, queryFn: requests.getDashboardOverview, enabled: isBrowser });
export const useRecords = (resource: string, query = "") => useQuery({ queryKey: appQueryKeys.records(resource, query), queryFn: () => requests.getRecords(resource, query), enabled: isBrowser && Boolean(resource) });
export const useRecord = (resource: string, slug: string) => useQuery({ queryKey: appQueryKeys.record(resource, slug), queryFn: () => requests.getRecord(resource, slug), enabled: isBrowser && Boolean(resource) && Boolean(slug) });
export const useWallet = () => useQuery({ queryKey: appQueryKeys.wallet, queryFn: requests.getWallet, enabled: isBrowser });
export const useInvestments = () => useQuery({ queryKey: appQueryKeys.investments, queryFn: requests.getInvestments, enabled: isBrowser });
export const useCoupons = () => useQuery({ queryKey: appQueryKeys.coupons, queryFn: requests.getCoupons, enabled: isBrowser });
export const useReferrals = () => useQuery({ queryKey: appQueryKeys.referrals, queryFn: requests.getReferrals, enabled: isBrowser });
export const useNotifications = () => useQuery({ queryKey: appQueryKeys.notifications, queryFn: requests.getNotifications, enabled: isBrowser });
export const useSupportMessages = () => useQuery({ queryKey: appQueryKeys.support, queryFn: requests.getSupportMessages, enabled: isBrowser, refetchInterval: isBrowser ? 15000 : false });
export const useSettings = () => useQuery({ queryKey: appQueryKeys.settings, queryFn: requests.getSettings, enabled: isBrowser });
export const useGovernanceProposals = (status = "all") => useQuery({ queryKey: appQueryKeys.governance(status), queryFn: () => requests.getGovernanceProposals(status), enabled: isBrowser });
export const useGovernanceProposal = (slug: string) => useQuery({ queryKey: appQueryKeys.proposal(slug), queryFn: () => requests.getGovernanceProposal(slug), enabled: isBrowser && Boolean(slug) });
export const useP2POffers = () => useQuery({ queryKey: appQueryKeys.p2p, queryFn: requests.getP2POffers, enabled: isBrowser });
export const useAcademy = () => useQuery({ queryKey: appQueryKeys.academy, queryFn: requests.getAcademy, enabled: isBrowser });
