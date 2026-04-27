"use client";

import { cn } from "@/lib/utils";

export type EditorialInlineListProps = {
  heading?: string;
  items: readonly string[];
  /** Tighter rhythm when nested (e.g. homepage services list). */
  dense?: boolean;
  className?: string;
};

/**
 * Short editorial list: optional heading, then all items in one flowing block
 * separated by middots (wraps naturally; not one row per item).
 */
export function EditorialInlineList({
  heading,
  items,
  dense,
  className,
}: EditorialInlineListProps) {
  if (items.length === 0) return null;

  return (
    <div
      className={cn(
        "mx-auto w-full max-w-4xl px-5 py-0 sm:px-8 lg:max-w-5xl",
        className,
      )}
    >
      {heading ? (
        <h3
          className={cn(
            "text-center font-sans text-lg font-medium leading-snug text-telco-red sm:text-xl",
            dense ? "mb-3" : "mb-6 md:mb-8",
          )}
        >
          {heading}
        </h3>
      ) : null}
      <p
        className={cn(
          "text-pretty text-center font-sans text-sm font-light leading-[1.7] tracking-tight text-black/80 sm:text-[0.9375rem]",
          dense && "leading-relaxed",
        )}
      >
        {items.map((item, i) => (
          <span key={`inline-list-${i}`}>
            {i > 0 ? (
              <span className="select-none text-black/22" aria-hidden>
                {" · "}
              </span>
            ) : null}
            <span>{item}</span>
          </span>
        ))}
      </p>
    </div>
  );
}
