"use client";

import QRCode from "qrcode";
import { useEffect, useMemo, useRef, useState } from "react";

import { DASHBOARD_ASSETS } from "@/app/dashboard/components/dashboard-assets";
import type { DepositMethodId, FiatCurrencyCode } from "@/app/dashboard/wallet/data/wallet-constants";
import {
  SelectChevron,
  TetherBadgeStack,
  WalletFormCardHeader,
} from "@/app/dashboard/wallet/components/wallet-shared";
import type {
  WalletData,
  WalletDepositMethod,
  WalletFiatCurrency,
  WalletTransferOption,
} from "@/lib/api/app.types";
import { useWallet } from "@/lib/api/queries/app";

function methodLabel(methodId: DepositMethodId | null, methods: WalletDepositMethod[]) {
  if (!methodId) return null;
  if (methodId === "fiat") {
    return (
      <span className="inline-flex items-center gap-2.5">
        <span className="flex size-6 items-center justify-center">
          <img alt="" aria-hidden className="size-6 max-w-none rotate-180" src={DASHBOARD_ASSETS.wallet.creditCardIcon} />
        </span>
        <span className="text-[14px] font-normal text-[#050a0e]" style={{ fontVariationSettings: "'opsz' 14" }}>
          Credit or Debit Card / Bank Transfer
        </span>
      </span>
    );
  }
  const row = methods.find((item) => item.id === methodId);
  if (!row) return null;
  return (
    <span className="inline-flex items-center gap-2.5">
      <TetherBadgeStack chainCorner={row.chainCorner ?? null} />
      <span className="text-[14px] font-normal text-[#050a0e]" style={{ fontVariationSettings: "'opsz' 14" }}>
        <span>{row.label}</span>
        {row.subLabel ? <span className="text-[#919191]"> {row.subLabel}</span> : null}
      </span>
      {row.recommended ? (
        <span className="rounded-[40px] bg-[rgba(111,178,211,0.2)] px-2 py-0.5 text-[10px] font-normal text-[#6fb2d3]">Recommended</span>
      ) : null}
    </span>
  );
}

function flagEmoji(currency: WalletFiatCurrency) {
  const region = String(currency.flag ?? "").trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(region)) return "";
  return String.fromCodePoint(...[...region].map((letter) => 127397 + letter.charCodeAt(0)));
}

function optionIcon(index: number) {
  if (index === 1) return DASHBOARD_ASSETS.wallet.bankRevolutIcon;
  if (index === 2) return DASHBOARD_ASSETS.wallet.bankSepaIcon;
  return DASHBOARD_ASSETS.wallet.bankSwiftIcon;
}

const POLYGON_USDT_METHOD: WalletDepositMethod = {
  id: "usdt-polygon",
  label: "USDT",
  subLabel: "Polygon (MATIC)",
  network: "polygon",
  asset: "USDT",
  recommended: true,
  chainCorner: "polygon",
};

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function record(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;
}

function methodLooksLikePolygonUsdt(method: WalletDepositMethod) {
  const haystack = [method.id, method.label, method.subLabel, method.network, method.asset, method.chainCorner]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes("usdt") && (haystack.includes("polygon") || haystack.includes("matic"));
}

function normalizeDepositMethods(source: WalletDepositMethod[]) {
  const methods = source
    .filter(methodLooksLikePolygonUsdt)
    .map((method) => ({
      ...method,
      ...POLYGON_USDT_METHOD,
      recommended: true,
    }));
  return methods.length > 0 ? [methods[0]] : [POLYGON_USDT_METHOD];
}

function optionAddress(option: WalletTransferOption) {
  const details = record(option.accountDetails);
  return text(option.accountDetails?.address)
    || text(option.accountDetails?.walletAddress)
    || text(option.accountDetails?.wallet_address)
    || text(details?.address)
    || text(details?.walletAddress)
    || text(details?.wallet_address);
}

function extractPolygonUsdtAddress(data: WalletData | undefined, options: WalletTransferOption[]) {
  const polygonUsdt = record(data?.depositInstructions?.polygonUsdt);
  const direct = text(polygonUsdt?.address)
    || text(data?.depositInstructions?.polygonUsdtAddress)
    || text(data?.depositInstructions?.usdtPolygonAddress)
    || text(data?.address);
  if (direct) return direct;

  for (const option of options) {
    const details = record(option.accountDetails);
    const haystack = [
      option.id,
      option.label,
      option.currency,
      details?.asset,
      details?.currency,
      details?.network,
    ].join(" ").toLowerCase();
    const address = optionAddress(option);
    if (address && haystack.includes("usdt") && (haystack.includes("polygon") || haystack.includes("matic"))) {
      return address;
    }
  }
  return "";
}

