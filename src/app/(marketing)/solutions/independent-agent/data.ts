import {
  IndependentAgentCommunityBuildersIcon,
  IndependentAgentFinancialAdvisorsIcon,
  IndependentAgentTraditionalRealEstateAgentsIcon,
} from "@/lib/assets";

export const independentAgentBenefits = [
  {
    title: "Financial advisors",
    body: "Your clients already diversify. Fractional international real estate is a natural fit for portfolios seeking passive income with tangible assets.",
    icon: IndependentAgentFinancialAdvisorsIcon,
  },
  {
    title: "Traditional real estate agents",
    body: "Clients who cannot yet afford a full property can now invest fractionally. Add a new conversion path for leads that would otherwise go cold.",
    icon: IndependentAgentTraditionalRealEstateAgentsIcon,
  },
  {
    title: "Community builders",
    body: "If you run an investment community, newsletter, or audience interested in alternative assets and passive income, Asset Union is a product your audience will respond to.",
    icon: IndependentAgentCommunityBuildersIcon,
  },
] as const;
