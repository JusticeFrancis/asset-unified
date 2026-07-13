"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { DASHBOARD_ASSETS } from "@/app/dashboard/components/dashboard-assets";

export type AddCouponModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm?: (code: string) => void;
};

export function AddCouponModal({
  open,
  onOpenChange,
  onConfirm,
}: AddCouponModalProps) {
  const titleId = useId();
  const fieldId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);
  const [code, setCode] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const close = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  useEffect(() => {
    if (open) {
      setCode("");
    }
  }, [open]);

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
      inputRef.current?.focus();
    }, 0);
    return () => window.clearTimeout(t);
  }, [open]);

  const handleConfirm = useCallback(() => {
    const trimmed = code.trim();
    if (!trimmed) return;
    onConfirm?.(trimmed);
    close();
  }, [code, onConfirm, close]);

  if (!mounted || !open) return null;

  const content = (
    <div
      aria-labelledby={titleId}
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
        className="relative z-10 flex w-full max-w-[434px] flex-col gap-6 rounded-[20px] bg-white px-6 pt-12 pb-6 shadow-[0_1px_4px_rgba(12,12,13,0.05)] outline-none"
        ref={panelRef}
        tabIndex={-1}
      >
        <div className="absolute right-6 top-6 flex justify-end">
          <button
            aria-label="Close"
            className="flex size-6 items-center justify-center rounded-full transition-opacity hover:opacity-80"
            type="button"
            onClick={close}
          >
            <img
              alt=""
              aria-hidden
              className="size-6"
              src={DASHBOARD_ASSETS.modal.close}
            />
          </button>
        </div>

        <h2
          className="px-3 text-center text-[16px] font-medium leading-normal text-[#050a0e]"
          id={titleId}
          style={{ fontVariationSettings: "'opsz' 14" }}
        >
          Add a new coupon code
        </h2>

        <div className="flex w-full flex-col gap-1">
          <div className="px-3">
            <label
              className="text-[12px] font-medium text-[#919191]"
              htmlFor={fieldId}
              style={{ fontVariationSettings: "'opsz' 14" }}
            >
              Coupon Code
            </label>
          </div>
          <input
            className="h-10 w-full rounded-[12px] border border-[#d7e7ef] bg-white px-4 text-[12px] font-medium text-[#050a0e] outline-none placeholder:text-[#919191] focus-visible:border-[#5c60cc] focus-visible:ring-2 focus-visible:ring-[#5c60cc]/20"
            id={fieldId}
            placeholder="KS93J02"
            ref={inputRef}
            style={{ fontVariationSettings: "'opsz' 14" }}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleConfirm();
              }
            }}
          />
        </div>

        <div className="flex w-full gap-2">
          <button
            className="flex h-10 min-h-10 flex-1 cursor-pointer items-center justify-center rounded-[12px] border border-[#cfe2ec] bg-white px-4 text-[12px] font-medium leading-none text-[#050a0e] transition-opacity hover:opacity-95 active:opacity-90"
            style={{ fontVariationSettings: "'opsz' 14" }}
            type="button"
            onClick={close}
          >
            Cancel
          </button>
          <button
            className="flex h-10 min-h-10 flex-1 cursor-pointer items-center justify-center rounded-[12px] bg-[#5c60cc] px-4 text-[12px] font-medium leading-none text-[#f5f7f8] transition-opacity hover:opacity-95 active:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!code.trim()}
            style={{ fontVariationSettings: "'opsz' 14" }}
            type="button"
            onClick={handleConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
