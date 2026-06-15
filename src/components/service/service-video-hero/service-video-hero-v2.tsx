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

export function ServiceVideoHeroV2({
  initialSlug,
  onActiveServiceChange,
}: ServiceVideoHeroV2Props) {
  const reduceMotion = usePrefersReducedMotion();
  const swiperRef = useRef<SwiperType | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(true);

  const initialSlide = useMemo(() => {
    if (!initialSlug) return 0;
    const i = serviceIndexFromSlug(initialSlug);
    return i >= 0 ? i : 0;
  }, [initialSlug]);

  const [activeIndex, setActiveIndex] = useState(initialSlide);

  useEffect(() => {
    setActiveIndex(initialSlide);
  }, [initialSlide]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const syncUrl = useCallback(
    (index: number) => {
      const slug = services[index]?.slug;
      if (!slug || typeof window === "undefined") return;
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
  const multi = services.length > 1;

  useEffect(() => {
    const sw = swiperRef.current;
    if (!sw || sw.destroyed || sw.realIndex === initialSlide) return;
    if (multi && sw.params.loop) {
      sw.slideToLoop(initialSlide, speed);
    } else {
      sw.slideTo(initialSlide, speed);
    }
  }, [initialSlide, multi, speed]);

  const activeTitle = services[activeIndex]?.title ?? "";

  return (
    <section
      ref={sectionRef}
      id="hero"
      aria-label="Featured services"
      className="relative isolate h-svh w-full overflow-x-clip bg-telco-dark text-white"
    >
      <span className="sr-only">
        {multi
          ? "Several services are shown here. Use the arrow controls, pagination dots, or keyboard arrows to change slides. "
          : null}
        Scroll down the page to continue past this section.
      </span>

      <div
        role="region"
        aria-label={`Service highlights: slide ${activeIndex + 1} of ${services.length}, ${activeTitle}`}
        className="h-full w-full"
      >
        <Swiper
          className="service-hero-swiper-v2 h-full w-full"
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
            setActiveIndex(s.realIndex);
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
                isActive={index === activeIndex && inView}
                reduceMotion={!!reduceMotion}
              />
              <div
                className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-8"
                aria-hidden
              >
                <h2 className="text-center text-white  leading-tight text-[40px] lg:text-8xl">
                  {service.title}
                </h2>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
