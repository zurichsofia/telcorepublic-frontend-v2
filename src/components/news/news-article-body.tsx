import type { PortableTextBlock } from "next-sanity";
import { PortableText, type PortableTextComponents } from "next-sanity";
import Image from "next/image";

import { urlFor } from "@/sanity/image";
import { cn } from "@/lib/utils";

type NewsArticleBodyProps = {
  value: PortableTextBlock[] | null | undefined;
};

const bodyTone = "text-white/88";
const listClass = cn(bodyTone, "mt-3 mb-5 pl-5");
const liClass = cn(bodyTone, "my-[0.4rem]");

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className={cn(bodyTone, "mb-4")}>{children}</p>
    ),
    h1: ({ children }) => (
      <h1
        className={cn(
          bodyTone,
          "mt-8 mb-4 text-[1.65rem] font-semibold tracking-[-0.03em] sm:text-[2rem]",
        )}
      >
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2
        className={cn(
          bodyTone,
          "mt-7 mb-[0.85rem] text-[1.4rem] font-medium tracking-[-0.02em] sm:text-[1.65rem]",
        )}
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3
        className={cn(
          bodyTone,
          "mt-[1.4rem] mb-3 text-[1.2rem] font-medium tracking-[-0.02em] sm:text-[1.3rem]",
        )}
      >
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4
        className={cn(
          bodyTone,
          "mt-6 mb-3 text-[1.1rem] font-medium tracking-[-0.02em]",
        )}
      >
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote
        className={cn(
          bodyTone,
          "my-5 border-l-2 border-white/20 pl-4 italic",
        )}
      >
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className={listClass}>{children}</ul>,
    number: ({ children }) => <ol className={listClass}>{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className={liClass}>{children}</li>,
    number: ({ children }) => <li className={liClass}>{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    underline: ({ children }) => <span className="underline">{children}</span>,
    "strike-through": ({ children }) => <s>{children}</s>,
    code: ({ children }) => (
      <code className="rounded bg-white/10 px-1 py-[0.1rem] font-mono text-[0.95em]">
        {children}
      </code>
    ),
    link: ({ children, value }) => {
      const href = typeof value?.href === "string" ? value.href : "#";
      return (
        <a
          href={href}
          className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white/60"
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
    <div className="max-w-none text-sm leading-[1.65] text-white/88 sm:text-base">
      <PortableText value={value} components={components} />
    </div>
  );
}
