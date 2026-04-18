"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

import { StickyChapter } from "./sticky-chapter";

gsap.registerPlugin(ScrollTrigger);

export function EditorialTagList({
  heading,
  tags,
}: {
  heading?: string;
  tags: readonly string[];
}) {
  const reduceMotion = usePrefersReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (reduceMotion) return;
    const root = rootRef.current;
    if (!root) return;

    const items = gsap.utils.toArray<HTMLElement>(
      root.querySelectorAll("[data-editorial-tag-item]"),
    );
    if (items.length === 0) return;

    const scroller =
      document.getElementById("snap-main-container") ?? undefined;

    const ctx = gsap.context(() => {
      gsap.set(items, { opacity: 0, x: 72 });
      gsap.to(items, {
        opacity: 1,
        x: 0,
        duration: 0.7,
        stagger: 0.32,
        ease: "power2.out",
        delay: 0.15,
        scrollTrigger: {
          trigger: root,
          scroller: scroller ?? window,
          start: "top 86%",
          once: true,
        },
      });
    }, root);

    return () => ctx.revert();
  }, [heading, reduceMotion, tags]);

  return (
    <StickyChapter
      stickyClassName="justify-start py-16 pl-5 pr-4 md:py-28 md:pl-12 md:pr-8 lg:py-40 lg:pl-28 lg:pr-12 xl:pl-36"
    >
      <div ref={rootRef}>
        {heading ? (
          <p className="max-w-xl font-sans text-xs font-medium uppercase tracking-widest text-black/40 sm:max-w-2xl">
            {heading}
          </p>
        ) : null}
        <ul
          className={`${heading ? "mt-16" : ""} max-w-xs space-y-6 overflow-x-clip sm:max-w-sm`}
        >
          {tags.map((tag, i) => (
            <li
              key={`${i}-${tag}`}
              data-editorial-tag-item
              className="will-change-transform border-b border-black/10 pb-6 font-sans text-base font-normal tracking-tight text-black/80 last:border-0 last:pb-0 sm:text-lg"
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </StickyChapter>
  );
}
