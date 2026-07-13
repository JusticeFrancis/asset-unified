import Image from "next/image";
import Link from "next/link";
import {
  AcademyHeroQuestCompleting,
  AcademyHeroQuestFarming,
  AcademyHeroQuestInviting,
} from "@/lib/assets";
import {
  AcademyLockIcon,
  AcademyMetamaskIcon,
  AcademyQuestDotIcon,
  AcademyWalletConnectIcon,
  DaoWalletIcon,
} from "@/components/icons";
import { Container } from "../../components/shared";

const quests = [
  {
    titleTop: "Completing",
    titleBottom: "Quests",
    points: "—",
    image: AcademyHeroQuestCompleting,
    bgClassName: "bg-[#0D9185]",
    imageClassName: "size-9 object-contain",
  },
  {
    titleTop: "Farming",
    titleBottom: "Yield",
    points: "—",
    image: AcademyHeroQuestFarming,
    bgClassName: "bg-[#225CE2]",
    imageClassName: "size-9 object-cover",
  },
  {
    titleTop: "Inviting",
    titleBottom: "Friends",
    points: "—",
    image: AcademyHeroQuestInviting,
    bgClassName: "bg-[#7232DC]",
    imageClassName: "size-9 object-cover scale-[1.2]",
  },
] as const;

export function HeroSection() {
  return (
    <section className="bg-background pb-12 pt-header sm:pb-16 md:pb-20">
      <Container className="max-w-[1350px]">
        <div className="mx-auto w-full max-w-[656px] rounded-[24px] bg-white p-4 sm:rounded-[32px] sm:p-6">
          <div className="space-y-3 text-center sm:space-y-4">
            <h1 className="text-h2 font-medium leading-tight text-foreground">
              Season Quest is Locked
            </h1>
            <p className="mx-auto max-w-[622px] text-base leading-relaxed text-muted sm:text-body-lg">
              Sign In to your Asset Union account to access your points, quests
              and leaderboard.
            </p>
          </div>

          <div className="relative mt-6">
            {/* Locked dashboard preview — purely decorative. Blurred so the
                sign-in modal on top is visually dominant. */}
            <div
              aria-hidden
              className="overflow-hidden rounded-[8px] bg-[#FAFCFD] p-3 blur-sm sm:p-[23px]"
            >
              <div className="relative w-full overflow-hidden rounded-2xl bg-brand p-4 sm:p-6">
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-25"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, rgba(245,247,248,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(245,247,248,0.12) 1px, transparent 1px)",
                    backgroundSize: "28px 28px",
                  }}
                />
                <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
                  <div className="min-w-0">
                    <span className="inline-flex rounded-[40px] bg-[#E4E4F6] px-3 py-1 text-[10px] text-accent">
                      RWA Season Quest
                    </span>
                    <p className="mt-3 text-xs font-light text-[#F5F7F8]">
                      Your total points
                    </p>
                    <p className="mt-1 flex items-end gap-2 text-[#F5F7F8]">
                      <span className="text-3xl font-medium leading-none sm:text-[38px]">
                        —
                      </span>
                      <span className="pb-1 text-xs font-light leading-none sm:text-sm">
                        pts
                      </span>
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-2 sm:mt-5">
                      {[
                        { label: "Rank:", value: "—" },
                        { label: "Level:", value: "—" },
                        { label: "Streak:", value: "—" },
                      ].map((stat) => (
                        <span
                          key={stat.label}
                          className="inline-flex h-9 items-center rounded-xl bg-background/15 px-3 text-[11px] font-medium text-[#F5F7F8] sm:h-10 sm:px-4 sm:text-xs"
                        >
                          <span className="text-[#CFE2EC]">{stat.label}</span>
                          &nbsp;{stat.value}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled
                    aria-disabled="true"
                    className="inline-flex h-9 items-center justify-center gap-1 self-start rounded-xl bg-[#F5F7F8] px-3 text-[11px] font-medium text-foreground sm:h-10 sm:self-auto sm:px-4 sm:text-xs"
                  >
                    <DaoWalletIcon className="size-4 text-foreground" />
                    <span>Withdraw Rent</span>
                  </button>
                </div>
              </div>

              {/*
                Quest tiles — horizontal scroll on small screens so they
                don't squeeze into 80px columns; switch to a centred row at
                sm+ where the card width comfortably fits three tiles.
              */}
              <div className="-mx-3 mt-4 flex items-center gap-3 overflow-x-auto px-3 sm:mx-0 sm:mt-[23px] sm:justify-center sm:gap-[11px] sm:overflow-visible sm:px-0">
                {quests.map((quest) => (
                  <article
                    key={`${quest.titleTop}-${quest.titleBottom}`}
                    className={`${quest.bgClassName} w-[110px] shrink-0 rounded-[20px] p-4 text-white sm:w-[122px] sm:p-[18px]`}
                  >
                    <div className="mx-auto flex size-11 items-center justify-center rounded-[8px] bg-white/30 p-1">
                      <Image
                        src={quest.image}
                        alt=""
                        aria-hidden
                        width={36}
                        height={36}
                        className={quest.imageClassName}
                      />
                    </div>
                    <p className="mt-2 text-center text-sm leading-tight sm:text-base">
                      {quest.titleTop}
                      <br />
                      {quest.titleBottom}
                    </p>
                    <p className="mx-auto mt-2 flex w-fit items-center gap-1 rounded-[40px] bg-[#212121]/30 px-2 text-xs leading-relaxed sm:text-sm">
                      <AcademyQuestDotIcon className="size-[9px]" />
                      {quest.points}
                    </p>
                  </article>
                ))}
              </div>
            </div>

            {/* Sign-in modal overlay. Scales naturally on mobile (left/right
                offsets via inset, max-width caps it on desktop). */}
            <div className="absolute inset-x-3 top-[8%] z-10 mx-auto w-auto max-w-[357px] sm:left-1/2 sm:right-auto sm:inset-x-auto sm:-translate-x-1/2 sm:top-[12%]">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-white shadow-[0_1px_4px_rgba(12,12,13,0.05)] sm:size-14">
                <AcademyLockIcon className="size-5 text-[#919191] sm:size-6" />
              </div>

              <div className="mt-4 space-y-4 sm:mt-6 sm:space-y-6">
                <Link
                  href="/sign-in"
                  className="flex w-full items-center justify-center rounded-xl bg-foreground px-4 py-3 text-sm font-medium text-background min-h-tap sm:py-4 sm:text-base"
                >
                  <span className="text-background">Sign In</span>
                </Link>

                <div className="flex items-center gap-4">
                  <div aria-hidden className="h-px flex-1 bg-[#2C373F]" />
                  <span className="text-xs font-light text-[#2C373F]">or</span>
                  <div aria-hidden className="h-px flex-1 bg-[#2C373F]" />
                </div>

                <div className="space-y-3 sm:space-y-6">
                  <Link
                    href="/sign-in"
                    className="flex min-h-tap w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-xs font-medium text-foreground"
                  >
                    <AcademyMetamaskIcon className="size-5" />
                    <span className="text-foreground">Continue with Metamask</span>
                  </Link>
                  <Link
                    href="/sign-in"
                    className="flex min-h-tap w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-xs font-medium text-foreground"
                  >
                    <AcademyWalletConnectIcon className="size-5" />
                    <span className="text-foreground">
                      Continue with Wallet Connect
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
