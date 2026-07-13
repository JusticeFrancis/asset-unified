"use client";

import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { DASHBOARD_ASSETS } from "@/app/dashboard/components/dashboard-assets";
import { AcademyQuestDotIcon, FaqChevronIcon } from "@/components/icons";
import {
  AcademyHeroQuestCompleting,
  AcademyHeroQuestFarming,
  AcademyHeroQuestInviting,
} from "@/lib/assets";
import { cn } from "@/lib/utils";
import { appQueryKeys, useAcademy } from "@/lib/api/queries/app";
import { claimFarmingPoints, completeQuest } from "@/lib/api/requests/app";

type AcademyData = {
  profile: { totalPoints: number; questPoints: number; farmingPoints: number; referralPoints: number; rank: number; level: number; streak: number; completedQuestSlugs: string[] };
  quests: any[];
  faq: any[];
  rewards: any[];
  farmingAssets: any[];
  referrals: { link: string; registered: number; qualified: number; rewarded: number; points: number };
  leaderboard: any[];
};

const EMPTY_ACADEMY: AcademyData = {
  profile: { totalPoints: 0, questPoints: 0, farmingPoints: 0, referralPoints: 0, rank: 0, level: 1, streak: 0, completedQuestSlugs: [] },
  quests: [], faq: [], rewards: [], farmingAssets: [],
  referrals: { link: "", registered: 0, qualified: 0, rewarded: 0, points: 0 },
  leaderboard: [],
};
const AcademyDataContext = createContext<AcademyData>(EMPTY_ACADEMY);
const useAcademyData = () => useContext(AcademyDataContext);

type AcademyTab = "home" | "quest" | "farming" | "referrals" | "rewards";

const TABS: { id: AcademyTab; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "quest", label: "Quest" },
  { id: "farming", label: "Farming" },
  { id: "referrals", label: "Referrals" },
  { id: "rewards", label: "Rewards" },
];

function StatChips() {
  const { profile } = useAcademyData();
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <div className="flex h-10 shrink-0 items-center justify-center gap-1 rounded-xl bg-[rgba(250,252,253,0.15)] px-4">
        <p
          className="text-[12px] font-medium leading-normal text-[#f5f7f8]"
          style={{ fontVariationSettings: "'opsz' 14" }}
        >
          <span className="text-[#cfe2ec]">Rank: </span>
          <span>#{profile.rank}</span>
        </p>
      </div>
      <div className="flex h-10 shrink-0 items-center justify-center gap-1 rounded-xl bg-[rgba(250,252,253,0.15)] px-4">
        <p
          className="text-[12px] font-medium leading-normal text-[#f5f7f8]"
          style={{ fontVariationSettings: "'opsz' 14" }}
        >
          <span className="text-[#cfe2ec]">Level: </span>
          <span>{profile.level}</span>
        </p>
      </div>
      <div className="flex h-10 shrink-0 items-center justify-center gap-1 rounded-xl bg-[rgba(250,252,253,0.15)] px-4">
        <p
          className="text-[12px] font-medium leading-normal text-[#f5f7f8]"
          style={{ fontVariationSettings: "'opsz' 14" }}
        >
          <span className="text-[#cfe2ec]">Steak: </span>
          <span>{profile.streak}🔥</span>
        </p>
      </div>
    </div>
  );
}

function SeasonBadge() {
  return (
    <div className="inline-flex rounded-[40px] bg-[#e4e4f6] px-3 py-1">
      <p
        className="text-[10px] font-normal leading-normal text-[#8672ca]"
        style={{ fontVariationSettings: "'opsz' 14" }}
      >
        RWA Season Quest&nbsp;
      </p>
    </div>
  );
}

function BannerMeshDecor({ src }: { src: string }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-[-14px] top-[-200px] h-[544px] w-[591px] max-w-none"
    >
      <img alt="" className="block size-full max-w-none" src={src} />
    </div>
  );
}

