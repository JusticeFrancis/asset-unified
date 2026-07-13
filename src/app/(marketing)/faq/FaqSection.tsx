"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { useRecords } from "@/lib/api/queries/app";
import { FaqList } from "../components/FaqList";
import { Container } from "../components/shared";

type KnowledgeFaq = {
  id: string;
  categoryId: string;
  categoryLabel: string;
  question: string;
  answer: string;
};

export function FaqSection() {
  const { data } = useRecords("knowledge-base-faq", "limit=200");
  const [activeCategory, setActiveCategory] = useState("");
  const [search, setSearch] = useState("");

  const faqs = useMemo<KnowledgeFaq[]>(
    () =>
      (data?.records ?? []).flatMap((record) => {
        const question = String(record.question ?? record.title ?? "").trim();
        const answer = String(record.answer ?? record.body ?? "").trim();
        const categoryId = String(record.categoryId ?? "general").trim() || "general";
        const categoryLabel = String(record.categoryLabel ?? "General").trim() || "General";
        return question && answer
          ? [{ id: record.id, categoryId, categoryLabel, question, answer }]
          : [];
      }),
    [data?.records],
  );

  const categories = useMemo(() => {
    const grouped = new Map<string, { id: string; label: string; count: number }>();
    for (const faq of faqs) {
      const current = grouped.get(faq.categoryId) ?? {
        id: faq.categoryId,
        label: faq.categoryLabel,
        count: 0,
      };
      current.count += 1;
      grouped.set(faq.categoryId, current);
    }
    return [...grouped.values()];
  }, [faqs]);

  useEffect(() => {
    if (!activeCategory && categories[0]) setActiveCategory(categories[0].id);
    if (activeCategory && !categories.some((category) => category.id === activeCategory)) {
      setActiveCategory(categories[0]?.id ?? "");
    }
  }, [activeCategory, categories]);

  useEffect(() => {
    const onSearch = (event: Event) => {
      setSearch(String((event as CustomEvent<string>).detail ?? ""));
    };
    window.addEventListener("asset-union-faq-search", onSearch);
    return () => window.removeEventListener("asset-union-faq-search", onSearch);
  }, []);

  const activeItems = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return faqs.filter((faq) => {
      const categoryMatches = search ? true : faq.categoryId === activeCategory;
      const searchMatches = !needle || `${faq.question} ${faq.answer}`.toLowerCase().includes(needle);
      return categoryMatches && searchMatches;
    });
  }, [activeCategory, faqs, search]);

  return (
    <section className="bg-background py-10 md:py-16 lg:pb-20">
      <Container>
        <div className="mx-auto w-full rounded-[24px] bg-white p-4 sm:rounded-[32px] sm:p-6">
          <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:flex sm:justify-center sm:px-0">
            <div className="inline-flex w-max items-center gap-2 rounded-[40px] bg-[#F5F7F8] p-1 sm:gap-5">
              {categories.map((category) => {
                const isActive = category.id === activeCategory && !search;
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setActiveCategory(category.id);
                    }}
                    className={cn(
                      "min-h-tap whitespace-nowrap rounded-[40px] px-3 py-2 text-sm leading-normal transition",
                      isActive
                        ? "bg-white font-normal text-foreground"
                        : "font-medium text-[#919191] hover:text-foreground",
                    )}
                  >
                    {category.label}{" "}
                    <span className="text-[#919191]">({category.count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          <FaqList
            key={`${activeCategory}-${search}`}
            idPrefix={`faq-${activeCategory || "search"}`}
            defaultOpenIndex={null}
            maxWidthClassName="max-w-none"
            className="mt-2 sm:mt-4"
            items={activeItems.map((item) => ({
              question: item.question,
              answer: item.answer,
            }))}
          />
        </div>
      </Container>
    </section>
  );
}
