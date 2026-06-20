import { HERO_SECTION_VH } from "./snow-mountain-hero-scroll";

/** Placeholder while the WebGL hero chunk loads — matches sky tone and section height. */
export function StaticHeroPoster() {
  return (
    <section
      id="hero"
      className="relative bg-[#e8e8e8]"
      style={{
        height: `${HERO_SECTION_VH}svh`,
        minHeight: `${HERO_SECTION_VH}svh`,
      }}
      aria-hidden
    />
  );
}
