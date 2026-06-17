"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import type { InsightQuote } from "@/data/news";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

import { NotificationStack } from "./notification-stack";

export const INSIGHTS_QUOTES_IMAGE_SRC =
  "/images/TelcoRepublic_Mountain.jpg";

export const INSIGHTS_QUOTES_VIDEO_SRC =
  "/videos/TelcoRepublic_Ocean_1280x720.mp4";

const ImageMediaStrip = dynamic(
  () =>
    import("./image-media-strip").then((module) => module.ImageMediaStrip),
  { ssr: true },
);

const VideoMediaStrip = dynamic(
  () =>
    import("./video-media-strip").then((module) => module.VideoMediaStrip),
  { ssr: false },
);

export function InsightsQuotesSection({
  quotes,
  imageSrc = INSIGHTS_QUOTES_IMAGE_SRC,
  videoSrc = INSIGHTS_QUOTES_VIDEO_SRC,
  showTopImage = true,
  showBottomVideo = true,
  heroTitle = false,
}: {
  quotes: readonly InsightQuote[];
  imageSrc?: string;
  videoSrc?: string;
  /** Full-bleed image strip above the quotes content. */
  showTopImage?: boolean;
  /** Full-bleed video strip below the quotes content. */
  showBottomVideo?: boolean;
  /** Large centered page title (e.g. news index). */
  heroTitle?: boolean;
}) {
  const reduceMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry?.isIntersecting ?? false);
      },
      { root: null, rootMargin: "20% 0px", threshold: 0 },
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);

  if (quotes.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      id="insights-quotes"
      className="relative isolate w-full"
      aria-label="Insights and perspectives"
    >
      {showTopImage ? <ImageMediaStrip imageSrc={imageSrc} /> : null}

      <div
        className={cn(
          "relative bg-telco-dark px-4 sm:px-8 lg:px-10 xl:px-12",
          heroTitle
            ? "pb-14 pt-32 sm:pb-16 sm:pt-44 lg:pb-20 lg:pt-48"
            : "py-14 sm:py-16 lg:py-20 xl:py-20",
        )}
      >
        {heroTitle ? (
          <h1 className="mx-auto mb-16 text-center font-display text-5xl uppercase text-telco-red sm:mb-12 sm:text-6xl lg:text-7xl">
            Insights
          </h1>
        ) : (
          <p className="mb-4 text-4xl font-light uppercase leading-relaxed text-telco-red">
            Insights
          </p>
        )}
        <div className="relative mx-auto w-full max-w-6xl overflow-visible">
          <div className="pointer-events-none absolute left-0 top-1/2 z-10 flex -translate-y-1/2 justify-start lg:-left-6 xl:-left-10">
            <Image
              src="/images/TR_Bird_Icon.svg"
              alt=""
              width={200}
              height={200}
              className="h-16 w-auto sm:h-20 lg:h-36 xl:h-44"
              priority={false}
            />
          </div>

          <div
            className="relative overflow-visible lg:pl-[4%] xl:pl-[2%]"
            role="region"
            aria-live="polite"
            aria-label="Industry insights"
          >
            <NotificationStack
              quotes={quotes}
              reduceMotion={reduceMotion}
              paused={!inView}
            />
          </div>
        </div>
      </div>

      {showBottomVideo ? (
        <VideoMediaStrip
          videoSrc={videoSrc}
          reduceMotion={reduceMotion}
          preload="none"
        />
      ) : null}
    </section>
  );
}
