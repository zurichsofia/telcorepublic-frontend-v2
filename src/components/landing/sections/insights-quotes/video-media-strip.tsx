"use client";

import { useEffect, useRef } from "react";

import { ClientLogoMarquee } from "@/components/about/client-logo-marquee";

const MEDIA_STRIP_CLASS =
  "relative h-[60vh] w-full overflow-hidden bg-telco-dark [content-visibility:auto] [contain-intrinsic-size:50vh] lg:h-[100vh] lg:[contain-intrinsic-size:100vh]";

export function VideoMediaStrip({
  videoSrc,
  reduceMotion,
  preload = "metadata",
}: {
  videoSrc: string;
  reduceMotion: boolean;
  preload?: "metadata" | "none";
}) {
  const stripRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playRafRef = useRef(0);

  useEffect(() => {
    const strip = stripRef.current;
    const v = videoRef.current;
    if (!strip || !v) return;

    const cancelDeferredPlay = () => {
      if (playRafRef.current !== 0) {
        cancelAnimationFrame(playRafRef.current);
        playRafRef.current = 0;
      }
    };

    if (reduceMotion) {
      v.pause();
      return cancelDeferredPlay;
    }

    const syncPlayback = (inView: boolean) => {
      cancelDeferredPlay();
      if (inView) {
        // Defer play until after scroll/layout settles to avoid main-thread spikes.
        playRafRef.current = requestAnimationFrame(() => {
          playRafRef.current = requestAnimationFrame(() => {
            playRafRef.current = 0;
            void v.play().catch(() => { });
          });
        });
      } else {
        v.pause();
      }
    };

    if (typeof IntersectionObserver === "undefined") {
      syncPlayback(true);
      return cancelDeferredPlay;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry) syncPlayback(entry.isIntersecting);
      },
      { root: null, rootMargin: "0px", threshold: 0.05 },
    );
    io.observe(strip);
    return () => {
      io.disconnect();
      cancelDeferredPlay();
    };
  }, [reduceMotion, videoSrc]);

  return (
    <div ref={stripRef} className={MEDIA_STRIP_CLASS}>
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover object-center"
        src={videoSrc}
        muted
        playsInline
        loop={!reduceMotion}
        preload={preload}
        aria-hidden
      />

      <ClientLogoMarquee
        variant="inverse"
        label="Clients"
        labelClassName="left-4 top-14 text-4xl font-light uppercase leading-relaxed text-white sm:left-8 sm:top-16 lg:left-10 lg:top-20 xl:left-12 xl:top-20"
        className="absolute inset-0 z-10 flex items-center"
      />
    </div>
  );
}
