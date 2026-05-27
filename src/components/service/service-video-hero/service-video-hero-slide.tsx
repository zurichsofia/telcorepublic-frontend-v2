"use client";

import { useEffect, useRef } from "react";

export function ServiceVideoSlide({
  title,
  videoSrc,
  isActive,
  reduceMotion,
}: {
  title: string;
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
      void v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [isActive, reduceMotion]);

  return (
    <article
      className="relative h-full w-full min-w-full shrink-0 overflow-hidden"
      aria-label={title}
    >
      <div className="pointer-events-none absolute inset-0 origin-center scale-[1.12] overflow-hidden">
        <video
          ref={videoRef}
          className="pointer-events-none absolute inset-0 h-full w-full origin-center object-cover"
          src={videoSrc}
          muted
          playsInline
          loop={!reduceMotion}
          preload="metadata"
          autoPlay={false}
        />
      </div>
    </article>
  );
}

