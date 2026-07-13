import Image from "next/image";
import { DaoLlcUserGroupIcon } from "@/lib/assets";
import { Container } from "../../components/shared";
import { daoRegistrationSteps, ownershipStructureRows } from "./data";

export function DaoRegistrationSection() {
  return (
    <section className="bg-brand py-12 sm:py-16 md:py-20 lg:py-24">
      <Container className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,597px)] lg:gap-[60px]">
        <div>
          <div className="mb-6 flex flex-wrap gap-2 text-[10px] sm:mb-8">
            <span className="rounded-[40px] bg-[#EDF4F8] px-3 py-1 text-brand">
              Level 1 of 4
            </span>
            <span className="rounded-[40px] bg-[#E4E4F6] px-3 py-1 text-accent">
              DAO LLC Registration
            </span>
          </div>
          <h2 className="text-h2 font-medium text-white">
            Checking DAO LLC registration is easy
          </h2>
          <p className="mt-4 max-w-[575px] text-base leading-relaxed text-[#E7EBEE] sm:text-body-lg">
            The secondary market works just like the primary - except inventory
            comes from other investors, not new property offerings.
          </p>

          <ol className="mt-8 space-y-6 sm:mt-10 sm:space-y-8">
            {daoRegistrationSteps.map((step) => (
              <li key={step.id} className="flex items-start gap-4">
                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-sm font-medium text-white sm:size-[35px] sm:text-[17px]">
                  {step.id}
                </span>
                <div>
                  <h3 className="text-base font-medium leading-tight text-white sm:text-xl">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#E7EBEE] sm:mt-3 sm:text-base">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <aside className="h-fit rounded-[20px] border border-border bg-white p-5 sm:p-8">
          <p className="text-sm font-medium uppercase text-[#919191] sm:text-base">
            Ownership Structure
          </p>
          <div className="mt-5 space-y-5 sm:mt-6 sm:space-y-10">
            {ownershipStructureRows.map(([label, value]) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-lg border border-border bg-background p-3 sm:gap-5 sm:p-4"
              >
                <span className="rounded-full bg-brand/15 p-2">
                  <Image
                    src={DaoLlcUserGroupIcon}
                    alt=""
                    aria-hidden
                    width={28}
                    height={24}
                    className="h-5 w-6 sm:h-6 sm:w-7"
                  />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-[#919191] sm:text-sm">{label}</p>
                  <p className="truncate text-sm font-medium text-foreground sm:text-base">
                    {value}
                  </p>
                </div>
                <span className="rounded-[40px] bg-brand-soft px-2 py-px text-[10px] text-accent">
                  Verified
                </span>
              </div>
            ))}
          </div>
        </aside>
      </Container>
    </section>
  );
}
