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

const VIDEO_WINTER = "/videos/winter-rysy.mp4";
const VIDEO_MANTA = "/videos/ninho-manta.mp4";
const DRAG_MULTIPLIER = 1.8;
const EASE_DRAGGING = 0.35;
const EASE_IDLE = 0.075;

function videoForIndex(index: number) {
  return index % 2 === 0 ? VIDEO_WINTER : VIDEO_MANTA;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function subtitleFromDesc(desc: string, maxLen = 72) {
  const t = desc.trim();
  if (t.length <= maxLen) return t;
  return `${t.slice(0, maxLen - 1).trimEnd()}…`;
}

export function ServiceVideoHero() {
  const reduceMotion = useReducedMotion();
  const panoRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const axisLineRef = useRef<HTMLDivElement>(null);
  const titleSlideRefs = useRef<(HTMLDivElement | null)[]>([]);

  const viewportWRef = useRef(0);
  const currentXRef = useRef(0);
  const targetXRef = useRef(0);
  const maxScrollRef = useRef(0);
  const isDraggingRef = useRef(false);
  const dragSourceRef = useRef<"pano" | "axis" | null>(null);
  const startPointerXRef = useRef(0);
  const startScrollXRef = useRef(0);
  const velocityRef = useRef(0);
  const lastPointerXRef = useRef(0);
  const lastTsRef = useRef(0);
  const animatingRef = useRef(false);
  const rafRef = useRef(0);
  const pointerIdRef = useRef(-1);
  const lastRoundedIdxRef = useRef(0);
  const dragWindowCleanupRef = useRef<null | (() => void)>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [viewportW, setViewportW] = useState(0);

  const sectionCount = services.length;

  const measure = useCallback(() => {
    const el = panoRef.current;
    if (!el) return;
    const w = el.clientWidth;
    viewportWRef.current = w;
    maxScrollRef.current = Math.max(0, (sectionCount - 1) * w);
    setViewportW(w);
    targetXRef.current = clamp(
      targetXRef.current,
      0,
      maxScrollRef.current,
    );
    currentXRef.current = clamp(
      currentXRef.current,
      0,
      maxScrollRef.current,
    );
  }, [sectionCount]);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const renderFrame = useCallback(() => {
    const clamped = clamp(currentXRef.current, 0, maxScrollRef.current);
    const w = viewportWRef.current;
    const continuousIdx = w > 0 ? clamped / w : 0;
    const activeIdx = Math.round(clamped / (w || 1));

    const track = trackRef.current;
    if (track) {
      track.style.transform = `translate3d(${-clamped}px, 0, 0)`;
    }

    const slides = panoRef.current?.querySelectorAll<HTMLElement>(
      "[data-parallax-video]",
    );
    slides?.forEach((slide, i) => {
      const offset = reduceMotion ? 0 : (clamped - i * w) * 0.08;
      slide.style.transform = `scale(1.12) translate3d(${offset}px, 0, 0)`;
    });

    titleSlideRefs.current.forEach((slide, i) => {
      if (!slide) return;
      const offset = i - continuousIdx;
      const translateX = offset * 120;
      const opacity = clamp(1 - Math.abs(offset) * 1.2, 0, 1);
      const scale = clamp(1 - Math.abs(offset) * 0.15, 0.72, 1);
      slide.style.transform = `translate3d(${translateX}%, 0, 0) scale(${scale})`;
      slide.style.opacity = String(opacity);
    });

    if (activeIdx !== lastRoundedIdxRef.current) {
      lastRoundedIdxRef.current = activeIdx;
      setActiveIndex(activeIdx);
    }
  }, [reduceMotion]);

  const startAnimation = useCallback(() => {
    if (animatingRef.current) return;
    animatingRef.current = true;
    const tick = () => {
      const isDragging = isDraggingRef.current;
      const ease = reduceMotion ? 1 : isDragging ? EASE_DRAGGING : EASE_IDLE;
      const max = maxScrollRef.current;

      currentXRef.current += (targetXRef.current - currentXRef.current) * ease;

      if (!isDragging) {
        targetXRef.current = clamp(targetXRef.current, 0, max);
      }

      if (
        !isDragging
        && Math.abs(currentXRef.current - targetXRef.current) < 0.35
      ) {
        currentXRef.current = targetXRef.current;
        animatingRef.current = false;
      }

      renderFrame();
      if (animatingRef.current) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [reduceMotion, renderFrame]);

  const snapTo = useCallback(
    (index: number) => {
      const w = viewportWRef.current;
      const max = Math.max(0, (sectionCount - 1) * w);
      const i = clamp(index, 0, sectionCount - 1);
      targetXRef.current = i * w;
      velocityRef.current = 0;
      lastRoundedIdxRef.current = i;
      setActiveIndex(i);
      if (!animatingRef.current) startAnimation();
    },
    [sectionCount, startAnimation],
  );

  const endDrag = useCallback(() => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);

    const w = viewportWRef.current;
    const max = maxScrollRef.current;
    const currentX = currentXRef.current;
    const velocity = velocityRef.current;
    const source = dragSourceRef.current;
    dragSourceRef.current = null;

    const absV = Math.abs(velocity);
    let target = Math.round(currentX / (w || 1));

    if (source === "pano" && w > 0) {
      if (absV > 2) {
        target = velocity < 0
          ? Math.ceil(currentX / w)
          : Math.floor(currentX / w);
      } else if (Math.abs(currentX - startScrollXRef.current) > w * 0.12) {
        target = currentX > startScrollXRef.current
          ? Math.ceil(currentX / w)
          : Math.floor(currentX / w);
      }
    } else if (source === "axis") {
      target = Math.round(targetXRef.current / (w || 1));
    }

    target = clamp(target, 0, sectionCount - 1);
    targetXRef.current = target * w;
    currentXRef.current = clamp(currentX, 0, max);
    if (!animatingRef.current) startAnimation();
  }, [sectionCount, startAnimation]);

  const beginDrag = useCallback(
    (
      clientX: number,
      source: "pano" | "axis",
      captureEl: HTMLElement | null,
    ) => {
      dragWindowCleanupRef.current?.();
      dragWindowCleanupRef.current = null;

      isDraggingRef.current = true;
      dragSourceRef.current = source;
      startPointerXRef.current = clientX;
      startScrollXRef.current = currentXRef.current;
      lastPointerXRef.current = clientX;
      lastTsRef.current = performance.now();
      velocityRef.current = 0;
      setIsDragging(true);

      const pid = pointerIdRef.current;

      const onMove = (e: PointerEvent) => {
        if (!isDraggingRef.current || e.pointerId !== pid) return;
        e.preventDefault();
        const now = performance.now();
        const dt = now - lastTsRef.current;
        const dx = e.clientX - lastPointerXRef.current;
        if (dt > 0) velocityRef.current = (dx / dt) * 16;
        lastPointerXRef.current = e.clientX;
        lastTsRef.current = now;

        const vw = viewportWRef.current;
        const m = maxScrollRef.current;

        if (dragSourceRef.current === "axis" && axisLineRef.current) {
          const rect = axisLineRef.current.getBoundingClientRect();
          const ratio = clamp((e.clientX - rect.left) / rect.width, 0, 1);
          targetXRef.current = ratio * m;
          currentXRef.current = targetXRef.current;
        } else if (dragSourceRef.current === "pano") {
          const diff = (startPointerXRef.current - e.clientX)
            * DRAG_MULTIPLIER;
          targetXRef.current = clamp(
            startScrollXRef.current + diff,
            -vw * 0.08,
            m + vw * 0.08,
          );
        }
      };

      const detach = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onUp);
        dragWindowCleanupRef.current = null;
      };

      const onUp = (e: PointerEvent) => {
        if (e.pointerId !== pid) return;
        detach();
        try {
          captureEl?.releasePointerCapture(pid);
        } catch {
          /* already released */
        }
        endDrag();
      };

      window.addEventListener("pointermove", onMove, { passive: false });
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);
      dragWindowCleanupRef.current = detach;

      if (!animatingRef.current) startAnimation();
    },
    [endDrag, startAnimation],
  );

  useEffect(() => {
    return () => {
      dragWindowCleanupRef.current?.();
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    if (viewportW <= 0) return;
    renderFrame();
  }, [viewportW, renderFrame]);

  const onPanoPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    if ((e.target as HTMLElement).closest("[data-axis-strip]")) return;
    pointerIdRef.current = e.pointerId;
    const pano = panoRef.current;
    pano?.setPointerCapture(e.pointerId);
    beginDrag(e.clientX, "pano", pano);
  };

  const onAxisPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.stopPropagation();
    const line = axisLineRef.current;
    if (!line) return;
    const rect = line.getBoundingClientRect();
    const ratio = clamp((e.clientX - rect.left) / rect.width, 0, 1);
    const max = maxScrollRef.current;
    targetXRef.current = ratio * max;
    currentXRef.current = targetXRef.current;
    pointerIdRef.current = e.pointerId;
    const captureEl = e.currentTarget as HTMLDivElement;
    captureEl.setPointerCapture(e.pointerId);
    beginDrag(e.clientX, "axis", captureEl);
  };

  const onWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("[data-axis-strip]")) return;

    const horizontalDominant =
      Math.abs(e.deltaX) > Math.abs(e.deltaY);
    const shiftAsHorizontal = e.shiftKey && e.deltaY !== 0;

    if (!horizontalDominant && !shiftAsHorizontal) {
      return;
    }

    e.preventDefault();
    const max = maxScrollRef.current;
    const delta = horizontalDominant ? e.deltaX : e.deltaY;
    targetXRef.current = clamp(
      targetXRef.current + delta * 1.5,
      0,
      max,
    );
    if (!animatingRef.current) startAnimation();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        snapTo(activeIndex + 1);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        snapTo(activeIndex - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, snapTo]);

  return (
    <section
      id="hero"
      aria-label="Featured services"
      className="relative isolate h-dvh min-h-[520px] max-h-[1200px] overflow-hidden bg-black text-white"
    >
      <HeroNav tone="onDark" />

      <div
        ref={panoRef}
        tabIndex={0}
        role="region"
        aria-label={`Service highlights: slide ${activeIndex + 1} of ${services.length}, ${services[activeIndex]?.title ?? ""}`}
        onPointerDown={onPanoPointerDown}
        onWheel={onWheel}
        className={cn(
          "relative z-10 h-full w-full overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-white/40",
          isDragging ? "cursor-grabbing select-none" : "cursor-grab",
        )}
        style={{ touchAction: "pan-y" }}
      >
        <div
          ref={trackRef}
          className="absolute left-0 top-0 flex h-full will-change-transform"
          style={{ transform: "translate3d(0,0,0)" }}
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
      </div>

      <div
        className={cn(
          "pointer-events-none absolute left-4 top-1/2 z-[25] -translate-y-1/2 text-white/15 transition-opacity duration-500 sm:left-5",
          activeIndex <= 0 ? "opacity-0" : "opacity-100",
        )}
        aria-hidden
      >
        <svg
          className="h-5 w-5 animate-service-axis-hint-left"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <title>Drag left</title>
          <polyline points="15,18 9,12 15,6" />
        </svg>
      </div>
      <div
        className={cn(
          "pointer-events-none absolute right-4 top-1/2 z-[25] -translate-y-1/2 text-white/15 transition-opacity duration-500 sm:right-5",
          activeIndex >= sectionCount - 1 ? "opacity-0" : "opacity-100",
        )}
        aria-hidden
      >
        <svg
          className="h-5 w-5 animate-service-axis-hint-right"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <title>Drag right</title>
          <polyline points="9,6 15,12 9,18" />
        </svg>
      </div>

      <div
        data-axis-strip
        className="pointer-events-none absolute inset-x-0 top-1/2 z-40 flex -translate-y-1/2 flex-col justify-center px-5 sm:px-10 lg:px-14"
      >
        <div className="relative mx-auto w-full max-w-[min(100%,1400px)]">
          <div className="relative mb-3 min-h-[3.25rem] sm:mb-4 sm:min-h-[3.75rem]">
            <div className="pointer-events-none relative z-10 flex min-h-[3.25rem] items-center overflow-hidden sm:min-h-[3.75rem]">
              {services.map((service, i) => (
                <div
                  key={service.title}
                  ref={(el) => {
                    titleSlideRefs.current[i] = el;
                  }}
                  className="absolute left-0 top-0 flex h-full w-full items-center will-change-[transform,opacity]"
                  aria-hidden={i !== activeIndex}
                >
                  <h2 className="font-display w-full text-left text-[clamp(1.65rem,4.2vw,2.75rem)] font-normal uppercase leading-none tracking-[0.08em] text-white">
                    {service.title}
                  </h2>
                </div>
              ))}
            </div>

            <div
              ref={axisLineRef}
              className="pointer-events-auto absolute inset-x-0 top-1/2 z-20 h-[2px] -translate-y-1/2"
            >
              <div
                role="slider"
                aria-valuemin={0}
                aria-valuemax={sectionCount - 1}
                aria-valuenow={activeIndex}
                aria-label="Service position"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                    e.preventDefault();
                    snapTo(activeIndex + 1);
                  } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                    e.preventDefault();
                    snapTo(activeIndex - 1);
                  }
                }}
                onPointerDown={onAxisPointerDown}
                className="absolute inset-x-0 -top-6 bottom-0 cursor-grab touch-none active:cursor-grabbing"
              />
              <div className="absolute inset-0 bg-white/10" />
            </div>
          </div>

          <p className="pointer-events-none mt-6 max-w-2xl text-left font-sans text-[10px] font-normal uppercase leading-relaxed tracking-[0.22em] text-white/40 sm:mt-7 sm:text-[11px] sm:tracking-[0.28em]">
            {subtitleFromDesc(services[activeIndex]?.desc ?? "")}
          </p>
        </div>
      </div>

      <div
        className="pointer-events-none absolute bottom-8 left-5 z-30 font-display text-[clamp(3rem,10vw,4.5rem)] font-light leading-none text-white/[0.06] sm:left-8 lg:left-14"
        aria-hidden
      >
        {String(activeIndex + 1).padStart(2, "0")}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex items-end justify-between gap-4 px-5 pb-6 sm:px-10 sm:pb-8 lg:px-14">
        <div className="flex items-center gap-2.5 text-[10px] font-medium uppercase tracking-[0.28em] text-white/50">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            aria-hidden
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12,5 19,12 12,19" />
          </svg>
          <span className="animate-service-axis-hint-fade">Drag to explore</span>
        </div>
        <div className="flex flex-col items-end gap-3">
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/45 tabular-nums">
            {String(activeIndex + 1).padStart(2, "0")}
            {" — "}
            {String(sectionCount).padStart(2, "0")}
          </p>
          <Link
            href="#services"
            className="pointer-events-auto text-[10px] font-medium uppercase tracking-[0.22em] text-white/70 underline-offset-4 transition hover:text-white hover:underline"
          >
            View all services
          </Link>
        </div>
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
      className="relative h-full w-screen shrink-0 overflow-hidden"
      aria-label={title}
    >
      <video
        ref={videoRef}
        data-parallax-video
        className="pointer-events-none absolute inset-0 h-full w-full object-cover will-change-transform"
        src={videoSrc}
        muted
        playsInline
        loop={!reduceMotion}
        preload="metadata"
        autoPlay={false}
      />

      <div className="relative z-10 flex h-full flex-col justify-end px-5 pb-28 pt-28 sm:px-10 sm:pb-32 sm:pt-32 lg:px-14">
        <p className="font-display text-[11px] font-medium uppercase tracking-[0.38em] text-[#eb1e25]">
          {n}
          {" · "}
          Services
        </p>
        <p className="mt-4 max-w-xl text-left text-[14px] font-light leading-[1.65] text-white/82 sm:text-[15px]">
          {description}
        </p>
      </div>
    </article>
  );
}
