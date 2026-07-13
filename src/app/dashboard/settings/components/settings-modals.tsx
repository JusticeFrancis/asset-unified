"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

import { DASHBOARD_ASSETS } from "@/app/dashboard/components/dashboard-assets";

function ModalChrome({
  open,
  onOpenChange,
  children,
  labelledBy,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  labelledBy?: string;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const close = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => {
      panelRef.current?.focus();
    }, 0);
    return () => window.clearTimeout(t);
  }, [open]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      aria-labelledby={labelledBy}
      aria-modal="true"
      className="fixed inset-0 z-100 flex items-center justify-center p-4"
      role="dialog"
    >
      <button
        aria-label="Close dialog"
        className="absolute inset-0 backdrop-blur-[7.5px] bg-[rgba(5,10,14,0.4)]"
        type="button"
        onClick={close}
      />
      <div
        className="relative z-10 w-full max-w-[434px] rounded-[20px] bg-white shadow-[0_1px_4px_rgba(12,12,13,0.05)] outline-none"
        ref={panelRef}
        tabIndex={-1}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}

function ModalKeyIcon() {
  return (
    <div className="relative size-[71.181px] shrink-0">
      <img
        alt=""
        aria-hidden
        className="absolute inset-0 size-full max-w-none"
        src={DASHBOARD_ASSETS.modal.walletCircle}
      />
      <div className="absolute left-1/2 top-1/2 size-8 -translate-x-1/2 -translate-y-1/2 overflow-hidden">
        <img
          alt=""
          aria-hidden
          className="block size-full max-w-none"
          src={DASHBOARD_ASSETS.settings.modalKeyIcon}
        />
      </div>
    </div>
  );
}

function ModalDeleteIcon() {
  return (
    <div className="relative size-[71.181px] shrink-0">
      <img
        alt=""
        aria-hidden
        className="absolute inset-0 size-full max-w-none"
        src={DASHBOARD_ASSETS.modal.walletCircle}
      />
      <div className="absolute left-1/2 top-1/2 size-8 -translate-x-1/2 -translate-y-1/2 overflow-hidden">
        <img
          alt=""
          aria-hidden
          className="block size-full max-w-none"
          src={DASHBOARD_ASSETS.settings.modalDeleteFaceIcon}
        />
      </div>
    </div>
  );
}

export type RevealPrivateKeyModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContinue: () => void;
  walletAddress?: string | null;
};

export function RevealPrivateKeyTermsModal({
  open,
  onOpenChange,
  onContinue,
  walletAddress,
}: RevealPrivateKeyModalProps) {
  const titleId = useId();
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeResponsibility, setAgreeResponsibility] = useState(false);

  useEffect(() => {
    if (open) {
      setAgreeTerms(false);
      setAgreeResponsibility(false);
    }
  }, [open]);

  const canReveal = agreeTerms && agreeResponsibility;

  return (
    <ModalChrome labelledBy={titleId} open={open} onOpenChange={onOpenChange}>
      <div className="flex flex-col items-center gap-6 px-6 pb-6 pt-12">
        <div className="absolute right-6 top-6 flex justify-end">
          <button
            aria-label="Close"
            className="flex size-6 items-center justify-center rounded-full transition-opacity hover:opacity-80"
            type="button"
            onClick={() => onOpenChange(false)}
          >
            <img
              alt=""
              aria-hidden
              className="size-6"
              src={DASHBOARD_ASSETS.modal.close}
            />
          </button>
        </div>

        <ModalKeyIcon />

        <div className="flex w-full flex-col items-center gap-1 px-3 text-center">
          <h2
            className="text-[16px] font-medium leading-normal text-[#050a0e]"
            id={titleId}
            style={{ fontVariationSettings: "'opsz' 14" }}
          >
            <span className="block whitespace-pre-wrap">
              You&apos;re about to reveal{" "}
            </span>
            <span className="block">a sensitive information</span>
          </h2>
          <p
            className="text-[12px] font-normal leading-normal text-[#919191]"
            style={{ fontVariationSettings: "'opsz' 14" }}
          >
            By revealing the private key for{" "}
            <span className="break-all">{walletAddress || "your connected wallet"}</span> you agree to
            the following:
          </p>
        </div>

        <div className="flex w-full flex-col gap-6">
          <label className="flex cursor-pointer gap-3 text-left">
            <input
              checked={agreeTerms}
              className="mt-0.5 size-4 shrink-0 cursor-pointer rounded-[4px] border border-[#cfe2ec] accent-[#5c60cc]"
              type="checkbox"
              onChange={(e) => setAgreeTerms(e.target.checked)}
            />
            <span
              className="text-[12px] font-normal leading-normal text-[#919191]"
              style={{ fontVariationSettings: "'opsz' 14" }}
            >
              You have read and agreed to our Terms of Service, Including the
              risks related to owning your private key disclosed in the Terms of
              Service.
            </span>
          </label>
          <label className="flex cursor-pointer gap-3 text-left">
            <input
              checked={agreeResponsibility}
              className="mt-0.5 size-4 shrink-0 cursor-pointer rounded-[4px] border border-[#cfe2ec] accent-[#5c60cc]"
              type="checkbox"
              onChange={(e) => setAgreeResponsibility(e.target.checked)}
            />
            <span
              className="text-[12px] font-normal leading-normal text-[#919191]"
              style={{ fontVariationSettings: "'opsz' 14" }}
            >
              You shall be responsible for the management and security of this
              key and any assets associated with this key, and Asset chain
              can&apos;t help in the recovery of keys.
            </span>
          </label>
        </div>

        <button
          className="flex h-10 w-full min-h-10 cursor-pointer items-center justify-center rounded-[12px] px-3 text-[12px] font-medium text-[#f5f7f8] transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!canReveal}
          style={{
            fontVariationSettings: "'opsz' 14",
            backgroundColor: canReveal ? "#5c60cc" : "rgba(92, 96, 204, 0.45)",
          }}
          type="button"
          onClick={() => {
            if (!canReveal) return;
            onContinue();
          }}
        >
          Reveal Private Key
        </button>
      </div>
    </ModalChrome>
  );
}

export type RevealPrivateKeyDisplayModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  privateKey: string;
};

export function RevealPrivateKeyDisplayModal({
  open,
  onOpenChange,
  privateKey,
}: RevealPrivateKeyDisplayModalProps) {
  const titleId = useId();
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (open) setRevealed(false);
  }, [open]);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(privateKey);
    } catch {
      /* ignore */
    }
  }, [privateKey]);

  return (
    <ModalChrome labelledBy={titleId} open={open} onOpenChange={onOpenChange}>
      <div className="flex flex-col items-center gap-6 px-6 pb-6 pt-12">
        <div className="absolute right-6 top-6 flex justify-end">
          <button
            aria-label="Close"
            className="flex size-6 items-center justify-center rounded-full transition-opacity hover:opacity-80"
            type="button"
            onClick={() => onOpenChange(false)}
          >
            <img
              alt=""
              aria-hidden
              className="size-6"
              src={DASHBOARD_ASSETS.modal.close}
            />
          </button>
        </div>

        <ModalKeyIcon />

        <div className="flex w-full flex-col items-center gap-1 px-3 text-center">
          <h2
            className="text-[16px] font-medium leading-normal text-[#050a0e]"
            id={titleId}
            style={{ fontVariationSettings: "'opsz' 14" }}
          >
            Wallet Private Key
          </h2>
          <p
            className="text-[12px] font-normal leading-normal text-[#919191]"
            style={{ fontVariationSettings: "'opsz' 14" }}
          >
            Store this ina secure place that only can access and do not share it
            with anyone.
          </p>
        </div>

        <div className="w-full rounded-lg bg-[#fafcfd]">
          <div className="rounded-2xl bg-[#f4f8fb] px-6 py-4">
            <p
              className={`break-all text-left text-[14px] font-normal leading-normal text-[#050a0e] transition-[filter] duration-200 ${
                revealed ? "" : "blur-[6px] select-none"
              }`}
              style={{ fontVariationSettings: "'opsz' 14" }}
            >
              {privateKey || "Private key unavailable"}
            </p>
          </div>
        </div>

        <div className="flex w-full gap-2">
          <button
            className="flex h-10 min-h-10 flex-1 cursor-pointer items-center justify-center gap-1 rounded-[12px] border border-[#cfe2ec] bg-white px-4 text-[12px] font-medium text-[#050a0e] transition-opacity hover:opacity-95"
            style={{ fontVariationSettings: "'opsz' 14" }}
            type="button"
            onClick={() => setRevealed((r) => !r)}
          >
            <img
              alt=""
              aria-hidden
              className="size-5 max-w-none"
              src={DASHBOARD_ASSETS.settings.revealEyeIcon}
            />
            Reveal
          </button>
          <button
            className="flex h-10 min-h-10 flex-1 cursor-pointer items-center justify-center gap-1 rounded-[12px] bg-[#5c60cc] px-3 text-[12px] font-medium text-[#f5f7f8] transition-opacity hover:opacity-95"
            style={{ fontVariationSettings: "'opsz' 14" }}
            type="button"
            onClick={copy}
          >
            <img
              alt=""
              aria-hidden
              className="size-5 max-w-none"
              src={DASHBOARD_ASSETS.settings.copyIcon}
            />
            Copy
          </button>
        </div>
      </div>
    </ModalChrome>
  );
}

