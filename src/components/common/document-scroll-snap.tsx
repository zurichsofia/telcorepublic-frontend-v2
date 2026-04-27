"use client";

import { useEffect } from "react";

/** Applied to `<html>` — pairs with globals `html.doc-scroll-snap`. */
export const DOC_SCROLL_SNAP_CLASS = "doc-scroll-snap";

/** Home: long hero + `scroll-snap-type: proximity` (see globals). */
export const DOC_SCROLL_SNAP_HOME_CLASS = "doc-scroll-snap-home";

/** `/services/*`: short hero + detail — `scroll-snap-type: mandatory`. */
export const DOC_SCROLL_SNAP_SERVICES_CLASS = "doc-scroll-snap-services";

/**
 * Viewport snap targets (`scroll-snap-align: start`; nav offset is content padding, not
 * `scroll-padding-top`, so hero ↔ pane snaps stay flush).
 */
export const DOC_SCROLL_SNAP_PANE_CLASS = "doc-scroll-snap-pane";

/** First “Why us” viewport — snow hero exit scrolls here (`SnowMountainHero`). */
export const HOME_WHY_SNAP_ID = "home-why-snap";

/**
 * Enables root scroll snap for the current route (viewport scroll on `documentElement`).
 * Mount once per page tree that should use snap; cleans up on unmount.
 */
export function DocumentScrollSnap({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add(
      DOC_SCROLL_SNAP_CLASS,
      DOC_SCROLL_SNAP_HOME_CLASS,
    );
    return () => {
      root.classList.remove(
        DOC_SCROLL_SNAP_CLASS,
        DOC_SCROLL_SNAP_HOME_CLASS,
      );
    };
  }, []);
  return children;
}
