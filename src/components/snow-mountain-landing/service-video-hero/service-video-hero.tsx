"use client";

import { useCallback, useMemo } from "react";
import { useReducedMotion } from "motion/react";
import type { Swiper as SwiperType } from "swiper";
import { Keyboard, Mousewheel, Parallax } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { services, serviceIndexFromSlug } from "@/data/services";
import { videoForServiceIndex } from "@/lib/service-hero-videos";
import { cn } from "@/lib/utils";

import { HeroNav } from "../hero-nav";
import { ServiceVideoHeroAxisStrip } from "./service-video-hero-axis-strip";
import { ServiceVideoSlide } from "./service-video-hero-slide";
import { useServiceVideoHero } from "./use-service-video-hero";

export type ServiceVideoHeroProps = {
  initialSlug?: string;
};

export function ServiceVideoHero({ initialSlug }: ServiceVideoHeroProps) {
  const reduceMotion = useReducedMotion();
  const sectionCount = services.length;

  /* Server prop only — avoids coupling to client pathname and remounting Swiper on URL sync */
  const initialSlide = useMemo(() => {
    if (!initialSlug) return 0;
    const i = serviceIndexFromSlug(initialSlug);
    return i >= 0 ? i : 0;
  }, [initialSlug]);

  const {
    chromeIndex,
    titleSlideRefs,
    axisLineRef,
    isDragging,
    onSwiper: bindContinuousSwiper,
    onAxisPointerDown,
    onAxisKeyDown,
  } = useServiceVideoHero({
    sectionCount,
    reduceMotion,
    initialSlide,
  });

  const syncUrl = useCallback((index: number) => {
    const slug = services[index]?.slug;
    if (!slug) return;
    const next = `/service/${slug}`;
    if (typeof window === "undefined") return;
    const path = window.location.pathname;
    if (path === "/" && index === 0) return;
    if (path === next) return;
    /* Do not use router.replace — it runs an App Router navigation and remounts the page (flash). */
    window.history.replaceState(window.history.state, "", next);
  }, []);

  const onSwiper = useCallback(
    (swiper: SwiperType) => {
      bindContinuousSwiper(swiper);
    },
    [bindContinuousSwiper],
  );

  const activeTitle = services[chromeIndex]?.title ?? "";

  return (
    <section
      id="hero"
      aria-label="Featured services"
      className="relative isolate h-dvh min-h-[520px] max-h-[1200px] w-full min-w-0 overflow-hidden bg-white text-white"
    >
      <HeroNav tone="onDark" />

      <div
        role="region"
        aria-label={`Service highlights: slide ${chromeIndex + 1} of ${sectionCount}, ${activeTitle}`}
        className={cn(
          "relative z-10 h-full w-full overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-white/40",
          isDragging ? "cursor-grabbing select-none" : "cursor-grab",
        )}
        tabIndex={0}
      >
        <Swiper
          key={initialSlug ?? "hero-root"}
          className="service-hero-swiper h-full w-full"
          modules={[Mousewheel, Keyboard, Parallax]}
          direction="horizontal"
          slidesPerView={1}
          spaceBetween={0}
          parallax={{ enabled: true }}
          speed={reduceMotion ? 0 : 480}
          initialSlide={initialSlide}
          mousewheel={{
            forceToAxis: true,
            sensitivity: 0.45,
            releaseOnEdges: true,
            /* Require a stronger wheel gesture; ignore bursts so one flick ≈ one slide */
            thresholdDelta: 22,
            thresholdTime: 480,
          }}
          keyboard={{ enabled: true, onlyInViewport: true }}
          onSwiper={onSwiper}
          onSlideChangeTransitionEnd={(s) => syncUrl(s.activeIndex)}
        >
          {services.map((service, index) => (
            <SwiperSlide key={service.slug} className="h-full">
              <ServiceVideoSlide
                index={index}
                title={service.title}
                description={service.desc}
                videoSrc={videoForServiceIndex(index)}
                isActive={index === chromeIndex}
                reduceMotion={!!reduceMotion}
                slideSizing="fill"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <ServiceVideoHeroAxisStrip
        services={services}
        activeIndex={chromeIndex}
        sectionCount={sectionCount}
        titleSlideRefs={titleSlideRefs}
        axisLineRef={axisLineRef}
        onAxisPointerDown={onAxisPointerDown}
        onAxisKeyDown={onAxisKeyDown}
      />
    </section>
  );
}
