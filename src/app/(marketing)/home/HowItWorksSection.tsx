"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useSpring,
  useScroll,
} from "framer-motion";
import { processSteps } from "./data";
import { Container, SectionHeading } from "../components/shared";

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-brand pb-12 sm:pb-16 md:pb-24">
      <Container>
        <SectionHeading
          eyebrow="How It Works"
          title={
            <>
              Buying Real Estate Used to Take 90 Days. Now It Takes 5 Minutes.
            </>
          }
          description="No brokers. No closing costs. No 47-page mortgage application. Here's every step between you and your first rental income."
          tone="light"
        />

        {/* Mobile / tablet: a static stacked list. Avoids the 400vh scroll
            trigger which is jarring on a phone and forces 4 viewports of
            scrolling through what should feel like a single section. */}
        <ol className="mt-10 flex flex-col gap-10 md:hidden">
          {processSteps.map((step, index) => (
            <li
              key={step.id}
              className="flex flex-col gap-5 border-t border-white/15 pt-6 first:border-t-0 first:pt-0"
            >
              <div className="flex items-center gap-4">
                <span
                  className={`inline-flex size-12 shrink-0 items-center justify-center rounded-xl text-2xl font-medium ${
                    index === 0 ? "bg-white text-brand" : "bg-white/15 text-white"
                  }`}
                  aria-hidden
                >
                  {step.id}
                </span>
                <h3 className="text-h2 font-medium leading-tight text-white">
                  {step.title}
                </h3>
              </div>
              <p className="text-base leading-relaxed text-[#E7EBEE] sm:text-body-lg">
                {step.body}
              </p>
              <div className="aspect-611/691 mx-auto w-full max-w-[460px] overflow-hidden rounded-[20px]">
                <img
                  src={step.image}
                  alt={step.title}
                  className="h-full w-full object-scale-down object-top"
                />
              </div>
            </li>
          ))}
        </ol>

        {/* Desktop: the original scroll-driven sticky experience. */}
        <DesktopScrollSteps />
      </Container>
    </section>
  );
}

function DesktopScrollSteps() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [activeStepProgress, setActiveStepProgress] = useState(0);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const smoothScrollProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    mass: 0.6,
  });

  useMotionValueEvent(smoothScrollProgress, "change", (latestProgress) => {
    if (latestProgress >= 0.999) {
      setActiveStepIndex(processSteps.length - 1);
      setActiveStepProgress(1);
      return;
    }

    const boundedProgress = Math.max(0, latestProgress) * processSteps.length;
    const stepCursor = Math.min(boundedProgress, processSteps.length - 0.0001);
    const nextActiveStepIndex = Math.floor(stepCursor);
    const nextActiveStepProgress = stepCursor - nextActiveStepIndex;

    setActiveStepIndex(nextActiveStepIndex);
    setActiveStepProgress(nextActiveStepProgress);
  });

  const activeStep = processSteps[activeStepIndex];
  const indicatorTrackHeight = 164;
  const indicatorThumbHeight = 72;
  const indicatorThumbOffset = Math.round(
    (indicatorTrackHeight - indicatorThumbHeight) * activeStepProgress,
  );

  return (
    <div ref={sectionRef} className="relative mt-12 hidden h-[400vh] md:block">
      <div className="sticky top-0 flex h-screen items-center py-3 md:py-4">
        <div className="grid w-full gap-8 lg:grid-cols-[600px_1fr] lg:gap-12">
          <article className="grid grid-cols-[98px_1fr] items-center gap-6">
            <div className="flex h-full items-center gap-5">
              <div className="inline-flex h-[60px] w-[69px] items-center justify-center rounded-[10px] bg-white/30 text-[32px] font-medium text-white">
                {activeStep.id}
              </div>

              <div
                className="relative w-[8px] rounded-[40px] bg-white/15"
                style={{ height: `${indicatorTrackHeight}px` }}
              >
                <motion.div
                  className="absolute left-0 top-0 w-[8px] rounded-[40px] bg-white"
                  style={{ height: `${indicatorThumbHeight}px` }}
                  animate={{ y: indicatorThumbOffset }}
                  transition={{
                    type: "spring",
                    stiffness: 320,
                    damping: 34,
                    mass: 0.45,
                  }}
                />
              </div>
            </div>

            <div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStep.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  <h3 className="text-[32px] font-medium leading-tight text-white md:text-[36px]">
                    {activeStep.title}
                  </h3>
                  <p className="mt-4 text-[20px] leading-[1.45] text-[#E7EBEE] md:text-[22px]">
                    {activeStep.body}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </article>

          <div className="relative mx-auto aspect-611/691 w-full max-w-[460px] overflow-hidden rounded-[20px] md:max-w-[560px] lg:max-w-[640px] xl:max-w-[700px]">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeStep.id}
                src={activeStep.image}
                alt={activeStep.title}
                className="h-full w-full object-scale-down object-top"
                initial={{ opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.015 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
