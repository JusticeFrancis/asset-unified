import {
  PartnersCtaChatIllustration,
  PartnersCtaFreeConsultationIcon,
} from "@/lib/assets";
import { SolutionsConsultationCta } from "../../components/SolutionsConsultationCta";

export function CtaSection() {
  return (
    <SolutionsConsultationCta
      title="Need Help in Cutting down Marketing Cost?"
      body="Get a free personalized investment consultation from our experts. We will help you understand the projected results, select the right property, and maximize your potential profit."
      buttonIcon={PartnersCtaFreeConsultationIcon}
      illustration={PartnersCtaChatIllustration}
    />
  );
}
