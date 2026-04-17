"use client";

import { motion, useReducedMotion } from "motion/react";

export function EditorialTagList({
  heading,
  tags,
}: {
  heading?: string;
  tags: readonly string[];
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0.22, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px -12% 0px", amount: 0.28 }}
      transition={{
        duration: reduceMotion ? 0 : 0.36,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative w-full bg-white py-16 pl-5 pr-4 md:py-28 md:pl-12 md:pr-8 lg:py-40 lg:pl-28 lg:pr-12 xl:pl-36"
    >
      {heading ? (
        <p className="max-w-xl font-sans text-xs font-medium uppercase tracking-widest text-black/40 sm:max-w-2xl">
          {heading}
        </p>
      ) : null}
      <ul
        className={`${heading ? "mt-16" : ""} max-w-xs space-y-6 sm:max-w-sm`}
      >
        {tags.map((tag) => (
          <li
            key={tag}
            className="border-b border-black/10 pb-6 font-sans text-base font-normal tracking-tight text-black/80 last:border-0 last:pb-0 sm:text-lg"
          >
            {tag}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
