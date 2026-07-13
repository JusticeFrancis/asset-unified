import Image from "next/image";
import {
  RentalMarketAprTrendIcon,
  RentalMarketCardFundedIcon,
  RentalMarketCardIncomeIcon,
} from "@/lib/assets";
import { MarketingCard } from "../../components/MarketingCard";
import { PrimaryButton } from "../../components/shared";
import type { RentalPropertyCard } from "./data";

type PropertyCardProps = RentalPropertyCard;

export function PropertyCard({
  name,
  location,
  apr,
  funded,
  coOwners,
  statuses,
  image,
}: PropertyCardProps) {
  const pills = [];
  if (statuses.includes("income")) {
    pills.push({
      icon: (
        <Image
          src={RentalMarketCardIncomeIcon}
          alt=""
          aria-hidden
          className="size-3"
        />
      ),
      label: "Instant Income",
    });
  }
  if (statuses.includes("funded")) {
    pills.push({
      icon: (
        <Image
          src={RentalMarketCardFundedIcon}
          alt=""
          aria-hidden
          className="size-3"
        />
      ),
      label: "Funded",
    });
  }

  return (
    <MarketingCard
      name={name}
      location={location}
      image={image}
      imageRatio="tall"
      pills={pills}
      topRight={
        <>
          <div className="flex items-center justify-end gap-1 text-xs text-[#919191]">
            <Image
              src={RentalMarketAprTrendIcon}
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
        <PrimaryButton
          href="/sign-in"
          size="sm"
          className="w-full bg-brand text-white sm:w-full"
        >
          View More
        </PrimaryButton>
      }
    />
  );
}
