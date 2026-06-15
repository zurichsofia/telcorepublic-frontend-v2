"use client";

import { FloatingLinesWhyUsBackground } from "@/components/common/floating-lines/floating-lines-why-us-background";
import { ScrollLinkedReveal } from "@/components/common/scroll-reveal";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
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

const WHY_SCROLL_LINKED = {
  startAtVh: 0.92,
  completeAtVh: 0.5,
  driftPx: 36,
} as const;

function WhyChapter({
  title,
  paragraphs,
  alignRight,
}: {
  title: string;
  paragraphs: readonly string[];
  alignRight: boolean;
}) {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <ScrollLinkedReveal
      disabled={reduceMotion}
      className={cn(
        "w-full py-20 sm:py-14 md:py-24",
        alignRight
          ? "max-w-[85%] self-end md:max-w-none"
          : "max-w-[95%] self-start md:max-w-none",
      )}
      {...WHY_SCROLL_LINKED}
    >
      <div
        className={cn(
          "flex flex-col overflow-x-clip text-left lg:max-w-3xl",
          alignRight && "md:ml-auto md:text-right",
        )}
      >
        <h3 className="text-pretty font-sans text-xl font-medium leading-normal text-telco-red sm:text-2xl lg:text-3xl">
          {title}
        </h3>
        <div className="text-pretty font-sans text-xl md:text-2xl leading-tight text-telco-dark lg:text-justify">
          {paragraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </div>
      </div>
    </ScrollLinkedReveal>
  );
}

export function WhyUsSection() {
  return (
    <FloatingLinesWhyUsBackground className="z-20 px-6 pb-20 sm:px-10 sm:pt-16 sm:pb-24 lg:px-16 lg:pt-20 lg:pb-28 xl:px-20">
      <section
        className="mx-auto flex max-w-7xl flex-col overflow-x-clip"
        aria-label="Why Telco Republic"
      >
        {WHY_CHAPTERS.map((chapter, index) => (
          <WhyChapter
            key={chapter.title}
            title={chapter.title}
            paragraphs={chapter.paragraphs}
            alignRight={index % 2 === 1}
          />
        ))}
      </section>
    </FloatingLinesWhyUsBackground>
  );
}
