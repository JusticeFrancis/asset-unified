"use client";

import { useState, type ReactNode } from "react";
import { FaqChevronIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export type FaqItem = {
  question: ReactNode;
  answer: ReactNode;
};

type FaqListProps = {
  items: FaqItem[];
  /** Unique id prefix used for `aria-controls` (avoid clashes when multiple
   *  lists are on the same page). */
  idPrefix?: string;
  /** Index that should start expanded. Pass `null` for all collapsed. */
  defaultOpenIndex?: number | null;
  /** Width cap for both questions and answers. */
  maxWidthClassName?: string;
  className?: string;
};

/**
 * Mobile-first accordion FAQ list. Buttons are `min-h-tap` (44 px) so the
 * chevron is reliably tappable on phones. Question type ramps from `text-base`
 * to `text-body-lg`. Single component for every marketing FAQ on the site.
 */
export function FaqList({
  items,
  idPrefix = "faq",
  defaultOpenIndex = 0,
  maxWidthClassName = "max-w-[875px]",
  className,
}: FaqListProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);

  return (
    <div
      className={cn(
        "mx-auto mt-10 w-full space-y-4 sm:mt-12 sm:space-y-6",
        maxWidthClassName,
        className,
      )}
    >
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const answerId = `${idPrefix}-answer-${index}`;
        return (
          <div key={index} className="border-b border-border pb-4 sm:pb-6">
            <button
              type="button"
              className="flex min-h-tap w-full items-center justify-between gap-4 py-2 text-left text-base text-foreground sm:text-body-lg"
              aria-expanded={isOpen}
              aria-controls={answerId}
              onClick={() =>
                setOpenIndex((current) => (current === index ? null : index))
              }
            >
              <span>{item.question}</span>
              <FaqChevronIcon
                aria-hidden
                className={cn(
                  "size-4 shrink-0 text-brand transition-transform duration-200 ease-out",
                  isOpen ? "rotate-180" : undefined,
                )}
              />
            </button>
            <div
              id={answerId}
              className={cn(
                "grid transition-all duration-300 ease-out",
                isOpen
                  ? "mt-3 grid-rows-[1fr] opacity-100"
                  : "mt-0 grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden text-sm leading-normal text-muted sm:text-base">
                {typeof item.answer === "string" ? (
                  <p className="max-w-[700px]">{item.answer}</p>
                ) : (
                  item.answer
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
