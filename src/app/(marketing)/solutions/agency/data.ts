import {
  AgencyMigrationRelocationIcon,
  AgencyTraditionalAgenciesIcon,
  AgencyWealthManagementIcon,
} from "@/lib/assets";

export const agencyBenefits = [
  {
    title: "Traditional real estate agencies",
    body: "Add a fractional ownership line to your existing portfolio. Offer clients properties in premium international markets without opening a new office.",
    icon: AgencyTraditionalAgenciesIcon,
  },
  {
    title: "Wealth management firms",
    body: "Real estate tokenization is an emerging asset class. Introduce your clients to fractional international real estate as part of a diversified portfolio.",
    icon: AgencyWealthManagementIcon,
  },
  {
    title: "Migration & relocation agencies",
    body: "Clients relocating or seeking second residencies are natural buyers of international property.",
    icon: AgencyMigrationRelocationIcon,
  },
] as const;
