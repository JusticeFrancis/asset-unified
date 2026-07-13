export type RentalHowItWorksStep = {
  id: string;
  title: string;
  body: string;
};

export type RentalOwnershipCard = {
  title: string;
  body: string;
  icon: "agreement" | "secondary-market" | "liability" | "dual-record";
};

export type RentalPropertyCard = {
  name: string;
  location: string;
  apr: string;
  funded: string;
  coOwners: string;
  statuses: ("income" | "funded")[];
  image?: string;
};

export const rentalHowItWorksSteps: RentalHowItWorksStep[] = [
  {
    id: "01",
    title: "Each property is a single-asset LLC",
    body: "Before shares go on sale, the property is transferred into a dedicated Limited Liability Company - one LLC per property. This legally separates each property from every other asset on the platform, and from Asset Union itself.",
  },
  {
    id: "02",
    title: "Shares are minted as ERC-3643 security tokens",
    body: "LLC membership is divided into a fixed number of shares and issued as security tokens on the Polygon blockchain. Each token represents a proportional ownership stake recorded both on-chain and in the LLC's legal documentation.",
  },
  {
    id: "03",
    title: "You buy shares, you join the LLC",
    body: "When you purchase shares, you digitally sign the LLC Operating Agreement and become a member of record. Your ownership is logged on the cap table, and your wallet address is whitelisted for that property's token contract.",
  },
  {
    id: "04",
    title: "A licensed property manager runs everything",
    body: "You have no landlord responsibilities. A licensed property manager handles tenants, maintenance, and legal compliance. Monthly rent is collected, verified, converted to USDC, and distributed daily to token holders.",
  },
];

export const rentalOwnershipCards: RentalOwnershipCard[] = [
  {
    title: "Signed LLC Operating Agreement",
    body: "Before your first purchase settles, you digitally sign the Operating Agreement for that property's LLC. It covers your income entitlement, voting rights, and transfer restrictions.",
    icon: "agreement",
  },
  {
    title: "Exit on the secondary market",
    body: "When you're ready to sell, list your shares on the P2P secondary market. Another verified investor buys them. No broker, no closing costs, no lock-up.",
    icon: "secondary-market",
  },
  {
    title: "Liability isolated per property",
    body: "Because each property is its own LLC, any legal or financial issue with one property cannot affect another. Your exposure is limited to the shares you hold in that specific property.",
    icon: "liability",
  },
  {
    title: "Dual-recorded ownership",
    body: "Your ownership is recorded in two places: as a token balance on the Polygon blockchain and in the LLC's legal cap table.",
    icon: "dual-record",
  },
];

export const rentalFaqs = [
  "What is the minimum investment?",
  "How is rental income calculated and distributed?",
  "Do I have any landlord responsibilities?",
  "What if the property has no tenant or the rent drops?",
  "Can I invest in multiple properties at once?",
];
