import { services } from "@/data/services";

type ServiceSlug = (typeof services)[number]["slug"];

/**
 * Clips for the `/services` listing page (`FullBleedMediaSectionList`).
 * Paths: `/videos/services/{slug}.mp4`
 */
export const SERVICES_VIDEO_URLS = {
  "disrupter-quintants": "/videos/services/disrupter-quintants.mp4",
  "competitive-positioning": "/videos/services/competitive-positioning.mp4",
  "go-to-market": "/videos/services/go-to-market.mp4",
  "market-assessment": "/videos/services/market-assessment.mp4",
  "custom-research": "/videos/services/custom-research.mp4",
  subscription: "/videos/services/subscription.mp4",
} as const satisfies Record<ServiceSlug, string>;

/**
 * Clips for `/services/[slug]` (ServiceVideoHero swiper).
 * Paths: `/videos/services/hero/{slug}.mp4`
 */
export const SERVICE_SLUG_HERO_VIDEO_URLS = {
  "disrupter-quintants": "/videos/services/hero/disrupter-quintants.mp4",
  "competitive-positioning": "/videos/services/hero/competitive-positioning.mp4",
  "go-to-market": "/videos/services/hero/go-to-market.mp4",
  "market-assessment": "/videos/services/hero/market-assessment.mp4",
  "custom-research": "/videos/services/hero/custom-research.mp4",
  subscription: "/videos/services/hero/subscription.mp4",
} as const satisfies Record<ServiceSlug, string>;

export function servicesListingVideoUrlForSlug(slug: ServiceSlug) {
  return SERVICES_VIDEO_URLS[slug];
}

export function serviceSlugHeroVideoUrlForSlug(slug: ServiceSlug) {
  return SERVICE_SLUG_HERO_VIDEO_URLS[slug];
}

/** Hero swiper slide order matches `services` array order. */
export function serviceSlugHeroVideoUrlForSlide(slide: number) {
  const slug = services[slide]?.slug;
  if (!slug) return SERVICE_SLUG_HERO_VIDEO_URLS[services[0].slug];
  return SERVICE_SLUG_HERO_VIDEO_URLS[slug];
}
