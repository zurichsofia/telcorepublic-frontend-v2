import { cn } from "@/lib/utils";

export type AudienceSegment = {
  name: string;
  description: string;
};

export type AudienceSegmentGridProps = {
  segments: readonly AudienceSegment[];
  className?: string;
};

function formatSegmentIndex(index: number): string {
  return String(index + 1).padStart(2, "0");
}

export function AudienceSegmentGrid({
  segments,
  className,
}: AudienceSegmentGridProps) {
  const hasOddCount = segments.length % 2 === 1;

  return (
    <ul
      role="list"
      className={cn(
        "mx-auto grid max-w-6xl grid-cols-1 gap-x-14 gap-y-12 sm:grid-cols-2 sm:gap-y-14 lg:gap-x-20 lg:gap-y-16",
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
              "sm:col-span-2 sm:mx-auto sm:max-w-xl sm:text-center",
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
