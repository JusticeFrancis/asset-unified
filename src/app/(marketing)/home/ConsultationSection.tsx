import { ConsultationCalendarIcon } from "@/components/icons";
import { consultationImage } from "./data";
import { Container, PrimaryButton } from "../components/shared";

export function ConsultationSection() {
  return (
    <section className="py-12 sm:py-16 md:py-24">
      <Container>
        <div className="relative rounded-[20px]">
          <div className="relative overflow-hidden rounded-[20px] bg-white px-6 py-8 sm:px-8 sm:py-10 md:px-12 md:py-14">
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-[267px] -left-[20px] hidden size-[384px] rounded-full bg-brand/5 sm:block"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -right-[128px] -top-[48px] hidden size-[384px] rounded-full bg-brand/5 sm:block"
            />
            <div className="grid gap-8 lg:grid-cols-[3fr_2fr] lg:items-center">
              <div>
                <h2 className="text-h1 font-medium leading-tight text-foreground">
                  Need Help Building an{" "}
                  <span className="text-brand">Investment Strategy?</span>
                </h2>
                <p className="mt-4 max-w-[560px] text-base leading-relaxed text-muted/70 sm:text-body-lg">
                  Get a free personalized investment consultation from our
                  experts. We will help you understand the projected results,
                  select the right property, and maximize your potential profit.
                </p>
                <div className="mt-6 sm:mt-8">
                  <PrimaryButton href="/sign-in" className="gap-2 sm:w-auto">
                    <ConsultationCalendarIcon className="size-5 text-white" />
                    <span className="text-white">Get a free consultation</span>
                  </PrimaryButton>
                </div>
              </div>
              <div
                aria-hidden
                className="hidden min-h-[300px] lg:block lg:min-h-[360px]"
              />
            </div>
          </div>
          <img
            src={consultationImage}
            alt="Consultation chat visual"
            aria-hidden
            className="pointer-events-none absolute right-[-46px] top-[-141px] hidden h-[676px] w-[676px] max-w-none object-contain lg:block"
          />
        </div>
      </Container>
    </section>
  );
}
