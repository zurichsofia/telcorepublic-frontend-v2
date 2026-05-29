import type { PortableTextBlock } from "next-sanity";
import { PortableText, type PortableTextComponents } from "next-sanity";
import Image from "next/image";

import { urlFor } from "@/sanity/image";
import { cn } from "@/lib/utils";

type NewsArticleBodyProps = {
  value: PortableTextBlock[] | null | undefined;
};

const bodyTone = "text-white/88";
/** Single-weight Helvetica — use medium for body; avoid semibold (reads too heavy). */
const bodyWeight = "font-medium";
const bodyText = cn(bodyTone, bodyWeight);
const decorationLine = "decoration-1 decoration-white";
const underlineMark = cn(
  bodyTone,
  bodyWeight,
  "underline underline-offset-[0.2em]",
  decorationLine,
);
const strikethroughMark = cn(bodyTone, bodyWeight, "line-through", decorationLine);
const linkMark = cn(
  bodyWeight,
  "text-telco-red underline underline-offset-[0.2em] decoration-1 decoration-telco-red transition-colors hover:text-white hover:decoration-white",
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

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className={cn(bodyText, "mb-4")}>{children}</p>
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
    strong: ({ children }) => (
      <strong className="font-bold tracking-[-0.01em] text-white">
        {children}
      </strong>
    ),
    em: ({ children }) => (
      <em className="font-medium italic">{children}</em>
    ),
    underline: ({ children }) => (
      <span className={underlineMark}>{children}</span>
    ),
    "strike-through": ({ children }) => (
      <s className={strikethroughMark}>{children}</s>
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
            sizes="(max-width: 1024px) 100vw, 896px"
          />
        </figure>
      );
    },
  },
};

export function NewsArticleBody({ value }: NewsArticleBodyProps) {
  if (!value?.length) return null;

  return (
    <div className="max-w-none text-[22px] leading-[1.65] font-medium text-white/88">
      <PortableText value={value} components={components} />
    </div>
  );
}
