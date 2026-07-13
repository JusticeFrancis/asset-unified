import { DaoWalletIcon } from "@/components/icons";
import { securityImage } from "./data";
import { PrimaryButton } from "../components/shared";
import { MarketingSplit } from "../components/MarketingSplit";

export function CtaSection() {
  return (
    <MarketingSplit
      tone="surface"
      title={
        <>
          Secure Real-World Assets via{" "}
          <span className="text-brand">DAO LLC Legal Frameworks</span>
        </>
      }
      body="Experience the synergy of Wyoming's legal protections and top-tier smart contract security (rated 9.8/10). We combine institutional-grade governance with blockchain efficiency for seamless, confident co-ownership."
      actions={
        <PrimaryButton href="/products/dao-llc" className="gap-2 sm:w-auto">
          <DaoWalletIcon className="size-5 text-white" />
          <span className="text-white">How DAO LLC works</span>
        </PrimaryButton>
      }
      media={
        <div className="h-64 w-full overflow-hidden rounded-2xl sm:h-80 md:h-96 lg:h-[560px]">
          <img
            src={securityImage}
            alt="DAO LLC framework visual"
            className="size-full object-cover object-center"
          />
        </div>
      }
    />
  );
}
