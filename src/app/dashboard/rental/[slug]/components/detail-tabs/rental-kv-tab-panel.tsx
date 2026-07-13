type RentalKvRow = { label: string; value: string };

type RentalKvTabPanelProps = {
  heading: string;
  rows: RentalKvRow[];
};

export function RentalKvTabPanel({ heading, rows }: RentalKvTabPanelProps) {
  return (
    <div className="rounded-[16px] bg-white px-4 py-6 shadow-[0_1px_4px_rgba(12,12,13,0.05)] sm:px-6 sm:py-12 md:px-[100px]">
      <h3 className="mb-4 text-[19px] font-medium text-[#050a0e]">{heading}</h3>
      <div className="flex flex-col">
        {rows.map((row) => (
          <div
            className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-2 text-[16px] font-normal leading-normal"
            key={row.label}
          >
            <p className="max-w-[min(100%,28rem)] text-[#919191]">
              {row.label}
            </p>
            <p className="shrink-0 text-right whitespace-nowrap text-[#050a0e]">
              {row.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
