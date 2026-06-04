/** Scroll-driven motion shared with hero copy parallax (updated each frame in the canvas). */
export type SnowMountainParallaxMotion = {
  x: number;
  y: number;
  scale: number;
  /** 0..1 hero scroll progress. */
  scroll: number;
};
