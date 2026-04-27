"use client";

import { StickyChapter } from "@/components/landing/service-editorial-scroll/sticky-chapter";

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
      "Industry leaders rely on our insights and advice.",
      "We maintain a strong Senior Executive and C-Level network on a global basis.",
    ],
  },
] as const;

function WhyChapter({
  title,
  paragraphs,
  variant,
}: {
  title: string;
  paragraphs: readonly string[];
  variant: "a" | "b";
}) {
  const isA = variant === "a";
  return (
    <StickyChapter
      stickyClassName={
        isA
          ? "pt-16 pl-5 pr-4 md:pt-28 md:pl-12 md:pr-8 lg:pt-20 lg:pl-24 lg:pr-12"
          : "justify-center pl-5 pr-4 md:pl-16 md:pr-8 lg:pl-28 lg:pr-16"
      }
    >
      <div
        className={cn(
          "w-full max-w-3xl space-y-5 md:space-y-6",
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
            <p key={`${title}-${j}`}>{text}</p>
          ))}
        </div>
      </div>
    </StickyChapter>
  );
}

/**
 * “Why Telco Republic” — same sticky scroll-up chapters as `ServiceEditorialScroll` /
 * `EditorialParagraph`, alternating left / right alignment.
 */
export function WhyUsSection() {
  return (
    <section
      id="why-telco-republic"
      className="relative isolate w-full overflow-x-clip bg-white pb-8"
      aria-labelledby="home-why-heading"
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

      <div className="relative w-full" aria-label="Why Telco Republic">
        {WHY_CHAPTERS.map((chapter, i) => (
          <WhyChapter
            key={chapter.title}
            title={chapter.title}
            paragraphs={chapter.paragraphs}
            variant={i % 2 === 0 ? "a" : "b"}
          />
        ))}
      </div>
    </section>
  );
}
