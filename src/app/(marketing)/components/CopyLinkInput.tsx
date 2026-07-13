"use client";

import { useState, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

type CopyLinkInputProps = {
  link: string;
  /** Visible label inside the trailing button. */
  buttonLabel?: string;
  /** Optional icon before the button label (24px). */
  buttonIcon?: ReactNode;
  /** Extra callback fired after successful copy. */
  onCopy?: () => void;
  /**
   * - `default` — light pill on dark/brand backgrounds (white/transparent text input).
   * - `inverse` — dark text input on light backgrounds.
   */
  tone?: "default" | "inverse";
  className?: string;
};

/**
 * Mobile-first link-with-copy control. Stacks vertically below sm so the URL
 * never gets truncated in a tight pill, then becomes a single inline pill at
 * sm+. The link itself uses `truncate` so very long URLs collapse cleanly.
 */
export function CopyLinkInput({
  link,
  buttonLabel = "Copy link",
  buttonIcon,
  onCopy,
  tone = "default",
  className,
}: CopyLinkInputProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      onCopy?.();
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard write can reject in unsecured contexts; fail silently.
    }
  };

  const isInverse = tone === "inverse";

  return (
    <div
      className={cn(
        "flex w-full max-w-full flex-col overflow-hidden rounded-xl sm:max-w-[520px] sm:flex-row",
        className,
      )}
    >
      <input
        type="text"
        readOnly
        value={link}
        aria-label="Referral link"
        className={cn(
          "min-w-0 flex-1 truncate bg-white/20 px-4 py-3 text-sm font-medium text-white outline-none placeholder:text-white/50 sm:text-base",
          isInverse && "bg-surface text-foreground placeholder:text-muted",
        )}
      />
      <button
        type="button"
        onClick={handleCopy}
        className={cn(
          "inline-flex min-h-tap items-center justify-center gap-2 px-6 py-3 text-sm font-medium transition sm:text-base",
          isInverse
            ? "bg-brand text-white hover:opacity-95"
            : "bg-background text-brand hover:bg-white",
        )}
      >
        {copied ? (
          <Check className="size-5" />
        ) : (
          buttonIcon ?? <Copy className="size-5" />
        )}
        <span>{copied ? "Copied" : buttonLabel}</span>
      </button>
    </div>
  );
}
