"use client";

import { ScrollReveal } from "@/components/common/scroll-reveal";
import { FloatingLinesWhyUsBg } from "@/components/snow-mountain-landing/floating-lines-why-us-bg";
import { HERO_RELEASE_SCROLL_VH } from "@/components/snow-mountain-landing/hero-scroll";
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

function WhyChapter({
  title,
  paragraphs,
  variant,
  animate,
  headingId,
  bodyDelay = 0.14,
}: {
  title: string;
  paragraphs: readonly string[];
  variant: "a" | "b";
  animate: boolean;
  headingId?: string;
  bodyDelay?: number;
}) {
  const isA = variant === "a";
  const xDirection: 1 | -1 = isA ? -1 : 1;

  return (
    <ScrollReveal
      disabled={!animate}
      xDirection={xDirection}
      className={cn(
        "flex w-full max-w-full flex-col justify-center overflow-x-clip",
        isA
          ? "pl-5 pr-4 md:pl-12 md:pr-8 lg:pl-24 lg:pr-12"
          : "pl-5 pr-4 md:pl-16 md:pr-8 lg:pl-28 lg:pr-16",
      )}
    >
      <div
        className={cn(
          "w-full max-w-3xl space-y-4 md:space-y-5",
          !isA && "ml-auto text-right",
        )}
      >
        <ScrollReveal.Item
          as="h3"
          id={headingId}
          className={cn(
            "text-pretty font-sans text-xl font-medium leading-normal text-telco-red sm:text-2xl lg:text-3xl",
            !isA && "ml-auto max-w-3xl",
          )}
        >
          {title}
        </ScrollReveal.Item>
        <div
          className={cn(
            "space-y-4 text-pretty font-sans text-base leading-tight tracking-wide text-black lg:text-xl",
            !isA && "ml-auto max-w-3xl",
          )}
        >
          {paragraphs.map((text, j) => (
            <ScrollReveal.Item
              key={`${title}-${j}`}
              as="p"
              delay={bodyDelay + j * 0.07}
            >
              {text}
            </ScrollReveal.Item>
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
}

export function WhyUsSection() {
  const reduceMotion = usePrefersReducedMotion();
  const animate = !reduceMotion;

  const [first, ...rest] = WHY_CHAPTERS;

  return (
    <FloatingLinesWhyUsBg
      className="z-20 w-full"
      style={{ marginTop: `-${HERO_RELEASE_SCROLL_VH}vh` }}
    >
      <section className="overflow-x-clip" aria-label="Why Telco Republic">
        <div
          id="why-us-first-screen"
          className="flex h-screen min-h-screen w-full flex-col justify-center pt-24"
          aria-labelledby="why-us-entry"
        >
          <WhyChapter
            title={first.title}
            paragraphs={first.paragraphs}
            variant="a"
            animate={animate}
            headingId="why-us-entry"
          />
        </div>

        <div
          id="why-us-rest"
          className="flex w-full flex-col space-y-12 pb-8 md:space-y-20"
        >
          {rest.map((chapter, i) => (
            <div key={chapter.title} className="py-8 md:py-12">
              <WhyChapter
                title={chapter.title}
                paragraphs={chapter.paragraphs}
                variant={(i + 1) % 2 === 0 ? "a" : "b"}
                animate={animate}
              />
            </div>
          ))}
        </div>
      </section>
    </FloatingLinesWhyUsBg>
  );
}
