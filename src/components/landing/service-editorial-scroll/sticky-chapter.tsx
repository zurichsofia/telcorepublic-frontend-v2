"use client";

import { type ReactNode } from "react";

import AnimatedContent from "@/components/AnimatedContent";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

import { cn } from "@/lib/utils";

export function StickyChapter({
  stickyClassName,
  motionClassName,
  children,
}: {
  stickyClassName?: string;
  motionClassName?: string;
  children: ReactNode;
}) {
  const reduceMotion = usePrefersReducedMotion();

  const shellClassName =
    "flex w-full min-w-0 max-w-full flex-col self-stretch";
  const innerClassName = cn(shellClassName, motionClassName);

  return (
    <div className="relative min-h-screen w-full overflow-x-clip overflow-y-visible bg-white">
      <div
        className={cn(
          "sticky top-0 z-0 flex min-h-[90vh] w-full max-w-full flex-col overflow-visible bg-white text-black",
          stickyClassName,
        )}
      >
        {reduceMotion ? (
          <div className={innerClassName}>{children}</div>
        ) : (
          <AnimatedContent
            className={innerClassName}
            distance={200}
            duration={0.5}
            ease="power3.out"
            initialOpacity={0}
            threshold={0.22}
          >
            {children}
          </AnimatedContent>
        )}
      </div>
    </div>
  );
}
