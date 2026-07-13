import { Container, SectionHeading } from "../../components/shared";
import { StatList } from "../../components/StatList";

const returnStats = [
  { label: "Tokens purchased", value: "100 tokens @ $50" },
  { label: "Ownership stake", value: "1.79%" },
  {
    label: "Token value at completion (est.)",
    value: <span className="text-brand">$68.50 (+37%)</span>,
  },
  {
    label: "Unrealised gain on tokens",
    value: <span className="text-[#14AE5C]">+$1,850</span>,
  },
  {
    label: "Daily rental income (est.)",
    value: <span className="text-[#14AE5C]">$1.07 / day</span>,
  },
  {
    label: "Annual rental income (est.)",
    value: <span className="text-[#14AE5C]">$390 / year (7.8% APR)</span>,
  },
  {
    label: "3-year total return (est.)",
    value: (
      <span className="text-[#14AE5C]">
        $2,950 rental + $1,850 appreciation
      </span>
    ),
  },
];

const appreciationRows = [
  {
    title: "Funding phase",
    body: "Tokens issued at construction price. Property doesn't exist yet. Risk is highest, price is lowest.",
    value: "$50.00 / shares",
  },
  {
    title: "Construction phase",
    body: "As milestones are reached, secondary market demand increases. Token price drifts upward reflecting progress.",
    value: "$55-62 / shares",
  },
  {
    title: "On completion",
    body: "Property is now a completed asset. Token price reflects full completed value, significantly above construction entry.",
    value: "$68.50 / shares",
  },
] as const;

export function ReturnsSection() {
  return (
    <section className="py-12 sm:py-16 md:py-20">
      <SectionHeading
        eyebrow="Returns"
        title={
          <>
            What a $5,000{" "}
            <span className="text-brand">construction investment</span> looks
            like.
          </>
        }
        description="Numbers for both models, based on a $280,000 development project with a $50 token price and an 18-month build timeline."
      />

      <Container className="mt-10 grid gap-5 sm:mt-12 lg:grid-cols-[minmax(0,651px)_minmax(0,1fr)]">
        <article className="flex flex-col justify-between rounded-[20px] border border-border bg-surface p-6 sm:p-8">
          <header>
            <h3 className="text-h3 font-medium text-foreground">
              Build to Rent - $5,000 invested
            </h3>
            <p className="mt-1 text-sm text-[#919191] sm:text-base">
              18-month construction - $280,000 completed value - 7.8% rental
              yield
            </p>
          </header>
          <div className="mt-6">
            <StatList items={returnStats} />
          </div>
          <div className="mt-6 flex flex-col items-start gap-2 rounded-[20px] bg-brand px-5 py-5 text-base sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-6 sm:text-body-lg">
            <p className="text-[#E7EBEE]">Estimated 3-year total return</p>
            <p className="text-2xl font-medium text-white">+$4,800</p>
          </div>
        </article>

        <article className="rounded-[20px] border border-border bg-surface p-6 sm:p-8">
          <h3 className="text-h3 font-medium text-foreground">
            Why construction tokens appreciate
          </h3>
          <p className="mt-1 text-sm text-[#919191] sm:text-base">
            Token price reflects development risk. Early investors accept more
            uncertainty in exchange for a lower entry price.
          </p>

          <div className="mt-6 space-y-5 sm:mt-8 sm:space-y-6">
            {appreciationRows.map((row, index) => (
              <div
                key={row.title}
                className={`relative flex gap-4 sm:gap-6 ${
                  index === appreciationRows.length - 1
                    ? ""
                    : "after:absolute after:left-[17px] after:top-9 after:h-[calc(100%-10px)] after:w-px after:bg-border after:content-['']"
                }`}
              >
                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-brand bg-brand/15 text-sm font-medium text-brand">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h4 className="text-base font-medium text-foreground sm:text-[20px]">
                    {row.title}
                  </h4>
                  <p className="mt-2 text-sm text-muted sm:text-body-lg">
                    {row.body}
                  </p>
                  <p className="mt-2 text-sm font-medium text-brand sm:text-body-lg">
                    {row.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </article>
      </Container>
    </section>
  );
}
