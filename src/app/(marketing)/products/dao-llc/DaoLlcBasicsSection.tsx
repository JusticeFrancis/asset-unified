import Image from "next/image";
import { DaoLlcCheckAltIcon, DaoLlcDaoIcon, DaoLlcLlcIcon } from "@/lib/assets";
import { Container, SectionHeading } from "../../components/shared";
import { daoLlcCards, hybridModelChecks } from "./data";

const cardIconMap = {
  dao: DaoLlcDaoIcon,
  llc: DaoLlcLlcIcon,
} as const;

export function DaoLlcBasicsSection() {
  return (
    <section id="how-it-works" className="pb-12 sm:pb-16 md:pb-20 lg:pb-24">
      <Container className="space-y-6 sm:space-y-9">
        <SectionHeading
          eyebrow="What is a DAO LLC?"
          title={
            <>
              What does <span className="text-brand">DAO LLC</span> mean for
              shared ownership?
            </>
          }
          description="The DAO LLC model converts physical real assets into digital ones - making investment more accessible and diversified while ensuring investors retain full ownership rights."
        />

        <div className="grid gap-5 sm:gap-6 md:grid-cols-2">
          {daoLlcCards.map((card) => (
            <article
              key={card.title}
              className="rounded-[20px] border border-border bg-white p-5 sm:p-6"
            >
              <Image
                src={cardIconMap[card.icon]}
                alt=""
                aria-hidden
                width={40}
                height={36}
                className="h-8 w-9 sm:h-9 sm:w-10"
              />
              <h3 className="mt-4 text-h3 font-medium text-foreground sm:mt-5">
                {card.title}
              </h3>
              <p className="mt-3 text-base text-[#919191] sm:mt-5 sm:text-body-lg">
                {card.body}
              </p>
            </article>
          ))}
        </div>

        <article className="rounded-[20px] border border-border bg-white p-5 sm:p-6">
          <h3 className="text-h3 font-medium text-foreground">
            The hybrid model gives you the best of both worlds
          </h3>
          <p className="mt-3 text-base text-[#919191] sm:mt-5 sm:text-body-lg">
            A legally recognised LLC structure provides verifiable ownership
            rights, while the DAO layer adds transparency, automation, and
            global accessibility with a strictly limited token supply. Each
            investor owns not just a token, but a legally protected share in
            real property.
          </p>

          <ul className="mt-5 grid gap-4 sm:gap-5 md:grid-cols-2">
            {hybridModelChecks.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 py-1 text-base text-[#919191] sm:text-body-lg"
              >
                <Image
                  src={DaoLlcCheckAltIcon}
                  alt=""
                  aria-hidden
                  width={24}
                  height={24}
                  className="size-5 shrink-0 sm:size-6"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>
      </Container>
    </section>
  );
}
