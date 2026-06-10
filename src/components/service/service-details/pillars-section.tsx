import { cn } from "@/lib/utils";

function DotRow({ count }: { count: number; }) {
  const n = Math.min(Math.max(count, 1), 3);
  return (
    <div className="flex justify-center gap-1.5 pb-4" aria-hidden>
      {Array.from({ length: n }, (_, i) => (
        <span key={i} className="size-2.5 rounded-full bg-telco-dark" />
      ))}
    </div>
  );
}

export type PillarItem = {
  /** Optional title row (e.g. role name) above the body. */
  label?: string;
  text: string;
};

export type PillarsSectionProps = {
  items: readonly PillarItem[];
  className?: string;
};

/**
 * Centered dot pillars: 1–3 dots by row index, optional label + body or body only.
 */
export function PillarsSection({ items, className }: PillarsSectionProps) {
  if (items.length === 0) return null;

  return (
    <section
      className={cn(
        "mx-auto max-w-xl space-y-16 px-5 text-center sm:px-8 md:space-y-20",
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
              <p className="font-semibold leading-snug text-telco-dark text-base sm:text-xl">
                {item.label}
              </p>
              <p className="mt-4 font-light leading-relaxed text-telco-dark text-sm sm:text-xl">
                {item.text}
              </p>
            </>
          ) : (
            <p className="font-normal leading-relaxed text-telco-dark text-sm sm:text-xl">
              {item.text}
            </p>
          )}
        </div>
      ))}
    </section>
  );
}
