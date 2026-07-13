import { apiRequest } from "@/lib/api/client";
import type { ApiRecord, DashboardOverview, RecordsResponse, WalletData } from "@/lib/api/app.types";

export const getRecords = <T extends ApiRecord = ApiRecord>(resource: string, query = "") =>
  apiRequest<RecordsResponse<T>>(`records/${encodeURIComponent(resource)}${query ? `?${query}` : ""}`);

export const getRecord = <T extends ApiRecord = ApiRecord>(resource: string, slug: string) =>
  apiRequest<T>(`records/${encodeURIComponent(resource)}/${encodeURIComponent(slug)}`);

export const getDashboardOverview = () => apiRequest<DashboardOverview>("dashboard/overview", { auth: true });
export const getWallet = () => apiRequest<WalletData>("wallet", { auth: true });
export const createDeposit = (body: Record<string, unknown>) => apiRequest<any>("wallet/deposits", { method: "post", auth: true, json: body });
export const createWithdrawal = (body: Record<string, unknown>) => apiRequest<any>("wallet/withdrawals", { method: "post", auth: true, json: body });
export const claimWalletRewards = (category: "rent" | "construction") => apiRequest<any>("wallet/claims", { method: "post", auth: true, json: { category } });
export const getInvestments = () => apiRequest<any>("investments", { auth: true });
export const createInvestment = (body: { propertySlug: string; propertyKind: "rental" | "construction"; shares: number; couponCode?: string }) => apiRequest<any>("investments", { method: "post", auth: true, json: body });
export const getCoupons = () => apiRequest<any>("coupons", { auth: true });
export const redeemCoupon = (code: string) => apiRequest<any>("coupons/redeem", { method: "post", auth: true, json: { code } });
export const getReferrals = () => apiRequest<any>("referrals", { auth: true });
export const createReferral = (email: string) => apiRequest<any>("referrals", { method: "post", auth: true, json: { email } });
export const getNotifications = () => apiRequest<any>("notifications?limit=100", { auth: true });
export const markNotificationRead = (id: string, read = true) => apiRequest<any>(`notifications/${id}`, { method: "patch", auth: true, json: { read } });
export const markAllNotificationsRead = () => apiRequest<any>("notifications", { method: "patch", auth: true, json: { markAllRead: true } });
export const getSupportMessages = () => apiRequest<any>("support/messages", { auth: true });
export const sendSupportMessage = (body: string) => apiRequest<any>("support/messages", { method: "post", auth: true, json: { body } });
export const getSettings = () => apiRequest<any>("settings", { auth: true });
export const updateSettings = (body: Record<string, unknown>) => apiRequest<any>("settings", { method: "patch", auth: true, json: body });
export const deleteAccount = () => apiRequest<void>("settings", { method: "delete", auth: true });
export const logoutDevice = (id: string) => apiRequest<void>(`settings/devices/${id}`, { method: "delete", auth: true });
export const revealPrivateKey = () => apiRequest<{ privateKey: string }>("settings/private-key", { method: "post", auth: true });
export const getGovernanceProposals = (status = "all") => apiRequest<any>(`governance/proposals?status=${status}`, { auth: true });
export const getGovernanceProposal = (slug: string) => apiRequest<any>(`governance/proposals/${encodeURIComponent(slug)}`, { auth: true });
export const createGovernanceProposal = (body: Record<string, unknown>) => apiRequest<any>("governance/proposals", { method: "post", auth: true, json: body });
export const voteGovernanceProposal = (slug: string, choice: string) => apiRequest<any>(`governance/proposals/${encodeURIComponent(slug)}/vote`, { method: "post", auth: true, json: { choice } });
export const getP2POffers = () => apiRequest<any>("p2p/offers", { auth: true });
export const createP2POrder = (body: Record<string, unknown>) => apiRequest<any>("p2p/orders", { method: "post", auth: true, json: body });
export const getAcademy = () => apiRequest<any>("academy", { auth: true });
export const completeQuest = (questSlug: string) => apiRequest<any>("academy", { method: "post", auth: true, json: { questSlug } });
export const claimFarmingPoints = (investmentId: string) => apiRequest<any>("academy", { method: "post", auth: true, json: { investmentId } });

export const uploadAsset = (file: File, folder = "asset-union") => {
  const form = new FormData();
  form.set("file", file);
  form.set("folder", folder);
  return apiRequest<{ publicId: string; url: string; width?: number; height?: number; resourceType: string }>("uploads", { method: "post", auth: true, body: form });
};
