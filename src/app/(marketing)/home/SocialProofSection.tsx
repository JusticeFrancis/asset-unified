"use client";

import { useRecord, useRecords } from "@/lib/api/queries/app";
import { trustLogos } from "./data";
import { Container, SectionHeading } from "../components/shared";

type Testimonial = {
  id: string;
  quote: string;
  name: string;
  location: string;
  meta: string;
  avatar: string;
};

export function SocialProofSection() {
  const { data } = useRecords("testimonial", "limit=3");
  const { data: section } = useRecord("marketing-section", "home-social-proof");
  const testimonials: Testimonial[] = (data?.records ?? []).flatMap((record) => {
    const quote = String(record.quote ?? record.body ?? "").trim();
    const name = String(record.name ?? record.title ?? "").trim();
    if (!quote || !name) return [];
    return [{
      id: record.id,
      quote,
      name,
      location: String(record.location ?? ""),
      meta: String(record.meta ?? record.subtitle ?? ""),
      avatar: String(record.avatar ?? record.image ?? ""),
    }];
  });
  const featured = testimonials[0];

  return (
    <section className="pb-12 sm:pb-16 md:pb-24">
      <Container>
        <SectionHeading
          eyebrow={String(section?.eyebrow ?? "Social Proof")}
          title={String(section?.title ?? "Investor stories")}
        />
        {featured ? (
          <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,500px)_minmax(0,1fr)]">
            <article className="flex min-h-[360px] flex-col justify-between gap-6 rounded-[20px] bg-brand p-6 sm:p-8 lg:min-h-[456px]">
              <div className="flex flex-col gap-2">
                <p className="text-5xl leading-none text-[#E7EBEE] sm:text-6xl">“</p>
                <p className="text-base leading-relaxed text-[#E7EBEE] sm:text-body-lg">{featured.quote}</p>
              </div>
              <div className="flex items-center gap-2">
                {featured.avatar ? <img src={featured.avatar} alt={featured.name} className="size-12 rounded-full object-cover" /> : null}
                <div className="text-sm font-light leading-tight">
                  <p className="text-[#E7EBEE]">{featured.name}</p>
                  <p className="text-[#E7EBEE]">{featured.location}</p>
                  <p className="text-[#B1BEC8]">{featured.meta}</p>
                </div>
              </div>
            </article>

            <div className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                {testimonials.slice(1).map((item) => (
                  <article key={item.id} className="flex flex-col justify-between gap-4 rounded-[20px] bg-[#EDF4F8] p-6 sm:p-8">
                    <div className="flex flex-col gap-2">
                      <p className="text-5xl leading-none text-[#2C373F] sm:text-6xl">“</p>
                      <p className="text-base leading-relaxed text-[#2C373F] sm:text-body-lg">{item.quote}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.avatar ? <img src={item.avatar} alt={item.name} className="size-12 rounded-full object-cover" /> : null}
                      <div className="text-sm font-light leading-tight">
                        <p className="text-[#2C373F]">{item.name}</p>
                        <p className="text-[#2C373F]">{item.location}</p>
                        <p className="text-[#768D9E]">{item.meta}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div className="grid gap-6 rounded-[20px] bg-[#EDF4F8] p-6 sm:grid-cols-2 sm:p-8 md:grid-cols-4">
                {trustLogos.map((partner) => (
                  <div key={partner.label} className="flex flex-col items-center justify-center gap-2">
                    <p className="text-sm text-[#2C373F] sm:text-base">{partner.label}</p>
                    <img
                      src={partner.image}
                      alt={partner.label}
                      className={partner.label === "Payment by" ? "h-8 w-auto max-w-[80px] object-contain" : partner.label === "Legal by" ? "h-8 w-auto max-w-[140px] object-contain" : "size-8 object-contain"}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </Container>
    </section>
  );
}
