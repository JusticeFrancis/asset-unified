"use client";

import {
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

import { DASHBOARD_ASSETS } from "@/app/dashboard/components/dashboard-assets";

export type DashboardModalAction = {
  label: string;
  variant: "primary" | "secondary";
  onClick?: () => void;
};

export type DashboardModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: ReactNode;
  callout?: { title: string; body: string };
  actions: DashboardModalAction[];
  icon?: ReactNode;
  /** When false, the built-in close control is hidden (rare). */
  showClose?: boolean;
};

export function DashboardModalWalletIcon() {
  return (
    <div className="relative size-[71px] shrink-0">
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
          src={DASHBOARD_ASSETS.modal.wallet}
        />
      </div>
    </div>
  );
}

export function DashboardModalProcessingIcon() {
  return (
    <div className="relative size-[71px] shrink-0">
      <img
        alt=""
        aria-hidden
        className="absolute inset-0 size-full max-w-none"
        src={DASHBOARD_ASSETS.modal.processing}
      />
    </div>
  );
}

export function DashboardModalErrorIcon() {
  return (
    <div className="relative size-[71px] shrink-0">
      <img
        alt=""
        aria-hidden
        className="absolute inset-0 size-full max-w-none"
        src={DASHBOARD_ASSETS.modal.errorCircle}
      />
      <div className="absolute left-1/2 top-1/2 size-[28px] -translate-x-1/2 -translate-y-1/2">
        <img
          alt=""
          aria-hidden
          className="block size-full max-w-none"
          src={DASHBOARD_ASSETS.modal.errorWallet}
        />
        <div className="absolute -bottom-px -right-px size-3.5 overflow-hidden">
          <img
            alt=""
            aria-hidden
            className="block size-full max-w-none"
            src={DASHBOARD_ASSETS.modal.errorX}
          />
        </div>
      </div>
    </div>
  );
}

export function DashboardModal({
  open,
  onOpenChange,
  title,
  description,
  callout,
  actions,
  icon,
  showClose = true,
}: DashboardModalProps) {
  const titleId = useId();
  const descriptionId = useId();
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

  const content = (
    <div
      aria-describedby={description ? descriptionId : undefined}
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
        className="relative z-10 w-full max-w-[434px] rounded-[20px] bg-white px-6 pt-12 pb-6 shadow-[0_1px_4px_rgba(12,12,13,0.05)] outline-none"
        ref={panelRef}
        tabIndex={-1}
      >
        {showClose ? (
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
        ) : null}

        <div className="flex flex-col items-center gap-6">
          {icon}

          <div className="flex w-full flex-col items-center gap-1 px-3 text-center">
            <h2
              className="text-[16px] font-medium leading-normal text-[#050a0e]"
              id={titleId}
            >
              {title}
            </h2>
            {description ? (
              <div
                className="text-[12px] font-medium leading-normal text-[#919191]"
                id={descriptionId}
              >
                {description}
              </div>
            ) : null}
          </div>

          {callout ? (
            <div className="w-full rounded-2xl border border-[#f4f8fb] bg-[#fafcfd] px-4 py-2">
              <div className="flex flex-col gap-1 text-left text-[12px] leading-normal">
                <p className="font-medium text-[#050a0e]">{callout.title}</p>
                <p className="font-light text-[#6e6e6e]">{callout.body}</p>
              </div>
            </div>
          ) : null}

          <div className="flex w-full gap-2">
            {actions.map((action) => {
              const base =
                "flex h-10 min-h-10 flex-1 cursor-pointer items-center justify-center rounded-[12px] px-4 text-[12px] font-medium leading-none transition-opacity hover:opacity-95 active:opacity-90";
              const className =
                action.variant === "primary"
                  ? `${base} bg-[#5c60cc] text-[#f5f7f8]`
                  : `${base} border border-[#cfe2ec] bg-white text-[#050a0e]`;
              return (
                <button
                  className={className}
                  key={action.label}
                  type="button"
                  onClick={() => {
                    action.onClick?.();
                  }}
                >
                  {action.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
