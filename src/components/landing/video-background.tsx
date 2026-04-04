"use client";

import { useEffect, useRef } from "react";

export function VideoBackground() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const video = ref.current;
    if (!video) return;

    const apply = () => {
      if (mq.matches) {
        video.pause();
        video.removeAttribute("autoplay");
      } else {
        video.play().catch(() => {});
      }
    };

    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return (
    <video
      ref={ref}
      className="h-full w-full object-cover"
      autoPlay
      muted
      loop
      playsInline
      aria-hidden
    >
      <source src="/hero-alps.mp4" type="video/mp4" />
    </video>
  );
}
