/** Shared ice atmosphere — Canvas clear, HTML shell, fog (matches `--bg` / page frost). */
export const SNOW_MOUNTAIN_FOG_COLOR = "#f2f9ff";
/** Screen-space exp fog: larger = thicker haze on distant slopes (see StormScreenFogEffect). */
export const SNOW_MOUNTAIN_SCREEN_FOG_DISTANCE = 0.00052;
/** Minimum mix toward fog over the whole image — reads as snow-filled air, not a clear backdrop. */
export const SNOW_MOUNTAIN_SCREEN_FOG_AERIAL = 0.15;
