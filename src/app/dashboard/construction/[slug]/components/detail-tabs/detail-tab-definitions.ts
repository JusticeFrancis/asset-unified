export const CONSTRUCTION_DETAIL_TABS = [
  "Timeline",
  "How it Works",
  "Share Price",
  "Calculator",
  "Document",
  "Property Activities",
  "About Property",
  "Property Info",
  "FAQ",
] as const;

export type ConstructionDetailTabLabel =
  (typeof CONSTRUCTION_DETAIL_TABS)[number];
