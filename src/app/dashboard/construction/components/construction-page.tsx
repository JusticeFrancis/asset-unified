import { ConstructionHeroBanner } from "./construction-hero-banner";
import { ConstructionPropertiesGrid } from "./construction-properties-grid";

export default function ConstructionPage() {
  return (
    <div className="mx-auto flex w-full max-w-[1118px] flex-col gap-5">
      <ConstructionHeroBanner />
      <ConstructionPropertiesGrid />
    </div>
  );
}
