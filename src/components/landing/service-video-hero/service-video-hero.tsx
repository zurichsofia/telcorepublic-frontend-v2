"use client";

import { useCallback, useMemo } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import type { Swiper as SwiperType } from "swiper";
import { Keyboard, Mousewheel, Parallax } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { services, serviceIndexFromSlug } from "@/data/services";
import { videoForServiceIndex } from "@/lib/service-hero-videos";
import { cn } from "@/lib/utils";

import { ServiceVideoHeroAxisStrip } from "./service-video-hero-axis-strip";
import { ServiceVideoHeroScrollHint } from "./service-video-hero-scroll-hint";
import { ServiceVideoSlide } from "./service-video-hero-slide";
import { useServiceVideoHero } from "./use-service-video-hero";
import { Navitation } from '@/components/landing/navigation';

export type ServiceVideoHeroProps = {
  initialSlug?: string;
  /** When the hero finishes a slide, URL is synced with `replaceState` and this runs so the page body can update without `router.replace` (avoids flash). */
  onActiveServiceChange?: (slug: string) => void;
};

export function ServiceVideoHero({
  initialSlug,
  onActiveServiceChange,
}: ServiceVideoHeroProps) {
  const reduceMotion = usePrefersReducedMotion();
  const sectionCount = services.length;
  // const [scrollHintDismissed, setScrollHintDismissed] = useState(false);
  // const dismissScrollHint = useCallback(() => {
  //   setScrollHintDismissed(true);
  // }, []);

  /* Slug from props only (shell-owned state) — hero does not read pathname; avoids remounting Swiper while still following slug changes from the parent. */
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

  const syncUrl = useCallback(
    (index: number) => {
      const slug = services[index]?.slug;
      if (!slug) return;
      if (typeof window === "undefined") return;
      const next = `/services/${encodeURIComponent(slug)}`;
      const current = `${window.location.pathname}${window.location.search}`;
      if (current !== next) {
        window.history.replaceState(window.history.state, "", next);
      }
      onActiveServiceChange?.(slug);
    },
    [onActiveServiceChange],
  );

  const onSwiper = useCallback(
    (swiper: SwiperType) => {
      bindContinuousSwiper(swiper);
    },
    [bindContinuousSwiper],
  );

  // const onAxisPointerDownWrapped = useCallback(
  //   (e: PointerEvent<HTMLDivElement>) => {
  //     dismissScrollHint();
  //     onAxisPointerDown(e);
  //   },
  //   [dismissScrollHint, onAxisPointerDown],
  // );

  // const onAxisKeyDownWrapped = useCallback(
  //   (e: KeyboardEvent<HTMLDivElement>) => {
  //     if (
  //       e.key === "ArrowRight" ||
  //       e.key === "ArrowDown" ||
  //       e.key === "ArrowLeft" ||
  //       e.key === "ArrowUp"
  //     ) {
  //       dismissScrollHint();
  //     }
  //     onAxisKeyDown(e);
  //   },
  //   [dismissScrollHint, onAxisKeyDown],
  // );

  const activeTitle = services[chromeIndex]?.title ?? "";

  return (
    <section
      id="hero"
      aria-label="Featured services"
      className="relative isolate h-dvh min-h-[520px] max-h-[1200px] w-full min-w-0 max-w-full overflow-x-clip overflow-y-hidden bg-white text-white"
    >
      <Navitation />

      <div
        role="region"
        aria-label={`Service highlights: slide ${chromeIndex + 1} of ${sectionCount}, ${activeTitle}`}
        className={cn(
          "relative z-10 h-full w-full min-w-0 max-w-full overflow-x-clip overflow-y-hidden outline-none focus-visible:ring-2 focus-visible:ring-white/40 bg-white",
          isDragging ? "cursor-grabbing select-none" : "cursor-grab",
        )}
        tabIndex={0}
      // onPointerDown={dismissScrollHint}
      // onWheel={dismissScrollHint}
      // onKeyDown={(e) => {
      //   if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      //     dismissScrollHint();
      //   }
      // }}
      >
        <span className="sr-only">
          {sectionCount > 1
            ? "Several services are shown here. Switch slides with horizontal scroll, drag, the line under the title, or the left and right arrow keys. "
            : null}
          Scroll down the page to continue past this section.
        </span>
        <Swiper
          className="service-hero-swiper h-full w-full min-w-0 max-w-full"
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

        {sectionCount > 1 ? (
          <div
            className="pointer-events-none absolute inset-0 z-12 flex"
            aria-hidden
          >
            <div className="w-[20%]" />
            <div className="pointer-events-auto w-1/2 cursor-default touch-pan-y" />
            <div className="w-[20%]" />
          </div>
        ) : null}
      </div>

      <ServiceVideoHeroScrollHint
        // dismissed={scrollHintDismissed}
        showHorizontalNav={sectionCount > 1}
      />

      <ServiceVideoHeroAxisStrip
        services={services}
        activeIndex={chromeIndex}
        sectionCount={sectionCount}
        visible={sectionCount > 1 && isDragging}
        titleSlideRefs={titleSlideRefs}
        axisLineRef={axisLineRef}
        onAxisPointerDown={onAxisPointerDown}
        onAxisKeyDown={onAxisKeyDown}
      />
    </section>
  );
}
