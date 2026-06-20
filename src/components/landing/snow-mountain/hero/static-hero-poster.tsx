import { HERO_SECTION_VH } from "./snow-mountain-hero-scroll";
import {
  MOBILE_VIEWPORT_HEIGHT,
  mobileHeroSectionHeight,
} from "@/lib/viewport-css-vars";

/** Placeholder while the WebGL hero chunk loads — matches sky tone and section height. */
export function StaticHeroPoster() {
  const sectionHeight = mobileHeroSectionHeight(HERO_SECTION_VH);

  return (
    <section
      id="hero"
      className="relative bg-[#e8e8e8]"
      style={{
        height: sectionHeight,
        minHeight: sectionHeight,
      }}
      aria-hidden
    >
      <div style={{ height: "100vh", minHeight: MOBILE_VIEWPORT_HEIGHT }} aria-hidden />
    </section>
  );
}
