"use client";

import { cn } from "@/lib/utils";

import { StickyChapter } from "./sticky-chapter";

export function EditorialOfferMoment({
  name,
  description,
  variant,
}: {
  name: string;
  description: string;
  variant: "a" | "b";
}) {
  const isA = variant === "a";
  return (
    <StickyChapter
      stickyClassName={
        isA
          ? "justify-center items-start pl-5 pr-4 sm:pl-8 sm:pr-8 md:pl-12 md:pr-8 lg:pl-24 lg:pr-12"
          : "justify-center items-start w-full pl-5 pr-4 md:pl-16 md:pr-8 lg:pl-28 lg:pr-16"
      }
    >
      <div
        className={cn("max-w-3xl sm:max-w-4xl", !isA && "ml-auto")}
      >
        <h3 className="text-pretty font-sans text-xl font-normal leading-tight tracking-tight text-black sm:text-2xl lg:text-4xl">
          {name}
        </h3>
        <p className="mt-8 max-w-2xl text-pretty font-sans text-sm font-light leading-relaxed text-black/70 sm:max-w-3xl sm:text-base">
          {description}
        </p>
      </div>
    </StickyChapter>
  );
}

export function EditorialOffersGroup({
  heading,
  items,
}: {
  heading?: string;
  items: readonly { name: string; description: string; }[];
}) {
  return (
    <div className="w-full">
      {heading ? (
        <div className="bg-white px-5 pb-12 pt-16 sm:px-8 md:pb-24 md:pt-24 lg:px-20 lg:pb-28 lg:pt-36">
          <p className="max-w-xl font-sans text-xs font-medium uppercase tracking-widest text-black/40 sm:max-w-2xl">
            {heading}
          </p>
        </div>
      ) : null}
      {items.map((item, index) => (
        <EditorialOfferMoment
          key={item.name}
          name={item.name}
          description={item.description}
          variant={index % 2 === 0 ? "a" : "b"}
        />
      ))}
    </div>
  );
}
