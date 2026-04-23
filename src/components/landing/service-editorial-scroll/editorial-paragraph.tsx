"use client";

import { cn } from "@/lib/utils";

import { StickyChapter } from "./sticky-chapter";

export function EditorialParagraph({
  text,
  variant,
}: {
  text: string;
  variant: "a" | "b";
}) {
  const isA = variant === "a";
  return (
    <StickyChapter
      stickyClassName={
        isA
          ? "pt-16 pl-5 pr-4 md:pt-28 md:pl-12 md:pr-8 lg:pt-60 lg:pl-24 lg:pr-12"
          : "justify-center pl-5 pr-4 md:pl-16 md:pr-8 lg:pl-28 lg:pr-16"
      }
    >
      <div className="w-full">
        <p
          className={cn(
            "max-w-3xl text-pretty font-sans text-base font-light leading-relaxed tracking-tight text-black/80 lg:text-3xl",
            !isA && "ml-auto",
          )}
        >
          {text}
        </p>
      </div>
    </StickyChapter>
  );
}
