export const RENTAL_DETAIL_TABS = [
  "Description",
  "Documents",
  "Property",
  "Management",
  "Financials",
  "Land Ownership",
  "Location",
] as const;

/** Mirrors `ConstructionDetailTabPanels` tab routing style. */
export const RENTAL_TAB_INDEX = {
  description: 0,
  documents: 1,
  property: 2,
  management: 3,
  financials: 4,
  landOwnership: 5,
  location: 6,
} as const;
