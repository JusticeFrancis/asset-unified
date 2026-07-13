import type { Metadata } from "next";
import { MarketingChrome } from "./components/MarketingChrome";

export const metadata: Metadata = {
  title: "Asset Union | Fractional Real Estate",
  description:
    "Own fractional real estate from $50 with daily rental distributions, legal LLC ownership, and on-chain transparency.",
};

export default function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <MarketingChrome>{children}</MarketingChrome>;
}
