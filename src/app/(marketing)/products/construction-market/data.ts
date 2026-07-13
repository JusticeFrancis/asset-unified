export type ConstructionStep = {
  id: string;
  title: string;
  body: string;
};

export type ConstructionProjectCard = {
  name: string;
  location: string;
  apr: string;
  funded: string;
  coOwners: string;
  status: "funding" | "funded" | "strategy";
  image?: string;
};

export const constructionHowItWorksSteps: ConstructionStep[] = [
  {
    id: "01",
    title: "Funding phase",
    body: "The project is listed for investment. Verified investors buy tokens from $50. Funds are held in the on-chain escrow vault. If the funding target isn't met by the deadline, funds are returned in full.",
  },
  {
    id: "02",
    title: "Construction phase",
    body: "The developer draws funds from escrow as milestones are reached, not upfront. Token holders track real-time build progress, photo updates, and milestone completions from their dashboard.",
  },
  {
    id: "03",
    title: "Completion & handover",
    body: "On practical completion, the property is inspected and handed over to the property manager (Model A) or listed for sale (Model B). Token price reflects the completed asset value.",
  },
  {
    id: "04",
    title: "Income or sale proceeds",
    body: "Model A: daily rental income starts flowing. Model B: sale proceeds are distributed in USDC when the property sells. Either way, you can sell your tokens on the secondary market at any point.",
  },
];

export const constructionFaqs = [
  "What happens to my money during construction before the property is complete?",
  "What if the project is delayed or the developer runs into problems?",
  "Can I sell my tokens before the construction is complete?",
  "What if the funding target isn't reached?",
  "How are sale proceeds distributed for Build to Sell projects?",
];
