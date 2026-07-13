import { BenefitsSection } from "./BenefitsSection";
import { CtaSection } from "./CtaSection";
import { HeroSection } from "./HeroSection";

export function DevelopersPage() {
  return (
    <main className="bg-background">
      <HeroSection />
      <BenefitsSection />
      <CtaSection />
    </main>
  );
}
