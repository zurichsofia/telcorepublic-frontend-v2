"use client";

import { useLayoutEffect } from "react";

import { syncViewportCssVars } from "@/lib/viewport-css-vars";

/** Keeps `--svh` / `--lvh` synced to the stable layout viewport (mont-fort pattern). */
export function useViewportCssVars(): void {
  useLayoutEffect(() => {
    syncViewportCssVars();

    const sync = () => syncViewportCssVars();
    window.addEventListener("resize", sync);
    window.addEventListener("orientationchange", sync);

    return () => {
      window.removeEventListener("resize", sync);
      window.removeEventListener("orientationchange", sync);
    };
  }, []);
}
