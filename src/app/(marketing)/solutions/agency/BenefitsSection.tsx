import Image from "next/image";
import { Container } from "../../components/shared";
import { agencyBenefits } from "./data";

export function BenefitsSection() {
  return (
    <section className="bg-[#EDF4F8] py-12 sm:py-16 md:py-20">
      <Container className="max-w-[1240px]">
        <div className="max-w-[778px]">
          <h2 className="text-h1 font-medium leading-tight text-foreground">
            Built for agencies that{" "}
            <span className="text-brand">want to offer more</span>
          </h2>
          <p className="mt-4 max-w-[622px] text-base leading-relaxed text-[#2C373F] sm:text-body-lg">
            Whether you run a traditional real estate agency looking to
            diversify, or a newer boutique firm targeting high-net-worth
            clients, Asset Union gives you a differentiated product to sell.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-[25px]">
          {agencyBenefits.map((benefit) => (
            <article
              key={benefit.title}
              className="rounded-[20px] border border-border bg-white px-5 py-6 sm:px-6 sm:py-8"
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
              <h3 className="mt-3 text-h3 font-medium leading-tight tracking-[-0.01em] text-foreground">
                {benefit.title}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-[#919191] sm:text-body-lg">
                {benefit.body}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
