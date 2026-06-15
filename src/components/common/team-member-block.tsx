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
  /** When true, body column is on the left and the name block on the right (lg+ only). */
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
        "mx-auto grid max-w-7xl grid-cols-1 gap-4 px-6 py-20 text-justify sm:px-8 lg:gap-40 lg:py-52",
        reverse ? "lg:grid-cols-[3fr_2fr] lg:[&>div]:order-1 lg:[&>header]:order-2" : "lg:grid-cols-[2fr_3fr]",
        className,
      )}
    >
      <header
        className={cn(
          "max-w-md",
          reverse && "lg:ml-auto ",
        )}
      >
        <p className="text-sm leading-tight tracking-wider font-bold text-telco-red">
          {role}
        </p>
        <h2 className="mt-2 font-display text-2xl md:text-5xl text-telco-red">
          {name}
        </h2>
      </header>
      <div className="min-w-0">
        <div className="space-y-2 text-base md:text-xl font-light  text-telco-dark">
          {previewParagraphs.map((p, index) => (
            <p key={`${id}-preview-${index}`}>{p}</p>
          ))}
        </div>

        {hasMore ? (
          <div
            id={regionId}
            hidden={!expanded}
            className="mt-5 space-y-2pt-5  text-base md:text-xl  font-light text-telco-dark"
          >
            {moreParagraphs.map((p, index) => (
              <p key={`${id}-more-${index}`}>{p}</p>
            ))}
          </div>
        ) : null}

        {expanded && linkedinUrl ? (
          <p className="mt-4 md:mt-8 text-base md:text-xl font-light text-telco-dark">
            Learn more on{" "}
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-normal text-telco-red transition-opacity hover:opacity-75"
            >
              LinkedIn
            </a>
            .
          </p>
        ) : null}

        {hasMore ? (
          <p className="mt-4 md:mt-8">
            <button
              type="button"
              className="text-base md:text-xl font-normal text-telco-red transition-opacity hover:opacity-75 cursor-pointer"
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
