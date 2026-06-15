"use client";

import { ScrollLinkedReveal } from "@/components/common/scroll-reveal";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

import { FloatingLinesWhyUsBackground } from "@/components/common/floating-lines/floating-lines-why-us-background";

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

const WHY_SCROLL_LINKED = {
  startAtVh: 0.92,
  completeAtVh: 0.5,
  driftPx: 36,
} as const;

function WhyChapter({
  title,
  paragraphs,
  variant,
  headingId,
  sectionClassName,
  sectionId,
  labelledBy,
}: {
  title: string;
  paragraphs: readonly string[];
  variant: "a" | "b";
  headingId?: string;
  sectionClassName?: string;
  sectionId?: string;
  labelledBy?: string;
}) {
  const isA = variant === "a";
  const reduceMotion = usePrefersReducedMotion();

  return (
    <ScrollLinkedReveal
      disabled={reduceMotion}
      id={sectionId}
      aria-labelledby={labelledBy}
      className={cn(
        "flex w-full flex-col justify-center",
        sectionClassName,
      )}
      {...WHY_SCROLL_LINKED}
    >
      <div
        className={cn(
          "flex w-full max-w-full flex-1 flex-col justify-center overflow-x-clip",
          !isA && "items-end",
        )}
      >
        <div
          className={cn(
            "w-full max-w-[98%] lg:max-w-[46rem] space-y-2 md:space-y-5",
            !isA && "text-right",
          )}
        >
          <h3
            id={headingId}
            className="text-pretty font-sans text-xl font-medium leading-normal text-telco-red sm:text-2xl lg:text-3xl"
          >
            {title}
          </h3>
          <div className="text-pretty font-sans text-xl leading-tight text-telco-dark lg:text-justify">
            {paragraphs.map((text) => (
              <p key={text}>{text}</p>
            ))}
          </div>
        </div>
      </div>
    </ScrollLinkedReveal>
  );
}

export function WhyUsSection() {
  return (
    <FloatingLinesWhyUsBackground className="z-20 w-full px-6 pb-20 sm:px-10 sm:pt-16 sm:pb-24 lg:px-16 lg:pt-20 lg:pb-28 xl:px-20">
      <section
        className="mx-auto w-full max-w-7xl overflow-x-clip"
        aria-label="Why Telco Republic"
      >
        {WHY_CHAPTERS.map((chapter, i) => (
          <WhyChapter
            key={chapter.title}
            title={chapter.title}
            paragraphs={chapter.paragraphs}
            variant={i % 2 === 0 ? "a" : "b"}
            headingId={i === 0 ? "why-us-entry" : undefined}
            sectionClassName={
              i === 0
                ? "min-h-[min(75svh,44rem)] pt-12 pb-16 sm:pt-16 sm:pb-20 md:pb-24"
                : "py-16 sm:py-20 md:py-24"
            }
            sectionId={i === 0 ? "why-us-first-screen" : undefined}
            labelledBy={i === 0 ? "why-us-entry" : undefined}
          />
        ))}
        <div
          className="pointer-events-none h-[min(24svh,18rem)] shrink-0 sm:h-[min(28svh,22rem)]"
          aria-hidden
        />
      </section>
    </FloatingLinesWhyUsBackground>
  );
}
