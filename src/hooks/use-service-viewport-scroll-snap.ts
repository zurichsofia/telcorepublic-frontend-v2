"use client";

import { useEffect } from "react";

import "@/styles/service-viewport-scroll-snap.css";

/** Applied to `document.documentElement` while the hook is mounted. */
export const SERVICE_VIEWPORT_SCROLL_SNAP_HTML_CLASS = "service-vh-scroll-snap";

/**
 * Enables root scroll-snap between `#hero` and `#service-detail` (see stylesheet).
 * Other routes stay on default `scroll-behavior: auto` from `globals.css`.
 */
export function useServiceViewportScrollSnap() {
  useEffect(() => {
    const cls = SERVICE_VIEWPORT_SCROLL_SNAP_HTML_CLASS;
    document.documentElement.classList.add(cls);
    return () => document.documentElement.classList.remove(cls);
  }, []);
}
