import Link from "next/link";

import { DetailTabChevronRightIcon } from "@/app/dashboard/construction/[slug]/components/detail-tabs/detail-tab-icons";

import type {
  RentalManagementTabCard,
  RentalManagementTabRow,
} from "@/app/dashboard/rental/data/rental-properties";

type RentalManagementTabPanelProps = {
  rows: RentalManagementTabRow[];
  card: RentalManagementTabCard;
};

function ManagementRow({ row }: { row: RentalManagementTabRow }) {
  if (row.type === "links") {
    return (
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-2 text-[16px] font-normal leading-normal">
        <p className="max-w-[min(100%,20rem)] text-[#919191]">{row.label}</p>
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-5 text-[#050a0e]">
          {row.links.map((link) => (
            <Link
              className="whitespace-nowrap transition-colors hover:text-brand"
              href={link.href}
              key={link.href}
              rel="noopener noreferrer"
              target="_blank"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-2 text-[16px] font-normal leading-normal">
      <p className="text-[#919191]">{row.label}</p>
      <p className="shrink-0 text-right whitespace-nowrap text-[#050a0e]">
        {row.value}
      </p>
    </div>
  );
}

function ManagementCompanyCard({ card }: { card: RentalManagementTabCard }) {
  const body = (
    <div className="flex items-center justify-between gap-4">
      <div className="flex min-w-0 items-start gap-2">
        <div className="size-[47.5px] shrink-0 overflow-hidden rounded-lg bg-[#edf4f8]">
          {card.imageSrc ? (
            <img
              alt=""
              className="size-full object-cover"
              src={card.imageSrc}
            />
          ) : null}
        </div>
        <div className="min-w-0">
          <p className="text-[14px] font-light text-[#050a0e]">
            {card.companyName}
          </p>
          <p className="text-[12px] font-medium text-[#919191]">
            {card.subtitle}
          </p>
        </div>
      </div>
      <DetailTabChevronRightIcon
        aria-hidden
        className="size-3 shrink-0 text-[#050a0e]"
      />
    </div>
  );

  return (
    <div className="mt-4 rounded-[24px] border border-[#5c60cc] bg-[rgba(92,96,204,0.15)] p-4">
      {card.href ? (
        <Link
          className="block text-inherit no-underline"
          href={card.href}
          rel={card.href.startsWith("http") ? "noopener noreferrer" : undefined}
          target={card.href.startsWith("http") ? "_blank" : undefined}
        >
          {body}
        </Link>
      ) : (
        body
      )}
    </div>
  );
}

export function RentalManagementTabPanel({
  rows,
  card,
}: RentalManagementTabPanelProps) {
  return (
    <div className="rounded-[16px] bg-white px-4 py-6 shadow-[0_1px_4px_rgba(12,12,13,0.05)] sm:px-6 sm:py-12 md:px-[100px]">
      <h3 className="mb-4 text-[19px] font-medium text-[#050a0e]">
        Management
      </h3>
      <div className="flex flex-col">
        {rows.map((row, i) => (
          <ManagementRow key={`${row.type}-${i}`} row={row} />
        ))}
      </div>
      <ManagementCompanyCard card={card} />
    </div>
  );
}
