export function StatColumnDivider() {
  return (
    <>
      {/* Mobile: hairline rule between stacked stats. */}
      <div
        aria-hidden
        className="h-px w-full shrink-0 bg-[#050a0e]/10 sm:hidden"
      />
      {/* Desktop: vertical column divider between inline stats. */}
      <div
        aria-hidden
        className="hidden h-[69px] w-px shrink-0 bg-[#050a0e]/10 sm:block"
      />
    </>
  );
}
