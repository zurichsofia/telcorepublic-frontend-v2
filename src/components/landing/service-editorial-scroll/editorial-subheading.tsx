"use client";

import { StickyChapter } from "./sticky-chapter";

export function EditorialSubheading({ text }: { text: string }) {
  return (
    <StickyChapter
      stickyClassName="justify-center pt-12 pl-5 pr-4 md:pt-20 md:pl-12 md:pr-8 lg:pt-24 lg:pl-20 lg:pr-16"
    >
      <h2 className="mx-auto max-w-xs text-pretty font-sans text-2xl font-normal leading-tight tracking-tight text-black sm:max-w-sm sm:text-3xl lg:max-w-md lg:text-4xl">
        {text}
      </h2>
    </StickyChapter>
  );
}
