import {
  HomeAppShowcaseOverlay,
  HomeAuditedLogo,
  HomeConsultationChat,
  HomeDaoLlcBackground,
  HomeHeroStrip,
  HomeHowItWorksStep1,
  HomeHowItWorksStep2,
  HomeHowItWorksStep3,
  HomeHowItWorksStep4,
  HomeKycLogo,
  HomeLegalLogo,
  HomePaymentLogo,
} from "@/lib/assets";

export type ValueProp = { title: string; body: string };

export type PropertyCard = {
  id: string;
  status: string;
  name: string;
  location: string;
  metricLabel: string;
  metricValue: string;
  funds: string;
  owners: string;
  image: string;
};

export type ProcessStep = {
  id: string;
  title: string;
  body: string;
  image: string;
};

export type CompareRow = {
  feature: string;
  assetUnion: string;
  traditional: string;
};

export type ProtectionCard = { title: string; body: string };


export type TrustLogo = {
  label: string;
  image: string;
};

export const heroBackgroundImage = HomeHeroStrip.src;
export const securityImage = HomeDaoLlcBackground.src;
export const consultationImage = HomeConsultationChat.src;
export const appShowcaseImage = HomeAppShowcaseOverlay.src;

export const valueProps: ValueProp[] = [
  {
    title: "Rent Lands Daily. Not Quarterly.",
    body: "Most platforms make you wait 90 days to see a dollar. We calculate your share of rental income every 24 hours and deposit it into your account.",
  },
  {
    title: "Walk Away Whenever You Want.",
    body: "Traditional real estate traps your money for years. Our secondary market lets you list tokens and sell to another verified investor on your timeline.",
  },
  {
    title: "You Own It. Legally.",
    body: "Every property sits inside its own LLC. Your name goes on the cap table, recorded in legal documentation and on-chain.",
  },
  {
    title: "$50. That's the Barrier Now.",
    body: "No mortgage applications. No down payments. Pick a property, choose your amount, and own a piece of it.",
  },
];

export const processSteps: ProcessStep[] = [
  {
    id: "01",
    title: "Create Your Account and Confirm Your Identity",
    body: "Sign up with your email. Then complete a quick identity check - upload your ID, scan your face, done. Takes under three minutes.",
    image: HomeHowItWorksStep1.src,
  },
  {
    id: "02",
    title: "Explore Properties and Read Everything",
    body: "Every listing shows you the full picture before you commit anything. Property value. Rental income. Operating expenses. Tenant status.",
    image: HomeHowItWorksStep2.src,
  },
  {
    id: "03",
    title: "Buy Tokens and Become a Legal Owner",
    body: "Pick a property. Choose your amount - starting at $50. Pay with your bank account, debit card, or crypto.",
    image: HomeHowItWorksStep3.src,
  },
  {
    id: "04",
    title: "Collect Rent Every Day. Sell Whenever You Want.",
    body: "Rental income from your property is calculated daily and deposited into your account. Claim whatever you have earned from your dashboard.",
    image: HomeHowItWorksStep4.src,
  },
];

export const compareRows: CompareRow[] = [
  {
    feature: "Minimum Investment",
    assetUnion: "$50",
    traditional: "$30,000-$100,000+",
  },
  {
    feature: "Time to Purchase",
    assetUnion: "Under 5 minutes",
    traditional: "30-90 days",
  },
  {
    feature: "Due Diligence",
    assetUnion: "Every document provided on the property page.",
    traditional: "Hire your own inspector, appraiser, attorney",
  },
  {
    feature: "Rental Income",
    assetUnion: "Daily",
    traditional: "Monthly or quarterly after expenses you manage yourself",
  },
  {
    feature: "Liquidity",
    assetUnion: "List and sell instantly on secondary market.",
    traditional: "3-12 months to sell through a broker",
  },
  {
    feature: "Diversification",
    assetUnion: "Multiple properties from $50 each",
    traditional: "One property per $30k+ invested",
  },
  {
    feature: "Legal Structure",
    assetUnion: "Single-asset LLC, liability isolated per property",
    traditional: "Personal debt, personal liability",
  },
  {
    feature: "Transparency",
    assetUnion: "Full financials, inspection reports, lease docs",
    traditional: "Whatever your agent and PM choose to share",
  },
  {
    feature: "Selling Costs",
    assetUnion: "No commission, peer-to-peer, sell at market price",
    traditional: "6% agent commission, closing costs, staging",
  },
];

export const protectionCards: ProtectionCard[] = [
  {
    title: "Each Property, Its Own LLC",
    body: "Your tokens represent legal membership in a single-asset LLC. One property, one entity. Liability is isolated. Your rights are documented in an Operating Agreement you sign before your first purchase.",
  },
  {
    title: "Compliance Is Coded In",
    body: "Every investor is KYC-verified. Every wallet is whitelisted on-chain. Tokens are frozen by default and can only move between approved addresses. This is how the smart contract works.",
  },
  {
    title: "Audited. Multi-Sig. Encrypted.",
    body: "Smart contracts are independently audited before mainnet deployment. Platform treasury requires multi-signature approval. Personal data is encrypted at rest with AES-256.",
  },
];


export const trustLogos: TrustLogo[] = [
  { label: "KYC by", image: HomeKycLogo.src },
  { label: "Payment by", image: HomePaymentLogo.src },
  { label: "Audited by", image: HomeAuditedLogo.src },
  { label: "Legal by", image: HomeLegalLogo.src },
];

