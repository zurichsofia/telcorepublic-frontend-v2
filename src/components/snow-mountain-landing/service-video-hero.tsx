"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { useReducedMotion } from "motion/react";

import { services } from "@/data/services";
import { cn } from "@/lib/utils";

import { HeroNav } from "./hero-nav";

/** Placeholder clips (alternating across the six service panels). */
const VIDEO_WINTER = "/videos/winter-rysy.mp4";
const VIDEO_MANTA = "/videos/ninho-manta.mp4";

function videoForIndex(index: number) {
  return index % 2 === 0 ? VIDEO_WINTER : VIDEO_MANTA;
}

type DragState = {
  active: boolean;
  pointerId: number;
  startClientX: number;
  startScrollLeft: number;
};

export function ServiceVideoHero() {
  const reduceMotion = useReducedMotion();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState>({
    active: false,
    pointerId: -1,
    startClientX: 0,
    startScrollLeft: 0,
  });
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const updateActiveFromScroll = useCallback(() => {
    const el = scrollerRef.current;
    if (!el || el.clientWidth <= 0) return;
    const next = Math.min(
      services.length - 1,
      Math.max(0, Math.round(el.scrollLeft / el.clientWidth)),
    );
    setActiveIndex((prev) => (prev === next ? prev : next));
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updateActiveFromScroll);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    updateActiveFromScroll();
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", onScroll);
    };
  }, [updateActiveFromScroll]);

  const scrollToIndex = useCallback((index: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const i = Math.min(services.length - 1, Math.max(0, index));
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        scrollToIndex(activeIndex + 1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        scrollToIndex(activeIndex - 1);
      }
    };

    el.addEventListener("keydown", onKeyDown);
    return () => el.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, scrollToIndex]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const el = scrollerRef.current;
    if (!el) return;

    dragRef.current = {
      active: true,
      pointerId: e.pointerId,
      startClientX: e.clientX,
      startScrollLeft: el.scrollLeft,
    };
    setIsDragging(true);
    el.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    const d = dragRef.current;
    if (!el || !d.active || e.pointerId !== d.pointerId) return;

    const delta = e.clientX - d.startClientX;
    el.scrollLeft = d.startScrollLeft - delta;
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    const d = dragRef.current;
    if (!d.active || e.pointerId !== d.pointerId) return;

    dragRef.current.active = false;
    setIsDragging(false);
    try {
      el?.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
    updateActiveFromScroll();
  };

  return (
    <section
      id="hero"
      aria-label="Featured services"
      className="relative isolate h-dvh min-h-[520px] max-h-[1200px] overflow-hidden bg-black text-white"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-20 h-44 bg-linear-to-b from-black/80 via-black/40 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[55%] bg-linear-to-t from-black/85 via-black/45 to-transparent"
        aria-hidden
      />

      <HeroNav tone="onDark" />

      <div
        ref={scrollerRef}
        tabIndex={0}
        role="region"
        aria-label={`Service highlights: slide ${activeIndex + 1} of ${services.length}, ${services[activeIndex]?.title ?? ""}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={(e) => {
          if (dragRef.current.active && e.pointerId === dragRef.current.pointerId) {
            endDrag(e);
          }
        }}
        className={cn(
          "relative z-10 flex h-full w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden scroll-smooth outline-none [scrollbar-width:none] focus-visible:ring-2 focus-visible:ring-white/40 [&::-webkit-scrollbar]:hidden",
          isDragging ? "cursor-grabbing select-none" : "cursor-grab",
        )}
        style={{ touchAction: "pan-x" }}
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
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex flex-col items-center gap-4 pb-6 sm:pb-8">
        <p className="pointer-events-none text-center text-[10px] font-medium uppercase tracking-[0.28em] text-white/55">
          Drag or swipe · Arrow keys
        </p>
        <div
          className="pointer-events-auto flex items-center justify-center gap-2.5 px-4"
          role="tablist"
          aria-label="Slide indicators"
        >
          {services.map((service, i) => (
            <button
              key={service.title}
              type="button"
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={`${service.title}, slide ${i + 1} of ${services.length}`}
              onClick={() => scrollToIndex(i)}
              className={cn(
                "h-2 rounded-full transition-[width,background-color] duration-300",
                i === activeIndex
                  ? "w-8 bg-white"
                  : "w-2 bg-white/35 hover:bg-white/55",
              )}
            />
          ))}
        </div>
        <Link
          href="#services"
          className="pointer-events-auto text-[10px] font-medium uppercase tracking-[0.22em] text-white/70 underline-offset-4 transition hover:text-white hover:underline"
        >
          View all services
        </Link>
      </div>
    </section>
  );
}

function ServiceVideoSlide({
  index,
  title,
  description,
  videoSrc,
  isActive,
  reduceMotion,
}: {
  index: number;
  title: string;
  description: string;
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

  const n = String(index + 1).padStart(2, "0");

  return (
    <article
      className="relative h-full w-full shrink-0 grow-0 snap-start snap-always overflow-hidden"
      style={{ flex: "0 0 100%" }}
      aria-label={title}
    >
      <video
        ref={videoRef}
        className="pointer-events-none absolute inset-0 h-full w-full scale-105 object-cover"
        src={videoSrc}
        muted
        playsInline
        loop={!reduceMotion}
        preload="metadata"
        autoPlay={false}
      />

      <div className="relative z-10 flex h-full flex-col justify-end px-5 pb-32 pt-28 sm:px-10 sm:pb-36 sm:pt-32 lg:px-14">
        <p className="font-display text-[11px] font-medium uppercase tracking-[0.38em] text-[#eb1e25]">
          {n} · Services
        </p>
        <h1 className="font-display mt-4 max-w-3xl text-3xl font-normal leading-[1.12] tracking-[-0.02em] sm:text-4xl lg:text-[2.65rem]">
          {title}
        </h1>
        <p className="mt-5 max-w-xl text-[14px] font-light leading-[1.65] text-white/82 sm:text-[15px]">
          {description}
        </p>
      </div>
    </article>
  );
}
