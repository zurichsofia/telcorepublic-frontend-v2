import type { PortableTextBlock } from "next-sanity";
import { PortableText, type PortableTextComponents } from "next-sanity";
import Image from "next/image";

import { urlFor } from "@/sanity/image";
import { cn } from "@/lib/utils";

type NewsArticleBodyProps = {
  value: PortableTextBlock[] | null | undefined;
};

const bodyTone = "text-white/88";
/** Single-weight Helvetica — strong is full white via wrapper descendant rule. */
const bodyWeight = "font-medium";
const bodyText = cn(bodyTone, bodyWeight, "leading-[1.45]");
const decorationLine = "decoration-1 decoration-white";
const underlineMark = cn(
  bodyTone,
  bodyWeight,
  "underline underline-offset-[0.2em]",
  decorationLine,
);
const strikethroughMark = cn(bodyTone, bodyWeight, "line-through", decorationLine);
/** Links stay telco-red; nested marks inherit so underline/strong do not look like body text. */
const linkMark = cn(
  bodyWeight,
  "text-telco-red underline underline-offset-[0.2em] decoration-1 decoration-telco-red transition-colors hover:text-white hover:decoration-white",
  "[&_strong]:text-inherit [&_em]:text-inherit [&_s]:text-inherit",
  "[&_.article-underline]:text-inherit [&_.article-underline]:decoration-inherit",
  "[&_.article-strikethrough]:text-inherit [&_.article-strikethrough]:decoration-inherit",
  "[&_code]:border-white/20 [&_code]:bg-white/10 [&_code]:text-inherit",
);
const ulClass = cn(
  bodyText,
  "mt-3 mb-5 list-disc pl-6 marker:text-white/70",
);
const olClass = cn(
  bodyText,
  "mt-3 mb-5 list-decimal pl-6 marker:text-white/70",
);
const liClass = cn(bodyText, "my-[0.4rem] pl-1");

function isEmptyTextBlock(value: unknown): boolean {
  if (!value || typeof value !== "object" || !("children" in value)) return true;
  const children = (value as { children?: unknown; }).children;
  if (!Array.isArray(children) || children.length === 0) return true;
  return children.every(
    (child) =>
      typeof child === "object" &&
      child !== null &&
      "text" in child &&
      typeof child.text === "string" &&
      child.text.trim() === "",
  );
}

const components: PortableTextComponents = {
  block: {
    normal: ({ children, value }) => (
      <p
        className={cn(
          bodyText,
          "mb-6",
          isEmptyTextBlock(value) && "min-h-[1.45em]",
        )}
      >
        {children}
      </p>
    ),
    h1: ({ children }) => (
      <h1
        className={cn(
          bodyTone,
          "mt-8 mb-4 text-[50px]",
        )}
      >
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2
        className={cn(
          bodyTone,
          "mt-7 mb-[0.85rem] text-[40px]",
        )}
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3
        className={cn(
          bodyText,
          "mt-[1.4rem] mb-3 text-[34px]",
        )}
      >
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4
        className={cn(
          bodyText,
          "mt-6 mb-3 text-[26px]",
        )}
      >
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote
        className={cn(
          bodyText,
          "my-5 border-l-2 border-white/20 pl-4 italic",
        )}
      >
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className={ulClass}>{children}</ul>,
    number: ({ children }) => <ol className={olClass}>{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className={liClass}>{children}</li>,
    number: ({ children }) => <li className={liClass}>{children}</li>,
  },
  marks: {
    em: ({ children }) => (
      <em className="font-medium italic">{children}</em>
    ),
    underline: ({ children }) => (
      <span className={cn(underlineMark, "article-underline")}>{children}</span>
    ),
    "strike-through": ({ children }) => (
      <s className={cn(strikethroughMark, "article-strikethrough")}>{children}</s>
    ),
    strong: ({ children }) => (
      <strong className="font-medium">{children}</strong>
    ),
    code: ({ children }) => (
      <code className="rounded bg-white/10 px-1 py-[0.1rem] font-mono text-[0.95em] font-normal">
        {children}
      </code>
    ),
    link: ({ children, value }) => {
      const href = typeof value?.href === "string" ? value.href : "#";
      return (
        <a
          href={href}
          className={linkMark}
          rel="noopener noreferrer"
          target="_blank"
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      const src = urlFor(value).width(1200).auto("format").url();
      return (
        <figure className="my-6 mx-auto w-full max-w-full">
          <Image
            src={src}
            alt={typeof value.alt === "string" ? value.alt : ""}
            width={1200}
            height={800}
            className="mx-auto block h-auto max-w-full object-contain"
            sizes="(max-width: 1280px) 100vw, 1152px"
          />
        </figure>
      );
    },
  },
};

export function NewsArticleBody({ value }: NewsArticleBodyProps) {
  if (!value?.length) return null;

  return (
    <div className="max-w-none wrap-break-word text-[20px] font-medium text-white/88 [&_strong]:text-white [&_a_strong]:text-inherit [&_a_.article-underline]:text-inherit [&_a_.article-underline]:decoration-inherit [&_a_.article-strikethrough]:text-inherit [&_a_.article-strikethrough]:decoration-inherit">
      <PortableText value={value} components={components} />
    </div>
  );
}
