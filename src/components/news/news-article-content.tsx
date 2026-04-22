import Image from "next/image";

import type { NewsContentBlock } from "@/data/news";
import { cn } from "@/lib/utils";

type NewsArticleContentProps = {
  content: readonly NewsContentBlock[];
};

/** Shared body color for prose blocks (used on multiple element types). */
const bodyTone = "text-white/88";

const listClass = cn(bodyTone, "mt-3 mb-5 pl-5");
const liClass = cn(bodyTone, "my-[0.4rem]");

/**
 * Renders structured blog blocks with shared article typography (dark page).
 */
export function NewsArticleContent({ content }: NewsArticleContentProps) {
  return (
    <div className="max-w-none text-sm leading-[1.65] text-white/88 sm:text-base">
      {content.map((b, i) => {
        if (b.type === "paragraph" && b.text) {
          return (
            <p key={i} className={cn(bodyTone, "mb-4")}>
              {b.text}
            </p>
          );
        }
        if (b.type === "heading" && b.text) {
          const L = b.level;
          if (L <= 2) {
            return (
              <h2
                key={i}
                className={cn(
                  bodyTone,
                  "mt-7 mb-[0.85rem] text-[1.4rem] font-medium tracking-[-0.02em] sm:text-[1.65rem]",
                )}
              >
                {b.text}
              </h2>
            );
          }
          if (L <= 4) {
            return (
              <h3
                key={i}
                className={cn(
                  bodyTone,
                  "mt-[1.4rem] mb-3 text-[1.2rem] font-medium tracking-[-0.02em] sm:text-[1.3rem]",
                )}
              >
                {b.text}
              </h3>
            );
          }
          return (
            <h4
              key={i}
              className={cn(
                bodyTone,
                "mt-6 mb-3 text-[1.1rem] font-medium tracking-[-0.02em]",
              )}
            >
              {b.text}
            </h4>
          );
        }
        if (b.type === "list" && b.items.length) {
          if (b.ordered) {
            return (
              <ol key={i} className={listClass}>
                {b.items.map((item, j) => (
                  <li key={j} className={liClass}>
                    {item}
                  </li>
                ))}
              </ol>
            );
          }
          return (
            <ul key={i} className={listClass}>
              {b.items.map((item, j) => (
                <li key={j} className={liClass}>
                  {item}
                </li>
              ))}
            </ul>
          );
        }
        if (b.type === "image" && b.src) {
          return (
            <figure key={i} className="my-6 mx-auto w-full max-w-full">
              <Image
                src={b.src}
                alt=""
                width={1200}
                height={800}
                className="mx-auto block h-auto max-w-full object-contain"
                sizes="(max-width: 1024px) 100vw, 896px"
              />
            </figure>
          );
        }
        return null;
      })}
    </div>
  );
}
