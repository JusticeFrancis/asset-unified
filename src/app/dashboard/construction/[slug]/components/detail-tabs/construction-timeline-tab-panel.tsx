"use client";

import { useState } from "react";

import { CONSTRUCTION_TIMELINE_ICON_MAP } from "@/components/icons/construction-timeline-icons";
import { cn } from "@/lib/utils";

import type {
  ConstructionPropertyRecord,
  ConstructionTimelineStep,
} from "@/app/dashboard/construction/data/construction-properties";

function StatusPill({
  status,
  label,
}: {
  status: "done" | "current" | "locked";
  label: string;
}) {
  if (status === "current") {
    return (
      <span className="rounded-[40px] bg-[rgba(111,178,211,0.15)] px-2 py-0.5 text-[8px] font-normal text-[#6fb2d3]">
        {label}
      </span>
    );
  }
  return (
    <span className="rounded-[40px] bg-[#f5f7f8] px-2 py-0.5 text-[8px] font-normal text-[#919191]">
      {label}
    </span>
  );
}

function TimelineMeta({ step }: { step: ConstructionTimelineStep }) {
  return (
    <>
      {step.status === "done" && <StatusPill label="Done" status="done" />}
      {step.status === "current" && (
        <StatusPill label="Current Stage" status="current" />
      )}
      {step.status === "locked" && (
        <StatusPill label="Locked" status="locked" />
      )}
      {step.dateLabel ? (
        <div className="text-right">
          <p className="text-[12px] font-light text-[#050a0e]">
            {step.dateLabel}
          </p>
          {step.dateSubLabel ? (
            <p className="text-[9px] font-light text-[#919191]">
              {step.dateSubLabel}
            </p>
          ) : null}
        </div>
      ) : null}
    </>
  );
}

function TimelineRows({ steps }: { steps: ConstructionTimelineStep[] }) {
  return (
    <div className="relative flex flex-col gap-4">
      {steps.map((step, index) => {
        const StepIcon = CONSTRUCTION_TIMELINE_ICON_MAP[step.iconKey];
        const isLastStep = index === steps.length - 1;
        return (
          <div
            className="relative z-1 flex w-full items-start gap-3 sm:items-center sm:gap-4"
            key={step.id}
          >
            {/* Desktop: dedicated right-aligned date/status column. */}
            <div className="hidden shrink-0 flex-col items-end justify-center text-right sm:flex sm:w-[238px]">
              <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1">
                <div className="flex flex-wrap justify-end gap-1">
                  <TimelineMeta step={step} />
                </div>
              </div>
            </div>

            {/* Icon column. The connector spans the row height plus the gap to
                the next row, so it scales with content (was previously a brittle
                fixed `h-[89px]`). The icon's white background masks the line
                where it crosses, leaving the visible segment between nodes. */}
            <div
              className={cn(
                "relative flex w-6 shrink-0 flex-col items-center self-stretch justify-start sm:justify-center",
              )}
            >
              <span className="relative z-2 grid size-6 shrink-0 place-items-center bg-white">
                <StepIcon aria-hidden className="size-6 text-[#919191]" />
              </span>
              {!isLastStep ? (
                <span
                  aria-hidden
                  className="absolute bottom-[-16px] left-1/2 top-6 w-px -translate-x-1/2 bg-[#deebf2] sm:top-[calc(50%+12px)]"
                />
              ) : null}
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-2">
              {/* Mobile: status + date inline above the description card so the
                  icon visually anchors the row instead of floating between two
                  stacked blocks. */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 sm:hidden">
                <TimelineMeta step={step} />
              </div>
              <div className="rounded-[8px] border border-[#edf4f8] p-4 sm:p-6">
                <p className="text-[14px] font-normal text-[#050a0e]">
                  {step.title}
                </p>
                <p className="mt-1 text-[12px] font-light leading-relaxed text-[#6e6e6e]">
                  {step.description}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

type ConstructionTimelineTabPanelProps = {
  property: ConstructionPropertyRecord;
};

export function ConstructionTimelineTabPanel({
  property,
}: ConstructionTimelineTabPanelProps) {
  const { timeline, constructionSiteTimeline } = property;
  const [timelineBand, setTimelineBand] = useState<"construction" | "project">(
    "project",
  );

  return (
    <div className="rounded-[16px] bg-white px-4 py-6 shadow-[0_1px_4px_rgba(12,12,13,0.05)] sm:px-6 sm:py-12 md:px-[100px]">
      <div className="mb-4 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-[19px] font-medium text-[#050a0e]">Timeline</h3>
        <div className="flex w-fit items-center gap-5 rounded-[40px] bg-[#f5f7f8] p-1">
          <button
            className={cn(
              "rounded-[40px] px-3 py-2 text-[14px] transition-colors",
              timelineBand === "construction"
                ? "bg-white font-normal text-[#050a0e]"
                : "font-medium text-[#919191]",
            )}
            onClick={() => setTimelineBand("construction")}
            type="button"
          >
            Construction
          </button>
          <button
            className={cn(
              "rounded-[40px] px-3 py-2 text-[14px] transition-colors",
              timelineBand === "project"
                ? "bg-white font-normal text-[#050a0e]"
                : "font-medium text-[#919191]",
            )}
            onClick={() => setTimelineBand("project")}
            type="button"
          >
            Project Timeline
          </button>
        </div>
      </div>

      {timelineBand === "project" ? (
        <TimelineRows steps={timeline} />
      ) : (
        <TimelineRows steps={constructionSiteTimeline} />
      )}
    </div>
  );
}
