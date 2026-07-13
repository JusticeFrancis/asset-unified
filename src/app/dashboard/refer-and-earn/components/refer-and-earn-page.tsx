"use client";

import { type ReactNode, useCallback, useState } from "react";

import { ReferHeroIllustration } from "@/app/dashboard/refer-and-earn/components/refer-hero-illustration";
import type { ReferralListRow } from "@/app/dashboard/refer-and-earn/data/referral-records";
import { useReferrals } from "@/lib/api/queries/app";
import { DASHBOARD_ASSETS } from "@/app/dashboard/components/dashboard-assets";


function StatTile({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex h-[112px] flex-1 flex-col items-center justify-center rounded-[16px] bg-white px-3 py-4 sm:px-6">
      <div className="flex flex-col items-center justify-center gap-2 leading-normal sm:whitespace-nowrap">
        <p className="text-[18px] font-medium text-[#050a0e] sm:text-[20px]">
          {value}
        </p>
        <p className="text-balance text-center text-[11px] font-normal leading-tight text-[#919191] sm:text-[12px] sm:leading-normal">
          {label}
        </p>
      </div>
    </div>
  );
}

function HowItWorksStep({
  step,
  title,
  description,
  variant,
  alignTop,
  stepNumberClass,
}: {
  step?: string;
  title: string;
  description: ReactNode;
  variant: "pending" | "done";
  alignTop?: boolean;
  stepNumberClass?: string;
}) {
  if (variant === "done") {
    return (
      <div className="flex items-center gap-2">
        <div className="relative h-[45px] w-[47px] shrink-0">
          <img
            alt=""
            className="absolute block size-full max-w-none"
            src={DASHBOARD_ASSETS.refer.howItWorksStepComplete}
          />
        </div>
        <div className="flex flex-col justify-center gap-1 text-[12px] leading-normal whitespace-nowrap">
          <p className="font-normal text-[#050a0e]">{title}</p>
          <p className="font-light text-[#919191]">{description}</p>
        </div>
      </div>
    );
  }

  const numberClass =
    stepNumberClass ?? "left-[calc(50%-10px)] top-[calc(50%-12.5px)]";

  return (
    <div className={`flex gap-2 ${alignTop ? "items-start" : "items-center"}`}>
      <div className="relative h-[45px] w-[47px] shrink-0">
        <div className="absolute left-1/2 top-1/2 flex size-[62.656px] -translate-x-1/2 -translate-y-1/2 items-center justify-center">
          <div className="rotate-120">
            <div className="relative size-[45.867px]">
              <div className="absolute inset-[0.44%]">
                <img
                  alt=""
                  className="block size-full max-w-none"
                  src={DASHBOARD_ASSETS.refer.howItWorksPolygon}
                />
              </div>
            </div>
          </div>
        </div>
        <p
          className={`absolute text-[19px] font-medium text-[#d9d9d9] ${numberClass}`}
          style={{ fontVariationSettings: "'opsz' 14" }}
        >
          {step}
        </p>
      </div>
      <div
        className={`flex flex-col gap-1 text-[12px] leading-normal ${alignTop ? "justify-start" : "justify-center"} ${alignTop ? "" : "whitespace-nowrap"}`}
      >
        <p className="font-normal text-[#050a0e]">{title}</p>
        <div className="font-light text-[#919191]">{description}</div>
      </div>
    </div>
  );
}

