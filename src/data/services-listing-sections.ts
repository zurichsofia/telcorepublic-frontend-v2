import { services } from "@/data/services";
import { servicesListingVideoUrlForSlug } from "@/lib/service-video-urls";

export type ServicesListingSection = {
  id: string;
  title: string;
  description: string;
  videoSrc: string;
};

/** Copy + video for each full-bleed block on `/services` (anchors use `id`). */
export const servicesListingSections: ServicesListingSection[] = services.map(
  (s) => ({
    id: s.slug,
    title: s.title,
    description: s.descShort,
    videoSrc: servicesListingVideoUrlForSlug(s.slug),
  }),
);
