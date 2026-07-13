import {
  DevelopersGlobalReachIcon,
  DevelopersLegalStructureIcon,
  DevelopersNoUpfrontFeeIcon,
} from "@/lib/assets";

export const developersBenefits = [
  {
    icon: DevelopersNoUpfrontFeeIcon,
    title: "No upfront listing fee",
    body: "Asset Union charges a platform commission only after your project successfully raises funds. You pay nothing until you get paid.",
  },
  {
    icon: DevelopersGlobalReachIcon,
    title: "Global investor reach",
    body: "Your project is visible to verified investors across supported markets from day one, without relying solely on expensive international marketing campaigns.",
  },
  {
    icon: DevelopersLegalStructureIcon,
    title: "Legal structure handled",
    body: "Asset Union creates the DAO LLC, drafts the investment agreement, and manages legal compliance in both the US and your local market.",
  },
] as const;
