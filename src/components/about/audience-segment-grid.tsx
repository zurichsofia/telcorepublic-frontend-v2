import { cn } from "@/lib/utils";

export type AudienceSegment = {
  name: string;
  description: string;
};

export type AudienceSegmentGridProps = {
  segments: readonly AudienceSegment[];
  /** Default 2; use 3 for compact advisory audience rows (e.g. About Us). */
  columns?: 2 | 3;
  className?: string;
};

function formatSegmentIndex(index: number): string {
  return String(index + 1).padStart(2, "0");
}

const gridClassByColumns = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
} as const;

export function AudienceSegmentGrid({
  segments,
  columns = 2,
  className,
}: AudienceSegmentGridProps) {
  const hasOddCount = segments.length % columns === 1;

  return (
    <ul
      role="list"
      className={cn(
        "mx-auto grid max-w-6xl grid-cols-1 gap-x-14 gap-y-12 sm:gap-y-14 lg:gap-x-20 lg:gap-y-16",
        gridClassByColumns[columns],
        className,
      )}
    >
      {segments.map((segment, index) => (
        <li
          key={segment.name}
          className={cn(
            "relative border-t border-telco-dark/10 pt-8 sm:pt-10",
            hasOddCount &&
              index === segments.length - 1 &&
              columns === 2 &&
              "sm:col-span-2 sm:mx-auto sm:max-w-xl sm:text-center",
            hasOddCount &&
              index === segments.length - 1 &&
              columns === 3 &&
              "sm:col-span-3 sm:mx-auto sm:max-w-xl sm:text-center",
          )}
        >
          <p
            className="font-display text-5xl leading-none tabular-nums text-telco-red/20"
            aria-hidden
          >
            {formatSegmentIndex(index)}
          </p>
          <h3 className="mt-3 font-display text-2xl leading-snug text-telco-red sm:mt-4">
            {segment.name}
          </h3>
          <p className="mt-3 text-base font-light leading-relaxed text-telco-dark sm:mt-4 sm:text-xl">
            {segment.description}
          </p>
        </li>
      ))}
    </ul>
  );
}
