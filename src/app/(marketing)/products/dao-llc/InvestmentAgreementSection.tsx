import Image from "next/image";
import { DaoLlcDividerLight, DaoLlcDocumentIcon } from "@/lib/assets";
import { Container } from "../../components/shared";
import { investmentAgreementRows, investmentAgreementSteps } from "./data";

export function InvestmentAgreementSection() {
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24">
      <Container className="grid gap-10 lg:grid-cols-[minmax(0,597px)_minmax(0,1fr)] lg:gap-[60px]">
        <div>
          <div className="mb-6 flex flex-wrap gap-2 text-[10px]">
            <span className="rounded-[40px] bg-brand px-3 py-1 text-white">
              Level 2 of 4
            </span>
            <span className="rounded-[40px] bg-[#E4E4F6] px-3 py-1 text-accent">
              Investment Agreement
            </span>
          </div>

          <article className="rounded-[20px] border border-border bg-surface p-5 sm:p-8">
            <p className="text-sm font-medium uppercase text-[#919191] sm:text-base">
              Investment Agreement Preview
            </p>
            <div className="mt-5 overflow-hidden rounded-2xl bg-background pb-4 sm:mt-6">
              <div className="flex items-center gap-3 bg-brand p-3 text-white sm:gap-4 sm:p-4">
                <span className="rounded-full bg-white/15 p-2">
                  <Image
                    src={DaoLlcDocumentIcon}
                    alt=""
                    aria-hidden
                    width={32}
                    height={32}
                    className="size-6 sm:size-8"
                  />
                </span>
                <p className="text-sm font-medium sm:text-base">
                  Investment Agreement - Bali Villa No. 7
                </p>
              </div>
              <div className="px-4 sm:px-6">
                {investmentAgreementRows.map(([label, value]) => (
                  <div key={label} className="py-3 sm:py-4">
                    <div className="flex items-center justify-between gap-4 text-xs sm:gap-6">
                      <p className="font-light text-[#919191]">{label}</p>
                      <p className="text-right text-foreground">{value}</p>
                    </div>
                    <Image
                      src={DaoLlcDividerLight}
                      alt=""
                      aria-hidden
                      width={500}
                      height={1}
                      className="mt-3 w-full sm:mt-4"
                    />
                  </div>
                ))}
                <div className="py-2">
                  <div className="flex items-center justify-between text-xs">
                    <p className="font-light text-[#919191]">Status</p>
                    <span className="rounded-[40px] bg-[#AFF4C6] px-2 py-px text-[10px] text-[#009951]">
                      Executed &amp; Filled
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>

        <div>
          <h2 className="max-w-[575px] text-h2 font-medium text-foreground">
            <span className="text-brand">Investment agreement</span> -
            verifiable at any time
          </h2>
          <p className="mt-4 max-w-[575px] text-base leading-relaxed text-muted sm:text-body-lg">
            An investment agreement is signed between the local company (owned
            by your DAO LLC) and the previous property owner or developer. This
            is the document that legally transfers the asset&apos;s value to
            the DAO.
          </p>
          <ol className="mt-8 space-y-6 sm:mt-10 sm:space-y-8">
            {investmentAgreementSteps.map((step) => (
              <li key={step.id} className="flex items-start gap-4">
                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-brand/15 text-sm font-medium text-brand sm:size-[35px] sm:text-[17px]">
                  {step.id}
                </span>
                <div>
                  <h3 className="text-base font-medium leading-tight text-foreground sm:text-xl">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted sm:mt-3 sm:text-base">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
