"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type { PointerEvent as ReactPointerEvent, WheelEvent as ReactWheelEvent } from "react";

const DRAG_MULTIPLIER = 1.8;
const EASE_DRAGGING = 0.35;
const EASE_IDLE = 0.075;

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export type UseServiceVideoHeroParams = {
  sectionCount: number;
  reduceMotion: boolean | null;
};

export function useServiceVideoHero({
  sectionCount,
  reduceMotion,
}: UseServiceVideoHeroParams) {
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
  const activeIndexRef = useRef(0);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [viewportW, setViewportW] = useState(0);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  const measure = useCallback(() => {
    const el = panoRef.current;
    if (!el) return;
    const w = el.clientWidth;
    viewportWRef.current = w;
    maxScrollRef.current = Math.max(0, (sectionCount - 1) * w);
    setViewportW(w);
    if (w > 0) {
      el.style.setProperty("--service-hero-slide-px", `${w}px`);
    } else {
      el.style.removeProperty("--service-hero-slide-px");
    }
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
      const isDraggingNow = isDraggingRef.current;
      const ease = reduceMotion ? 1 : isDraggingNow ? EASE_DRAGGING : EASE_IDLE;
      const max = maxScrollRef.current;

      currentXRef.current += (targetXRef.current - currentXRef.current) * ease;

      if (!isDraggingNow) {
        targetXRef.current = clamp(targetXRef.current, 0, max);
      }

      if (
        !isDraggingNow
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

  const onPanoPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      if ((e.target as HTMLElement).closest("[data-axis-strip]")) return;
      pointerIdRef.current = e.pointerId;
      const pano = panoRef.current;
      pano?.setPointerCapture(e.pointerId);
      beginDrag(e.clientX, "pano", pano);
    },
    [beginDrag],
  );

  const onAxisPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
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
    },
    [beginDrag],
  );

  const onWheel = useCallback(
    (e: ReactWheelEvent<HTMLDivElement>) => {
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
    },
    [startAnimation],
  );

  const onAxisKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        snapTo(activeIndexRef.current + 1);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        snapTo(activeIndexRef.current - 1);
      }
    },
    [snapTo],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        snapTo(activeIndexRef.current + 1);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        snapTo(activeIndexRef.current - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [snapTo]);

  return {
    panoRef,
    trackRef,
    axisLineRef,
    titleSlideRefs,
    activeIndex,
    isDragging,
    viewportW,
    snapTo,
    onPanoPointerDown,
    onAxisPointerDown,
    onAxisKeyDown,
    onWheel,
  };
}