function HomeSeasonBanner() {
  const { profile } = useAcademyData();
  return (
    <div className="relative flex w-full flex-wrap items-end justify-between gap-4 overflow-hidden rounded-[20px] bg-[#5c60cc] p-4 sm:p-6">
      <BannerMeshDecor src={DASHBOARD_ASSETS.academy.bannerMesh} />
      <div className="relative z-10 flex min-w-0 flex-1 flex-col gap-2">
        <SeasonBadge />
        <p
          className="text-[12px] font-light leading-normal text-[#f5f7f8]"
          style={{ fontVariationSettings: "'opsz' 14" }}
        >
          Your total points
        </p>
        <div className="flex items-end gap-2 text-[#f5f7f8]">
          <p
            className="text-[28px] font-medium leading-none sm:text-[38px]"
            style={{ fontVariationSettings: "'opsz' 14" }}
          >
            {profile.totalPoints.toLocaleString()}
          </p>
          <p
            className="pb-1 text-[14px] font-light leading-none"
            style={{ fontVariationSettings: "'opsz' 14" }}
          >
            pts
          </p>
        </div>
      </div>
      <div className="relative z-10 flex w-full justify-end sm:w-auto sm:justify-start">
        <StatChips />
      </div>
    </div>
  );
}

function PointsBanner({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="relative flex w-full flex-wrap items-end justify-between gap-4 overflow-hidden rounded-[20px] bg-[#5c60cc] p-4 sm:p-6">
      <BannerMeshDecor src={DASHBOARD_ASSETS.academy.bannerMesh} />
      <div className="relative z-10 flex min-w-0 flex-1 flex-col gap-2">
        <SeasonBadge />
        <p
          className="text-[12px] font-light leading-normal text-[#f5f7f8]"
          style={{ fontVariationSettings: "'opsz' 14" }}
        >
          {label}
        </p>
        <div className="flex flex-wrap items-end gap-2 text-[#f5f7f8]">
          {value}
        </div>
      </div>
      <div className="relative z-10 flex w-full justify-end sm:w-auto sm:shrink-0 sm:justify-start">
        <StatChips />
      </div>
    </div>
  );
}

function QuestPointsBanner() {
  const { profile, quests } = useAcademyData();
  const totalQuestPoints = quests.reduce((sum, quest) => sum + Number(quest.points || 0), 0);
  return (
    <PointsBanner
      label="quest points"
      value={
        <>
          <span
            className="text-[28px] font-medium leading-none sm:text-[38px]"
            style={{ fontVariationSettings: "'opsz' 14" }}
          >
            {profile.questPoints.toLocaleString()}
          </span>
          <span
            className="text-base font-light leading-none text-[#cfe2ec]"
            style={{ fontVariationSettings: "'opsz' 14" }}
          >
            / {totalQuestPoints.toLocaleString()} pts
          </span>
        </>
      }
    />
  );
}

function FarmingPointsBanner() {
  const { profile } = useAcademyData();
  return (
    <PointsBanner
      label="Farming points from rent"
      value={
        <>
          <p
            className="text-[28px] font-medium leading-none sm:text-[38px]"
            style={{ fontVariationSettings: "'opsz' 14" }}
          >
            {profile.farmingPoints.toLocaleString()}
          </p>
          <p
            className="pb-1 text-[14px] font-light leading-none"
            style={{ fontVariationSettings: "'opsz' 14" }}
          >
            pts
          </p>
        </>
      }
    />
  );
}

function ReferralPointsBanner() {
  const { profile } = useAcademyData();
  return (
    <PointsBanner
      label="Referral points"
      value={
        <>
          <p
            className="text-[28px] font-medium leading-none sm:text-[38px]"
            style={{ fontVariationSettings: "'opsz' 14" }}
          >
            {profile.referralPoints.toLocaleString()}
          </p>
          <p
            className="pb-1 text-[14px] font-light leading-none"
            style={{ fontVariationSettings: "'opsz' 14" }}
          >
            pts
          </p>
        </>
      }
    />
  );
}

function RewardsTeaserBanner({ text }: { text: string }) {
  return (
    <div className="relative flex h-[81px] w-full items-center justify-center overflow-hidden rounded-[20px] bg-[#5c60cc] px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-90"
      >
        <img
          alt=""
          className="absolute left-1/2 top-1/2 block min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 max-w-none"
          src={DASHBOARD_ASSETS.academy.rewardsBannerMesh}
        />
      </div>
      <p
        className="relative z-10 text-[18px] font-medium leading-normal text-[#f5f7f8]"
        style={{ fontVariationSettings: "'opsz' 14" }}
      >
        {text}
      </p>
    </div>
  );
}

