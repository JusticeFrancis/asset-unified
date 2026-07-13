import { CtaSection } from "./CtaSection";
import { DaoRegistrationSection } from "./DaoRegistrationSection";
import { DaoLlcBasicsSection } from "./DaoLlcBasicsSection";
import { FaqSection } from "./FaqSection";
import { HeroSection } from "./HeroSection";
import { InvestmentAgreementSection } from "./InvestmentAgreementSection";
import { LegalSecuritySection } from "./LegalSecuritySection";
import { SmartContractsSection } from "./SmartContractsSection";
import { WalletOwnershipSection } from "./WalletOwnershipSection";

export function DaoLlcPage() {
  return (
    <main className="bg-background">
      <HeroSection />
      <LegalSecuritySection />
      <DaoLlcBasicsSection />
      <DaoRegistrationSection />
      <InvestmentAgreementSection />
      <SmartContractsSection />
      <WalletOwnershipSection />
      <FaqSection />
      <CtaSection />
    </main>
  );
}
