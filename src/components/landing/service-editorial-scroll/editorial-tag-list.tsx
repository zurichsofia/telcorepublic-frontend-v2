"use client";

import { StickyChapter } from "./sticky-chapter";

export function EditorialTagList({
  heading,
  tags,
}: {
  heading?: string;
  tags: readonly string[];
}) {
  return (
    <StickyChapter
      stickyClassName="justify-start py-16 pl-5 pr-4 md:py-28 md:pl-12 md:pr-8 lg:py-40 lg:pl-28 lg:pr-12 xl:pl-36"
    >
      {heading ? (
        <p className="max-w-xl font-sans text-xs font-medium uppercase tracking-widest text-black/40 sm:max-w-2xl">
          {heading}
        </p>
      ) : null}
      <ul
        className={`${heading ? "mt-16" : ""} max-w-xs space-y-6 sm:max-w-sm`}
      >
        {tags.map((tag) => (
          <li
            key={tag}
            className="border-b border-black/10 pb-6 font-sans text-base font-normal tracking-tight text-black/80 last:border-0 last:pb-0 sm:text-lg"
          >
            {tag}
          </li>
        ))}
      </ul>
    </StickyChapter>
  );
}