const DELETE_CONFIRM_PHRASE = "Delete my Account";

export type DeleteAccountModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmDelete?: () => void;
};

export function DeleteAccountModal({
  open,
  onOpenChange,
  onConfirmDelete,
}: DeleteAccountModalProps) {
  const titleId = useId();
  const fieldId = useId();
  const [phrase, setPhrase] = useState("");

  useEffect(() => {
    if (open) setPhrase("");
  }, [open]);

  const canSubmit = phrase === DELETE_CONFIRM_PHRASE;

  return (
    <ModalChrome labelledBy={titleId} open={open} onOpenChange={onOpenChange}>
      <div className="flex flex-col items-center gap-6 px-6 pb-6 pt-12">
        <div className="absolute right-6 top-6 flex justify-end">
          <button
            aria-label="Close"
            className="flex size-6 items-center justify-center rounded-full transition-opacity hover:opacity-80"
            type="button"
            onClick={() => onOpenChange(false)}
          >
            <img
              alt=""
              aria-hidden
              className="size-6"
              src={DASHBOARD_ASSETS.modal.close}
            />
          </button>
        </div>

        <ModalDeleteIcon />

        <div className="flex w-full flex-col items-center gap-1 px-3 text-center">
          <h2
            className="text-[16px] font-medium leading-normal text-[#050a0e]"
            id={titleId}
            style={{ fontVariationSettings: "'opsz' 14" }}
          >
            Are you really Leaving?
          </h2>
          <p
            className="text-[12px] font-normal leading-normal text-[#919191]"
            style={{ fontVariationSettings: "'opsz' 14" }}
          >
            We don&apos;t leaving you&apos;re leaving! Before you delete your
            account, can re-confirm your decision below.
          </p>
        </div>

        <div className="flex w-full flex-col gap-1">
          <label
            className="text-[12px] font-medium text-[#050a0e]"
            htmlFor={fieldId}
            style={{ fontVariationSettings: "'opsz' 14" }}
          >
            Type &quot;Delete my Account&quot;
          </label>
          <input
            className="h-10 w-full rounded-[12px] border border-[#cfe2ec] bg-white px-4 text-[12px] font-medium text-[#050a0e] outline-none placeholder:text-[#919191] focus-visible:border-[#5c60cc] focus-visible:ring-2 focus-visible:ring-[#5c60cc]/20"
            id={fieldId}
            placeholder="Delete my Account"
            style={{ fontVariationSettings: "'opsz' 14" }}
            value={phrase}
            onChange={(e) => setPhrase(e.target.value)}
          />
        </div>

        <div className="flex w-full gap-2">
          <button
            className="flex h-10 min-h-10 flex-1 cursor-pointer items-center justify-center rounded-[12px] border border-[#cfe2ec] bg-white px-4 text-[12px] font-medium text-[#050a0e] transition-opacity hover:opacity-95"
            style={{ fontVariationSettings: "'opsz' 14" }}
            type="button"
            onClick={() => onOpenChange(false)}
          >
            No, Cancel
          </button>
          <button
            className="flex h-10 min-h-10 flex-1 cursor-pointer items-center justify-center rounded-[12px] bg-[#b3261e] px-3 text-[12px] font-medium text-[#f5f7f8] transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!canSubmit}
            style={{ fontVariationSettings: "'opsz' 14" }}
            type="button"
            onClick={() => {
              if (!canSubmit) return;
              onConfirmDelete?.();
              onOpenChange(false);
            }}
          >
            Submit, Delete Account
          </button>
        </div>
      </div>
    </ModalChrome>
  );
}
