"use client";

import { StickyChapter } from "./sticky-chapter";

export function EditorialSimpleList({
  heading,
  items,
}: {
  heading?: string;
  items: readonly string[];
}) {
  const scrollVh = Math.min(138, 64 + items.length * 4);
  return (
    <StickyChapter
      scrollVh={scrollVh}
      stickyClassName="justify-center px-5 py-12 sm:px-8 md:py-20 md:pl-12 lg:px-28 lg:py-32"
    >
      {heading ? (
        <p className="mb-20 max-w-xl font-sans text-xs font-medium uppercase tracking-widest text-black/40 sm:max-w-2xl">
          {heading}
        </p>
      ) : null}
      <ul className="max-w-2xl space-y-5 sm:max-w-3xl">
        {items.map((item) => (
          <li
            key={item}
            className="flex gap-6 text-pretty font-sans text-sm font-light leading-relaxed text-black/75 sm:text-base"
          >
            <span
              className="mt-1.5 h-px w-8 shrink-0 bg-black/20"
              aria-hidden
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </StickyChapter>
  );
}
