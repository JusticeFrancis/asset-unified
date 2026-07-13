import Image from "next/image";
import { Container } from "../../components/shared";
import { partnerBenefits } from "./data";

export function BenefitsSection() {
  return (
    <section className="bg-surface py-12 sm:py-16 md:py-20">
      <Container className="max-w-[1240px]">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,582px)] lg:gap-12">
          <div className="max-w-[622px]">
            <h2 className="text-h1 font-medium leading-tight text-foreground">
              What being a <span className="text-brand">verified partner</span>{" "}
              means
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted sm:text-body-lg">
              It&apos;s not a listing directory. Verified partner status on
              Asset Union means active trust from co-investors - and a direct
              path to winning mandates through the platform&apos;s governance
              system.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:block lg:columns-2 lg:gap-6">
            {partnerBenefits.map((benefit) => (
              <article
                key={benefit.title}
                className="rounded-[20px] border border-border bg-white px-5 py-6 sm:px-6 sm:py-8 lg:mb-6 lg:inline-block lg:w-full lg:break-inside-avoid"
              >
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand/15 sm:size-11">
                  <Image
                    src={benefit.icon}
                    alt=""
                    aria-hidden
                    width={24}
                    height={24}
                    className="size-5 sm:size-6"
                  />
                </span>
                <h3 className="mt-4 text-h3 font-medium leading-tight text-foreground">
                  {benefit.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-[#919191] sm:text-body-lg">
                  {benefit.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
