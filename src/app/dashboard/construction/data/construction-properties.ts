import type { ConstructionTimelineIconKey } from "@/components/icons/construction-timeline-icons";
import type { PropertyCardProps } from "@/app/dashboard/dashboard/property-card";

export type TimelineStatus = "done" | "current" | "locked";
export type ConstructionTimelineStep = { id: string; title: string; description: string; status: TimelineStatus; dateLabel?: string; dateSubLabel?: string; iconKey: ConstructionTimelineIconKey };
export type ConstructionDocumentRow = { id: string; title: string; subtitle?: string; externalUrl?: string; action: "chevron" | "open" };
export type ConstructionSharePriceTabContent = { initialPrice: string; currentPrice: string; endConstructionPrice: string };
export type ConstructionCalculatorBreakdownRow = { label: string; value: string; valueMedium?: boolean };
export type ConstructionCalculatorTabContent = { min: number; max: number; ticks: readonly [number, number, number, number, number]; defaultAmount: number; youWillHaveMultiplier: number; breakdown: ConstructionCalculatorBreakdownRow[] };
export type ConstructionPropertyActivityRow = { id: string; title: string; description: string; dateMonth?: string; dateDay?: string; transactionHashUrl?: string };
export type ConstructionAboutPropertySection = { heading?: string; paragraphs?: string[]; bullets?: string[]; italicNote?: string };
export type ConstructionAboutPropertyTabContent = { intro: string; sections: ConstructionAboutPropertySection[] };
export type ConstructionPropertyInfoRow = { label: string; value: string };
export type ConstructionPropertyInfoStat = { label: string; value: string };
export type ConstructionPropertyInfoTabContent = { rows: ConstructionPropertyInfoRow[]; statRows: ConstructionPropertyInfoStat[][] };
export type ConstructionFaqItem = { id: string; question: string; answer?: string };
export type ConstructionPropertyRecord = {
  id?: string;
  slug: string;
  featured?: boolean;
  card: PropertyCardProps & { title: string; location: string; fundsCollected: string; coOwners: string; aprPercent?: string; constructionEndQuarter?: string };
  detail: {
    displayTitle?: string; heroImage: string; gallery: string[]; investorsLabel: string; statusBadge: string;
    totalRaised: string; raisedGoal: string; progressPercent: number; expectedExit: string; projectedRoi: string;
    projectedApr: string; sharePrice: string; sharePriceValue?: number; balanceDisplay: string; managerName: string;
    managerRole: string; companyName: string; companyTag: string; documents: ConstructionDocumentRow[];
    sharePriceTab: ConstructionSharePriceTabContent; calculatorTab: ConstructionCalculatorTabContent;
    propertyActivitiesTab: ConstructionPropertyActivityRow[]; howItWorksTab?: ConstructionAboutPropertyTabContent; aboutPropertyTab: ConstructionAboutPropertyTabContent;
    propertyInfoTab: ConstructionPropertyInfoTabContent; faqTab: ConstructionFaqItem[];
  };
  timeline: ConstructionTimelineStep[];
  constructionSiteTimeline: ConstructionTimelineStep[];
  asset?: string;
};
