import { CtaSection } from "./CtaSection";
import { FaqSection } from "./FaqSection";
import { HeroSection } from "./HeroSection";
import { HowItWorksSection } from "./HowItWorksSection";
import { LiveProjectsSection } from "./LiveProjectsSection";
import { ModelSection } from "./ModelSection";
import { ReturnsSection } from "./ReturnsSection";

export function ConstructionMarketPage() {
  return (
    <main className="bg-background">
      <HeroSection />
      <ModelSection />
      <HowItWorksSection />
      <ReturnsSection />
      <LiveProjectsSection />
      <FaqSection />
      <CtaSection />
    </main>
  );
}
