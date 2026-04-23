"use client";

import { useEffect } from "react";

import "@/styles/service-viewport-scroll-snap.css";

/** Applied to `document.documentElement` while the hook is mounted. */
export const SERVICE_VIEWPORT_SCROLL_SNAP_HTML_CLASS = "service-vh-scroll-snap";

/** Enables `scroll-behavior: smooth` only after the user has scrolled past `#hero`. */
export const SERVICE_VIEWPORT_SCROLL_SMOOTH_PAST_HERO_CLASS =
  "service-vh-scroll-smooth-past-hero";

/**
 * Enables root scroll-snap between `#hero` and `#service-detail` (see stylesheet).
 * `scroll-behavior: smooth` applies only after scrolling past `#hero` (navbar + 100vh
 * video stack) so the first viewport scrolls natively. Other routes stay on default
 * `scroll-behavior: auto` from `globals.css`.
 */
export function useServiceViewportScrollSnap() {
  useEffect(() => {
    const html = document.documentElement;
    const snapCls = SERVICE_VIEWPORT_SCROLL_SNAP_HTML_CLASS;
    const smoothCls = SERVICE_VIEWPORT_SCROLL_SMOOTH_PAST_HERO_CLASS;
    html.classList.add(snapCls);

    const syncSmooth = () => {
      const hero = document.getElementById("hero");
      if (!hero) {
        html.classList.remove(smoothCls);
        return;
      }
      const heroBottom = hero.offsetTop + hero.offsetHeight;
      const pastHero = window.scrollY >= heroBottom - 0.5;
      html.classList.toggle(smoothCls, pastHero);
    };

    syncSmooth();
    window.addEventListener("scroll", syncSmooth, { passive: true });
    window.addEventListener("resize", syncSmooth);

    return () => {
      window.removeEventListener("scroll", syncSmooth);
      window.removeEventListener("resize", syncSmooth);
      html.classList.remove(snapCls, smoothCls);
    };
  }, []);
}
