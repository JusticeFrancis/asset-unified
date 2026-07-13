"use client";

import { useParams } from "next/navigation";
import { GovernanceProposalDetailView } from "@/app/dashboard/governance/proposal/[slug]/components/governance-proposal-detail-view";
import type { GovernanceProposalRecord } from "@/app/dashboard/governance/data/governance-records";
import { useGovernanceProposal } from "@/lib/api/queries/app";

export default function GovernanceProposalPage() {
  const params = useParams<{ slug: string }>();
  const { data, isLoading } = useGovernanceProposal(params.slug);
  if (isLoading) return null;
  if (!data) return <p className="py-16 text-center text-[19px] font-medium text-[#919191]">Proposal not found</p>;
  return <GovernanceProposalDetailView proposal={data as GovernanceProposalRecord} />;
}
