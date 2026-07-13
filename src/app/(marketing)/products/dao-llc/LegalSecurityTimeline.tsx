import { legalSecurityTimeline } from "./data";

export function LegalSecurityTimeline() {
  return (
    <article className="flex gap-4 sm:gap-5">
      <div className="relative h-[360px] w-[7px] shrink-0 rounded-[40px] bg-brand/15 sm:h-[420px] sm:w-[9px]">
        <span className="absolute left-0 top-0 h-[60px] w-[7px] rounded-[40px] bg-brand sm:h-[72px] sm:w-[9px]" />
      </div>
      <div className="space-y-8 sm:space-y-12">
        {legalSecurityTimeline.map((item) => (
          <div key={item.title}>
            <h3 className="text-h3 font-medium text-foreground">
              {item.title}
            </h3>
            <p className="mt-2 text-base text-[#919191] sm:mt-3 sm:text-body-lg">
              {item.body}
            </p>
          </div>
        ))}
      </div>
    </article>
  );
}
