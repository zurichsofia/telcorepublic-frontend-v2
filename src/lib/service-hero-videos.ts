import { services } from "@/data/services";

/**
 * One hero clip per service (by slug). Edit paths here; order is not implied — each slug is explicit.
 * If `services` gains a slug, TypeScript will require a new key here (`satisfies Record<…>`).
 */
export const SERVICE_HERO_VIDEOS = {
  "disrupter-quadrants": "/videos/winter-rysy.mp4",
  "competitive-positioning": "/videos/ninho-manta.mp4",
  "go-to-market": "/videos/winter-rysy.mp4",
  "market-assessment": "/videos/ninho-manta.mp4",
  "custom-research": "/videos/winter-rysy.mp4",
  "subscription": "/videos/ninho-manta.mp4",
} as const satisfies Record<(typeof services)[number]["slug"], string>;

export function videoForServiceSlug(slug: (typeof services)[number]["slug"]) {
  return SERVICE_HERO_VIDEOS[slug];
}

export function videoForServiceIndex(index: number) {
  const slug = services[index]?.slug;
  if (!slug) return SERVICE_HERO_VIDEOS[services[0].slug];
  return SERVICE_HERO_VIDEOS[slug];
}
