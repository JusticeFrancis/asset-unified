"use client";

import { useRecord } from "@/lib/api/queries/app";
import { Container } from "../../components/shared";

type DatabaseLegalDocumentProps = {
  slug: string;
  fallbackTitle: string;
};

export function DatabaseLegalDocument({ slug, fallbackTitle }: DatabaseLegalDocumentProps) {
  const { data } = useRecord("legal-document", slug);
  const title = String(data?.title ?? fallbackTitle);
  const body = String(data?.body ?? data?.content ?? "").trim();
  const sections = Array.isArray(data?.sections) ? data.sections : [];

  return (
    <main className="bg-background pt-header">
      <Container className="max-w-[820px] py-12 sm:py-16 md:py-20">
        <h1 className="text-h1 font-medium text-foreground">{title}</h1>
        {body ? (
          <p className="mt-4 whitespace-pre-wrap text-base leading-relaxed text-muted sm:text-body-lg">
            {body}
          </p>
        ) : null}
        {sections.map((section, index) => {
          if (!section || typeof section !== "object") return null;
          const item = section as Record<string, unknown>;
          const heading = String(item.heading ?? "").trim();
          const content = String(item.body ?? item.content ?? "").trim();
          if (!heading && !content) return null;
          return (
            <section className="mt-8" key={`${heading}-${index}`}>
              {heading ? <h2 className="text-xl font-medium text-foreground">{heading}</h2> : null}
              {content ? (
                <p className="mt-3 whitespace-pre-wrap text-base leading-relaxed text-muted">
                  {content}
                </p>
              ) : null}
            </section>
          );
        })}
      </Container>
    </main>
  );
}
