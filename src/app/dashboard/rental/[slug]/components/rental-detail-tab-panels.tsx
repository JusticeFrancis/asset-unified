"use client";

import { ConstructionAboutPropertyTabPanel } from "@/app/dashboard/construction/[slug]/components/detail-tabs/construction-about-property-tab-panel";
import { ConstructionDocumentTabPanel } from "@/app/dashboard/construction/[slug]/components/detail-tabs/construction-document-tab-panel";
import { ConstructionPropertyActivitiesTabPanel } from "@/app/dashboard/construction/[slug]/components/detail-tabs/construction-property-activities-tab-panel";
import type { RentalPropertyRecord } from "@/app/dashboard/rental/data/rental-properties";

import { RENTAL_TAB_INDEX } from "./rental-detail-tab-definitions";
import { RentalKvTabPanel } from "./detail-tabs/rental-kv-tab-panel";
import { RentalLocationTabPanel } from "./detail-tabs/rental-location-tab-panel";
import { RentalManagementTabPanel } from "./detail-tabs/rental-management-tab-panel";

type RentalDetailTabPanelsProps = {
  activeTab: number;
  property: RentalPropertyRecord;
};

export function RentalDetailTabPanels({
  activeTab,
  property,
}: RentalDetailTabPanelsProps) {
  const { detail } = property;

  switch (activeTab) {
    case RENTAL_TAB_INDEX.description:
      return (
        <ConstructionAboutPropertyTabPanel
          content={detail.descriptionTab}
          heading="Description"
        />
      );
    case RENTAL_TAB_INDEX.documents:
      return <ConstructionDocumentTabPanel documents={detail.documents} />;
    case RENTAL_TAB_INDEX.property:
      return (
        <ConstructionPropertyActivitiesTabPanel
          activities={detail.propertyActivitiesTab}
          showTimelineConnector
        />
      );
    case RENTAL_TAB_INDEX.management:
      return (
        <RentalManagementTabPanel
          card={detail.managementTab.card}
          rows={detail.managementTab.rows}
        />
      );
    case RENTAL_TAB_INDEX.financials:
      return (
        <RentalKvTabPanel
          heading="Financials"
          rows={detail.financialsTab.rows}
        />
      );
    case RENTAL_TAB_INDEX.landOwnership:
      return (
        <RentalKvTabPanel
          heading="Land Ownership"
          rows={detail.landOwnershipTab.rows}
        />
      );
    case RENTAL_TAB_INDEX.location:
      return (
        <RentalLocationTabPanel
          embedUrl={detail.locationTab.embedUrl}
          largeMapUrl={detail.locationTab.largeMapUrl}
        />
      );
    default:
      return null;
  }
}
