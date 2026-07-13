import Image from "next/image";
import { DaoLlcCtaSphereLevel4, DaoLlcWalletPropertyIcon } from "@/lib/assets";
import { Container } from "../../components/shared";
import { walletHoldings, walletOwnershipSteps } from "./data";

export function WalletOwnershipSection() {
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24">
      <Container className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,597px)] lg:gap-[60px]">
        <div>
          <div className="mb-6 flex flex-wrap gap-2 text-[10px] sm:mb-8">
            <span className="rounded-[40px] bg-brand px-3 py-1 text-white">
              Level 4 of 4
            </span>
            <span className="rounded-[40px] bg-[#E4E4F6] px-3 py-1 text-accent">
              Wallet Ownership
            </span>
          </div>

          <h2 className="max-w-[503px] text-h2 font-medium text-foreground">
            You own your share - <span className="text-brand">truly</span>
          </h2>
          <p className="mt-4 max-w-[575px] text-base leading-relaxed text-muted sm:text-body-lg">
            All property tokens are held in your personal cryptocurrency
            wallet, protected by a cryptographic seed phrase only you control.
            The platform can never freeze or restrict your assets.
          </p>

          <ol className="mt-8 space-y-6 sm:mt-10 sm:space-y-8">
            {walletOwnershipSteps.map((step) => (
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

        <aside className="h-fit rounded-[20px] border border-border bg-surface p-5 sm:p-8">
          <p className="text-sm font-medium uppercase text-[#919191] sm:text-base">
            Your Wallet
          </p>
          <div className="mt-5 overflow-hidden rounded-2xl bg-background pb-4 sm:mt-6">
            <div
              className="relative overflow-hidden rounded-2xl px-6 py-4 text-white sm:px-8"
              style={{
                background:
                  "linear-gradient(115deg, rgb(92, 96, 204) 31%, rgb(152, 92, 204) 103%)",
              }}
            >
              <p className="text-[12px] leading-relaxed text-border">
                My Portfolio Value
                <br />
                0x71c7...3f4e
              </p>
              <p className="mt-2 text-3xl font-medium sm:text-4xl">$4,850</p>
              <div className="mt-4 flex items-center justify-between text-[12px] text-border">
                <span>4 properties - 127 tokens</span>
                <span>+12% APR</span>
              </div>
              <Image
                src={DaoLlcCtaSphereLevel4}
                alt=""
                aria-hidden
                width={118}
                height={118}
                className="pointer-events-none absolute -right-4 -top-6 size-[88px] sm:size-[118px]"
              />
            </div>
            <div className="space-y-3 px-4 pt-4 sm:space-y-4 sm:px-6">
              {walletHoldings.map((holding, index) => (
                <div
                  key={`${holding.title}-${index}`}
                  className="flex items-center gap-3 rounded-lg border border-border bg-background p-3 sm:gap-5 sm:p-4"
                >
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-brand/15 sm:size-12">
                    <Image
                      src={DaoLlcWalletPropertyIcon}
                      alt=""
                      aria-hidden
                      width={32}
                      height={32}
                      className="size-6 sm:size-8"
                    />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground sm:text-base">
                      {holding.title}
                    </p>
                    <p className="text-xs text-[#919191] sm:text-base">
                      {holding.subtitle}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground sm:text-base">
                      {holding.value}
                    </p>
                    <p className="text-[10px] text-[#009951]">{holding.apr}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </Container>
    </section>
  );
}
