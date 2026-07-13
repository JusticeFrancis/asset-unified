import Link from "next/link";

import { DASHBOARD_ASSETS } from "@/app/dashboard/components/dashboard-assets";

export function WalletBackToWalletLink({ href }: { href?: string }) {
  return (
    <Link
      className="flex shrink-0 items-center gap-1 text-[#050a0e]"
      href={href ?? "/dashboard/wallet"}
    >
      <span className="flex size-6 items-center justify-center" aria-hidden>
        <img
          alt=""
          className="size-6 max-w-none rotate-180"
          height={24}
          src={DASHBOARD_ASSETS.wallet.chevronRight}
          width={24}
        />
      </span>
      <span
        className="text-[12px] font-normal"
        style={{ fontVariationSettings: "'opsz' 14" }}
      >
        Back to Wallet
      </span>
    </Link>
  );
}

export function WalletFormCardHeader({
  backHref,
  title,
  rightSpacer = true,
}: {
  backHref?: string;
  title: string;
  /** Mirror Figma layout: invisible duplicate for centering */
  rightSpacer?: boolean;
}) {
  return (
    <div className="flex w-full items-center justify-between">
      <WalletBackToWalletLink href={backHref} />
      <p
        className="text-[14px] font-normal text-[#050a0e]"
        style={{ fontVariationSettings: "'opsz' 14" }}
      >
        {title}
      </p>
      {rightSpacer ? (
        <div className="invisible flex items-center gap-1">
          <WalletBackToWalletLink href={backHref} />
        </div>
      ) : (
        <div className="w-6 shrink-0" />
      )}
    </div>
  );
}

export function TetherBadgeStack({
  size = 24,
  chainCorner,
  className = "",
}: {
  size?: 24 | 32;
  chainCorner: "polygon" | "tron" | null;
  className?: string;
}) {
  const box = size === 32 ? "size-8 rounded-[8px]" : "size-6 rounded-[8px]";
  const corner = "absolute bottom-0 right-0 size-[10px] rounded-[8px]";
  return (
    <div className={`relative shrink-0 ${className}`}>
      <div
        className={`flex items-center justify-center ${box} bg-[#50af95]`}
        aria-hidden
      >
        <img
          alt=""
          className="h-[58%] w-[58%] max-w-none object-contain"
          src={DASHBOARD_ASSETS.wallet.tetherSymbol}
        />
      </div>
      {chainCorner === "polygon" ? (
        <div
          className={`${corner} flex items-center justify-center bg-[#8247e5]`}
          aria-hidden
        >
          <img
            alt=""
            className="h-[62%] w-[62%] max-w-none object-contain"
            src={DASHBOARD_ASSETS.wallet.polygonSymbol}
          />
        </div>
      ) : null}
      {chainCorner === "tron" ? (
        <div
          className={`${corner} flex items-center justify-center bg-[#ef0027]`}
          aria-hidden
        >
          <img
            alt=""
            className="h-[55%] w-[55%] max-w-none object-contain"
            src={DASHBOARD_ASSETS.wallet.tronSymbol}
          />
        </div>
      ) : null}
    </div>
  );
}

export function PolygonOnlyBadge({ size = 24 }: { size?: 24 | 32 }) {
  const box = size === 32 ? "size-8 rounded-[8px]" : "size-6 rounded-[8px]";
  return (
    <div
      className={`flex shrink-0 items-center justify-center ${box} bg-[#8247e5]`}
      aria-hidden
    >
      <img
        alt=""
        className="h-[58%] w-[58%] max-w-none object-contain"
        src={DASHBOARD_ASSETS.wallet.polygonSymbol}
      />
    </div>
  );
}

export function SelectChevron({ open }: { open: boolean }) {
  return (
    <span
      className="flex size-6 items-center justify-center transition-transform"
      aria-hidden
    >
      {open ? (
        <img
          alt=""
          className="size-6 max-w-none"
          height={24}
          src={DASHBOARD_ASSETS.wallet.chevronUp}
          width={24}
        />
      ) : (
        <img
          alt=""
          className="size-6 max-w-none rotate-90"
          height={24}
          src={DASHBOARD_ASSETS.wallet.chevronRight}
          width={24}
        />
      )}
    </span>
  );
}
