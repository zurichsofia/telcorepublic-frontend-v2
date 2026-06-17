"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

export type WhyUsChapterProps = {
  title: string;
  paragraphs: readonly string[];
  alignRight?: boolean;
};

/** In-view fade fallback when CSS view() timeline is unavailable. */
export function WhyUsChapter({
  title,
  paragraphs,
  alignRight = false,
}: WhyUsChapterProps) {
  const reduceMotion = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(reduceMotion);

  useEffect(() => {
    if (reduceMotion) return;

    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setRevealed(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setRevealed(true);
          io.disconnect();
        }
      },
      { root: null, threshold: 0.08, rootMargin: "0px 0px -5% 0px" },
    );

    io.observe(node);
    return () => io.disconnect();
  }, [reduceMotion]);

  return (
    <motion.div
      ref={ref}
      initial={false}
      animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "w-full py-20 sm:py-14 md:py-24",
        alignRight
          ? "max-w-[90%] self-end md:max-w-none"
          : "max-w-[90%] self-start md:max-w-none",
      )}
    >
      <div
        className={cn(
          "flex flex-col overflow-x-clip text-left lg:max-w-3xl",
          alignRight && "md:ml-auto md:text-right",
        )}
      >
        <h3 className="text-pretty text-3xl font-medium leading-normal text-telco-red sm:text-2xl lg:text-3xl">
          {title}
        </h3>
        <div className="text-pretty text-2xl leading-tight text-telco-dark md:text-2xl lg:text-justify">
          {paragraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
