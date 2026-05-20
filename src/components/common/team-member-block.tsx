"use client";

import { useId, useState } from "react";

import { cn } from "@/lib/utils";

export type TeamMemberBlockProps = {
  id: string;
  role: string;
  name: string;
  linkedinUrl?: string;
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
 * Two-column profile: role + name (telco-red) and body copy + read more, with optional reversed columns.
 */
export function TeamMemberBlock({
  id,
  role,
  name,
  linkedinUrl,
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
        "mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 py-20 sm:px-8 lg:grid-cols-2 lg:gap-24 lg:py-52 text-justify",
        reverse && "[&>div]:order-1 [&>header]:order-2",
        className,
      )}
    >
      <header
        className={cn(
          "max-w-md",
          reverse && "lg:ml-auto ",
        )}
      >
        <p className="text-lg font-semibold tracking-wide text-telco-red">
          {role}
        </p>
        <h2 className="mt-2 font-display text-4xl text-telco-red sm:text-5xl">
          {linkedinUrl ? (
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-inherit transition-opacity hover:opacity-75"
              aria-label={`${name} on LinkedIn`}
            >
              {name}
            </a>
          ) : (
            name
          )}
        </h2>
      </header>
      <div className="min-w-0">
        <div className="space-y-5 text-base font-light leading-relaxed text-neutral-900">
          {previewParagraphs.map((p, index) => (
            <p key={`${id}-preview-${index}`}>{p}</p>
          ))}
        </div>

        {hasMore ? (
          <div
            id={regionId}
            hidden={!expanded}
            className="mt-5 space-y-5 pt-5 text-base font-light leading-relaxed text-neutral-900"
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
              className="text-base font-normal text-telco-red transition-opacity hover:opacity-75 cursor-pointer"
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
