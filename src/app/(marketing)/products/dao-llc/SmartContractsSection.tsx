import Image from "next/image";
import {
  DaoLlcBlueDivider,
  DaoLlcLiquidityIcon,
  DaoLlcRegistryIcon,
  DaoLlcRulesIcon,
  DaoLlcShieldIcon,
} from "@/lib/assets";
import { Container } from "../../components/shared";
import { rentDistributionSteps, smartContractFeatures } from "./data";

const iconMap = {
  shield: DaoLlcShieldIcon,
  rules: DaoLlcRulesIcon,
  registry: DaoLlcRegistryIcon,
  liquidity: DaoLlcLiquidityIcon,
} as const;

export function SmartContractsSection() {
  return (
    <section className="bg-brand py-12 sm:py-16 md:py-20 lg:py-24">
      <Container className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,597px)] lg:gap-[60px]">
        <div>
          <div className="mb-6 flex flex-wrap gap-2 text-[10px] sm:mb-8">
            <span className="rounded-[40px] bg-[#F5F7F8] px-3 py-1 text-brand">
              Level 3 of 4
            </span>
            <span className="rounded-[40px] bg-[#E4E4F6] px-3 py-1 text-accent">
              Smart Contracts
            </span>
          </div>

          <h2 className="max-w-[503px] text-h2 font-medium text-white">
            Smart contracts are legally linked to real estate
          </h2>
          <p className="mt-4 max-w-[575px] text-base leading-relaxed text-[#E7EBEE] sm:text-body-lg">
            After ownership transfers to the local company owned by your DAO
            LLC, smart contracts represent the financial value and legal
            ownership of the property. They execute automatically - without
            intermediaries.
          </p>

          <ul className="mt-10 space-y-6 sm:mt-12 sm:space-y-8">
            {smartContractFeatures.map((item) => (
              <li key={item.title} className="flex items-start gap-4">
                <span className="rounded-full bg-white/15 p-2">
                  <Image
                    src={iconMap[item.icon]}
                    alt=""
                    aria-hidden
                    width={20}
                    height={20}
                    className="size-5"
                  />
                </span>
                <div>
                  <h3 className="text-base font-medium leading-tight text-white sm:text-xl">
                    {item.title}
                  </h3>
                  <p className="mt-2 max-w-[515px] text-sm leading-relaxed text-[#E7EBEE] sm:mt-3 sm:text-base">
                    {item.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <aside className="h-fit rounded-[20px] border border-border bg-white p-5 sm:p-8">
          <p className="text-sm font-medium uppercase text-[#919191] sm:text-base">
            Rent Distribution Flow
          </p>
          <ol className="mt-5 space-y-5 sm:mt-6 sm:space-y-6">
            {rentDistributionSteps.map((step) => (
              <li key={step.id}>
                <div className="flex items-start gap-4">
                  <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-brand/15 text-sm font-medium text-brand sm:size-[35px] sm:text-[17px]">
                    {step.id}
                  </span>
                  <div>
                    <h3 className="text-base font-medium leading-tight text-foreground sm:text-xl">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#919191] sm:mt-3 sm:text-base">
                      {step.body}
                    </p>
                  </div>
                </div>
                {step.id === "5" ? null : (
                  <Image
                    src={DaoLlcBlueDivider}
                    alt=""
                    aria-hidden
                    width={500}
                    height={1}
                    className="mt-5 w-full sm:mt-6"
                  />
                )}
              </li>
            ))}
          </ol>
        </aside>
      </Container>
    </section>
  );
}
