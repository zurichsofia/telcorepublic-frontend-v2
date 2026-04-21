"use client";

import { useId, useState } from "react";

import { cn } from "@/lib/utils";

export type TeamMemberBlockProps = {
  id: string;
  role: string;
  name: string;
  previewParagraphs: readonly string[];
  /** Extra copy revealed by “Read more”. Omit or pass empty to hide the control. */
  moreParagraphs?: readonly string[];
  readMoreLabel?: string;
  readLessLabel?: string;
  /** When true, body column is on the left and the name block on the right (lg+). */
  reverse?: boolean;
  className?: string;
};

/**
 * Two-column profile: role + name (red) and body copy + read more, with optional reversed columns.
 */
export function TeamMemberBlock({
  id,
  role,
  name,
  previewParagraphs,
  moreParagraphs = [],
  readMoreLabel = "Read more",
  readLessLabel = "Read less",
  reverse = false,
  className,
}: TeamMemberBlockProps) {
  const [expanded, setExpanded] = useState(false);
  const regionId = useId();
  const hasMore = moreParagraphs.length > 0;

  return (
    <article
      id={id}
      className={cn(
        "mx-auto grid max-w-6xl grid-cols-1 gap-10 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:py-20",
        reverse && "[&>div]:order-1 [&>header]:order-2",
        className,
      )}
    >
      <header
        className={cn(
          "max-w-sm",
          reverse && "lg:ml-auto lg:text-right",
        )}
      >
        <p className="text-sm font-semibold uppercase tracking-wide text-red-600">
          {role}
        </p>
        <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight text-red-600 sm:text-5xl">
          {name}
        </h2>
      </header>
      <div className="min-w-0">
        <div className="space-y-4 text-base font-light leading-relaxed text-neutral-900">
          {previewParagraphs.map((p, index) => (
            <p key={`${id}-preview-${index}`}>{p}</p>
          ))}
        </div>

        {hasMore ? (
          <div
            id={regionId}
            hidden={!expanded}
            className="mt-4 space-y-4 pt-4 text-base font-light leading-relaxed text-neutral-900"
          >
            {moreParagraphs.map((p, index) => (
              <p key={`${id}-more-${index}`}>{p}</p>
            ))}
          </div>
        ) : null}

        {hasMore ? (
          <p className="mt-8">
            <button
              type="button"
              className="text-base font-normal text-red-600 underline-offset-4 hover:underline"
              aria-expanded={expanded}
              aria-controls={regionId}
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded ? readLessLabel : readMoreLabel}
            </button>
          </p>
        ) : null}
      </div>
    </article>
  );
}
