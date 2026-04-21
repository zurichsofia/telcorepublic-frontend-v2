"use client";

import { useEffect, useRef } from "react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

export type FullBleedMediaItem = {
  id: string;
  title: string;
  description: string;
  videoSrc?: string;
};

export type FullBleedMediaSectionProps = FullBleedMediaItem & {
  /** Even indices align copy to the right; odd to the left. */
  index: number;
};

/**
 * Full-bleed block: optional looping video (or dark fallback), overlay, and headline copy.
 */
export function FullBleedMediaSection({
  id,
  title,
  description,
  videoSrc,
  index,
}: FullBleedMediaSectionProps) {
  const reduceMotion = usePrefersReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const alignRight = index % 2 === 0;

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !videoSrc) return;
    if (reduceMotion) {
      v.pause();
      return;
    }
    void v.play().catch(() => { });
  }, [reduceMotion, videoSrc]);

  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="relative isolate min-h-[min(100dvh,920px)] w-full overflow-hidden bg-neutral-950"
    >
      {videoSrc ? (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full scale-[1.06] object-cover object-center"
          src={videoSrc}
          muted
          playsInline
          loop={!reduceMotion}
          preload="metadata"
          autoPlay={!reduceMotion}
        />
      ) : (
        <div
          className="absolute inset-0 bg-linear-to-br from-neutral-950 via-[#3a0a0c] to-neutral-900"
          aria-hidden
        />
      )}

      {/* TODO: Remove overlay */}
      <div
        className="absolute inset-0 bg-linear-to-t from-black/75 via-black/50 to-black/35"
        aria-hidden
      />

      <div
        className={cn(
          "relative z-10 flex min-h-[min(100dvh,920px)] w-full max-w-7xl mx-auto items-end",
          alignRight ? "justify-end" : "justify-start",
        )}
      >
        <div
          className={cn(
            "max-w-2xl py-24",
            alignRight
              ? "pr-5 pl-8 sm:pr-10 sm:pl-14 lg:pr-16"
              : "pl-5 pr-8 sm:pl-10 sm:pr-14 lg:pl-16",
          )}
        >
          <h2
            id={`${id}-heading`}
            className="font-display text-4xl tracking-tight text-white sm:text-5xl lg:text-4xl"
          >
            {title}
          </h2>
          <p className="mt-5 text-base font-light leading-relaxed text-white/90 sm:text-lg">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}

export function FullBleedMediaSectionList({
  items,
}: {
  items: readonly FullBleedMediaItem[];
}) {
  return (
    <div className="w-full">
      {items.map((item, i) => (
        <FullBleedMediaSection key={item.id} {...item} index={i} />
      ))}
    </div>
  );
}