const HOME_STAT_CARDS = [
  {
    title: "Completing Quests",
    bg: "bg-[#0d9185]",
    image: AcademyHeroQuestCompleting,
    imageClass: "size-[37px] object-contain",
  },
  {
    title: "Farming Yield",
    bg: "bg-[#225ce2]",
    image: AcademyHeroQuestFarming,
    imageClass: "size-[37px] object-cover",
  },
  {
    title: "Inviting Friends",
    bg: "bg-[#7232dc]",
    image: AcademyHeroQuestInviting,
    imageClass: "size-[37px] object-cover scale-[1.15]",
  },
] as const;

function HomePanel() {
  const { profile, leaderboard, faq } = useAcademyData();
  const homePoints = [profile.questPoints, profile.farmingPoints, profile.referralPoints];
  return (
    <div className="flex flex-col gap-8 sm:gap-12">
      <div className="flex flex-col gap-4 sm:gap-6">
        <HomeSeasonBanner />
        {/* Mobile: stack the colored stat cards into a single column so each
            card has room to breathe and the title/icon/points read clearly.
            From sm+ they sit side-by-side as in the original Figma layout. */}
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:gap-[11px]">
          {HOME_STAT_CARDS.map((card, index) => (
            <article
              key={card.title}
              className={cn(
                "flex min-w-0 flex-1 flex-row items-center gap-3 rounded-[20px] px-4 py-3 text-[#f5f7f8] sm:flex-col sm:gap-0 sm:px-2 sm:pt-2 sm:pb-7",
                card.bg,
              )}
            >
              <div className="flex items-center sm:p-2.5">
                <div className="flex items-center justify-center rounded-lg bg-white/30 p-1">
                  <Image
                    alt=""
                    aria-hidden
                    className={card.imageClass}
                    height={37}
                    src={card.image}
                    width={37}
                  />
                </div>
              </div>
              <div className="flex min-w-0 flex-1 flex-row items-center justify-between gap-2 sm:flex-col sm:flex-none sm:items-center sm:justify-center sm:gap-1 sm:px-2.5">
                <p
                  className="min-w-0 text-left text-[16px] font-normal leading-normal sm:text-center"
                  style={{ fontVariationSettings: "'opsz' 14" }}
                >
                  {card.title}
                </p>
                <div className="flex shrink-0 items-center gap-1 rounded-[40px] bg-[#212121]/30 px-2">
                  <AcademyQuestDotIcon className="size-[9px] shrink-0" />
                  <p
                    className="text-[14px] font-normal leading-[25.2px]"
                    style={{ fontVariationSettings: "'opsz' 14" }}
                  >
                    {homePoints[index].toLocaleString()}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <section className="flex flex-col gap-2 rounded-[20px] border border-[#cfe2ec] p-4 sm:rounded-[32px] sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <h2
            className="text-[19px] font-medium text-[#050a0e]"
            style={{ fontVariationSettings: "'opsz' 14" }}
          >
            Leaderboard
          </h2>
          <p
            className="text-[12px] font-medium text-[#5c60cc]"
            style={{ fontVariationSettings: "'opsz' 14" }}
          >
            Your rank: #{profile.rank}
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-6">
            <p
              className="text-[12px] font-medium uppercase text-[#919191]"
              style={{ fontVariationSettings: "'opsz' 14" }}
            >
              name
            </p>
            <p
              className="text-[12px] font-medium uppercase text-[#919191]"
              style={{ fontVariationSettings: "'opsz' 14" }}
            >
              Points
            </p>
          </div>
          <div className="relative h-px w-full">
            <img
              alt=""
              aria-hidden
              className="block size-full max-w-none"
              src={DASHBOARD_ASSETS.refer.tableHeaderRule}
            />
          </div>
        </div>
        {leaderboard.map((row: any, index: number) => (
          <div
            className="flex h-9 items-center justify-between gap-4"
            key={row.name}
          >
            <div className="flex min-w-0 flex-1 items-center gap-1">
              <img
                alt=""
                className="size-8 shrink-0 rounded-full object-cover"
                height={32}
                src={row.avatar || DASHBOARD_ASSETS.academy.leaderboardAvatar1}
                width={32}
              />
              <p
                className="min-w-0 truncate text-[12px] font-normal text-[#050a0e]"
                style={{ fontVariationSettings: "'opsz' 14" }}
              >
                {row.name}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1 px-2">
              <AcademyQuestDotIcon className="size-[9px] shrink-0" />
              <p
                className="text-[14px] font-normal leading-[25.2px] text-[#050a0e]"
                style={{ fontVariationSettings: "'opsz' 14" }}
              >
                {Number(row.points || 0).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </section>

      <section className="rounded-[20px] bg-[#edf4f8] px-4 py-6 sm:px-[59px]">
        <div className="mx-auto flex max-w-[527px] flex-col items-center gap-8 sm:gap-12">
          <div className="flex w-full flex-col items-center gap-2 text-center sm:gap-4">
            <p
              className="w-full text-[14px] font-medium uppercase leading-[25.2px] text-[#5c60cc] sm:text-[18px]"
              style={{ fontVariationSettings: "'opsz' 14" }}
            >
              faq
            </p>
            <div
              className="text-[18px] font-medium leading-tight text-[#5c60cc] sm:text-[24px] sm:leading-normal md:text-[32px]"
              style={{ fontVariationSettings: "'opsz' 14" }}
            >
              <p className="mb-0">
                <span className="text-[#050a0e]">
                  Frequently asked questions
                </span>
              </p>
              <p>quest & rewards</p>
            </div>
          </div>
          <div className="flex w-full flex-col gap-4 sm:gap-6">
            {faq.map((q: any, i: number) => (
              <div
                className={cn(
                  "flex flex-col gap-4 pb-4 sm:gap-5 sm:pb-6",
                  i < faq.length - 1 &&
                    "border-b border-solid border-[#cfe2ec]",
                )}
                key={q.id || q.slug || i}
              >
                <div className="flex w-full items-start justify-between gap-3 sm:gap-4">
                  <p
                    className="min-w-0 flex-1 text-left text-[13px] font-normal leading-snug text-[#050a0e] sm:text-[16px] sm:leading-normal md:text-[18px]"
                    style={{ fontVariationSettings: "'opsz' 14" }}
                  >
                    {q.question || q.title || ""}
                  </p>
                  <FaqChevronIcon className="size-4 shrink-0 text-[#050a0e] sm:size-5 md:size-6" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

type QuestCard = {
  slug: string;
  title: string;
  points: string;
  cta: "begin" | "completed";
};

type QuestModule = { index: string; title: string; cards: QuestCard[] };

function QuestLessonCard({ card, onBegin }: { card: QuestCard; onBegin: (slug: string) => void }) {
  const cover = DASHBOARD_ASSETS.academy.questCardCover;
  return (
    <div className="relative w-full min-w-0 flex-1 sm:max-w-[calc(50%-4px)]">
      <div className="relative h-[126px] w-full overflow-hidden rounded-[21px]">
        <Image
          alt=""
          aria-hidden
          className="object-cover"
          fill
          sizes="(max-width: 640px) 100vw, 260px"
          src={cover}
        />
        <div
          aria-hidden
          className="absolute inset-0 rounded-[21px] bg-linear-to-r from-black/20 to-black/20"
        />
        <div className="absolute inset-0 flex flex-col justify-center gap-4 px-4">
          <p
            className="text-[16px] font-medium leading-normal text-white"
            style={{ fontVariationSettings: "'opsz' 14" }}
          >
            {card.title}
          </p>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1 px-2">
              <p
                className="text-[14px] font-normal leading-[25.2px] text-white"
                style={{ fontVariationSettings: "'opsz' 14" }}
              >
                Earn
              </p>
              <AcademyQuestDotIcon className="size-[9px] shrink-0 text-white" />
              <p
                className="text-[14px] font-normal leading-[25.2px] text-white"
                style={{ fontVariationSettings: "'opsz' 14" }}
              >
                {card.points}
              </p>
            </div>
            {card.cta === "begin" ? (
              <button
                className="flex h-10 w-full items-center justify-center rounded-xl border border-white bg-[rgba(250,252,253,0.15)] text-[12px] font-medium text-[#f5f7f8] transition-opacity hover:opacity-95"
                style={{ fontVariationSettings: "'opsz' 14" }}
                type="button"
                onClick={() => onBegin(card.slug)}
              >
                Begin
              </button>
            ) : (
              <div className="flex h-10 w-full items-center justify-center gap-1 rounded-xl bg-[rgba(250,252,253,0.15)]">
                <img
                  alt=""
                  aria-hidden
                  className="size-5 shrink-0"
                  src={DASHBOARD_ASSETS.academy.questCompletedIcon}
                />
                <p
                  className="text-[12px] font-medium text-[#cfe2ec]"
                  style={{ fontVariationSettings: "'opsz' 14" }}
                >
                  Completed
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function QuestPanel() {
  const { quests, profile } = useAcademyData();
  const queryClient = useQueryClient();
  const modules = useMemo<QuestModule[]>(() => {
    const grouped = new Map<string, QuestModule>();
    for (const quest of quests) {
      const index = String(quest.moduleIndex ?? quest.module ?? "1");
      const title = String(quest.moduleTitle ?? "Quests");
      const key = `${index}:${title}`;
      const module = grouped.get(key) ?? { index, title, cards: [] };
      module.cards.push({ slug: quest.slug, title: quest.title || quest.name || "", points: String(Number(quest.points || 0)), cta: profile.completedQuestSlugs.includes(quest.slug) ? "completed" : "begin" });
      grouped.set(key, module);
    }
    return [...grouped.values()];
  }, [profile.completedQuestSlugs, quests]);
  const onBegin = useCallback(async (slug: string) => {
    await completeQuest(slug);
    await queryClient.invalidateQueries({ queryKey: appQueryKeys.academy });
  }, [queryClient]);
  return (
    <div className="flex flex-col gap-8 sm:gap-12">
      <QuestPointsBanner />
      {modules.map((mod) => (
        <section
          className="flex flex-col gap-4 rounded-[20px] border border-[#cfe2ec] p-4 sm:gap-6 sm:rounded-[32px] sm:p-6"
          key={mod.title}
        >
          <div className="flex items-center gap-4">
            <p
              className="text-[14px] font-medium text-[#919191]"
              style={{ fontVariationSettings: "'opsz' 14" }}
            >
              {mod.index}
            </p>
            <h2
              className="text-[19px] font-medium text-[#050a0e]"
              style={{ fontVariationSettings: "'opsz' 14" }}
            >
              {mod.title}
            </h2>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2 sm:flex-row">
              {mod.cards.slice(0, 2).map((c) => (
                <QuestLessonCard card={c} key={c.slug} onBegin={onBegin} />
              ))}
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              {mod.cards.slice(2, 4).map((c) => (
                <QuestLessonCard card={c} key={c.slug} onBegin={onBegin} />
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}

type FarmingAsset = {
  id: string;
  image?: string | null;
  title: string;
  shares: string;
  available: string;
  cta:
    | { kind: "claim"; label: string }
    | { kind: "claimed"; label: string };
};

function FarmingAssetCard({ asset, onClaim }: { asset: FarmingAsset; onClaim: (id: string) => void }) {
  return (
    <article className="flex w-full max-w-[636px] flex-col gap-3 rounded-[20px] border border-[#cfe2ec] p-3 sm:flex-row sm:items-center sm:gap-4 sm:p-2">
      <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
        <div className="relative h-[59px] w-[60px] shrink-0 overflow-hidden rounded-2xl">
          <img alt="" className="size-full object-cover" src={asset.image || "/images/transparent-placeholder.svg"} />
        </div>
        <div className="flex min-w-0 flex-1 items-start justify-between gap-2">
          <div className="min-w-0 sm:px-3">
            <p
              className="truncate text-[14px] font-medium text-[#050a0e] sm:text-[16px]"
              style={{ fontVariationSettings: "'opsz' 14" }}
            >
              {asset.title}
            </p>
            <p
              className="truncate text-[12px] font-medium text-[#919191]"
              style={{ fontVariationSettings: "'opsz' 14" }}
            >
              {asset.shares}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1 sm:px-3">
            <p
              className="text-[11px] font-medium text-[#919191] sm:text-[12px]"
              style={{ fontVariationSettings: "'opsz' 14" }}
            >
              Available to claim
            </p>
            <div className="flex items-center gap-1">
              <AcademyQuestDotIcon className="size-[9px] shrink-0" />
              <p
                className="text-[14px] font-normal leading-[25.2px] text-[#050a0e]"
                style={{ fontVariationSettings: "'opsz' 14" }}
              >
                {asset.available}
              </p>
            </div>
          </div>
        </div>
      </div>
      {asset.cta.kind === "claim" ? (
        <button
          className="flex h-10 w-full shrink-0 items-center justify-center rounded-xl bg-[#5c60cc] px-4 text-[12px] font-medium text-[#f5f7f8] transition-opacity hover:opacity-95 sm:w-auto"
          style={{ fontVariationSettings: "'opsz' 14" }}
          type="button"
          onClick={() => onClaim(asset.id)}
        >
          {asset.cta.label}
        </button>
      ) : (
        <button
          className="flex h-10 w-full shrink-0 cursor-default items-center justify-center rounded-xl bg-[#e3e3e3] px-4 text-[12px] font-medium text-[#919191] sm:w-auto"
          disabled
          style={{ fontVariationSettings: "'opsz' 14" }}
          type="button"
        >
          {asset.cta.label}
        </button>
      )}
    </article>
  );
}

function FarmingPanel() {
  const { farmingAssets } = useAcademyData();
  const queryClient = useQueryClient();
  const assets: FarmingAsset[] = farmingAssets.map((asset: any) => ({ id: asset.id, image: asset.image, title: asset.title || "", shares: `Shares bought: ${Number(asset.shares || 0).toLocaleString()}`, available: Number(asset.availablePoints || 0).toLocaleString(), cta: asset.claimed || Number(asset.availablePoints || 0) <= 0 ? { kind: "claimed", label: "Claimed" } : { kind: "claim", label: "Claim" } }));
  const onClaim = useCallback(async (id: string) => {
    await claimFarmingPoints(id);
    await queryClient.invalidateQueries({ queryKey: appQueryKeys.academy });
  }, [queryClient]);
  return (
    <div className="flex flex-col gap-8 sm:gap-12">
      <FarmingPointsBanner />
      <div className="flex flex-col gap-4 sm:gap-8">
        <h2
          className="text-[17px] font-medium text-[#050a0e] sm:text-[19px]"
          style={{ fontVariationSettings: "'opsz' 14" }}
        >
          My Assets
        </h2>
        <div className="flex flex-col gap-4 sm:gap-6">
          {assets.map((asset) => (
            <FarmingAssetCard asset={asset} key={asset.id} onClaim={onClaim} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ReferralsPanel() {
  const { referrals } = useAcademyData();
  const [copied, setCopied] = useState(false);
  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(referrals.link);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [referrals.link]);

  const statTiles = [
    { value: referrals.registered.toLocaleString(), label: "No. of Registered Referrals" },
    { value: referrals.qualified.toLocaleString(), label: "Verified Referrals points" },
    { value: referrals.rewarded.toLocaleString(), label: "Invested Referrals points" },
    { value: referrals.points.toLocaleString(), label: "Total Referrals points" },
  ] as const;

  return (
    <div className="flex flex-col gap-8 sm:gap-12">
      <ReferralPointsBanner />
      <div className="flex max-w-[636px] flex-col gap-4 sm:gap-8">
        <h2
          className="text-[17px] font-medium text-[#050a0e] sm:text-[19px]"
          style={{ fontVariationSettings: "'opsz' 14" }}
        >
          Referral Stats
        </h2>
        <div className="flex w-full max-w-[431px] flex-col gap-1">
          <p
            className="text-[12px] font-medium text-[#919191]"
            style={{ fontVariationSettings: "'opsz' 14" }}
          >
            Your unique referral link:
          </p>
          <div className="flex w-full min-w-0 flex-col gap-2 rounded-xl border border-[#cfe2ec] bg-[#fafcfd] p-2 sm:h-10 sm:flex-row sm:items-center sm:justify-between sm:gap-0 sm:p-0 sm:pl-4">
            <p
              className="min-w-0 flex-1 truncate text-[12px] font-medium text-[#919191] sm:pr-2"
              style={{ fontVariationSettings: "'opsz' 14" }}
            >
              {referrals.link || "—"}
            </p>
            <button
              className="flex h-10 w-full shrink-0 items-center justify-center gap-1 rounded-xl bg-[#5c60cc] px-3 text-[12px] font-medium text-[#f5f7f8] transition-opacity hover:opacity-95 sm:w-[124px]"
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
        <div className="grid w-full max-w-[636px] grid-cols-2 gap-3 sm:gap-6">
          {statTiles.map((t) => (
            <div
              className="flex h-[112px] flex-col items-center justify-center rounded-2xl bg-[#fafcfd] px-3 py-4 sm:px-6"
              key={t.label}
            >
              <div className="flex flex-col items-center gap-2 text-center leading-normal sm:whitespace-nowrap">
                <p
                  className="text-[18px] font-medium text-[#050a0e] sm:text-[20px]"
                  style={{ fontVariationSettings: "'opsz' 14" }}
                >
                  {t.value}
                </p>
                <p
                  className="text-balance text-[11px] font-normal leading-tight text-[#919191] sm:text-[12px] sm:leading-normal"
                  style={{ fontVariationSettings: "'opsz' 14" }}
                >
                  {t.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RewardsPanel() {
  const { rewards } = useAcademyData();
  const bannerText = String(rewards[0]?.bannerText ?? (rewards.length ? `${rewards.length} reward${rewards.length === 1 ? "" : "s"} available` : ""));
  return (
    <div className="flex flex-col gap-8 sm:gap-12">
      <RewardsTeaserBanner text={bannerText} />
      <div className="grid w-full max-w-[636px] grid-cols-2 gap-3 sm:gap-5">
        {rewards.map((item: any) => (
          <div
            className="flex flex-col items-center gap-3 rounded-2xl bg-[#fafcfd] px-3 py-3 sm:gap-4 sm:px-6 sm:py-4"
            key={item.id || item.slug}
          >
            <div className="relative aspect-280/302 w-full overflow-hidden rounded-[16px] sm:rounded-[20px]">
              <Image
                alt=""
                className="object-cover"
                fill
                sizes="(max-width:640px) 50vw, 300px"
                src={item.image || item.coverImage || "/images/transparent-placeholder.svg"}
              />
            </div>
            <div className="flex flex-col items-center gap-1 text-center leading-normal sm:gap-2">
              <p
                className="text-[16px] font-medium text-[#050a0e] sm:text-[20px]"
                style={{ fontVariationSettings: "'opsz' 14" }}
              >
                {item.title}
              </p>
              <p
                className="text-[12px] font-normal text-[#919191]"
                style={{ fontVariationSettings: "'opsz' 14" }}
              >
                {item.status || "Available"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AcademyPage() {
  const [tab, setTab] = useState<AcademyTab>("home");
  const { data } = useAcademy();
  const academyData: AcademyData = data ?? EMPTY_ACADEMY;

  return (
    <AcademyDataContext.Provider value={academyData}>
    <div className="mx-auto flex w-full max-w-[1118px] flex-col">
      <div className="flex flex-col gap-6 rounded-[20px] bg-white p-4 sm:rounded-[32px] sm:p-6">
        <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Mobile: native <select> avoids horizontal overflow from 5 pill
              buttons (which previously clipped the fixed top-nav icons). */}
          <div className="relative sm:hidden">
            <select
              aria-label="Select Academy section"
              className="block h-12 w-full appearance-none rounded-[12px] border border-[#cfe2ec] bg-white px-4 pr-10 text-[14px] font-medium text-[#050a0e] outline-none focus-visible:ring-2 focus-visible:ring-[#5c60cc]/40"
              onChange={(event) => setTab(event.target.value as AcademyTab)}
              value={tab}
            >
              {TABS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
            <ChevronDown
              aria-hidden
              className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#919191]"
            />
          </div>

          <div className="hidden w-fit items-center gap-2 rounded-[40px] bg-[#f5f7f8] p-1 sm:flex sm:gap-5">
            {TABS.map((item) => {
              const active = tab === item.id;
              return (
                <button
                  key={item.id}
                  className={cn(
                    "rounded-[40px] px-3 py-2 text-[14px] transition-colors",
                    active
                      ? "bg-white font-normal text-[#050a0e] sm:px-4"
                      : "font-medium text-[#919191]",
                    active && item.id === "home" ? "sm:min-w-[128px]" : null,
                  )}
                  style={{ fontVariationSettings: "'opsz' 14" }}
                  type="button"
                  onClick={() => setTab(item.id)}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {tab === "home" && <HomePanel />}
        {tab === "quest" && <QuestPanel />}
        {tab === "farming" && <FarmingPanel />}
        {tab === "referrals" && <ReferralsPanel />}
        {tab === "rewards" && <RewardsPanel />}
      </div>
    </div>
    </AcademyDataContext.Provider>
  );
}
