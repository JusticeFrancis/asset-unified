"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { compareRows } from "./data";
import { Container, SectionHeading } from "../components/shared";
import { cn } from "@/lib/utils";

const CHART_BLUE = "#6FB2D3";
const CHART_PURPLE = "#5C60CC";
const AXIS_MUTED = "#919191";

const PERIOD_STEPS = [0, 5, 10, 20, 30, 40, 50] as const;
const NUM_BARS = 14;

type Frequency = "daily" | "weekly" | "monthly" | "annually";

const FREQUENCIES: { id: Frequency; label: string }[] = [
  { id: "daily", label: "Daily" },
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
  { id: "annually", label: "Annually" },
];

function periodsPerYear(freq: Frequency): number {
  switch (freq) {
    case "daily":
      return 365;
    case "weekly":
      return 52;
    case "monthly":
      return 12;
    case "annually":
      return 1;
    default:
      return 12;
  }
}

function futureValueAtYears(
  principal: number,
  payment: number,
  annualRatePct: number,
  years: number,
  freq: Frequency,
): { fv: number; contributed: number } {
  if (years <= 0) {
    return { fv: principal, contributed: principal };
  }
  const nPerYear = periodsPerYear(freq);
  const n = Math.max(0, Math.round(years * nPerYear));
  const r = annualRatePct / 100 / nPerYear;
  const fvLump = principal * Math.pow(1 + r, n);
  const fvAnnuity =
    r === 0 ? payment * n : payment * ((Math.pow(1 + r, n) - 1) / r);
  const fv = fvLump + fvAnnuity;
  const contributed = principal + payment * n;
  return { fv, contributed };
}

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

function formatAxisTick(v: number): string {
  if (v >= 1_000_000) return "1M";
  if (v >= 1000) return `${v / 1000}K`;
  return String(v);
}

function parseMoney(raw: string): number {
  const n = Number.parseFloat(raw.replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

type SuffixFieldProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  suffix: string;
  className?: string;
};

function SuffixField({
  label,
  value,
  onChange,
  suffix,
  className,
}: SuffixFieldProps) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-1", className)}>
      <span className="text-sm font-light text-foreground">{label}</span>
      <div className="flex min-h-tap items-center justify-between gap-2 rounded-xl border border-border bg-[#f5f7f8] px-4 text-sm font-medium">
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-w-0 flex-1 bg-transparent py-2 text-foreground outline-none"
          aria-label={label}
        />
        <span className="shrink-0 text-brand">{suffix}</span>
      </div>
    </div>
  );
}

