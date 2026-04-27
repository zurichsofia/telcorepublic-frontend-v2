"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

import { HOME_WHY_SNAP_ID } from "@/components/common/document-scroll-snap";
import { cn } from "@/lib/utils";

const WHY_CHAPTERS = [
  {
    title: "Decades of Industry Experience",
    paragraphs: [
      "We have worked for leading global analyst research firms, such as Gartner, for decades. We have worked in the industry and followed its market evolution since the 1990s.",
    ],
  },
  {
    title: "Personalized, Responsive and Collaborative",
    paragraphs: [
      "Our services are personalized and flexible, at an attractive price/performance ratio.",
    ],
  },
  {
    title: "Comprehensive Insights",
    paragraphs: [
      "We have supported hundreds of global operators, vendors, investors and tech startups.",
    ],
  },
  {
    title: "Reliable Methodology",
    paragraphs: [
      "We have developed industry models, benchmarks and best practices for users and suppliers to support digital transformation and change management.",
    ],
  },
  {
    title: "Objective, Unbiased, Fact-based",
    paragraphs: [
      "Our mission is to provide unbiased, fact-based and in-depth insights in conjunction with strategic advice.",
    ],
  },
  {
    title: "Extensive Network",
    paragraphs: [
      "Industry leaders rely on our insights and advice. We maintain a strong Senior Executive and C-Level network on a global basis.",
    ],
  },
] as const;

/** Paragraphs slide up and fade in as their scroll position crosses the viewport band. */
function ScrollRevealParagraph({
  children,
  reduceMotion,
}: {
  children: string;
  reduceMotion: boolean;
}) {
  const ref = useRef<HTMLParagraphElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    /** Wide band so opacity / y ramp over more scroll (was ~0.44vh → feels rushed). */
    offset: ["start end", "start 0.28"],
  });
  const opacity = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [1, 1] : [0, 1],
  );
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? [0, 0] : [36, 0],
  );

  return (
    <motion.p
      ref={ref}
      className="will-change-[transform,opacity]"
      style={{ opacity, y }}
    >
      {children}
    </motion.p>
  );
}

function WhyChapter({
  title,
  paragraphs,
  variant,
  reduceMotion,
}: {
  title: string;
  paragraphs: readonly string[];
  variant: "a" | "b";
  reduceMotion: boolean;
}) {
  const isA = variant === "a";
  /**
   * One chapter ≈ one viewport: avoid stacked `position: sticky` (previous pin + next
   * in-flow shows two chapters in the same view).
   */
  return (
    <div
      className={cn(
        "flex min-h-dvh w-full max-w-full flex-col justify-center overflow-x-clip py-16 md:py-24",
        isA
          ? "pl-5 pr-4 md:pl-12 md:pr-8 lg:pl-24 lg:pr-12"
          : "pl-5 pr-4 md:pl-16 md:pr-8 lg:pl-28 lg:pr-16",
      )}
    >
      <div
        className={cn(
          "w-full max-w-2xl space-y-5 md:space-y-6",
          !isA && "ml-auto text-right",
        )}
      >
        <h3
          className={cn(
            "text-pretty font-sans text-xl font-medium leading-snug tracking-tight text-telco-red sm:text-2xl lg:text-3xl",
            !isA && "ml-auto max-w-2xl",
          )}
        >
          {title}
        </h3>
        <div
          className={cn(
            "space-y-4 text-pretty font-sans text-base font-light leading-relaxed tracking-tight text-black/80 md:space-y-5 lg:text-xl",
            !isA && "ml-auto",
          )}
        >
          {paragraphs.map((text, j) => (
            <ScrollRevealParagraph
              key={`${title}-${j}`}
              reduceMotion={reduceMotion}
            >
              {text}
            </ScrollRevealParagraph>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * “Why Telco Republic” — full-viewport chapters (not `StickyChapter`): stacked sticky
 * would show two chapters in one viewport while one pin hands off to the next.
 *
 * The root `motion.section` only drives opacity (no `transform` — avoids sticky bugs).
 */
export function WhyUsSection() {
  const reduce = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.78, 1],
    reduce ? [1, 1, 1, 1] : [0.9, 1, 1, 0.94],
  );

  return (
    <motion.section
      ref={sectionRef}
      id="why-telco-republic"
      className="relative isolate w-full overflow-x-clip bg-white pb-8"
      aria-labelledby="home-why-heading"
      style={{ opacity }}
    >
      <div
        id={HOME_WHY_SNAP_ID}
        className="flex min-h-dvh w-full flex-col justify-center"
      >
        <header className="relative z-10 mx-auto max-w-4xl px-5 pt-28 pb-16 text-center sm:px-8 sm:pt-32 md:pb-20 lg:pt-36">
          <div
            className="mx-auto mb-6 h-px w-12 bg-linear-to-r from-telco-red/55 to-transparent sm:mb-8 sm:w-16"
            aria-hidden
          />
          <p className="text-xs font-medium uppercase tracking-widest text-black/75">
            Why us
          </p>
          <h2
            id="home-why-heading"
            className="mx-auto mt-4 max-w-3xl text-pretty font-display text-3xl font-normal tracking-tight text-telco-red sm:text-4xl md:text-5xl"
          >
            Why Telco Republic
          </h2>
        </header>
      </div>

      <div className="relative w-full" aria-label="Why Telco Republic">
        {WHY_CHAPTERS.map((chapter, i) => (
          <WhyChapter
            key={chapter.title}
            title={chapter.title}
            paragraphs={chapter.paragraphs}
            variant={i % 2 === 0 ? "a" : "b"}
            reduceMotion={reduce}
          />
        ))}
      </div>
    </motion.section>
  );
}
