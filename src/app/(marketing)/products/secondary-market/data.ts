export type SecondaryValueCard = {
  title: string;
  body: string;
  icon: "blocks" | "liquidity" | "legal" | "shield";
  highlighted?: boolean;
};

export type SecondaryHowItWorksStep = {
  id: string;
  title: string;
  body: string;
};

export type SecondaryMarketCard = {
  name: string;
  location: string;
  propertyPrice: string;
  shares: string;
  sharePrice: string;
  apr: string;
  aprDelta: string;
  image?: string;
};

export const secondaryValueCards: SecondaryValueCard[] = [
  {
    title: "Peer-to-peer, not platform-to-you",
    body: "Shares on the secondary market are sold by other investors, not by Asset Union. You're buying someone's existing ownership stake in a real property LLC at the seller's listed price.",
    icon: "blocks",
    highlighted: true,
  },
  {
    title: "No lock-up periods",
    body: "There's no minimum holding period. You can list your shares for sale from the day after purchase settles. The secondary market is always open, and buyers and sellers set their own terms.",
    icon: "liquidity",
  },
  {
    title: "Your legal rights transfer with the shares",
    body: "When a trade completes, LLC membership transfers to the new owner. They inherit rent entitlement, governance rights, and legal documentation, all recorded on-chain.",
    icon: "legal",
  },
  {
    title: "Every trade is compliance-checked",
    body: "Shares can only move between KYC-verified, whitelisted wallets. No unverified wallet can receive a transfer, and each transaction is recorded on-chain.",
    icon: "shield",
  },
];

export const secondaryHowItWorksSteps: SecondaryHowItWorksStep[] = [
  {
    id: "01",
    title: "Browse available listings",
    body: "Filter by property type, location, APR, or share price. See how many shares are available, at what price, and from which property.",
  },
  {
    id: "02",
    title: "Enter the number of shares",
    body: "Choose how many shares to buy. Your USDT balance is shown in real time. A 3% discount is applied at checkout as a buyer incentive.",
  },
  {
    id: "03",
    title: "Confirm the transaction",
    body: "Review the order summary: asset name, shares, share price, and total. Confirm once, and the transaction is final and recorded on-chain.",
  },
  {
    id: "04",
    title: "Ownership and rent start the next day",
    body: "Shares appear in your portfolio. Daily rent starts accruing from the next calculation cycle, and your LLC membership is now reflected on the cap table.",
  },
];

export const secondaryFaqs = [
  "Can I sell my shares at any time?",
  "How is the share price determined on the secondary market?",
  "What is the 3% buyer discount?",
  "Do I earn rent on shares bought through the secondary market?",
  "Is the secondary market the same for all property types?",
  "What if no one wants to buy my shares?",
];
