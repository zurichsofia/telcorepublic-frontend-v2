"use client";

import { type ReactNode } from "react";

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
  const shellClassName =
    "flex w-full min-w-0 max-w-full flex-col self-stretch";
  const innerClassName = cn(shellClassName, motionClassName);

  return (
    <div className="relative min-h-[82svh] w-full overflow-x-clip overflow-y-visible">
      <div
        className={cn(
          "sticky top-0 z-0 flex min-h-[76svh] w-full max-w-full flex-col overflow-visible text-black",
          stickyClassName,
        )}
      >
        <div className={innerClassName}>{children}</div>
      </div>
    </div>
  );
}
