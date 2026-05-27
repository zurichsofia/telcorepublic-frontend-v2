"use client";

import { cn } from "@/lib/utils";

function DotRow({ count }: { count: number }) {
  const n = Math.min(Math.max(count, 1), 3);
  return (
    <div className="flex justify-center gap-1.5 pb-4" aria-hidden>
      {Array.from({ length: n }, (_, i) => (
        <span key={i} className="size-1.5 rounded-full bg-black" />
      ))}
    </div>
  );
}

export type EditorialPillarItem = {
  /** Optional title row (e.g. role name) above the body. */
  label?: string;
  text: string;
};

export type EditorialPillarsSectionProps = {
  items: readonly EditorialPillarItem[];
  className?: string;
};

/**
 * Centered dot pillars: 1–3 dots by row index, optional label + body or body only.
 */
export function EditorialPillarsSection({
  items,
  className,
}: EditorialPillarsSectionProps) {
  if (items.length === 0) return null;

  return (
    <section
      className={cn(
        "mx-auto max-w-2xl space-y-16 px-5 py-0 text-center sm:px-8 md:space-y-20",
        className,
      )}
    >
      {items.map((item, i) => (
        <div
          key={item.label ? `pillar-${item.label}-${i}` : `pillar-line-${i}`}
        >
          <DotRow count={i + 1} />
          {item.label ? (
            <>
              <p className="text-pretty font-sans text-base font-semibold leading-snug text-black sm:text-lg">
                {item.label}
              </p>
              <p className="mt-4 text-pretty font-sans text-sm font-light leading-relaxed text-black sm:text-base">
                {item.text}
              </p>
            </>
          ) : (
            <p className="text-pretty font-sans text-sm font-light leading-relaxed text-black sm:text-base">
              {item.text}
            </p>
          )}
        </div>
      ))}
    </section>
  );
}

