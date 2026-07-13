"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ReactNode, useMemo, useState } from "react";
import { Calendar, ChevronDown, ChevronLeft } from "lucide-react";

import { DASHBOARD_ASSETS } from "@/app/dashboard/components/dashboard-assets";
import { useInvestments } from "@/lib/api/queries/app";
import { createGovernanceProposal } from "@/lib/api/requests/app";
import { cn } from "@/lib/utils";

type ProposalTypeId = "capex" | "sale" | "rental" | "emergency" | "manager";

const PT = DASHBOARD_ASSETS.governance.proposalType;

function ProposalTypeIconWell({ id }: { id: ProposalTypeId }) {
  if (id === "emergency") {
    return (
      <div className="relative h-[45px] w-[47px] shrink-0 overflow-hidden">
        <img
          alt=""
          className="absolute inset-0 block size-full max-w-none object-contain object-center"
          src={PT.emergencyCombined}
        />
      </div>
    );
  }

  const layers: Record<
    Exclude<ProposalTypeId, "emergency">,
    { bg: string; icon: string }
  > = {
    capex: { bg: PT.capexBg, icon: PT.capexIcon },
    sale: { bg: PT.saleBg, icon: PT.saleIcon },
    rental: { bg: PT.rentalBg, icon: PT.rentalIcon },
    manager: { bg: PT.managerBg, icon: PT.managerIcon },
  };

  const { bg, icon } = layers[id];

  return (
    <div className="relative h-[45px] w-[47px] shrink-0">
      <div className="absolute left-1/2 top-1/2 flex size-[62.656px] -translate-x-1/2 -translate-y-1/2 items-center justify-center">
        <div className="flex-none rotate-[120deg]">
          <div className="relative size-[45.867px]">
            <img
              alt=""
              className="pointer-events-none absolute inset-[0.44%] block size-full max-w-none"
              src={bg}
            />
          </div>
        </div>
      </div>
      <div className="absolute left-[12px] top-[11px] size-6 overflow-hidden">
        <img alt="" className="block size-full max-w-none" src={icon} />
      </div>
    </div>
  );
}

const PROPOSAL_TYPES: {
  id: ProposalTypeId;
  title: string;
  description: ReactNode;
  disabled?: boolean;
}[] = [
  {
    id: "capex",
    title: "Major Repair / CapEx",
    description: "Approve capital expenditure or significant repairs",
  },
  {
    id: "sale",
    title: "Property Sale",
    description: "Vote on selling the property at a specified price",
  },
  {
    id: "rental",
    title: "Rental Price / Terms",
    description: (
      <>
        <span className="block">Change rental rates or tenancy </span>
        <span className="block">terms</span>
      </>
    ),
  },
  {
    id: "emergency",
    title: "Emergency Action",
    description: "Urgent decisions requiring immediate input",
  },
  {
    id: "manager",
    title: "Change Property Manager",
    description: (
      <>
        <span className="block">Replace the current property </span>
        <span className="block">manager</span>
      </>
    ),
    disabled: true,
  },
];

