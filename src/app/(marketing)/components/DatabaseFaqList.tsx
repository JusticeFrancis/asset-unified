"use client";

import { useRecords } from "@/lib/api/queries/app";
import { FaqList } from "./FaqList";

type DatabaseFaqListProps = {
  resource: string;
  idPrefix: string;
  maxWidthClassName?: string;
  className?: string;
  defaultOpenIndex?: number | null;
};

export function DatabaseFaqList({
  resource,
  idPrefix,
  maxWidthClassName,
  className,
  defaultOpenIndex,
}: DatabaseFaqListProps) {
  const { data } = useRecords(resource, "limit=100");
  const items = (data?.records ?? []).flatMap((record) => {
    const question = String(record.question ?? record.title ?? "").trim();
    const answer = String(record.answer ?? record.body ?? "").trim();
    return question && answer ? [{ question, answer }] : [];
  });

  return (
    <FaqList
      className={className}
      defaultOpenIndex={defaultOpenIndex}
      idPrefix={idPrefix}
      items={items}
      maxWidthClassName={maxWidthClassName}
    />
  );
}
