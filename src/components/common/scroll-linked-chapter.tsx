"use client";

import { ScrollLinkedReveal } from "@/components/common/scroll-reveal";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

export const SCROLL_LINKED_CHAPTER_DEFAULTS = {
  startAtVh: 0.92,
  completeAtVh: 0.5,
  driftPx: 36,
} as const;

export type ScrollLinkedChapterProps = {
  title: string;
  paragraphs: readonly string[];
  alignRight?: boolean;
};

export function ScrollLinkedChapter({
  title,
  paragraphs,
  alignRight = false,
}: ScrollLinkedChapterProps) {
  const reduceMotion = usePrefersReducedMotion();

  return (
    <ScrollLinkedReveal
      disabled={reduceMotion}
      className={cn(
        "w-full py-20 sm:py-14 md:py-24",
        alignRight
          ? "max-w-[90%] self-end md:max-w-none"
          : "max-w-[90%] self-start md:max-w-none",
      )}
      {...SCROLL_LINKED_CHAPTER_DEFAULTS}
    >
      <div
        className={cn(
          "flex flex-col overflow-x-clip text-left lg:max-w-3xl",
          alignRight && "md:ml-auto md:text-right",
        )}
      >
        <h3 className="text-pretty text-3xl font-medium leading-normal text-telco-red sm:text-2xl lg:text-3xl">
          {title}
        </h3>
        <div className="text-pretty text-2xl leading-tight text-telco-dark md:text-2xl lg:text-justify">
          {paragraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </div>
      </div>
    </ScrollLinkedReveal>
  );
}
