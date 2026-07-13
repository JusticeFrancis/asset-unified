import { AppDownloadSection } from "./AppDownloadSection";
import { ComparisonCalculatorSection } from "./ComparisonCalculatorSection";
import { ConsultationSection } from "./ConsultationSection";
import { CtaSection } from "./CtaSection";
import { FaqSection } from "./FaqSection";
import { HeroSection } from "./HeroSection";
import { HowItWorksSection } from "./HowItWorksSection";
import { ListingsSection } from "./ListingsSection";
import { ProtectionSection } from "./ProtectionSection";
import { SocialProofSection } from "./SocialProofSection";
import { WhatIsItFeatureCardsSection } from "./WhatIsItFeatureCardsSection";

export function HomePage() {
  return (
    <main className="bg-background">
      <HeroSection />
      <WhatIsItFeatureCardsSection />
      <ListingsSection />
      <HowItWorksSection />
      <ComparisonCalculatorSection />
      <ProtectionSection />
      <CtaSection />
      <ConsultationSection />
      <SocialProofSection />
      <FaqSection />
      <AppDownloadSection />
    </main>
  );
}
