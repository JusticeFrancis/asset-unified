"use client";

import Image from "next/image";
import { useState } from "react";
import { SearchIcon } from "@/components/icons";
import { FaqHeroChatIllustration } from "@/lib/assets";
import { Container } from "../components/shared";

export function HeroSection() {
  const [search, setSearch] = useState("");

  return (
    <section className="bg-background pt-header">
      <Container className="max-w-[1350px]">
        <div className="relative overflow-hidden rounded-[24px] bg-brand px-5 py-10 sm:rounded-[32px] sm:px-8 sm:py-12 lg:min-h-[485px] lg:px-12 lg:py-0">
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,733px)_minmax(0,1fr)] lg:gap-12 lg:py-16">
            <div className="max-w-[733px]">
              <h1 className="text-h1 font-medium leading-snug text-background">
                Welcome <span aria-hidden>👋</span> This is the Asset Union
                knowledge base. Here you will find answers to frequently asked
                questions from our investors.
              </h1>

              <label
                htmlFor="faq-search"
                className="mt-6 flex h-12 w-full max-w-[492px] items-center justify-between rounded-xl bg-background px-4 sm:h-14"
              >
                <span className="sr-only">Search for answers</span>
                <input
                  id="faq-search"
                  type="text"
                  value={search}
                  onChange={(event) => {
                    const value = event.target.value;
                    setSearch(value);
                    window.dispatchEvent(new CustomEvent("asset-union-faq-search", { detail: value }));
                  }}
                  placeholder="Search for answers"
                  className="w-full border-0 bg-transparent text-sm text-foreground placeholder:text-[#919191] outline-none sm:text-base"
                />
                <SearchIcon
                  aria-hidden
                  className="size-5 shrink-0 text-foreground/90"
                />
              </label>
            </div>

            <div className="relative hidden lg:block">
              <Image
                src={FaqHeroChatIllustration}
                alt=""
                aria-hidden
                width={568}
                height={568}
                priority
                className="h-auto w-full max-w-[568px] scale-110 object-contain"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
