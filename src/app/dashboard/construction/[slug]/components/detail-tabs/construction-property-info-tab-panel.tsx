import type { ConstructionPropertyInfoTabContent } from "@/app/dashboard/construction/data/construction-properties";
import { cn } from "@/lib/utils";

type ConstructionPropertyInfoTabPanelProps = {
  info: ConstructionPropertyInfoTabContent;
  heading?: string;
};

export function ConstructionPropertyInfoTabPanel({
  info,
  heading = "Property Info",
}: ConstructionPropertyInfoTabPanelProps) {
  return (
    <div className="rounded-[16px] bg-white px-4 py-6 shadow-[0_1px_4px_rgba(12,12,13,0.05)] sm:px-6 sm:py-12 md:px-[100px]">
      <h3 className="mb-4 text-[19px] font-medium text-[#050a0e]">{heading}</h3>
      <div className="flex flex-col gap-4">
        {info.rows.map((row) => (
          <div
            className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1"
            key={row.label}
          >
            <p className="max-w-[min(100%,28rem)] text-[16px] font-light text-[#6e6e6e]">
              {row.label}
            </p>
            <p className="shrink-0 text-right text-[18px] whitespace-nowrap text-[#050a0e]">
              {row.value}
            </p>
          </div>
        ))}

        {info.statRows.map((row, ri) => (
          <div
            className={cn("flex flex-wrap gap-4", ri > 0 && "lg:flex-nowrap")}
            key={`stat-row-${ri}`}
          >
            {row.map((stat) => (
              <div
                className="flex min-w-0 flex-1 flex-col items-center gap-1 rounded-[16px] bg-[#fafcfd] px-3 py-2 sm:px-6"
                key={stat.label}
              >
                <p className="text-[16px] font-light text-[#6e6e6e]">
                  {stat.label}
                </p>
                <p className="text-[18px] text-[#050a0e]">{stat.value}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
