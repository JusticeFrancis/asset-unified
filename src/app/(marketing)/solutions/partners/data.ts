import {
  PartnersGovernanceProposalsIcon,
  PartnersInboundEnquiriesIcon,
  PartnersProfileVerifiedIcon,
  PartnersServiceAgreementsIcon,
} from "@/lib/assets";

export const partnerBenefits = [
  {
    title: "Profile is verified by Asset Union",
    body: "We review your credentials, references, and local compliance standing. Verified partners receive a trust badge that is visible to all token holders across the platform.",
    icon: PartnersProfileVerifiedIcon,
  },
  {
    title: "You receive inbound enquiries",
    body: "Asset Union's team also shares your contact details with developers and AU's property management team who need your services - a two-way connection, not just a passive directory entry.",
    icon: PartnersInboundEnquiriesIcon,
  },
  {
    title: "You appear in governance proposals",
    body: "When a property needs a service provider in your category and geography, your profile is listed as a candidate in the governance vote. Token holders decide - transparently, on-chain.",
    icon: PartnersGovernanceProposalsIcon,
  },
  {
    title: "Service agreements are formalised",
    body: "When selected, the engagement is documented formally. Scope, deliverables, and payment terms are agreed in writing. Asset Union facilitates - you deliver.",
    icon: PartnersServiceAgreementsIcon,
  },
] as const;
