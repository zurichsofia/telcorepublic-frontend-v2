"use client";

import { type ReactNode } from "react";

import { cn } from "@/lib/utils";

export function StickyChapter({
  stickyClassName,
  motionClassName,
  shellClassName,
  children,
}: {
  stickyClassName?: string;
  motionClassName?: string;
  /** Extra outer height = longer scroll while the chapter is pinned (default ~6svh runway). */
  shellClassName?: string;
  children: ReactNode;
}) {
  const shellInnerClassName =
    "flex w-full min-w-0 max-w-full flex-col self-stretch";
  const innerClassName = cn(shellInnerClassName, motionClassName);

  return (
    <div
      className={cn(
        "relative min-h-[68svh] w-full overflow-x-clip overflow-y-visible",
        shellClassName,
      )}
    >
      <div
        className={cn(
          "sticky top-0 z-0 flex min-h-[62svh] w-full max-w-full flex-col overflow-visible text-black",
          stickyClassName,
        )}
      >
        <div className={innerClassName}>{children}</div>
      </div>
    </div>
  );
}
