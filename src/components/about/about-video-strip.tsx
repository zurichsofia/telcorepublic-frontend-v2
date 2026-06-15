"use client";

import { useEffect, useRef } from "react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

const STRIP_CLASS =
  "relative w-full overflow-hidden bg-telco-dark h-[100vh]";

export function AboutVideoStrip({ videoSrc }: { videoSrc: string; }) {
  const reduceMotion = usePrefersReducedMotion();
  const stripRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const strip = stripRef.current;
    const video = videoRef.current;
    if (!strip || !video) return;

    if (reduceMotion) {
      video.pause();
      return;
    }

    const syncPlayback = (inView: boolean) => {
      if (inView) {
        void video.play().catch(() => { });
      } else {
        video.pause();
      }
    };

    if (typeof IntersectionObserver === "undefined") {
      syncPlayback(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) syncPlayback(entry.isIntersecting);
      },
      { root: null, rootMargin: "0px", threshold: 0.1 },
    );
    observer.observe(strip);
    return () => observer.disconnect();
  }, [reduceMotion, videoSrc]);

  return (
    <div
      ref={stripRef}
      className={STRIP_CLASS}
      aria-hidden
    >
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover object-center"
        src={videoSrc}
        muted
        playsInline
        loop={!reduceMotion}
        preload="metadata"
      />

    </div>
  );
}
