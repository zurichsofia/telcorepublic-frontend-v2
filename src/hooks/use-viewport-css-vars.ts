"use client";

import { useLayoutEffect } from "react";

import { isMobileDevice } from "@/lib/device/is-coarse-pointer";
import { syncViewportCssVars } from "@/lib/viewport-css-vars";

/** Keeps `--svh` / `--lvh` synced to the stable layout viewport (mont-fort pattern). */
export function useViewportCssVars(): void {
  useLayoutEffect(() => {
    syncViewportCssVars();
    let lockedMobileWidth = window.innerWidth;

    const sync = (force = false) => {
      if (!force && isMobileDevice()) {
        const nextWidth = window.innerWidth;
        if (nextWidth === lockedMobileWidth) return;
        lockedMobileWidth = nextWidth;
      }

      syncViewportCssVars();
    };
    const syncResize = () => sync();
    const syncOrientation = () => sync(true);
    window.addEventListener("resize", syncResize);
    window.addEventListener("orientationchange", syncOrientation);

    return () => {
      window.removeEventListener("resize", syncResize);
      window.removeEventListener("orientationchange", syncOrientation);
    };
  }, []);
}
