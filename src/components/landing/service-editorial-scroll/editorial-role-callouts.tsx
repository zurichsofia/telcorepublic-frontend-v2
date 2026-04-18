"use client";

import { cn } from "@/lib/utils";

import { StickyChapter } from "./sticky-chapter";

export function EditorialRoleCallouts({
  items,
}: {
  items: readonly { role: string; text: string; }[];
}) {
  return (
    <StickyChapter
      stickyClassName="justify-center py-12 pl-5 pr-5 md:py-24 md:pl-12 md:pr-16 lg:py-32 lg:pl-28 lg:pr-32"
    >
      <div className="flex w-full flex-col gap-12 md:gap-20 lg:gap-24">
        {items.map((item, index) => (
          <div
            key={item.role}
            className={cn(
              "max-w-xl sm:max-w-2xl",
              index % 2 === 0 ? "self-start" : "self-end",
            )}
          >
            <p className="font-sans text-xs font-medium uppercase tracking-widest text-black/40">
              {item.role}
            </p>
            <p className="mt-5 text-pretty font-sans text-sm font-light leading-relaxed text-black/75 sm:text-base">
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </StickyChapter>
  );
}
