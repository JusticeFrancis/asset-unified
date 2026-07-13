import { CtaSection } from "./CtaSection";
import { FaqSection } from "./FaqSection";
import { HeroSection } from "./HeroSection";
import { HowItWorksSection } from "./HowItWorksSection";
import { LivePropertiesSection } from "./LivePropertiesSection";
import { OwnershipSection } from "./OwnershipSection";

export function RentalMarketPage() {
  return (
    <main className="bg-background">
      <HeroSection />
      <HowItWorksSection />
      <LivePropertiesSection />
      <OwnershipSection />
      <FaqSection />
      <CtaSection />
    </main>
  );
}
