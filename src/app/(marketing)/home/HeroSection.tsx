import { Play } from "lucide-react";
import { HeroImage } from "@/lib/assets";
import {
  HomeEndorsementBusinessInsiderIcon,
  HomeEndorsementBusinessJournalsIcon,
  HomeEndorsementForbesIcon,
  HomeEndorsementNasdaqIcon,
  HomeEndorsementNbcIcon,
  HomeEndorsementTechcrunchIcon,
} from "@/components/icons";
import {
  Container,
  PrimaryButton,
  SecondaryButton,
} from "../components/shared";

const brandEndorsements = [
  {
    name: "The Business Journals",
    Icon: HomeEndorsementBusinessJournalsIcon,
    className: "h-6 sm:h-8 w-auto max-w-[5.5rem] object-contain",
  },
  {
    name: "Nasdaq",
    Icon: HomeEndorsementNasdaqIcon,
    className: "h-6 sm:h-8 w-auto max-w-[6.25rem] object-contain",
  },
  {
    name: "TechCrunch",
    Icon: HomeEndorsementTechcrunchIcon,
    className: "h-6 sm:h-8 w-auto max-w-[7.25rem] object-contain",
  },
  {
    name: "Forbes",
    Icon: HomeEndorsementForbesIcon,
    className: "h-6 sm:h-8 w-auto max-w-[5.5rem] object-contain",
  },
  {
    name: "NBC",
    Icon: HomeEndorsementNbcIcon,
    className: "h-6 sm:h-8 w-auto max-w-12 object-contain",
  },
  {
    name: "Business Insider",
    Icon: HomeEndorsementBusinessInsiderIcon,
    className: "h-6 sm:h-8 w-auto max-w-[5.5rem] object-contain",
  },
];

export function HeroSection() {
  return (
    <section className="relative">
      <div
        className="flex min-h-[640px] sm:min-h-[720px] md:min-h-[820px] lg:min-h-[900px] items-center bg-cover bg-center bg-no-repeat pt-header pb-24 sm:pb-28 md:pb-32"
        style={{ backgroundImage: `url(${HeroImage.src})` }}
      >
        <Container>
          <div className="mx-auto w-full max-w-[1005px] text-center">
            <h1 className="text-display font-medium leading-tight">
              <span className="text-brand">Own Real Estate for $50.</span>{" "}
              <span className="text-foreground">Get Paid Rent Every Day.</span>
            </h1>
            <p className="mx-auto mt-4 w-full max-w-[770px] text-body-lg text-brand">
              Every property on our platform is held in its own LLC and broken
              into tokens you can buy, sell, and earn from. Purchase a fraction
              of a rental property in minutes.
            </p>
            <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              <PrimaryButton href="/sign-in" className="sm:w-[171px]">
                Start Investing
              </PrimaryButton>
              <SecondaryButton href="#how-it-works" className="gap-2">
                <Play className="size-5 text-brand" />
                <span className="text-brand">How it Works</span>
              </SecondaryButton>
            </div>
          </div>
        </Container>
      </div>
      <Container className="absolute inset-x-0 bottom-0 z-20 translate-y-1/2">
        <div className="rounded-xl bg-[#F3F2FF] px-4 py-4 sm:px-6 sm:py-5 md:py-6">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:gap-x-10 sm:gap-y-4 md:justify-evenly">
            {brandEndorsements.map((brand) => (
              <div
                key={brand.name}
                className="flex shrink-0 items-center justify-center"
              >
                <brand.Icon className={brand.className} />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
