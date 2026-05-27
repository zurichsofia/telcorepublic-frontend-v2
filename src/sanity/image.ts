import createImageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";

import { dataset, projectId } from "./env";

const builder = createImageUrlBuilder({ projectId, dataset });

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

export function coverImageUrl(
  source: SanityImageSource | null | undefined,
  width = 800,
): string | null {
  if (!source) return null;
  return urlFor(source).width(width).auto("format").url();
}
