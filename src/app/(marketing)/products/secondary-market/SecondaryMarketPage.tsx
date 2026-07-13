import { CtaSection } from "./CtaSection";
import { FaqSection } from "./FaqSection";
import { HeroSection } from "./HeroSection";
import { HowItWorksSection } from "./HowItWorksSection";
import { LiveMarketsSection } from "./LiveMarketsSection";
import { WhatIsItSection } from "./WhatIsItSection";

export function SecondaryMarketPage() {
  return (
    <main className="bg-background">
      <HeroSection />
      <WhatIsItSection />
      <HowItWorksSection />
      <LiveMarketsSection />
      <FaqSection />
      <CtaSection />
    </main>
  );
}
