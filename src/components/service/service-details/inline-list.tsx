import { cn } from "@/lib/utils";

export type InlineListProps = {
  heading?: string;
  items: readonly string[];
  /** Tighter rhythm when nested (e.g. homepage services list). */
  dense?: boolean;
  className?: string;
};

/**
 * Optional heading, then all items in one flowing block separated by dots.
 */
export function InlineList({
  heading,
  items,
  dense,
  className,
}: InlineListProps) {
  if (items.length === 0) return null;

  return (
    <div className={cn("mx-auto max-w-6xl px-5 sm:px-8", className)}>
      {heading && (
        <h3
          className={cn(
            "text-center font-medium leading-snug text-telco-red text-lg sm:text-xl",
            dense ? "mb-3" : "mb-6 md:mb-8",
          )}
        >
          {heading}
        </h3>
      )}
      <p
        className={cn(
          "text-center font-light leading-relaxed text-telco-dark text-sm sm:text-xl",
          dense && "leading-relaxed",
        )}
      >
        {items.map((item, i) => (
          <span key={`inline-list-${i}`}>
            {i > 0 && (
              <span
                className="mx-4 inline-block size-1.5 shrink-0 rounded-full bg-telco-dark align-middle"
                aria-hidden
              />
            )}
            <span>{item}</span>
          </span>
        ))}
      </p>
    </div>
  );
}
