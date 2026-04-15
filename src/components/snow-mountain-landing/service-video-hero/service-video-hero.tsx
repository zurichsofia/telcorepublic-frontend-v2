"use client";

import { useReducedMotion } from "motion/react";

import { services } from "@/data/services";

import { HeroNav } from "../hero-nav";
import { ServiceVideoHeroAxisStrip } from "./service-video-hero-axis-strip";
import { ServiceVideoHeroPano } from "./service-video-hero-pano";
import {
  ServiceVideoSlide,
  videoForIndex,
} from "./service-video-hero-slide";
import { useServiceVideoHero } from "./use-service-video-hero";

export function ServiceVideoHero() {
  const reduceMotion = useReducedMotion();
  const sectionCount = services.length;

  const {
    panoRef,
    trackRef,
    axisLineRef,
    titleSlideRefs,
    activeIndex,
    isDragging,
    onPanoPointerDown,
    onAxisPointerDown,
    onAxisKeyDown,
    onWheel,
  } = useServiceVideoHero({ sectionCount, reduceMotion });

  return (
    <section
      id="hero"
      aria-label="Featured services"
      className="relative isolate h-dvh min-h-[520px] max-h-[1200px] overflow-hidden bg-black text-white"
    >
      <HeroNav tone="onDark" />

      <ServiceVideoHeroPano
        panoRef={panoRef}
        trackRef={trackRef}
        activeIndex={activeIndex}
        sectionCount={sectionCount}
        activeTitle={services[activeIndex]?.title ?? ""}
        isDragging={isDragging}
        onPointerDown={onPanoPointerDown}
        onWheel={onWheel}
      >
        {services.map((service, index) => (
          <ServiceVideoSlide
            key={service.title}
            index={index}
            title={service.title}
            description={service.desc}
            videoSrc={videoForIndex(index)}
            isActive={index === activeIndex}
            reduceMotion={!!reduceMotion}
          />
        ))}
      </ServiceVideoHeroPano>


      <ServiceVideoHeroAxisStrip
        services={services}
        activeIndex={activeIndex}
        sectionCount={sectionCount}
        titleSlideRefs={titleSlideRefs}
        axisLineRef={axisLineRef}
        onAxisPointerDown={onAxisPointerDown}
        onAxisKeyDown={onAxisKeyDown}
      />


      {/* TODO: Add drag hint */}
    </section>
  );
}
