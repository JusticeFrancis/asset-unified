import Image from "next/image";
import {
  ConstructionMarketAprTrendIcon,
  ConstructionMarketCardFundingIcon,
  ConstructionMarketCardFundedIcon,
  ConstructionMarketCardStrategyIcon,
} from "@/lib/assets";
import { MarketingCard } from "../../components/MarketingCard";
import { PrimaryButton } from "../../components/shared";
import type { ConstructionProjectCard } from "./data";

const statusMap = {
  funding: {
    icon: ConstructionMarketCardFundingIcon,
    label: "Construction Funding",
  },
  funded: {
    icon: ConstructionMarketCardFundedIcon,
    label: "Funded",
  },
  strategy: {
    icon: ConstructionMarketCardStrategyIcon,
    label: "Strategy Executed",
  },
} as const;

export function ProjectCard({
  name,
  location,
  apr,
  funded,
  coOwners,
  image,
  status,
}: ConstructionProjectCard) {
  const statusConfig = statusMap[status];

  return (
    <MarketingCard
      name={name}
      location={location}
      image={image}
      imageRatio="tall"
      pills={[
        {
          icon: (
            <Image
              src={statusConfig.icon}
              alt=""
              aria-hidden
              className="size-3"
            />
          ),
          label: statusConfig.label,
        },
      ]}
      topRight={
        <>
          <div className="flex items-center justify-end gap-1 text-xs text-[#919191]">
            <Image
              src={ConstructionMarketAprTrendIcon}
              alt=""
              aria-hidden
              className="size-4"
            />
            APR
          </div>
          <p className="mt-1 text-sm font-medium text-brand">{apr}</p>
        </>
      }
      stats={[
        { label: "Funds Collected:", value: funded },
        { label: "Co-owners:", value: coOwners },
      ]}
      actions={
        <PrimaryButton href="/sign-in" size="sm" className="w-full sm:w-full">
          View Project
        </PrimaryButton>
      }
    />
  );
}
