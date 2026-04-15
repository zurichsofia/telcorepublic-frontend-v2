"use client";

import { useEffect, useRef } from "react";

//TODO: Add video for each service

const VIDEO_WINTER = "/videos/winter-rysy.mp4";
const VIDEO_MANTA = "/videos/ninho-manta.mp4";

export function videoForIndex(index: number) {
  return index % 2 === 0 ? VIDEO_WINTER : VIDEO_MANTA;
}

export function ServiceVideoSlide({
  index,
  title,
  description,
  videoSrc,
  isActive,
  reduceMotion,
}: {
  index: number;
  title: string;
  description: string;
  videoSrc: string;
  isActive: boolean;
  reduceMotion: boolean;
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
      className="relative h-full w-[var(--service-hero-slide-px,100%)] shrink-0 overflow-hidden"
      aria-label={title}
    >
      <video
        ref={videoRef}
        data-parallax-video
        className="pointer-events-none absolute inset-0 h-full w-full object-cover will-change-transform"
        src={videoSrc}
        muted
        playsInline
        loop={!reduceMotion}
        preload="metadata"
        autoPlay={false}
      />

      <div className="relative z-10 flex h-full flex-col justify-end px-5 pb-28 pt-28 sm:px-10 sm:pb-32 sm:pt-32 lg:px-14">
        <p className="font-display text-[11px] font-medium uppercase tracking-[0.38em] text-[#eb1e25]">
          {n}
          {" · "}
          Services
        </p>
        <p className="mt-4 max-w-xl text-left text-[14px] font-light leading-[1.65] text-white/82 sm:text-[15px]">
          {description}
        </p>
      </div>
    </article>
  );
}
