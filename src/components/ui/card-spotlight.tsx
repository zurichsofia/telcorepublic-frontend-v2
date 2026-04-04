"use client";

import { useRef, useState } from "react";

import { cn } from "@/lib/utils";

export function CardSpotlight({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      className={cn(
        "group relative flex min-h-0 flex-col overflow-hidden rounded-xl border border-white/10 bg-neutral-900 p-8",
        className
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          /* Muted grey-violet */
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px,
            rgba(62, 58, 76, 0.22) 0%,
            rgba(48, 46, 62, 0.14) 38%,
            rgba(38, 40, 52, 0.09) 55%,
            transparent 64%)`,
        }}
      />
      <div className="relative z-10 flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
