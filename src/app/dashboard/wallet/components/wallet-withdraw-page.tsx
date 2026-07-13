"use client";

import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { DASHBOARD_ASSETS } from "@/app/dashboard/components/dashboard-assets";
import {
  PolygonOnlyBadge,
  SelectChevron,
} from "@/app/dashboard/wallet/components/wallet-shared";
import { appQueryKeys, useWallet } from "@/lib/api/queries/app";
import { createWithdrawal } from "@/lib/api/requests/app";

type Step = 1 | 2 | 3 | 4;
type WithdrawalResult = {
  transaction?: {
    id?: string;
    providerId?: string | null;
    status?: string;
    metadata?: Record<string, unknown>;
  };
  provider?: Record<string, unknown>;
};

function asPositiveNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function formatAmount(value: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 8 }).format(value);
}

export default function WalletWithdrawPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data } = useWallet();
  const [step, setStep] = useState<Step>(1);
  const [networkOpen, setNetworkOpen] = useState(false);
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [asset] = useState("USDT");
  const [network, setNetwork] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<WithdrawalResult | null>(null);

  const walletAddress = data?.address ?? "";
  const balance = Number(data?.balances?.[asset] ?? 0);
  const numericAmount = asPositiveNumber(amount);
  const fee = Number(data?.depositInstructions?.networkFee ?? 0);
  const feeAsset = String(data?.depositInstructions?.networkFeeAsset ?? asset);
  const networks = useMemo(() => {
    const unique = new Map<string, string>();
    for (const method of data?.depositInstructions?.methods ?? []) {
      if (method.network) unique.set(method.network, method.subLabel || method.network);
    }
    return [...unique.entries()].map(([id, label]) => ({ id, label }));
  }, [data?.depositInstructions?.methods]);
  const selectedNetworkLabel = networks.find((item) => item.id === network)?.label ?? "Select network";

  function goBack() {
    setError("");
    if (step === 1) router.push("/dashboard/wallet");
    else setStep((current) => (current > 1 ? ((current - 1) as Step) : current));
  }

  function proceedFromAddress() {
    if (data?.status !== "active" || !walletAddress) {
      setError("Complete wallet setup before withdrawing.");
      return;
    }
    if (!toAddress.trim()) {
      setError("Enter a destination address.");
      return;
    }
    if (!network) {
      setError("Select an available network.");
      return;
    }
    setError("");
    setStep(2);
  }

  function proceedFromAmount() {
    if (!numericAmount) {
      setError("Enter a valid withdrawal amount.");
      return;
    }
    if (numericAmount > balance) {
      setError("Your wallet balance is too low.");
      return;
    }
    setError("");
    setStep(3);
  }

  async function submitWithdrawal() {
    setSubmitting(true);
    setError("");
    try {
      const response = await createWithdrawal({
        amount: numericAmount,
        asset,
        destinationAddress: toAddress.trim(),
        network,
      }) as WithdrawalResult;
      setResult(response);
      await queryClient.invalidateQueries({ queryKey: appQueryKeys.wallet });
      setStep(4);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The transfer could not be submitted.");
    } finally {
      setSubmitting(false);
    }
  }

  const provider = result?.provider ?? {};
  const explorerUrl = [
    provider.block_explorer_url,
    provider.explorer_url,
    provider.receipt_url,
    result?.transaction?.metadata?.explorerUrl,
  ].find((value): value is string => typeof value === "string" && value.startsWith("http"));

  return (
    <div className="mx-auto w-full max-w-[535px]">
      <div className="flex flex-col gap-8 rounded-[20px] bg-white p-4 sm:gap-12 sm:rounded-[32px] sm:p-6">
        {step === 1 ? (
          <>
            <div className="flex flex-col gap-8">
              <div className="flex w-full items-center justify-between">
                <button className="flex items-center gap-1 text-[#050a0e]" type="button" onClick={goBack}>
                  <img alt="" aria-hidden className="size-6 rotate-180 max-w-none" src={DASHBOARD_ASSETS.wallet.chevronRight} />
                  <span className="sr-only">Back</span>
                </button>
                <p className="text-[14px] font-normal text-[#050a0e]" style={{ fontVariationSettings: "'opsz' 14" }}>Choose Address</p>
                <div className="w-6 shrink-0" />
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <div className="px-3"><p className="text-[12px] font-medium text-[#919191]" style={{ fontVariationSettings: "'opsz' 14" }}>From</p></div>
                  <div className="flex h-10 items-center rounded-xl border border-[#d7e7ef] px-4">
                    <p className="truncate text-[14px] font-normal text-[#050a0e]" style={{ fontVariationSettings: "'opsz' 14" }}>{walletAddress || "Wallet not connected"}</p>
                  </div>
                  <div className="flex justify-end px-3">
                    <p className="text-[12px] font-medium text-[#919191]" style={{ fontVariationSettings: "'opsz' 14" }}><span className="font-light">Balance: </span>{formatAmount(balance)} {asset}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="px-3"><p className="text-[12px] font-medium text-[#919191]" style={{ fontVariationSettings: "'opsz' 14" }}>To</p></div>
                  <input className="h-10 w-full rounded-xl border border-[#d7e7ef] px-4 text-[12px] font-medium text-[#050a0e] outline-none placeholder:text-[#919191]" placeholder="0x..." style={{ fontVariationSettings: "'opsz' 14" }} value={toAddress} onChange={(event) => setToAddress(event.target.value)} />
                </div>

                <div className="relative flex flex-col gap-1">
                  <div className="px-3"><p className="text-[12px] font-medium text-[#919191]" style={{ fontVariationSettings: "'opsz' 14" }}>Select Network</p></div>
                  <button className="flex h-10 w-full items-center justify-between rounded-xl border border-[#050a0e] px-4" type="button" aria-expanded={networkOpen} onClick={() => setNetworkOpen((open) => !open)}>
                    <span className="flex items-center gap-2">
                      <PolygonOnlyBadge />
                      <span className="text-[14px] font-normal text-[#050a0e]" style={{ fontVariationSettings: "'opsz' 14" }}>{selectedNetworkLabel}</span>
                    </span>
                    <SelectChevron open={networkOpen} />
                  </button>
                  {networkOpen ? (
                    <div className="absolute left-0 right-0 top-full z-20 mt-2 rounded-xl bg-white p-2 shadow-[2px_2px_4px_0px_rgba(0,0,0,0.07),-2px_0px_4px_0px_rgba(0,0,0,0.07)]">
                      {networks.map((item) => (
                        <button key={item.id} className="flex h-10 w-full items-center gap-2 rounded-lg px-3 text-left hover:bg-[#f4f8fb]" type="button" onClick={() => { setNetwork(item.id); setNetworkOpen(false); }}>
                          <PolygonOnlyBadge />
                          <span className="text-[14px] font-normal text-[#050a0e]">{item.label}</span>
                        </button>
                      ))}
                      {networks.length === 0 ? <p className="px-3 py-2 text-[12px] font-medium text-[#919191]">No withdrawal network is available.</p> : null}
                    </div>
                  ) : null}
                </div>
                {error ? <p className="px-3 text-[12px] font-medium text-red-600">{error}</p> : null}
              </div>
            </div>
            <button className="flex h-10 w-full items-center justify-center rounded-xl bg-[#5c60cc] px-4" type="button" onClick={proceedFromAddress}>
              <span className="text-[12px] font-medium text-[#f5f7f8]" style={{ fontVariationSettings: "'opsz' 14" }}>Continue</span>
            </button>
          </>
        ) : null}

        {step === 2 ? (
          <>
            <div className="flex flex-col gap-8">
              <div className="flex w-full items-center justify-between">
                <button className="flex size-6 items-center justify-center" type="button" onClick={goBack}><img alt="" aria-hidden className="size-6 rotate-180 max-w-none" src={DASHBOARD_ASSETS.wallet.chevronRight} /></button>
                <p className="text-[14px] font-normal text-[#050a0e]" style={{ fontVariationSettings: "'opsz' 14" }}>Send Amount</p>
                <div className="w-6 shrink-0" />
              </div>

              <div className="flex flex-col items-center gap-8">
                <div className="flex flex-col items-center gap-0.5 text-[#050a0e]">
                  <input
                    aria-label="Withdrawal amount"
                    className="w-full bg-transparent text-center text-[26px] font-medium outline-none placeholder:text-[#919191] sm:text-[34px]"
                    inputMode="decimal"
                    min="0"
                    placeholder="0.00"
                    step="any"
                    type="number"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                  />
                  <p className="text-[16px] font-light" style={{ fontVariationSettings: "'opsz' 14" }}>{asset} {numericAmount ? formatAmount(numericAmount) : "0.00"}</p>
                </div>

                <div className="flex w-full flex-col gap-1">
                  <div className="px-3"><p className="text-[12px] font-medium text-[#919191]" style={{ fontVariationSettings: "'opsz' 14" }}>Choose Asset</p></div>
                  <div className="flex h-10 items-center justify-between rounded-xl border border-[#050a0e] px-4">
                    <span className="flex items-center gap-2"><PolygonOnlyBadge /><span className="text-[14px] font-normal text-[#050a0e]" style={{ fontVariationSettings: "'opsz' 14" }}>{asset} · {selectedNetworkLabel}</span></span>
                    <SelectChevron open={false} />
                  </div>
                </div>

                <div className="flex w-full flex-col gap-2">
                  <div className="flex h-10 items-center justify-between rounded-xl bg-[#f5f7f8] px-4 text-[12px] font-medium"><span className="text-[#919191]">To</span><span className="max-w-[65%] truncate text-[#050a0e]" style={{ fontVariationSettings: "'opsz' 14" }}>{toAddress}</span></div>
                  <div className="flex h-10 items-center justify-between rounded-xl bg-[#f5f7f8] px-4 text-[12px] font-medium"><span className="text-[#919191]">Balance</span><span className="text-[#050a0e]">{formatAmount(balance)} {asset}</span></div>
                </div>

                <div className="h-px w-full bg-[#cfe2ec]" />
                <div className="flex w-full items-start justify-between text-[12px]">
                  <span className="font-light text-[#6e6e6e]" style={{ fontVariationSettings: "'opsz' 14" }}>Network fee:</span>
                  <span className="flex items-center gap-1 font-medium"><span className="text-[#050a0e]">{formatAmount(fee)}</span><span className="text-[#919191]">{feeAsset}</span></span>
                </div>
                {error ? <p className="w-full px-3 text-[12px] font-medium text-red-600">{error}</p> : null}
              </div>
            </div>
            <button className="flex h-10 w-full items-center justify-center rounded-xl bg-[#5c60cc] px-4" type="button" onClick={proceedFromAmount}>
              <span className="text-[12px] font-medium text-[#f5f7f8]" style={{ fontVariationSettings: "'opsz' 14" }}>Continue</span>
            </button>
          </>
        ) : null}

        {step === 3 ? (
          <>
            <div className="flex flex-col gap-8">
              <div className="flex w-full items-center justify-between">
                <button className="flex size-6 items-center justify-center" type="button" onClick={goBack}><img alt="" aria-hidden className="size-6 rotate-180 max-w-none" src={DASHBOARD_ASSETS.wallet.chevronRight} /></button>
                <p className="text-[14px] font-normal text-[#050a0e]" style={{ fontVariationSettings: "'opsz' 14" }}>Send Amount</p>
                <div className="w-6 shrink-0" />
              </div>

              <div className="flex flex-col gap-6">
                <div className="flex w-full items-center justify-between gap-4 whitespace-nowrap text-[#050a0e]">
                  <p className="text-[16px] font-light" style={{ fontVariationSettings: "'opsz' 14" }}>Sending....</p>
                  <p className="text-right font-medium"><span className="text-[24px]" style={{ fontVariationSettings: "'opsz' 14" }}>{formatAmount(numericAmount)} </span><span className="text-[19px] text-[#919191]" style={{ fontVariationSettings: "'opsz' 14" }}>{asset}</span></p>
                </div>
                <div className="h-px w-full bg-[#cfe2ec]" />
                <div className="rounded-xl bg-[#f5f7f8] p-4 text-[12px] font-medium">
                  <div className="flex items-center justify-between gap-2"><span className="text-[#919191]">Address</span><span className="max-w-[60%] truncate text-[#050a0e]">{toAddress}</span></div>
                  <div className="mt-6 flex items-center justify-between gap-2"><span className="text-[#919191]">Transaction fee</span><span className="text-[#050a0e]">{formatAmount(fee)} {feeAsset}</span></div>
                </div>
                {error ? <p className="px-3 text-[12px] font-medium text-red-600">{error}</p> : null}
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex h-10 flex-1 items-center justify-center rounded-xl border border-[#cfe2ec] px-4" type="button" onClick={() => setStep(2)} disabled={submitting}><span className="text-[12px] font-medium text-[#050a0e]" style={{ fontVariationSettings: "'opsz' 14" }}>Cancel</span></button>
              <button className="flex h-10 flex-1 items-center justify-center rounded-xl bg-[#5c60cc] px-4 disabled:opacity-60" type="button" onClick={submitWithdrawal} disabled={submitting}><span className="text-[12px] font-medium text-[#f5f7f8]" style={{ fontVariationSettings: "'opsz' 14" }}>{submitting ? "Submitting..." : "Continue"}</span></button>
            </div>
          </>
        ) : null}

        {step === 4 ? (
          <>
            <div className="relative flex flex-col items-center gap-6 pt-2">
              <div className="flex w-full items-center justify-between">
                <button className="flex size-6 items-center justify-center" type="button" onClick={goBack}><img alt="" aria-hidden className="size-6 rotate-180 max-w-none" src={DASHBOARD_ASSETS.wallet.chevronRight} /></button>
                <div className="w-6 shrink-0" /><div className="w-6 shrink-0" />
              </div>
              <div className="relative flex flex-col items-center gap-6">
                <div className="relative flex size-[72px] shrink-0 items-center justify-center">
                  <img alt="" aria-hidden className="absolute inset-0 size-full max-w-none object-contain" src={DASHBOARD_ASSETS.wallet.successMarkBg} />
                  <img alt="" aria-hidden className="relative z-1 h-11 w-11 max-w-none object-contain" src={DASHBOARD_ASSETS.wallet.successPlaneIcon} />
                </div>
                <div className="flex max-w-[403px] flex-col items-center gap-1 text-center">
                  <p className="text-[19px] font-medium text-[#050a0e]" style={{ fontVariationSettings: "'opsz' 14" }}>Transaction Submitted!</p>
                  <p className="text-[16px] font-light text-[#919191]" style={{ fontVariationSettings: "'opsz' 14" }}>Your withdrawal was accepted for processing. Its status will update from the payment provider.</p>
                </div>
                {explorerUrl ? (
                  <Link className="flex items-center gap-1 rounded-[40px] border border-[#cfe2ec] px-3 py-1" href={explorerUrl} rel="noopener noreferrer" target="_blank">
                    <span className="text-[15px] font-light text-[#050a0e]" style={{ fontVariationSettings: "'opsz' 14" }}>View on block explorer</span>
                    <img alt="" aria-hidden className="size-4 max-w-none" src={DASHBOARD_ASSETS.wallet.externalLinkIcon} />
                  </Link>
                ) : null}
              </div>
            </div>
            <Link className="flex h-10 w-full items-center justify-center rounded-xl bg-[#5c60cc] px-4" href="/dashboard/wallet"><span className="text-[12px] font-medium text-[#f5f7f8]" style={{ fontVariationSettings: "'opsz' 14" }}>Go back to Wallet</span></Link>
          </>
        ) : null}
      </div>
    </div>
  );
}
