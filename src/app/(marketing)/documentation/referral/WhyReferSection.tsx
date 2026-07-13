import Image, { type StaticImageData } from "next/image";
import type { ReactNode } from "react";
import { Container, SectionHeading } from "../../components/shared";
import { whyReferCards } from "./data";

type WhyReferCardProps = {
  eyebrow: string;
  title: string;
  body: string;
  icon: ReactNode;
};

function WhyReferCard({ eyebrow, title, body, icon }: WhyReferCardProps) {
  return (
    <article className="flex h-full flex-col rounded-[20px] border border-border bg-white px-5 py-6 sm:px-6 sm:py-8">
      <div className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand/15 sm:size-11">
        {icon}
      </div>
      <p className="mt-3 text-[10px] uppercase tracking-wide text-[#919191] sm:text-[11px]">
        {eyebrow}
      </p>
      <h3 className="mt-1 text-h3 font-medium leading-tight text-foreground">
        {title}
      </h3>
      <p className="mt-3 text-base leading-relaxed text-[#919191] sm:text-body-lg">
        {body}
      </p>
    </article>
  );
}

const renderIcon = (icon: StaticImageData | string) => {
  // String values can be either a file path (rendered as Image) or a single
  // glyph character like "$" (rendered as text). Anything that looks like a
  // path or imported image goes through next/image.
  const isImagePath = typeof icon === "string" && icon.startsWith("/");
  if (typeof icon === "string" && !isImagePath) {
    return (
      <span className="text-2xl font-light text-brand sm:text-[24px]">
        {icon}
      </span>
    );
  }
  return (
    <Image
      src={icon}
      alt=""
      aria-hidden
      width={24}
      height={24}
      className="size-5 sm:size-6"
    />
  );
};

export function WhyReferSection() {
  return (
    <section className="py-12 sm:py-16 md:py-20">
      <Container>
        <SectionHeading
          eyebrow="WHY REFER"
          title={
            <>
              Opportunities that open up when you{" "}
              <span className="text-brand">invite others</span>
            </>
          }
          description="Asset Union gives you a strong referral system on top of real estate investing. Here is what your friends get and what you earn."
        />

        <div className="mt-10 grid gap-5 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {whyReferCards.slice(0, 3).map((card) => (
            <WhyReferCard
              key={card.title}
              eyebrow={card.eyebrow}
              title={card.title}
              body={card.body}
              icon={renderIcon(card.icon)}
            />
          ))}
        </div>

        <div className="mt-5 grid gap-5 sm:mt-6 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,397px)]">
          <WhyReferCard
            eyebrow={whyReferCards[3].eyebrow}
            title={whyReferCards[3].title}
            body={whyReferCards[3].body}
            icon={renderIcon(whyReferCards[3].icon)}
          />
          <WhyReferCard
            eyebrow={whyReferCards[4].eyebrow}
            title={whyReferCards[4].title}
            body={whyReferCards[4].body}
            icon={renderIcon(whyReferCards[4].icon)}
          />
        </div>
      </Container>
    </section>
  );
}
