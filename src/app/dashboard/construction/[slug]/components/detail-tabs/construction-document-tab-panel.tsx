import type { ConstructionDocumentRow } from "@/app/dashboard/construction/data/construction-properties";

import {
  DetailTabChevronRightIcon,
  DetailTabDocPdfIcon,
  DetailTabExternalLinkIcon,
} from "./detail-tab-icons";
import Link from "next/link";

type ConstructionDocumentTabPanelProps = {
  documents: ConstructionDocumentRow[];
};

export function ConstructionDocumentTabPanel({
  documents,
}: ConstructionDocumentTabPanelProps) {
  return (
    <div className="rounded-[16px] bg-white px-4 py-6 shadow-[0_1px_4px_rgba(12,12,13,0.05)] sm:px-6 sm:py-12 md:px-[100px]">
      <h3 className="mb-4 text-[19px] font-medium text-[#050a0e]">Documents</h3>
      <div className="flex flex-col gap-4">
        {documents.map((row) => (
          <div
            className="flex items-center justify-between gap-3 rounded-[8px] bg-[#f5f7f8] p-4"
            key={row.id}
          >
            <div className="flex min-w-0 flex-1 items-start gap-2">
              <DetailTabDocPdfIcon
                aria-hidden
                className="size-6 shrink-0 text-[#5c60cc]"
              />
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <div className="flex flex-wrap items-center gap-1">
                  <p className="text-[16px] font-light text-[#050a0e]">
                    {row.title}
                  </p>
                  {row.externalUrl ? (
                    <DetailTabExternalLinkIcon
                      aria-hidden
                      className="size-4 shrink-0 text-brand"
                    />
                  ) : null}
                </div>
                {row.subtitle ? (
                  <p className="break-all text-[12px] font-light text-[#050a0e]">
                    {row.subtitle}
                  </p>
                ) : null}
              </div>
            </div>

            {row.action === "open" && row.externalUrl ? (
              <Link
                className="flex shrink-0 items-center gap-1 text-[16px] font-light text-brand hover:underline"
                href={row.externalUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                <span className="text-brand">open</span>
                <DetailTabExternalLinkIcon
                  aria-hidden
                  className="size-4 text-brand"
                />
              </Link>
            ) : (
              <span className="flex shrink-0 items-center text-brand" aria-hidden>
                <DetailTabChevronRightIcon className="size-3" />
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
