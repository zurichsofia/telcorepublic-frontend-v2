"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

export { videoForServiceIndex as videoForIndex } from "@/lib/service-hero-videos";

export function ServiceVideoSlide({
  index,
  title,
  description,
  videoSrc,
  isActive,
  reduceMotion,
  /** Swiper slides already define width; use full width to avoid gaps vs `bg-black` hero */
  slideSizing = "cssVar",
}: {
  index: number;
  title: string;
  description: string;
  videoSrc: string;
  isActive: boolean;
  reduceMotion: boolean;
  slideSizing?: "cssVar" | "fill";
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    if (reduceMotion) {
      v.pause();
      return;
    }

    if (isActive) {
      void v.play().catch(() => { });
    } else {
      v.pause();
    }
  }, [isActive, reduceMotion]);

  const n = String(index + 1).padStart(2, "0");

  return (
    <article
      className={cn(
        "relative h-full shrink-0 overflow-hidden",
        slideSizing === "fill"
          ? "w-full min-w-full"
          : "w-[var(--service-hero-slide-px,100%)]",
      )}
      aria-label={title}
    >
      <div className="pointer-events-none absolute inset-0 origin-center scale-[1.12] overflow-hidden">
        <video
          ref={videoRef}
          data-parallax-video
          data-swiper-parallax-x="0"
          className="pointer-events-none absolute inset-0 h-full w-full origin-center object-cover will-change-transform"
          src={videoSrc}
        muted
        playsInline
        loop={!reduceMotion}
        preload="metadata"
          autoPlay={false}
        />
      </div>

      <div className="relative z-10 flex h-full flex-col justify-end px-5 pb-28 pt-28 sm:px-10 sm:pb-32 sm:pt-32 lg:px-14">
        <p className="font-display text-xs font-medium uppercase tracking-widest text-[var(--color-telco-red)]">
          {n}
          {" · "}
          Services
        </p>
        <p className="mt-4 max-w-xl text-left text-sm font-light leading-relaxed text-white/82 sm:text-base">
          {description}
        </p>
      </div>
    </article>
  );
}
