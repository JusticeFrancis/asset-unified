"use client";

import { useMemo, useState } from "react";

import type { ConstructionCalculatorTabContent } from "@/app/dashboard/construction/data/construction-properties";

type ConstructionCalculatorTabPanelProps = {
  calculator: ConstructionCalculatorTabContent;
};

function formatUsd(n: number) {
  return `$ ${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export function ConstructionCalculatorTabPanel({
  calculator,
}: ConstructionCalculatorTabPanelProps) {
  const { min, max, ticks, defaultAmount, youWillHaveMultiplier, breakdown } =
    calculator;
  const [amount, setAmount] = useState(defaultAmount);

  const youWillHave = useMemo(
    () => Math.round(amount * youWillHaveMultiplier),
    [amount, youWillHaveMultiplier],
  );

  const fillPercent = useMemo(
    () => ((amount - min) / (max - min)) * 100,
    [amount, min, max],
  );

  return (
    <div className="rounded-[16px] bg-white px-4 py-6 shadow-[0_1px_4px_rgba(12,12,13,0.05)] sm:px-6 sm:py-12 md:px-[100px]">
      <h3 className="mb-6 text-[19px] font-medium text-[#050a0e]">
        Investment Calculator
      </h3>

      <div className="flex flex-col gap-1">
        <p className="text-[12px] font-light text-[#050a0e]">
          Input or slide to select
        </p>
        <div className="flex h-10 items-center justify-between gap-3 rounded-[12px] border border-[#edf4f8] px-4 text-[16px] font-medium">
          <div className="flex min-w-0 flex-1 items-center gap-1">
            <span className="shrink-0 text-[#050a0e]">$</span>
            <input
              aria-label="Investment amount"
              className="min-w-0 flex-1 bg-transparent text-[#050a0e] outline-none"
              max={max}
              min={min}
              onChange={(e) => {
                const v = e.target.value === "" ? min : Number(e.target.value);
                if (Number.isNaN(v)) return;
                setAmount(Math.min(max, Math.max(min, v)));
              }}
              type="number"
              value={amount}
            />
          </div>
          <button
            className="shrink-0 text-[16px] font-medium text-[#5c60cc]"
            onClick={() => setAmount(max)}
            type="button"
          >
            Max
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-2">
        <div className="relative h-10 w-full">
          <div className="absolute left-2 right-2 top-1/2 h-[6px] -translate-y-1/2 rounded-[40px] bg-[#f5f7f8]" />
          <div
            aria-hidden
            className="absolute left-2 top-1/2 h-[6px] -translate-y-1/2 rounded-[40px] bg-[#5c60cc]"
            style={{
              width: `calc((100% - 16px) * ${fillPercent / 100})`,
            }}
          />
          <input
            aria-label="Adjust investment amount"
            className="absolute inset-0 z-1 h-full w-full cursor-pointer opacity-0"
            max={max}
            min={min}
            onChange={(e) => setAmount(Number(e.target.value))}
            type="range"
            value={amount}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute top-1/2 z-2 size-[15px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#5c60cc] bg-[#fafcfd]"
            style={{
              left: `calc(8px + (100% - 16px) * ${fillPercent / 100})`,
            }}
          />
        </div>
        <div className="flex justify-between gap-1 text-[14px] font-light text-[#050a0e]">
          {ticks.map((t) => (
            <span className="min-w-0 shrink text-center" key={t}>
              {formatUsd(t)}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center gap-1">
        <p className="text-[14px] font-light text-[#050a0e]">You will have</p>
        <div className="w-full rounded-[12px] bg-[rgba(92,96,204,0.15)] p-4 text-center">
          <p className="text-[24px] font-medium text-[#050a0e]">
            {formatUsd(youWillHave)}
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col">
        {breakdown.map((row) => (
          <div
            className="flex items-center justify-between gap-4 py-2 text-[16px]"
            key={row.label}
          >
            <span className="font-normal text-[#919191]">{row.label}</span>
            <span
              className={
                row.valueMedium
                  ? "font-medium text-[#050a0e]"
                  : "font-normal text-[#050a0e]"
              }
            >
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