export function ComparisonCalculatorSection() {
  const [initialCapital, setInitialCapital] = useState("6700");
  const [periodicContribution, setPeriodicContribution] = useState("560");
  const [apr, setApr] = useState("12");
  const [frequency, setFrequency] = useState<Frequency>("daily");
  const [periodStepIndex, setPeriodStepIndex] = useState(3);

  const principalN = parseMoney(initialCapital);
  const paymentN = parseMoney(periodicContribution);
  const aprN = parseMoney(apr);
  const years = PERIOD_STEPS[periodStepIndex];

  const summary = useMemo(
    () => futureValueAtYears(principalN, paymentN, aprN, years, frequency),
    [principalN, paymentN, aprN, years, frequency],
  );

  const chartData = useMemo(() => {
    const maxYear = Math.max(years, 1);
    return Array.from({ length: NUM_BARS }, (_, i) => {
      const t = (i / (NUM_BARS - 1)) * maxYear;
      const { fv, contributed } = futureValueAtYears(
        principalN,
        paymentN,
        aprN,
        t,
        frequency,
      );
      const profit = Math.max(0, fv - contributed);
      return {
        i: String(i),
        principal: contributed,
        profit,
      };
    });
  }, [principalN, paymentN, aprN, years, frequency]);

  const yMax = 1_000_000;

  return (
    <section id="comparison" className="py-12 sm:py-16 md:py-24">
      <Container>
        <SectionHeading
          eyebrow="Why Us?"
          title={
            <>
              What Are You Actually <span className="text-brand">Choosing</span>{" "}
              Between?
            </>
          }
          description="Two ways to invest in real estate. Same asset class. Completely different experience."
        />

        {/* Mobile / tablet: stacked cards. The comparison table needs ~900px
            of horizontal room — on phones we render each row as a card with
            the feature name on top and the two value columns below. */}
        <div className="mt-10 space-y-3 lg:hidden">
          {compareRows.map((row) => (
            <article
              key={row.feature}
              className="overflow-hidden rounded-[20px] border border-border bg-white"
            >
              <p className="bg-surface px-4 py-3 text-sm font-semibold text-[#2C373F] sm:text-base">
                {row.feature}
              </p>
              <dl className="divide-y divide-border">
                <div className="flex items-start justify-between gap-3 px-4 py-3 text-sm">
                  <dt className="font-medium text-brand">Asset Chain</dt>
                  <dd className="text-right text-[#2C373F]">{row.assetUnion}</dd>
                </div>
                <div className="flex items-start justify-between gap-3 px-4 py-3 text-sm">
                  <dt className="font-medium text-muted">Traditional</dt>
                  <dd className="text-right text-[#2C373F]">{row.traditional}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>

        {/* Desktop: 3-column grid. No more `min-w-[900px]` overflow — at lg+
            (1024px) the columns fit cleanly with horizontal padding. */}
        <div className="mt-10 hidden overflow-hidden rounded-[20px] lg:block">
          <div className="grid grid-cols-3 text-base">
            <p className="flex min-h-[88px] items-center border-b border-border bg-background px-6 text-transparent xl:px-8 xl:text-[20px]">
              Labels
            </p>
            <p className="flex min-h-[88px] items-center border-b border-border bg-surface px-6 text-lg font-semibold text-[#2C373F] xl:px-8 xl:text-[20px]">
              Asset Chain
            </p>
            <p className="flex min-h-[88px] items-center border-b border-border bg-background px-6 text-lg font-semibold text-[#2C373F] xl:px-8 xl:text-[20px]">
              Traditional Real Estate
            </p>
          </div>
          {compareRows.map((row) => (
            <div
              key={row.feature}
              className="grid grid-cols-3 text-base xl:text-[18px]"
            >
              <p className="flex min-h-[88px] items-center border-b border-border bg-background px-6 text-[#2C373F] xl:px-8">
                {row.feature}
              </p>
              <p className="flex min-h-[88px] items-center border-b border-border bg-surface px-6 text-[#2C373F] xl:px-8">
                {row.assetUnion}
              </p>
              <p className="flex min-h-[88px] items-center border-b border-border bg-background px-6 text-[#2C373F] xl:px-8">
                {row.traditional}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-6 rounded-[16px] bg-white p-4 sm:p-6 lg:flex-row lg:gap-6 lg:p-8">
          <div className="flex w-full shrink-0 flex-col gap-6 rounded-[20px] bg-[#edf4f8] p-4 sm:p-6 lg:max-w-[541px]">
            <div className="relative h-[min(401px,52vw)] min-h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                  barCategoryGap="32%"
                >
                  <CartesianGrid
                    strokeDasharray="4 6"
                    stroke="#CFE2EC"
                    vertical={false}
                  />
                  <XAxis dataKey="i" type="category" hide />
                  <YAxis
                    domain={[0, yMax]}
                    ticks={[0, 100_000, 200_000, 400_000, 800_000, 1_000_000]}
                    tickFormatter={formatAxisTick}
                    tick={{ fill: AXIS_MUTED, fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    width={44}
                  />
                  <Bar
                    dataKey="principal"
                    stackId="stack"
                    fill={CHART_BLUE}
                    radius={[0, 0, 0, 0]}
                    barSize={11}
                  />
                  <Bar
                    dataKey="profit"
                    stackId="stack"
                    fill={CHART_PURPLE}
                    radius={[3, 3, 0, 0]}
                    barSize={11}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-wrap items-start justify-center gap-6 sm:gap-10 md:gap-14">
              <div className="flex min-w-[140px] flex-col items-center gap-1 text-center">
                <p className="text-xl font-medium text-foreground sm:text-2xl">
                  {formatCurrency(summary.contributed)}
                </p>
                <div className="flex items-center gap-1 text-sm text-[#919191] sm:text-base">
                  <span
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: CHART_BLUE }}
                    aria-hidden
                  />
                  <span>Initial investment</span>
                </div>
                <p className="text-sm text-[#919191] sm:text-base">My earnings</p>
              </div>

              <div
                className="hidden h-[78px] w-px shrink-0 bg-border sm:block"
                aria-hidden
              />

              <div className="flex min-w-[140px] flex-col items-center gap-1 text-center">
                <p className="text-xl font-medium text-foreground sm:text-2xl">
                  {formatCurrency(summary.fv)}
                </p>
                <div className="flex items-center gap-1 text-sm text-[#919191] sm:text-base">
                  <span
                    className="size-2.5 shrink-0 rounded-full bg-brand"
                    aria-hidden
                  />
                  <span>Estimated profit</span>
                </div>
                <p className="text-sm text-[#919191] sm:text-base">
                  Calculated income
                </p>
              </div>
            </div>
          </div>

          <div className="flex min-w-0 flex-1 flex-col justify-center gap-8 sm:gap-12">
            <div className="flex flex-col gap-3 sm:gap-4">
              <p className="text-eyebrow font-medium uppercase text-brand">
                Yield Calculator
              </p>
              <h3 className="text-h1 font-medium leading-tight text-foreground">
                <span className="text-brand">Plan Your Investments</span>{" "}
                <span className="text-foreground">
                  on the Asset Union Platform
                </span>
              </h3>
              <p className="max-w-[734px] text-base leading-relaxed text-[#919191] sm:text-body-lg">
                Build a financial plan for a carefree retirement and financial
                independence. Our calculator will help you make an informed
                decision.
              </p>
            </div>

            <div className="flex flex-col gap-6">
              <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                <SuffixField
                  label="Initial capital"
                  value={initialCapital}
                  onChange={setInitialCapital}
                  suffix="$"
                />
                <SuffixField
                  label="Amount of periodic contributions"
                  value={periodicContribution}
                  onChange={setPeriodicContribution}
                  suffix="$"
                />
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-6">
                <SuffixField
                  label="APR"
                  value={apr}
                  onChange={setApr}
                  suffix="%"
                  className="w-full sm:w-[131px] sm:shrink-0"
                />
                <div
                  className="-mx-1 flex min-h-tap flex-1 overflow-x-auto rounded-full bg-background p-1 sm:mx-0"
                  role="tablist"
                  aria-label="Contribution frequency"
                >
                  {FREQUENCIES.map((f) => {
                    const selected = frequency === f.id;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        role="tab"
                        aria-selected={selected}
                        onClick={() => setFrequency(f.id)}
                        className={cn(
                          "flex flex-1 shrink-0 items-center justify-center rounded-full px-3 py-2 text-sm transition",
                          selected
                            ? "bg-white font-normal text-foreground shadow-[0_2px_8px_rgba(5,10,14,0.08)]"
                            : "font-medium text-[#919191] hover:text-foreground",
                        )}
                      >
                        {f.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <span className="text-sm font-light text-foreground">
                  Period
                </span>
                <div className="relative h-[21px] w-full">
                  <div className="pointer-events-none absolute inset-0 rounded-full bg-background" />
                  <div
                    className="pointer-events-none absolute inset-y-0 left-0 rounded-full bg-brand transition-[width] duration-150 ease-out"
                    style={{
                      width: `${(periodStepIndex / (PERIOD_STEPS.length - 1)) * 100}%`,
                    }}
                  />
                  <div
                    className="pointer-events-none absolute top-1/2 size-7 -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand bg-white shadow-[0_1px_4px_rgba(5,10,14,0.15)] transition-[left] duration-150 ease-out sm:size-[30px]"
                    style={{
                      left: `${(periodStepIndex / (PERIOD_STEPS.length - 1)) * 100}%`,
                    }}
                  />
                  <input
                    type="range"
                    min={0}
                    max={PERIOD_STEPS.length - 1}
                    step={1}
                    value={periodStepIndex}
                    onChange={(e) =>
                      setPeriodStepIndex(Number.parseInt(e.target.value, 10))
                    }
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    aria-valuetext={`${years} years`}
                  />
                </div>
                <div className="flex justify-between gap-1 text-[11px] font-light text-foreground sm:text-sm">
                  {PERIOD_STEPS.map((y) => (
                    <span key={y} className="min-w-0 text-center">
                      {y === 0 ? "0" : `${y} yrs`}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
