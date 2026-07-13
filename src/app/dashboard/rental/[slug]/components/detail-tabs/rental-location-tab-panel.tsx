type RentalLocationTabPanelProps = {
  embedUrl: string;
  largeMapUrl?: string;
};

export function RentalLocationTabPanel({
  embedUrl,
  largeMapUrl,
}: RentalLocationTabPanelProps) {
  return (
    <div className="rounded-[16px] bg-white px-4 py-6 shadow-[0_1px_4px_rgba(12,12,13,0.05)] sm:px-6 sm:py-12 md:px-[100px]">
      <h3 className="mb-4 text-[19px] font-medium text-[#050a0e]">Map</h3>
      <div className="relative overflow-hidden rounded-lg border border-[#edf4f8] shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
        {largeMapUrl ? (
          <a
            className="absolute top-3 left-3 z-1 rounded bg-white px-3 py-1 text-[12px] font-normal text-[#0369f0] shadow-sm"
            href={largeMapUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            View larger map
          </a>
        ) : null}
        <iframe
          className="aspect-[917/300] min-h-[240px] w-full border-0 sm:min-h-[300px]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={embedUrl}
          title="Property location map"
        />
      </div>
    </div>
  );
}
