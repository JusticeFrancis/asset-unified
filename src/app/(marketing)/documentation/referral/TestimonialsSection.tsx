"use client";

import { useRecord, useRecords } from "@/lib/api/queries/app";
import { Container, SectionHeading } from "../../components/shared";

export function TestimonialsSection() {
  const { data } = useRecords("referral-testimonial", "limit=12");
  const { data: section } = useRecord("marketing-section", "referral-testimonials");
  const testimonials = (data?.records ?? []).flatMap((record) => {
    const quote = String(record.quote ?? record.body ?? "").trim();
    const name = String(record.name ?? record.title ?? "").trim();
    if (!quote || !name) return [];
    return [{
      id: record.id,
      quote,
      name,
      location: String(record.location ?? ""),
      subtitle: String(record.subtitle ?? record.meta ?? ""),
      avatar: String(record.avatar ?? record.image ?? ""),
    }];
  });

  return (
    <section className="relative bg-brand pb-12 pt-12 sm:pb-16 sm:pt-16 md:pb-20 md:pt-20 lg:pb-32 lg:pt-24">
      <Container>
        <SectionHeading
          eyebrow={String(section?.eyebrow ?? "Investor stories")}
          title={String(section?.title ?? "How investors grow their capital with Asset Union")}
          description={String(section?.description ?? "")}
          tone="light"
        />
      </Container>

      <div className="relative mt-10 sm:mt-12 lg:mt-16">
        <Container>
          <div className="rounded-[24px] bg-white p-5 sm:p-8 lg:p-10">
            <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
              {testimonials.map((item) => (
                <article key={item.id} className="flex h-full flex-col rounded-[20px] bg-[#EDF4F8] p-6 sm:p-7 lg:p-8">
                  <p aria-hidden className="text-5xl leading-none text-[#2C373F] sm:text-[64px]">“</p>
                  <p className="mt-2 text-base leading-relaxed text-[#2C373F] sm:text-body-lg">{item.quote}</p>
                  <div className="mt-6 flex items-center gap-3">
                    {item.avatar ? <img src={item.avatar} alt={item.name} className="size-10 shrink-0 rounded-full object-cover sm:size-[46px]" /> : null}
                    <div className="min-w-0 text-sm">
                      <p className="truncate text-[#2C373F]">{item.name}</p>
                      <p className="truncate text-[#2C373F]">{item.location}</p>
                      <p className="truncate text-[#768D9E]">{item.subtitle}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
