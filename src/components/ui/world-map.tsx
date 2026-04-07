"use client";

import { useId, useMemo, useRef } from "react";
import { motion, useInView } from "motion/react";
import DottedMap from "dotted-map";
import proj4 from "proj4";

type MapEndpoint = {
  lat: number;
  lng: number;
  label?: string;
  /** When true, a soft pulse ring animates from this point (e.g. home base). */
  pulse?: boolean;
};

interface MapProps {
  dots?: Array<{
    start: MapEndpoint;
    end: MapEndpoint;
  }>;
  lineColor?: string;
}

const DOT_R = 1;
const DOT_R_PULSE = 1.15;
/** Expanding ring - viewBox height is ~100; keep ripple large enough to read on screen. */
const PULSE_RING_MIN = 1.5;
const PULSE_RING_MAX = 6;
const PULSE_STROKE_W = 0.5;
/** Brighter than route lines so the pulse reads on dark backgrounds */
const PULSE_RING_COLOR = "#5c81be";

/** Matches dotted-map internals (Mercator + same bounds as the raster SVG). */
type DottedMapLayout = {
  width: number;
  height: number;
  X_MIN: number;
  X_RANGE: number;
  Y_MAX: number;
  Y_RANGE: number;
  proj4String: string;
};

function projectLatLng(
  lat: number,
  lng: number,
  layout: DottedMapLayout
): { x: number; y: number; } {
  const [projX, projY] = proj4(layout.proj4String, [lng, lat]) as [
    number,
    number,
  ];
  if (!Number.isFinite(projX) || !Number.isFinite(projY)) {
    return { x: 0, y: 0 };
  }
  const x = (layout.width * (projX - layout.X_MIN)) / layout.X_RANGE;
  const y = (layout.height * (layout.Y_MAX - projY)) / layout.Y_RANGE;
  return { x, y };
}

export default function WorldMap({
  dots = [],
  lineColor = "#7cadff",
}: MapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.35 });
  const gradientId = `wm-${useId().replace(/:/g, "")}`;
  const arcGlowFilterId = `wm-arc-glow-${useId().replace(/:/g, "")}`;

  const map = useMemo(
    () => new DottedMap({ height: 100, grid: "diagonal" }),
    []
  );

  const layout = useMemo(() => {
    const m = map as unknown as DottedMapLayout;
    return {
      width: m.width,
      height: m.height,
      X_MIN: m.X_MIN,
      X_RANGE: m.X_RANGE,
      Y_MAX: m.Y_MAX,
      Y_RANGE: m.Y_RANGE,
      proj4String: m.proj4String,
    };
  }, [map]);

  // Landmass dots: must contrast the page background. Pure white (#FFFFFF40)
  // was tuned for dark UIs and disappears on the frost theme - use ink tint.
  // Do not use useTheme() here: it is undefined on the server, which breaks
  // stable img data URLs + hydration.
  const svgMap = map.getSVG({
    radius: 0.22,
    color: "#6a94df",
    shape: "circle",
  });

  const createCurvedPath = (
    start: { x: number; y: number; },
    end: { x: number; y: number; },
    mapHeight: number
  ) => {
    const midX = (start.x + end.x) / 2;
    const arcLift = Math.min(
      mapHeight * 0.35,
      Math.max(mapHeight * 0.08, Math.abs(end.x - start.x) * 0.12)
    );
    const midY = Math.min(start.y, end.y) - arcLift;
    return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-lg font-sans"
    >
      <img
        src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
        className="h-full w-full pointer-events-none select-none"
        alt="world map"
        height="495"
        width="1056"
        draggable={false}
      />
      <svg
        ref={svgRef}
        viewBox={`0 0 ${layout.width} ${layout.height}`}
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full pointer-events-none select-none"
      >
        <defs>
          <filter
            id={arcGlowFilterId}
            x="-80%"
            y="-80%"
            width="260%"
            height="260%"
            filterUnits="objectBoundingBox"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.35" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="5%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="95%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>

        {dots.map((dot, i) => {
          const startPoint = projectLatLng(
            dot.start.lat,
            dot.start.lng,
            layout
          );
          const endPoint = projectLatLng(dot.end.lat, dot.end.lng, layout);
          const d = createCurvedPath(startPoint, endPoint, layout.height);
          const transition = {
            duration: 1,
            delay: 0.45 * i,
            ease: "easeOut" as const,
          };
          return (
            <g key={`path-group-${i}`}>
              <motion.path
                d={d}
                fill="none"
                stroke={`url(#${gradientId})`}
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.42}
                filter={`url(#${arcGlowFilterId})`}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: isInView ? 1 : 0 }}
                transition={transition}
              />
              <motion.path
                d={d}
                fill="none"
                stroke={`url(#${gradientId})`}
                strokeWidth="0.38"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: isInView ? 1 : 0 }}
                transition={transition}
              />
            </g>
          );
        })}

        {dots.map((dot, i) => {
          const start = projectLatLng(dot.start.lat, dot.start.lng, layout);
          const end = projectLatLng(dot.end.lat, dot.end.lng, layout);
          return (
            <g key={`points-group-${i}`}>
              <g key={`start-${i}`}>
                <circle
                  cx={start.x}
                  cy={start.y}
                  r={dot.start.pulse ? DOT_R_PULSE : DOT_R}
                  fill={lineColor}
                />
                {dot.start.pulse ? (
                  <g aria-hidden>
                    <circle
                      cx={start.x}
                      cy={start.y}
                      r={PULSE_RING_MIN}
                      fill="none"
                      stroke={PULSE_RING_COLOR}
                      strokeWidth={PULSE_STROKE_W}
                      strokeLinecap="round"
                    >
                      <animate
                        attributeName="r"
                        from={PULSE_RING_MIN}
                        to={PULSE_RING_MAX}
                        dur="2.2s"
                        begin="0s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="stroke-opacity"
                        from="0.88"
                        to="0"
                        dur="2.2s"
                        begin="0s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="stroke-width"
                        from={PULSE_STROKE_W}
                        to="0.12"
                        dur="2.2s"
                        begin="0s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    <circle
                      cx={start.x}
                      cy={start.y}
                      r={PULSE_RING_MIN}
                      fill="none"
                      stroke={PULSE_RING_COLOR}
                      strokeWidth={PULSE_STROKE_W}
                      strokeLinecap="round"
                    >
                      <animate
                        attributeName="r"
                        from={PULSE_RING_MIN}
                        to={PULSE_RING_MAX}
                        dur="2.2s"
                        begin="1.1s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="stroke-opacity"
                        from="0.88"
                        to="0"
                        dur="2.2s"
                        begin="1.1s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="stroke-width"
                        from={PULSE_STROKE_W}
                        to="0.12"
                        dur="2.2s"
                        begin="1.1s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  </g>
                ) : null}
              </g>
              <g key={`end-${i}`}>
                <circle cx={end.x} cy={end.y} r={DOT_R} fill={lineColor} />
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