export function GovernanceCreateProposalView() {
  const router = useRouter();
  const { data } = useInvestments();
  const [selectedType, setSelectedType] = useState<ProposalTypeId>("rental");
  const [propertySlug, setPropertySlug] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [cost, setCost] = useState("");
  const [closesAt, setClosesAt] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const ownedProperties = useMemo(() => {
    const bySlug = new Map<string, { propertySlug: string; propertyTitle: string; propertyLocation: string; shares: number }>();
    for (const investment of data?.investments ?? []) {
      if (investment.status !== "completed" || !investment.propertySlug) continue;
      const current = bySlug.get(investment.propertySlug) ?? {
        propertySlug: investment.propertySlug,
        propertyTitle: investment.propertyTitle || investment.propertySlug,
        propertyLocation: investment.propertyLocation || "",
        shares: 0,
      };
      current.shares += Number(investment.shares || 0);
      bySlug.set(investment.propertySlug, current);
    }
    return [...bySlug.values()];
  }, [data?.investments]);

  const selectedProperty = ownedProperties.find((property) => property.propertySlug === propertySlug);
  const selectedTypeConfig = PROPOSAL_TYPES.find((type) => type.id === selectedType);

  async function submit() {
    if (!selectedProperty || !title.trim() || !description.trim() || !closesAt) {
      setError("Select a property and complete the required proposal details.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const proposal = await createGovernanceProposal({
        type: selectedType,
        categoryLabel: selectedTypeConfig?.title ?? "General",
        title: title.trim(),
        description: description.trim(),
        propertySlug: selectedProperty.propertySlug,
        property: selectedProperty.propertyTitle,
        propertyLine: `${selectedProperty.propertyTitle}${selectedProperty.propertyLocation ? ` — ${selectedProperty.propertyLocation}` : ""} (${selectedProperty.shares.toLocaleString()} tokens held)`,
        propertyShort: selectedProperty.propertyTitle,
        locationDetail: selectedProperty.propertyLocation,
        cost: cost.trim() || "—",
        closesAt: new Date(closesAt).toISOString(),
        eligibleVotes: selectedProperty.shares,
      });
      router.push(`/dashboard/governance/proposal/${proposal.slug}`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The proposal could not be created.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-[1118px] flex-col gap-5 lg:flex-row lg:items-start">
      <div className="w-full shrink-0 rounded-[20px] bg-white p-4 sm:p-6 lg:max-w-[339px]">
        <Link className="mb-6 flex items-center gap-1 text-[19px] font-medium text-[#050a0e] transition-opacity hover:opacity-80" href="/dashboard/governance">
          <ChevronLeft aria-hidden className="size-5 shrink-0" strokeWidth={1.75} />
          Proposal type
        </Link>
        <div className="flex flex-col gap-2">
          {PROPOSAL_TYPES.map(({ id, title: typeTitle, description: typeDescription, disabled }) => {
            const selected = selectedType === id && !disabled;
            return (
              <button
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg border p-2 text-left transition-colors",
                  disabled ? "cursor-not-allowed border-[#cfe2ec] bg-[rgba(145,145,145,0.2)] opacity-80" : selected ? "border-[#5c60cc] bg-[rgba(92,96,204,0.15)]" : "border-[#cfe2ec] bg-white hover:bg-[#fafcfd]",
                )}
                disabled={disabled}
                key={id}
                type="button"
                onClick={() => { if (!disabled) setSelectedType(id); }}
              >
                <ProposalTypeIconWell id={id} />
                <span className="flex min-w-0 flex-col gap-1 text-[12px] leading-normal">
                  <span className={cn("font-normal", disabled ? "text-[#919191]" : "text-[#050a0e]")}>{typeTitle}</span>
                  <span className="font-light text-[#919191]">{typeDescription}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="min-w-0 flex-1 rounded-[20px] bg-white p-4 shadow-[0_1px_4px_rgba(12,12,13,0.05)] sm:p-6">
        <div className="flex flex-col gap-8">
          <div>
            <div className="flex items-center justify-between"><h2 className="text-[19px] font-medium text-[#050a0e]">Proposal details</h2></div>
            <div className="mt-4 h-px w-full bg-[#cfe2ec]" />
          </div>

          <div className="flex flex-col gap-6">
            <label className="flex flex-col gap-2">
              <span className="text-[12px] font-medium text-[#050a0e]">Property</span>
              <div className="relative flex h-10 items-center justify-between rounded-[12px] border border-[#cfe2ec] px-4">
                <select className="h-full w-full appearance-none bg-transparent pr-8 text-[12px] font-medium text-[#919191] outline-none" value={propertySlug} onChange={(event) => setPropertySlug(event.target.value)}>
                  <option value="">Select a property</option>
                  {ownedProperties.map((property) => <option key={property.propertySlug} value={property.propertySlug}>{property.propertyTitle}{property.propertyLocation ? ` — ${property.propertyLocation}` : ""} ({property.shares.toLocaleString()} tokens held)</option>)}
                </select>
                <ChevronDown aria-hidden className="pointer-events-none absolute right-4 size-5 shrink-0 text-[#050a0e]" strokeWidth={1.5} />
              </div>
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-[12px] font-medium text-[#050a0e]">Proposal title</span>
              <div className="flex h-10 items-center justify-between rounded-[12px] border border-[#cfe2ec] px-4">
                <input className="h-full min-w-0 flex-1 bg-transparent text-[12px] font-medium text-[#050a0e] outline-none placeholder:text-[#919191]" placeholder="Enter proposal title" value={title} onChange={(event) => setTitle(event.target.value)} />
                <ChevronDown aria-hidden className="size-5 shrink-0 text-[#050a0e]" strokeWidth={1.5} />
              </div>
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-[12px] font-medium text-[#050a0e]">Description</span>
              <div className="relative min-h-[111px] rounded-[12px] border border-[#cfe2ec] p-4">
                <textarea className="min-h-[79px] w-full resize-y bg-transparent text-[12px] font-medium text-[#050a0e] outline-none placeholder:text-[#919191]" placeholder="Start to write here...." rows={4} value={description} onChange={(event) => setDescription(event.target.value)} />
                <ChevronDown aria-hidden className="pointer-events-none absolute bottom-3 right-3 size-5 text-[#050a0e] opacity-40" strokeWidth={1.5} />
              </div>
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-[12px] font-medium text-[#050a0e]">Estimated cost <span className="text-[#919191]">(if applicable)</span></span>
              <div className="flex h-10 items-center justify-between rounded-[12px] border border-[#cfe2ec] px-4">
                <input className="h-full min-w-0 flex-1 bg-transparent text-[12px] font-medium text-[#050a0e] outline-none placeholder:text-[#919191]" placeholder="Enter estimated cost" value={cost} onChange={(event) => setCost(event.target.value)} />
                <ChevronDown aria-hidden className="size-5 shrink-0 text-[#050a0e]" strokeWidth={1.5} />
              </div>
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-[12px] font-medium text-[#050a0e]">Voting Duration</span>
              <div className="flex h-10 items-center justify-between rounded-[12px] border border-[#cfe2ec] px-4">
                <input className="h-full min-w-0 flex-1 bg-transparent text-[12px] font-medium text-[#919191] outline-none" min={new Date().toISOString().slice(0, 10)} type="date" value={closesAt} onChange={(event) => setClosesAt(event.target.value)} />
                <Calendar aria-hidden className="size-5 shrink-0 text-[#050a0e]" strokeWidth={1.5} />
              </div>
            </label>
            {error ? <p className="text-[12px] font-medium text-red-600">{error}</p> : null}
          </div>

          <div className="h-px w-full bg-[#cfe2ec]" />
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-[12px] leading-normal"><p className="font-light text-[#919191]">Proceed to the next step</p><p className="font-normal text-[#050a0e]">Construction Timeline</p></div>
            <div className="flex gap-2">
              <Link className="flex h-10 min-w-[120px] items-center justify-center rounded-[12px] border border-[#cfe2ec] bg-white px-4 text-[12px] font-medium text-[#050a0e] transition-opacity hover:opacity-90" href="/dashboard/governance">Back</Link>
              <button className="flex h-10 min-w-[120px] items-center justify-center rounded-[12px] bg-[#5c60cc] px-4 text-[12px] font-medium text-[#f5f7f8] transition-opacity hover:opacity-95 disabled:opacity-60" type="button" disabled={submitting} onClick={submit}>{submitting ? "Creating..." : "Confirm"}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
