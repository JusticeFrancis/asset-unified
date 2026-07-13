import Image from "next/image";
import {
  DaoLlcCheckIcon,
  DaoLlcDaoHomeIcon,
  DaoLlcTimelineCheckIcon,
} from "@/lib/assets";
import { legalSecurityChecks } from "./data";

export function LegalSecurityWyomingCard() {
  return (
    <article className="rounded-[20px] border border-border bg-white p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <span className="rounded-lg bg-brand/15 p-2">
          <Image
            src={DaoLlcDaoHomeIcon}
            alt=""
            aria-hidden
            width={24}
            height={24}
            className="size-5 sm:size-6"
          />
        </span>
        <h3 className="text-h3 font-medium text-foreground">
          DAO LLC - Wyoming
        </h3>
      </div>
      <p className="mt-4 text-base text-[#919191] sm:mt-5 sm:text-body-lg">
        Each property is held by a unique Wyoming DAO LLC. Ownership shares map
        1:1 to tokens on the Polygon blockchain, giving you verifiable, legally
        backed rights to the real estate.
      </p>

      <ul className="mt-2">
        {legalSecurityChecks.map((item, index) => (
          <li
            key={item}
            className={`flex gap-3 py-4 text-base text-[#919191] sm:py-5 sm:text-body-lg ${
              index === legalSecurityChecks.length - 1
                ? ""
                : "border-b border-border"
            }`}
          >
            <Image
              src={index === 0 ? DaoLlcTimelineCheckIcon : DaoLlcCheckIcon}
              alt=""
              aria-hidden
              width={24}
              height={24}
              className="mt-0.5 size-5 shrink-0 sm:size-6"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
