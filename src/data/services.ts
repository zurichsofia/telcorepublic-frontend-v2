/**
 * `services` and getters use the single canonical list in `services-v2.ts`.
 */

export type { ServiceContentBlock } from "./service-content-types";
import type { ServiceRecord } from "./service-content-types";
import { services } from "./services-v2";

export { services };
export type ServiceEntry = ServiceRecord;

export function getServiceBySlug(slug: string): ServiceEntry | undefined {
  return services.find((s) => s.slug === slug);
}

export function serviceIndexFromSlug(slug: string): number {
  return services.findIndex((s) => s.slug === slug);
}