export default function ReferAndEarnPage() {
  const { data } = useReferrals();
  const rows = (data?.referrals ?? []) as ReferralListRow[];
  const referralLink = String(data?.referralLink ?? "");
  const stats = data?.stats ?? { total: 0, qualified: 0, rewards: 0, availableRewards: 0, lockedRewards: 0, claimedRewards: 0, points: 0 };
  const [copied, setCopied] = useState(false);

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [referralLink]);

  return (
    <div className="mx-auto flex w-full max-w-[1136px] flex-col gap-5 lg:flex-row lg:items-start">
      <div className="flex min-w-0 flex-1 flex-col gap-5">
        <div className="flex flex-col gap-6 rounded-[20px] bg-white p-4 sm:flex-row sm:items-start sm:justify-between sm:gap-10 sm:rounded-[32px] sm:p-6">
          <div className="flex min-w-0 flex-1 flex-col gap-6 sm:gap-10">
            <div className="flex flex-col gap-2.5">
              <div
                className="text-[20px] font-medium leading-normal text-[#050a0e] sm:text-[26px]"
                style={{ fontVariationSettings: "'opsz' 14" }}
              >
                <p className="mb-0">Refer friends,</p>
                <p>and 3% of their investment</p>
              </div>
              <p
                className="max-w-[572px] text-[12px] font-medium text-[#919191]"
                style={{ fontVariationSettings: "'opsz' 14" }}
              >
                Invite friends and get 3% of their first 3 months investments.
              </p>
            </div>
            <div className="flex max-w-[431px] flex-col gap-1">
              <p
                className="text-[12px] font-medium text-[#919191]"
                style={{ fontVariationSettings: "'opsz' 14" }}
              >
                Your unique referral link:
              </p>
              <div className="flex w-full min-w-0 flex-col gap-2 rounded-[12px] border border-[#cfe2ec] bg-[#fafcfd] p-2 sm:h-10 sm:flex-row sm:items-center sm:justify-between sm:gap-0 sm:p-0 sm:pl-4">
                <p
                  className="min-w-0 flex-1 truncate text-[12px] font-medium text-[#919191] sm:pr-2"
                  style={{ fontVariationSettings: "'opsz' 14" }}
                >
                  {referralLink}
                </p>
                <button
                  className="flex h-10 w-full shrink-0 items-center justify-center gap-1 rounded-[12px] bg-[#5c60cc] px-3 text-[12px] font-medium text-[#f5f7f8] transition-opacity hover:opacity-95 sm:w-[124px]"
                  style={{ fontVariationSettings: "'opsz' 14" }}
                  type="button"
                  onClick={copyLink}
                >
                  <img
                    alt=""
                    aria-hidden
                    className="size-5 shrink-0"
                    src={DASHBOARD_ASSETS.refer.copyLinkIcon}
                  />
                  {copied ? "Copied" : "Copy link"}
                </button>
              </div>
            </div>
          </div>
          <div className="mx-auto shrink-0 sm:mx-0">
            <ReferHeroIllustration />
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-5 sm:flex-row">
            <StatTile label="No. of Registered Referrals" value={String(stats.total)} />
            <StatTile label="No. of Verified Referrals" value={String(stats.qualified)} />
          </div>
          <div className="flex flex-col gap-5 sm:flex-row">
            <StatTile label="No. of Invested Referrals" value={String(stats.qualified)} />
            <StatTile label="Total Referrals Reward" value={`$${Number(stats.rewards || 0).toLocaleString()}`} />
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-[20px] bg-white p-4 sm:rounded-[32px] sm:p-6">
          <div className="flex items-center justify-between">
            <h2
              className="text-[19px] font-medium text-[#050a0e]"
              style={{ fontVariationSettings: "'opsz' 14" }}
            >
              Your Referral List
            </h2>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex min-h-px min-w-0 flex-1 items-center gap-6">
                <p
                  className="text-[12px] font-medium uppercase text-[#919191]"
                  style={{ fontVariationSettings: "'opsz' 14" }}
                >
                  name
                </p>
              </div>
              <div className="flex min-h-px min-w-0 flex-1 items-center">
                <p
                  className="text-[12px] font-medium uppercase text-[#919191]"
                  style={{ fontVariationSettings: "'opsz' 14" }}
                >
                  email
                </p>
              </div>
              <div className="flex min-h-px min-w-0 flex-1 items-center justify-end sm:justify-start">
                <p
                  className="text-[12px] font-medium uppercase text-[#919191]"
                  style={{ fontVariationSettings: "'opsz' 14" }}
                >
                  sign up date
                </p>
              </div>
            </div>
            <div className="relative h-px w-full shrink-0">
              <img
                alt=""
                className="block size-full max-w-none"
                src={DASHBOARD_ASSETS.refer.tableHeaderRule}
              />
            </div>
            {rows.map((row) => (
              <div
                className="flex items-center justify-between gap-4"
                key={row.email}
              >
                <div className="flex min-h-px min-w-0 flex-1 items-center gap-1">
                  <div className="relative size-8 shrink-0">
                    <img
                      alt=""
                      className="absolute block size-full max-w-none rounded-full object-cover"
                      height={32}
                      src={row.avatarSrc || DASHBOARD_ASSETS.settings.profileAvatar}
                      width={32}
                    />
                  </div>
                  <p
                    className="min-w-0 flex-1 truncate text-[12px] font-normal text-[#050a0e]"
                    style={{ fontVariationSettings: "'opsz' 14" }}
                  >
                    {row.name}
                  </p>
                </div>
                <p
                  className="min-h-px min-w-0 flex-1 truncate text-[12px] font-normal text-[#050a0e]"
                  style={{ fontVariationSettings: "'opsz' 14" }}
                >
                  {row.email}
                </p>
                <p
                  className="min-h-px min-w-0 flex-1 truncate text-right text-[12px] font-normal text-[#050a0e] sm:text-left"
                  style={{ fontVariationSettings: "'opsz' 14" }}
                >
                  {row.signUpDate}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex w-full shrink-0 flex-col gap-3 lg:w-[359px]">
        <div className="flex flex-col gap-8 rounded-[20px] bg-white p-4 sm:gap-12 sm:rounded-[32px] sm:p-6">
          <h2
            className="text-[19px] font-medium text-[#050a0e]"
            style={{ fontVariationSettings: "'opsz' 14" }}
          >
            How It works
          </h2>
          <div className="flex flex-col gap-4">
            <HowItWorksStep
              description="Send a referral link to your friend."
              step="01"
              title="Sign Up"
              variant="pending"
            />
            <HowItWorksStep
              alignTop
              description={
                <>
                  <p className="mb-0 whitespace-pre">{`Make sure your registered friend passed `}</p>
                  <p className="whitespace-pre">verification.</p>
                </>
              }
              step="02"
              stepNumberClass="left-[calc(50%-12px)] top-[calc(50%-12.5px)]"
              title="Verify identity"
              variant="pending"
            />
            <HowItWorksStep
              alignTop
              description="Motivate your friend o make his first investment."
              step="03"
              stepNumberClass="left-[calc(50%-12.5px)] top-[calc(50%-12.5px)]"
              title="Purchase a property"
              variant="pending"
            />
            <HowItWorksStep
              description="Enjoy your handwork!"
              title="Get rewards"
              variant="done"
            />
          </div>
        </div>

        <div className="flex flex-col gap-8 rounded-[20px] bg-white p-4 sm:gap-12 sm:rounded-[32px] sm:p-6">
          <h2
            className="text-[19px] font-medium text-[#050a0e]"
            style={{ fontVariationSettings: "'opsz' 14" }}
          >
            My Rewards
          </h2>
          <div className="flex flex-col gap-2">
            <div className="flex h-[173px] flex-col items-center justify-center rounded-[16px] bg-[#f4f8fb] px-4 py-3 sm:px-6 sm:py-4">
              <div className="flex flex-col items-center justify-center gap-2 whitespace-nowrap leading-normal text-[#050a0e]">
                <p
                  className="text-[14px] font-normal"
                  style={{ fontVariationSettings: "'opsz' 14" }}
                >
                  Available balance
                </p>
                <p
                  className="text-[28px] font-medium sm:text-[38px]"
                  style={{ fontVariationSettings: "'opsz' 14" }}
                >
                  {`$${Number(stats.availableRewards || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col items-center justify-center rounded-[16px] bg-[#f4f8fb] px-4 py-3 sm:px-6 sm:py-4">
                <div className="flex flex-col items-center justify-center gap-2 whitespace-nowrap leading-normal text-[#050a0e]">
                  <p
                    className="text-[20px] font-medium"
                    style={{ fontVariationSettings: "'opsz' 14" }}
                  >
                    {`$${Number(stats.lockedRewards || 0).toLocaleString()}`}
                  </p>
                  <p
                    className="text-[12px] font-normal"
                    style={{ fontVariationSettings: "'opsz' 14" }}
                  >
                    Locked Balance
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center rounded-[16px] bg-[#f4f8fb] px-4 py-3 sm:px-6 sm:py-4">
                <div className="flex flex-col items-center justify-center gap-2 whitespace-nowrap leading-normal text-[#050a0e]">
                  <p
                    className="text-[20px] font-medium"
                    style={{ fontVariationSettings: "'opsz' 14" }}
                  >
                    {`$${Number(stats.claimedRewards || 0).toLocaleString()}`}
                  </p>
                  <p
                    className="text-[12px] font-normal"
                    style={{ fontVariationSettings: "'opsz' 14" }}
                  >
                    Rewards claimed
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center rounded-[16px] bg-[#f4f8fb] px-4 py-3 sm:px-6 sm:py-4">
                <div className="flex flex-col items-center justify-center gap-2 whitespace-nowrap leading-normal text-[#050a0e]">
                  <p
                    className="text-[20px] font-medium"
                    style={{ fontVariationSettings: "'opsz' 14" }}
                  >
                    {`$${Number(stats.rewards || 0).toLocaleString()}`}
                  </p>
                  <p
                    className="text-[12px] font-normal"
                    style={{ fontVariationSettings: "'opsz' 14" }}
                  >
                    Total rewards
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
