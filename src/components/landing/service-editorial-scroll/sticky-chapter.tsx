"use client";

import { type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";


export function StickyChapter({
  scrollVh,
  stickyClassName,
  motionClassName,
  children,
}: {
  scrollVh: number;
  stickyClassName?: string;
  motionClassName?: string;
  children: ReactNode;
}) {
  const reduceMotion = useReducedMotion();

  const shellClassName =
    "flex w-full min-w-0 max-w-full flex-col self-stretch";
  const innerClassName = cn(shellClassName, motionClassName);

  return (
    <div
      className="relative w-full overflow-x-clip overflow-y-visible bg-white"
      style={{ minHeight: `${scrollVh}vh` }}
    >
      <div
        className={cn(
          "sticky top-0 z-0 flex min-h-[90vh] w-full max-w-full flex-col overflow-visible bg-white text-black",
          stickyClassName,
        )}
      >
        {reduceMotion ? (
          <div className={innerClassName}>{children}</div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 200 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{
              once: true,
              amount: 0.15,
              margin: "12% 0px 8% 0px",
            }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={innerClassName}
          >
            {children}
          </motion.div>
        )}
      </div>
    </div>
  );
}
