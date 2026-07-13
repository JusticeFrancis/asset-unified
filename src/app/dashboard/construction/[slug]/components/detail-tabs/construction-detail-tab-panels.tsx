"use client";

import type { ConstructionPropertyRecord } from "@/app/dashboard/construction/data/construction-properties";

import { ConstructionAboutPropertyTabPanel } from "./construction-about-property-tab-panel";
import { ConstructionCalculatorTabPanel } from "./construction-calculator-tab-panel";
import { ConstructionDocumentTabPanel } from "./construction-document-tab-panel";
import { ConstructionFaqTabPanel } from "./construction-faq-tab-panel";
import { ConstructionPropertyActivitiesTabPanel } from "./construction-property-activities-tab-panel";
import { ConstructionPropertyInfoTabPanel } from "./construction-property-info-tab-panel";
import { ConstructionSharePriceTabPanel } from "./construction-share-price-tab-panel";
import { ConstructionTimelineTabPanel } from "./construction-timeline-tab-panel";

const TAB_INDEX = {
  timeline: 0,
  howItWorks: 1,
  sharePrice: 2,
  calculator: 3,
  document: 4,
  activities: 5,
  about: 6,
  info: 7,
  faq: 8,
} as const;

const EMPTY_CONTENT = { intro: "", sections: [] };

type ConstructionDetailTabPanelsProps = {
  property: ConstructionPropertyRecord;
  activeTab: number;
};

export function ConstructionDetailTabPanels({
  property,
  activeTab,
}: ConstructionDetailTabPanelsProps) {
  switch (activeTab) {
    case TAB_INDEX.timeline:
      return <ConstructionTimelineTabPanel property={property} />;
    case TAB_INDEX.howItWorks:
      return (
        <ConstructionAboutPropertyTabPanel
          content={property.detail.howItWorksTab ?? EMPTY_CONTENT}
          heading="How it Works"
        />
      );
    case TAB_INDEX.sharePrice:
      return <ConstructionSharePriceTabPanel sharePrice={property.detail.sharePriceTab} />;
    case TAB_INDEX.calculator:
      return <ConstructionCalculatorTabPanel calculator={property.detail.calculatorTab} />;
    case TAB_INDEX.document:
      return <ConstructionDocumentTabPanel documents={property.detail.documents} />;
    case TAB_INDEX.activities:
      return <ConstructionPropertyActivitiesTabPanel activities={property.detail.propertyActivitiesTab} />;
    case TAB_INDEX.about:
      return <ConstructionAboutPropertyTabPanel content={property.detail.aboutPropertyTab} />;
    case TAB_INDEX.info:
      return <ConstructionPropertyInfoTabPanel info={property.detail.propertyInfoTab} />;
    case TAB_INDEX.faq:
      return <ConstructionFaqTabPanel items={property.detail.faqTab} />;
    default:
      return <ConstructionTimelineTabPanel property={property} />;
  }
}
