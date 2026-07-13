"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./Footer";
import { Header } from "./Header";

type MarketingChromeProps = {
  children: React.ReactNode;
};

export function MarketingChrome({ children }: MarketingChromeProps) {
  const pathname = usePathname();
  const hideMarketingChrome = pathname === "/sign-in";

  if (hideMarketingChrome) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
