import type { ConstructionAboutPropertyTabContent } from "@/app/dashboard/construction/data/construction-properties";

type ConstructionAboutPropertyTabPanelProps = {
  content: ConstructionAboutPropertyTabContent;
  heading?: string;
};

export function ConstructionAboutPropertyTabPanel({
  content,
  heading = "About Property",
}: ConstructionAboutPropertyTabPanelProps) {
  return (
    <div className="rounded-[16px] bg-white px-4 py-6 text-[#050a0e] shadow-[0_1px_4px_rgba(12,12,13,0.05)] sm:px-6 sm:py-12 md:px-[100px]">
      <h3 className="mb-4 text-[19px] font-medium">{heading}</h3>
      <div className="space-y-4 text-[16px] font-light leading-normal">
        <p className="whitespace-pre-wrap">{content.intro}</p>

        {content.sections.map((section, i) => (
          <div key={i}>
            {section.heading ? (
              <p className="mb-2 font-medium">{section.heading}</p>
            ) : null}
            {section.paragraphs?.map((p, j) => (
              <p className="mb-2 whitespace-pre-wrap last:mb-0" key={j}>
                {p}
              </p>
            ))}
            {section.bullets && section.bullets.length > 0 ? (
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {section.bullets.map((item, j) => (
                  <li key={j}>
                    <span className="leading-normal">{item}</span>
                  </li>
                ))}
              </ul>
            ) : null}
            {section.italicNote ? (
              <p className="mt-4 italic">{section.italicNote}</p>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
