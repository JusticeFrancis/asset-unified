import type { PropertyCardProps } from "@/app/dashboard/dashboard/property-card";
import type { ConstructionAboutPropertyTabContent, ConstructionDocumentRow, ConstructionPropertyActivityRow } from "@/app/dashboard/construction/data/construction-properties";

export type RentalPropertyQuickOption = { shares: number; usdLabel: string };
export type RentalKvRow = { label: string; value: string };
export type RentalManagementTabRow = { type: "kv"; label: string; value: string } | { type: "links"; label: string; links: { label: string; href: string }[] };
export type RentalManagementTabCard = { companyName: string; subtitle: string; imageSrc?: string; href?: string };
export type RentalManagementTabContent = { rows: RentalManagementTabRow[]; card: RentalManagementTabCard };
export type RentalFinancialsTabContent = { rows: RentalKvRow[] };
export type RentalLandOwnershipTabContent = { rows: RentalKvRow[] };
export type RentalLocationTabContent = { embedUrl: string; largeMapUrl?: string };
export type RentalPropertyRecord = {
  id?: string;
  slug: string;
  isFeatured: boolean;
  featured?: boolean;
  featuredMeta?: { coOwners: string; fundsCollected: string; aprPercent: string };
  card: PropertyCardProps & { title: string; location: string; fundsCollected: string; coOwners: string; aprPercent?: string };
  detail: {
    displayTitle?: string; heroImage: string; gallery: string[]; investorsCount: string; statusBadgeLabel: string;
    propertyPrice: string; aprPercent: string; ecaLabel: string; sharePrice: string; sharePriceValue?: number;
    collectedPercent: number; balanceDisplay: string; primaryCtaLabel: string; quickShareOptions: RentalPropertyQuickOption[];
    managerPrompt: string; managerName: string; managerRole: string; managementCompanyName: string; companyTag: string;
    documents: ConstructionDocumentRow[]; descriptionTab: ConstructionAboutPropertyTabContent;
    propertyActivitiesTab: ConstructionPropertyActivityRow[]; managementTab: RentalManagementTabContent;
    financialsTab: RentalFinancialsTabContent; landOwnershipTab: RentalLandOwnershipTabContent; locationTab: RentalLocationTabContent;
  };
  asset?: string;
};
