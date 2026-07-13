import { PropertyCard } from "@/app/dashboard/dashboard/property-card";

import {
  getPartnerPropertyCardProps,
  type PartnerDetailRecord,
} from "@/app/dashboard/partner/data/partner-records";

type PartnerDetailViewProps = {
  partner: PartnerDetailRecord;
};

export function PartnerDetailView({ partner }: PartnerDetailViewProps) {
  const { headerAvatarSrc, name, description, linkedProperties } = partner;

  return (
    <div className="mx-auto flex w-full max-w-[1118px] flex-col gap-6">
      <div className="flex flex-col gap-4 rounded-[20px] bg-white p-4 shadow-[0_1px_4px_rgba(12,12,13,0.05)] sm:flex-row sm:items-center sm:gap-6 sm:rounded-[32px] sm:p-6">
        <div className="relative mx-auto size-[111.344px] shrink-0 overflow-hidden rounded-full sm:mx-0">
          <img
            alt=""
            className="absolute inset-0 size-full object-cover"
            src={headerAvatarSrc}
          />
        </div>
        <div className="min-w-0 flex-1 text-[#050a0e]">
          <h2 className="text-[24px] font-medium leading-tight sm:text-[28px] sm:leading-none md:text-[34px]">
            {name}
          </h2>
          <p className="mt-1 text-[16px] font-light">{description}</p>
        </div>
      </div>

      <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(min(100%,342px),1fr))] gap-6">
        {linkedProperties.map((link, index) => {
          const card = getPartnerPropertyCardProps(link);
          return <PropertyCard key={`${link.rentalSlug}-${index}`} {...card} />;
        })}
      </div>
    </div>
  );
}
