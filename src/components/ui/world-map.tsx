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
const DOT_R_PULSE = 1.1;

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
): { x: number; y: number } {
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
  lineColor = "#0ea5e9",
}: MapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.35 });
  const gradientId = `wm-${useId().replace(/:/g, "")}`;

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

  // Fixed dark styling — do not use useTheme() here: it is undefined on the
  // server, which produced white maps + hydration mismatches on the img src.
  const svgMap = map.getSVG({
    radius: 0.22,
    color: "#FFFFFF40",
    shape: "circle",
    backgroundColor: "#000000",
  });

  const createCurvedPath = (
    start: { x: number; y: number },
    end: { x: number; y: number },
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
      className="relative aspect-[2/1] w-full rounded-lg bg-black font-sans"
    >
      <img
        src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
        className="h-full w-full [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_90%,transparent)] pointer-events-none select-none"
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
        {dots.map((dot, i) => {
          const startPoint = projectLatLng(
            dot.start.lat,
            dot.start.lng,
            layout
          );
          const endPoint = projectLatLng(dot.end.lat, dot.end.lng, layout);
          return (
            <g key={`path-group-${i}`}>
              <motion.path
                d={createCurvedPath(startPoint, endPoint, layout.height)}
                fill="none"
                stroke={`url(#${gradientId})`}
                strokeWidth="0.38"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: isInView ? 1 : 0 }}
                transition={{
                  duration: 1,
                  delay: 0.45 * i,
                  ease: "easeOut",
                }}
                key={`start-upper-${i}`}
              />
            </g>
          );
        })}

        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="5%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="95%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>

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
                  <circle
                    cx={start.x}
                    cy={start.y}
                    r={DOT_R_PULSE}
                    fill={lineColor}
                    opacity="0.4"
                  >
                    <animate
                      attributeName="r"
                      from={DOT_R_PULSE}
                      to="4.5"
                      dur="2s"
                      begin="0s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      from="0.45"
                      to="0"
                      dur="2s"
                      begin="0s"
                      repeatCount="indefinite"
                    />
                  </circle>
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
