import { DASHBOARD_ASSETS } from "@/app/dashboard/components/dashboard-assets";

import { ConstructionStagesRow } from "./construction-stages-row";

export function ConstructionHeroBanner() {
  return (
    <div className="relative w-full overflow-hidden rounded-[12px]">
      <div className="relative min-h-[280px] w-full md:aspect-[1116/324] md:min-h-0">
        <img
          alt=""
          className="absolute inset-0 size-full object-cover"
          src={DASHBOARD_ASSETS.main.propertyCardB}
        />
        <div
          aria-hidden
          className="absolute inset-0 rounded-[12px]"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0) 57.8%, rgba(0,0,0,0.2) 87.3%), linear-gradient(90deg, rgba(0,0,0,0.1), rgba(0,0,0,0.1)), linear-gradient(90deg, rgba(0,0,0,0.2), rgba(0,0,0,0.2))",
          }}
        />
        <div className="relative flex min-h-[280px] flex-col items-center justify-between gap-6 px-6 py-8 md:min-h-0 md:justify-center md:py-24">
          <p className="text-center text-[24px] font-medium text-[#f5f7f8] sm:text-[28px] md:text-[34px]">
            Stages In Construction
          </p>
          {/* Mobile: stages live in the same flex column as the title so they
              never collide. The desktop variant below is pinned to the banner
              bottom to match the original Figma layout. */}
          <div className="w-full md:hidden">
            <ConstructionStagesRow variant="inline" />
          </div>
        </div>
        <div className="hidden md:block">
          <ConstructionStagesRow variant="floating" />
        </div>
      </div>
    </div>
  );
}
