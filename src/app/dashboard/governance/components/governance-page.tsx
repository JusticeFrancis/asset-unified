"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Plus } from "lucide-react";

import { GovernanceProposalRow } from "@/app/dashboard/governance/components/governance-proposal-row";
import { GovernanceStatsBanner } from "@/app/dashboard/governance/components/governance-stats-banner";
import type { GovernanceProposalRecord } from "@/app/dashboard/governance/data/governance-records";
import { useGovernanceProposals } from "@/lib/api/queries/app";
import { cn } from "@/lib/utils";

type Filter = "all" | "active" | "closed";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "closed", label: "Closed" },
];

export default function GovernancePage() {
  const [filter, setFilter] = useState<Filter>("all");
  const { data } = useGovernanceProposals(filter);
  const proposals = (data?.proposals ?? []) as GovernanceProposalRecord[];
  const stats = data?.stats ?? { activeCount: 0, passedCount: 0, votedCount: 0, votingPower: 0 };

  const filtered = useMemo(() => filter === "all" ? proposals : proposals.filter((proposal) => proposal.status === filter), [filter, proposals]);

  return (
    <div className="mx-auto flex w-full max-w-[1118px] flex-col gap-8">
      <GovernanceStatsBanner
        activeCount={stats.activeCount}
        passedCount={stats.passedCount}
        votedCount={stats.votedCount}
        votingPower={stats.votingPower}
      />

      <div className="flex flex-col gap-4 rounded-[20px] bg-white p-4 sm:rounded-[32px] sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-[19px] font-medium text-[#050a0e]">Proposals</h2>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
            <div className="flex w-fit items-center gap-5 rounded-[40px] bg-[#f5f7f8] p-1">
              {FILTERS.map(({ id, label }) => (
                <button
                  className={cn(
                    "rounded-[40px] px-4 py-2 text-[14px] transition-colors",
                    filter === id
                      ? "bg-white font-normal text-[#050a0e] shadow-sm"
                      : "font-medium text-[#919191]",
                  )}
                  key={id}
                  type="button"
                  onClick={() => setFilter(id)}
                >
                  {label}
                </button>
              ))}
            </div>
            <Link
              className="flex h-10 w-full items-center justify-center gap-1 rounded-[12px] bg-[#5c60cc] px-3 text-[12px] font-medium text-[#f5f7f8] transition-opacity hover:opacity-95 sm:w-[176px]"
              href="/dashboard/governance/create"
            >
              <Plus
                aria-hidden
                className="size-6 text-[#f5f7f8]"
                strokeWidth={1.75}
              />
              <span className="hidden sm:inline text-[#f5f7f8]">
                Create Proposal
              </span>
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {filtered.map((p) => (
            <GovernanceProposalRow key={p.slug} proposal={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
