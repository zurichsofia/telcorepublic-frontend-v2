"use client";

import { FloatingLinesWhyUsBackground } from "@/components/common/floating-lines/floating-lines-why-us-background";
import { ScrollLinkedChapter } from "@/components/common/scroll-linked-chapter";

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

export function WhyUsSection() {
  return (
    <FloatingLinesWhyUsBackground className="z-20 px-6 pb-20 sm:px-10 sm:pt-16 sm:pb-24 lg:px-16 lg:pt-20 lg:pb-28 xl:px-20">
      <section
        className="mx-auto flex max-w-7xl flex-col overflow-x-clip"
        aria-label="Why Telco Republic"
      >
        {WHY_CHAPTERS.map((chapter, index) => (
          <ScrollLinkedChapter
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