export default function WalletDepositPage() {
  const { data, isLoading } = useWallet();
  const [open, setOpen] = useState(false);
  const [method, setMethod] = useState<DepositMethodId | null>(null);
  const [fiatOpen, setFiatOpen] = useState(false);
  const [bankOpen, setBankOpen] = useState(false);
  const [fiatSearch, setFiatSearch] = useState("");
  const [pickedFiat, setPickedFiat] = useState<FiatCurrencyCode | null>(null);
  const [qrUrl, setQrUrl] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

  const rawMethods = data?.depositInstructions?.methods ?? [];
  const methods = useMemo(() => normalizeDepositMethods(rawMethods), [rawMethods]);
  const fiatCurrencies = data?.depositInstructions?.fiatCurrencies ?? [];
  const transferOptions = data?.depositInstructions?.transferOptions ?? [];
  const walletAddress = useMemo(() => extractPolygonUsdtAddress(data, transferOptions), [data, transferOptions]);
  const fiatEnabled = fiatCurrencies.length > 0;
  const cryptoSelected = Boolean(method && method !== "fiat" && methods.some((item) => item.id === method));

  useEffect(() => {
    function onDoc(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (!walletAddress) {
      setQrUrl("");
      return;
    }
    QRCode.toDataURL(walletAddress, { margin: 1, width: 230 })
      .then((value) => {
        if (!cancelled) setQrUrl(value);
      })
      .catch(() => {
        if (!cancelled) setQrUrl("");
      });
    return () => {
      cancelled = true;
    };
  }, [walletAddress]);

  useEffect(() => {
    if (isLoading) return;
    const firstCryptoMethod = methods[0]?.id ?? null;
    if (!method && firstCryptoMethod) {
      setMethod(firstCryptoMethod);
      return;
    }
    if (method && method !== "fiat" && !methods.some((item) => item.id === method)) {
      setMethod(firstCryptoMethod);
    }
  }, [isLoading, method, methods]);

  function pickMethod(id: DepositMethodId) {
    setMethod(id);
    setOpen(false);
    if (id === "fiat") setFiatOpen(true);
  }

  function onCopy() {
    if (walletAddress) void navigator.clipboard.writeText(walletAddress);
  }

  const fiatFiltered = useMemo(() => {
    const query = fiatSearch.trim().toLowerCase();
    if (!query) return fiatCurrencies;
    return fiatCurrencies.filter((currency) =>
      currency.code.toLowerCase().includes(query) || currency.name.toLowerCase().includes(query),
    );
  }, [fiatCurrencies, fiatSearch]);

  const filteredTransferOptions = transferOptions.filter(
    (option) => !pickedFiat || !option.currency || option.currency.toUpperCase() === pickedFiat.toUpperCase(),
  );

  function useTransferOption(option: WalletTransferOption) {
    if (option.url) {
      window.open(option.url, "_blank", "noopener,noreferrer");
      return;
    }
    if (option.accountDetails && Object.keys(option.accountDetails).length > 0) {
      void navigator.clipboard.writeText(JSON.stringify(option.accountDetails, null, 2));
    }
  }

  return (
    <div className="mx-auto w-full max-w-[535px]">
      <div className="flex flex-col gap-4 rounded-[20px] bg-white p-4 sm:rounded-[32px] sm:p-6">
        <WalletFormCardHeader title="Deposit" />

        <div ref={rootRef} className="relative flex w-full flex-col gap-1">
          <div className="px-3">
            <p className="text-[12px] font-medium text-[#919191]" style={{ fontVariationSettings: "'opsz' 14" }}>Select Method</p>
          </div>
          <button
            className={`flex h-10 w-full items-center justify-between rounded-xl border px-4 text-left ${method ? "border-[#050a0e]" : "border-[#d7e7ef]"}`}
            type="button"
            aria-expanded={open}
            aria-haspopup="listbox"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="min-w-0 flex-1 truncate">
              {method ? methodLabel(method, methods) : (
                <span className="text-[12px] font-medium text-[#050a0e]" style={{ fontVariationSettings: "'opsz' 14" }}>-</span>
              )}
            </span>
            <SelectChevron open={open} />
          </button>

          {open ? (
            <div className="absolute left-0 right-0 top-full z-20 mt-2 flex flex-col gap-2 rounded-[20px] bg-white p-4 shadow-[2px_2px_4px_0px_rgba(0,0,0,0.07),-2px_0px_4px_0px_rgba(0,0,0,0.07)] sm:rounded-[32px] sm:p-6" role="listbox">
              {methods.map((row) => (
                <button key={row.id} className="flex w-full items-center gap-2.5 py-2 text-left" role="option" type="button" onClick={() => pickMethod(row.id)}>
                  <TetherBadgeStack chainCorner={row.chainCorner ?? null} />
                  <span className="flex-1 text-[14px] font-normal" style={{ fontVariationSettings: "'opsz' 14" }}>
                    <span className="text-[#050a0e]">{row.label}</span>
                    {row.subLabel ? <span className="text-[#919191]"> {row.subLabel}</span> : null}
                  </span>
                  {row.recommended ? <span className="rounded-[40px] bg-[rgba(111,178,211,0.2)] px-2 py-0.5 text-[10px] font-normal text-[#6fb2d3]">Recommended</span> : null}
                </button>
              ))}
              {fiatEnabled ? (
                <button className="flex w-full items-center gap-2.5 py-2 text-left" role="option" type="button" onClick={() => pickMethod("fiat")}>
                  <span className="flex size-6 items-center justify-center">
                    <img alt="" aria-hidden className="size-6 max-w-none rotate-180" src={DASHBOARD_ASSETS.wallet.creditCardIcon} />
                  </span>
                  <span className="text-[14px] font-normal text-[#050a0e]" style={{ fontVariationSettings: "'opsz' 14" }}>Credit or Debit Card / Bank Transfer</span>
                </button>
              ) : null}
              {!isLoading && methods.length === 0 && !fiatEnabled ? (
                <p className="py-2 text-[12px] font-medium text-[#919191]">No deposit methods are available for this wallet.</p>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className={`relative flex flex-col items-center gap-4 rounded-lg ${cryptoSelected ? "" : "bg-[#fafcfd] blur-[3px]"}`}>
          {!cryptoSelected ? (
            <div className="pointer-events-none absolute inset-0 z-1 flex items-start justify-center pt-10" aria-hidden>
              <div className="flex size-[46px] items-center justify-center rounded-full bg-white shadow-[0_1px_4px_rgba(12,12,13,0.05)]">
                <span className="text-[20px] opacity-60" aria-hidden>🔒</span>
              </div>
            </div>
          ) : null}
          <div className={`flex flex-col items-center gap-4 ${cryptoSelected ? "" : "select-none"}`}>
            <div className="relative size-[115px] shrink-0">
              {qrUrl ? <img alt="Deposit QR code" className="size-full max-w-none object-contain" height={115} src={qrUrl} width={115} /> : <div className="size-full rounded-lg bg-[#f4f8fb]" />}
            </div>
            <p className="text-center text-[12px] font-medium text-[#919191]" style={{ fontVariationSettings: "'opsz' 14" }}>
              {walletAddress ? "Scan the QR or copy the address below to deposit USDT on Polygon" : "USDT Polygon deposit address is not available yet"}
            </p>
            <div className="flex w-full items-center justify-between gap-3 rounded-2xl bg-[#f4f8fb] px-4 py-3 sm:px-6 sm:py-4">
              <div className="min-w-0 flex-1">
                <p className="break-all text-[14px] font-normal text-[#050a0e]" style={{ fontVariationSettings: "'opsz' 14" }}>{walletAddress || "Deposit address not configured"}</p>
                <p className="mt-1 text-[10px] font-light text-[#6e6e6e]" style={{ fontVariationSettings: "'opsz' 14" }}>USDT Polygon Address</p>
              </div>
              {cryptoSelected && walletAddress ? (
                <button className="shrink-0" type="button" aria-label="Copy wallet address" onClick={onCopy}>
                  <img alt="" aria-hidden className="size-6 max-w-none" src={DASHBOARD_ASSETS.settings.copyIcon} />
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {fiatOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 p-4">
          <div className="flex max-h-[min(720px,90vh)] w-full max-w-[535px] flex-col gap-4 overflow-y-auto rounded-[20px] bg-white p-4 shadow-lg sm:rounded-[32px] sm:p-6" role="dialog" aria-modal="true" aria-labelledby="fiat-modal-title">
            <div className="flex items-center justify-between gap-2">
              <div className="w-6 shrink-0" />
              <h2 id="fiat-modal-title" className="text-[14px] font-normal text-[#050a0e]" style={{ fontVariationSettings: "'opsz' 14" }}>Select local currency</h2>
              <button className="flex size-6 shrink-0 items-center justify-center" type="button" aria-label="Close" onClick={() => setFiatOpen(false)}><span className="text-[18px] leading-none text-[#919191]">×</span></button>
            </div>
            <div className="flex h-10 items-center gap-2 rounded-xl border border-[#d7e7ef] px-4">
              <img alt="" aria-hidden className="size-6 shrink-0 max-w-none opacity-90" height={24} src={DASHBOARD_ASSETS.wallet.searchIcon} width={24} />
              <input className="min-w-0 flex-1 bg-transparent text-[12px] font-medium text-[#050a0e] outline-none placeholder:text-[#919191]" placeholder="Search asset" style={{ fontVariationSettings: "'opsz' 14" }} value={fiatSearch} onChange={(event) => setFiatSearch(event.target.value)} />
            </div>
            <div className="px-3"><p className="text-[12px] font-medium text-[#919191]" style={{ fontVariationSettings: "'opsz' 14" }}>Fiat</p></div>
            <ul className="flex flex-col gap-1">
              {fiatFiltered.map((currency) => (
                <li key={currency.code}>
                  <button className="flex h-10 w-full items-center justify-between rounded-xl px-4 text-left transition-colors hover:bg-[#f4f8fb]" type="button" onClick={() => { setPickedFiat(currency.code); setFiatOpen(false); setBankOpen(true); }}>
                    <span className="flex items-center gap-2">
                      <span className="text-[22px] leading-none">{flagEmoji(currency)}</span>
                      <span className="flex flex-col gap-0.5">
                        <span className="text-[12px] font-medium text-[#050a0e]" style={{ fontVariationSettings: "'opsz' 14" }}>{currency.code}</span>
                        <span className="text-[10px] font-medium text-[#919191]" style={{ fontVariationSettings: "'opsz' 14" }}>{currency.name}</span>
                      </span>
                    </span>
                    <span className="text-[#919191]" aria-hidden>›</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}

      {bankOpen ? (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/25 p-4">
          <div className="w-full max-w-[487px] rounded-[20px] bg-white p-4 shadow-lg" role="dialog" aria-modal="true" aria-labelledby="bank-modal-title">
            <div className="mb-6 flex items-center justify-between">
              <div className="w-6 shrink-0" />
              <h2 id="bank-modal-title" className="text-[14px] font-normal text-[#050a0e]" style={{ fontVariationSettings: "'opsz' 14" }}>Transfer options</h2>
              <button className="flex size-6 shrink-0 items-center justify-center" type="button" aria-label="Close" onClick={() => setBankOpen(false)}><span className="text-[18px] leading-none text-[#919191]">×</span></button>
            </div>
            <div className="flex flex-col gap-4">
              {filteredTransferOptions.map((option, index) => (
                <button key={option.id} className="flex gap-3 rounded-2xl border border-[#919191] bg-[#f4f8fb] p-4 text-left" type="button" onClick={() => useTransferOption(option)}>
                  <span className="flex h-[27px] w-[27px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-white">
                    <img alt="" className="h-4 w-auto max-w-none" src={optionIcon(index)} />
                  </span>
                  <span className="flex min-w-0 flex-col gap-1">
                    <span className="text-[14px] font-normal text-[#050a0e]" style={{ fontVariationSettings: "'opsz' 14" }}>{option.label}</span>
                    {typeof option.minimum === "number" ? (
                      <span className="text-[10px] font-normal text-[#6e6e6e] opacity-[0.74]" style={{ fontVariationSettings: "'opsz' 14" }}>Min. Top up &gt; {option.minimum} {option.currency ?? pickedFiat ?? ""}</span>
                    ) : null}
                    <span className="flex flex-wrap gap-2">
                      {option.feeLabel ? <span className="rounded border border-[#6fb2d3] bg-[rgba(111,178,211,0.1)] px-1 py-0.5 text-[10px] text-[#6fb2d3] opacity-[0.74]">{option.feeLabel}</span> : null}
                      {option.eta ? <span className="rounded border border-[#6fb2d3] bg-[rgba(111,178,211,0.1)] px-1 py-0.5 text-[10px] text-[#6fb2d3] opacity-[0.74]">{option.eta}</span> : null}
                    </span>
                  </span>
                </button>
              ))}
              {filteredTransferOptions.length === 0 ? <p className="py-3 text-center text-[12px] font-medium text-[#919191]">No transfer option is available for this currency.</p> : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
