"use client";

import type { ReactNode } from "react";
import type { PointerEvent as ReactPointerEvent, WheelEvent as ReactWheelEvent } from "react";

import { cn } from "@/lib/utils";

type ServiceVideoHeroPanoProps = {
  panoRef: React.RefObject<HTMLDivElement | null>;
  trackRef: React.RefObject<HTMLDivElement | null>;
  activeIndex: number;
  sectionCount: number;
  activeTitle: string;
  isDragging: boolean;
  onPointerDown: (e: ReactPointerEvent<HTMLDivElement>) => void;
  onWheel: (e: ReactWheelEvent<HTMLDivElement>) => void;
  children: ReactNode;
};

export function ServiceVideoHeroPano({
  panoRef,
  trackRef,
  activeIndex,
  sectionCount,
  activeTitle,
  isDragging,
  onPointerDown,
  onWheel,
  children,
}: ServiceVideoHeroPanoProps) {
  return (
    <div
      ref={panoRef}
      tabIndex={0}
      role="region"
      aria-label={`Service highlights: slide ${activeIndex + 1} of ${sectionCount}, ${activeTitle}`}
      onPointerDown={onPointerDown}
      onWheel={onWheel}
      className={cn(
        "relative z-10 h-full w-full overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-white/40",
        isDragging ? "cursor-grabbing select-none" : "cursor-grab",
      )}
      style={{ touchAction: "pan-y" }}
    >
      <div
        ref={trackRef}
        className="absolute left-0 top-0 flex h-full will-change-transform"
        style={{ transform: "translate3d(0,0,0)" }}
      >
        {children}
      </div>
    </div>
  );
}
