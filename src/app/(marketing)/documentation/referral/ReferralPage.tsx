import { CtaSection } from "./CtaSection";
import { EarningsScenariosSection } from "./EarningsScenariosSection";
import { FaqSection } from "./FaqSection";
import { HeroSection } from "./HeroSection";
import { HowToStartSection } from "./HowToStartSection";
import { LinkOptionsSection } from "./LinkOptionsSection";
import { TestimonialsSection } from "./TestimonialsSection";
import { WhyReferSection } from "./WhyReferSection";

export function ReferralPage() {
  return (
    <main className="bg-background">
      <HeroSection />
      <WhyReferSection />
      <EarningsScenariosSection />
      <HowToStartSection />
      <LinkOptionsSection />
      <TestimonialsSection />
      <FaqSection />
      <CtaSection />
    </main>
  );
}
