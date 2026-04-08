import {
  heroHandoffOverlayOpacity,
  heroMidBlockY,
  heroMidCopyOpacity,
  heroMidLineY,
  heroPrimaryCopyOpacity,
  heroPrimaryHeadlineLineY,
  heroPrimaryParallaxX,
  heroPrimaryParallaxY,
  heroPrimarySubcopyY,
  heroScrollHintOpacity,
} from "@/lib/snow-mountain-hero-scroll";

/** 200vh scroll while mountain is pinned + 100vh sticky layer = 300vh hero. */
export const HERO_STICKY_SCROLL_VH = 400;
export const HERO_SECTION_VH = HERO_STICKY_SCROLL_VH + 100;

/** Initial custom props for p=0 (avoids unset vars before layout sync). */
export const HERO_SCROLL_VARS_INITIAL = {
  "--sm-handoff": "0",
  "--sm-primary-opacity": "1",
  "--sm-mid-opacity": "0",
  "--sm-scroll-hint": "1",
  "--sm-primary-x": "0px",
  "--sm-primary-y": "0px",
  "--sm-subcopy-y": "0px",
  "--sm-h1-0-y": "0px",
  "--sm-h1-1-y": "0px",
  "--sm-mid-block-y": "16px",
  "--sm-mid-label-y": "10px",
  "--sm-mid-title-y": "10px",
  "--sm-mid-body-y": "10px",
} as const satisfies Record<string, string>;

export function applyHeroScrollVars(
  el: HTMLElement,
  p: number,
  reduce: boolean | null,
) {
  if (reduce) {
    el.style.setProperty("--sm-handoff", "0");
    el.style.setProperty("--sm-primary-opacity", "1");
    el.style.setProperty("--sm-mid-opacity", "0");
    el.style.setProperty("--sm-scroll-hint", "1");
    el.style.setProperty("--sm-primary-x", "0px");
    el.style.setProperty("--sm-primary-y", "0px");
    el.style.setProperty("--sm-subcopy-y", "0px");
    el.style.setProperty("--sm-h1-0-y", "0px");
    el.style.setProperty("--sm-h1-1-y", "0px");
    el.style.setProperty("--sm-mid-block-y", "0px");
    el.style.setProperty("--sm-mid-label-y", "0px");
    el.style.setProperty("--sm-mid-title-y", "0px");
    el.style.setProperty("--sm-mid-body-y", "0px");
    return;
  }
  el.style.setProperty("--sm-handoff", String(heroHandoffOverlayOpacity(p)));
  el.style.setProperty("--sm-primary-opacity", String(heroPrimaryCopyOpacity(p)));
  el.style.setProperty("--sm-mid-opacity", String(heroMidCopyOpacity(p)));
  el.style.setProperty("--sm-scroll-hint", String(heroScrollHintOpacity(p)));
  el.style.setProperty("--sm-primary-x", `${heroPrimaryParallaxX(p)}px`);
  el.style.setProperty("--sm-primary-y", `${heroPrimaryParallaxY(p)}px`);
  el.style.setProperty("--sm-subcopy-y", `${heroPrimarySubcopyY(p)}px`);
  el.style.setProperty("--sm-h1-0-y", `${heroPrimaryHeadlineLineY(p, 0)}px`);
  el.style.setProperty("--sm-h1-1-y", `${heroPrimaryHeadlineLineY(p, 1)}px`);
  el.style.setProperty("--sm-mid-block-y", `${heroMidBlockY(p)}px`);
  el.style.setProperty("--sm-mid-label-y", `${heroMidLineY(p, 0)}px`);
  el.style.setProperty("--sm-mid-title-y", `${heroMidLineY(p, 1)}px`);
  el.style.setProperty("--sm-mid-body-y", `${heroMidLineY(p, 2)}px`);
}
