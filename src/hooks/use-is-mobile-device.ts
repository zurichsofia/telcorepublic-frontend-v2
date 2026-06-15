"use client";

import { useEffect, useState } from "react";

import {
  COARSE_POINTER_MQ,
  MOBILE_MAX_WIDTH_MQ,
  isMobileDevice,
} from "@/lib/device/is-coarse-pointer";

/** Phones and narrow viewports (client-only; false on first paint / SSR). */
export function useIsMobileDevice(): boolean {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const coarse = window.matchMedia(COARSE_POINTER_MQ);
    const narrow = window.matchMedia(MOBILE_MAX_WIDTH_MQ);
    const update = () => setMobile(isMobileDevice());
    update();
    coarse.addEventListener("change", update);
    narrow.addEventListener("change", update);
    return () => {
      coarse.removeEventListener("change", update);
      narrow.removeEventListener("change", update);
    };
  }, []);

  return mobile;
}
