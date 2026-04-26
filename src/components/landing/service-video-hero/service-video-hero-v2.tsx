"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import type { Swiper as SwiperType } from "swiper";
import { Keyboard, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { services, serviceIndexFromSlug } from "@/data/services";
import { serviceSlugHeroVideoUrlForSlide } from "@/lib/service-video-urls";

import { ServiceVideoSlide } from "./service-video-hero-slide";

import "swiper/css/pagination";
import "swiper/css/navigation";
import "./service-video-hero-v2.css";

export type ServiceVideoHeroV2Props = {
  initialSlug?: string;
  onActiveServiceChange?: (slug: string) => void;
};

/**
 * Service hero: Swiper loop, pagination, navigation, keyboard.
 */
export function ServiceVideoHeroV2({
  initialSlug,
  onActiveServiceChange,
}: ServiceVideoHeroV2Props) {
  const reduceMotion = usePrefersReducedMotion();
  const sectionCount = services.length;
  const swiperRef = useRef<SwiperType | null>(null);

  const initialSlide = useMemo(() => {
    if (!initialSlug) return 0;
    const i = serviceIndexFromSlug(initialSlug);
    return i >= 0 ? i : 0;
  }, [initialSlug]);

  const [chromeIndex, setChromeIndex] = useState(initialSlide);

  useEffect(() => {
    setChromeIndex(initialSlide);
  }, [initialSlide]);

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

  const speed = reduceMotion ? 0 : 480;
  const multi = sectionCount > 1;

  useEffect(() => {
    const sw = swiperRef.current;
    if (!sw || sw.destroyed) return;
    if (sw.realIndex === initialSlide) return;
    if (multi && sw.params.loop) {
      sw.slideToLoop(initialSlide, speed);
    } else {
      sw.slideTo(initialSlide, speed);
    }
  }, [initialSlide, multi, speed]);

  const activeTitle = services[chromeIndex]?.title ?? "";

  return (
    <section
      id="hero"
      aria-label="Featured services"
      className="relative isolate flex min-h-0 w-full min-w-0 max-w-full flex-col overflow-x-clip bg-black text-white"
    >
      <div
        role="region"
        aria-label={`Service highlights: slide ${chromeIndex + 1} of ${sectionCount}, ${activeTitle}`}
        className="relative z-10 h-screen min-h-0 w-full min-w-0 max-w-full shrink-0 overflow-x-clip overflow-y-hidden bg-black"
      >
        <span className="sr-only">
          {multi
            ? "Several services are shown here. Use the arrow controls, pagination dots, or keyboard arrows to change slides. "
            : null}
          Scroll down the page to continue past this section.
        </span>

        <Swiper
          className="service-hero-swiper-v2 h-full w-full min-w-0 max-w-full"
          modules={[Pagination, Navigation, Keyboard]}
          slidesPerView={1}
          spaceBetween={0}
          speed={speed}
          loop={multi}
          pagination={multi ? { clickable: true } : false}
          navigation={multi}
          keyboard={{ enabled: true, onlyInViewport: true }}
          initialSlide={initialSlide}
          onSwiper={(s) => {
            swiperRef.current = s;
          }}
          onSlideChange={(s) => {
            setChromeIndex(s.realIndex);
          }}
          onSlideChangeTransitionEnd={(s) => {
            syncUrl(s.realIndex);
          }}
        >
          {services.map((service, index) => (
            <SwiperSlide key={service.slug} className="h-full">
              <ServiceVideoSlide
                title={service.title}
                videoSrc={serviceSlugHeroVideoUrlForSlide(index)}
                isActive={index === chromeIndex}
                reduceMotion={!!reduceMotion}
              />
              <div
                className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-8"
                aria-hidden
              >
                <h2 className="font-display text-center  font-normal uppercase leading-tight tracking-wide text-white text-2xl lg:text-7xl">
                  {activeTitle}
                </h2>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>


      </div>
    </section>
  );
}
