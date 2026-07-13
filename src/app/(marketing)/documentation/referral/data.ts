import {
  ReferralCopyLightIcon,
  ReferralFeatureMultiLevelIcon,
  ReferralFeatureOwnershipIcon,
  ReferralFeaturePassiveIncomeIcon,
  ReferralFeatureQualityIcon,
} from "@/lib/assets";

export const whyReferCards = [
  {
    eyebrow: "PASSIVE INCOME",
    title: "Earn while they earn",
    icon: ReferralFeaturePassiveIncomeIcon,
    body: "Receive 3% of every investment your referral makes in their first 3 months. One active investor making $2,000/month means $60 for you - every month.",
  },
  {
    eyebrow: "QUALITY PROPERTIES",
    title: "Only 1-in-10 listings qualify",
    icon: ReferralFeatureQualityIcon,
    body: "Your friends invest in properties that pass rigorous due diligence. Only 1-2 out of every 10 submitted projects make it to the platform - you are recommending real quality.",
  },
  {
    eyebrow: "MULTI-LEVEL REWARDS",
    title: "Earn 1.5% from 2nd level",
    icon: ReferralFeatureMultiLevelIcon,
    body: "When your referrals invite their own friends, you earn 1.5% on those investments too - completely automatically, with zero extra effort on your part.",
  },
  {
    eyebrow: "REAL OWNERSHIP FOR YOUR FRIENDS",
    title: "You are sharing genuine fractional real estate",
    icon: ReferralFeatureOwnershipIcon,
    body: "Every property is tokenized via a Wyoming DAO LLC with a verified smart contract and investment agreement. Your referrals get real ownership rights - not just a digital token.",
  },
  {
    eyebrow: "NO WITHDRAWAL FEES",
    title: "0% fee, any amount",
    icon: "$",
    body: "When your rewards unlock, there are no withdrawal fees, no minimum amount, and payouts are processed within 24 hours directly to your account balance.",
  },
];


export const howToStartSteps = [
  {
    id: "01",
    title: "Get your unique referral link",
    body: "A tracking link is generated in your profile as soon as you complete KYC. It tracks all visitors and any resulting investments for 3 months.",
    action: "Get my Link",
  },
  {
    id: "02",
    title: "Share it anywhere and earn automatically",
    body: "Send your link in messenger, social media, email, or in person. Every time your contact invests, 3% lands in your account automatically.",
    action: "Share channels",
  },
];

export const referralLinkCards = [
  {
    kicker: "When a friend knows exactly what they want",
    title: "Property-specific link",
    body: "Send them directly to a specific villa or apartment with your referral ID embedded.",
    tone: "bg-[#E2E3F9]",
  },
  {
    kicker: "For those ready to sign up",
    title: "Registration link",
    body: "Skip browsing and send them straight to sign up so they can register and get verified immediately.",
    tone: "bg-[#D9F1E2]",
  },
  {
    kicker: "For reference",
    title: "Platform link",
    body: "Let your friend browse the full platform, explore properties, and read how everything works.",
    tone: "bg-[#FEF3E3]",
  },
];



export const shareChannels = [
  {
    label: "Whatsapp",
    icon: "/images/documentation/referral/icons/whatsapp.svg",
  },
  {
    label: "Telegram",
    icon: "/images/documentation/referral/icons/telegram.svg",
  },
  {
    label: "Share link",
    icon: "/images/documentation/referral/icons/share-link.svg",
  },
];

export const copyIcon = ReferralCopyLightIcon;
