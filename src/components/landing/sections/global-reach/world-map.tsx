"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import DottedMap from "dotted-map";
import proj4 from "proj4";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

type MapEndpoint = {
  lat: number;
  lng: number;
  label?: string;
  /** When true, a soft pulse ring animates from this point (e.g. home base). */
  pulse?: boolean;
};

interface MapProps {
  dots?: ReadonlyArray<{
    start: MapEndpoint;
    end: MapEndpoint;
  }>;
  /** Arc stroke color (matches brand cloud grey). */
  lineColor?: string;
  /** Non-highlight location dots (separate from line so markers stay readable). */
  markerColor?: string;
  /** Brand accent: only the pulsing home point (e.g. Zurich) uses this. */
  accentColor?: string;
}

/** Landmass grid: grey dots on white. */
const LAND_DOT_COLOR = "#6b7379";

const DOT_R = 1;
const DOT_R_PULSE = 1.15;
/** Expanding ring - viewBox height is ~100; keep ripple large enough to read on screen. */
const PULSE_RING_MIN = 1.5;
const PULSE_RING_MAX = 6;
const PULSE_STROKE_W = 0.5;

const GLOBAL_REACH_DOTS = [
  {
    start: { lat: 47.3769, lng: 8.5417, pulse: true as const },
    end: { lat: 51.5074, lng: -0.1278 },
  },
  {
    start: { lat: 51.5074, lng: -0.1278 },
    end: { lat: 40.7128, lng: -74.006 },
  },
  {
    start: { lat: 51.5074, lng: -0.1278 },
    end: { lat: 25.2048, lng: 55.2708 },
  },
  {
    start: { lat: 28.6139, lng: 77.209 },
    end: { lat: 1.3521, lng: 103.8198 },
  },
  {
    start: { lat: 1.3521, lng: 103.8198 },
    end: { lat: 35.6762, lng: 139.6503 },
  },
  {
    start: { lat: 40.7128, lng: -74.006 },
    end: { lat: -23.5505, lng: -46.6333 },
  },
] as const;

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
  dots = GLOBAL_REACH_DOTS,
  lineColor = "#eb1e25",
  markerColor = "#eb1e25",
  accentColor = "#eb1e25",
}: MapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const drawStartedRef = useRef(false);
  const reduceMotion = usePrefersReducedMotion();
  const [inView, setInView] = useState(false);
  const [arcsVisible, setArcsVisible] = useState(false);
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

  const mapImageSrc = useMemo(() => {
    const svgMap = map.getSVG({
      radius: 0.24,
      color: LAND_DOT_COLOR,
      shape: "circle",
      backgroundColor: "#ffffff",
    });
    return `data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`;
  }, [map]);

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

  useEffect(() => {
    const container = containerRef.current;
    if (!container || dots.length === 0) return;

    const pathAnimations: Animation[] = [];

    const startArcDraw = () => {
      if (drawStartedRef.current) return;

      const paths = pathRefs.current.filter(Boolean) as SVGPathElement[];
      if (paths.length === 0) return;

      drawStartedRef.current = true;

      const preparePath = (path: SVGPathElement) => {
        const len = path.getTotalLength();
        path.setAttribute("stroke-dasharray", String(len));
        path.setAttribute("stroke-dashoffset", String(len));
      };

      // Defer layout reads out of the intersection callback.
      requestAnimationFrame(() => {
        paths.forEach(preparePath);
        setArcsVisible(true);

        if (reduceMotion) {
          paths.forEach((path) => path.setAttribute("stroke-dashoffset", "0"));
          return;
        }

        requestAnimationFrame(() => {
          paths.forEach((path, index) => {
            const len = path.getTotalLength();
            const i = Math.floor(index / 2);
            pathAnimations.push(
              path.animate(
                [{ strokeDashoffset: len }, { strokeDashoffset: 0 }],
                {
                  duration: 1000,
                  delay: 450 * i,
                  fill: "forwards",
                  easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                },
              ),
            );
          });
        });
      });
    };

    const obs = new IntersectionObserver(
      ([entry]) => {
        setInView(entry?.isIntersecting ?? false);
        if (!entry?.isIntersecting || drawStartedRef.current) return;
        startArcDraw();
      },
      { root: null, rootMargin: "0px 0px -35% 0px", threshold: 0 },
    );
    obs.observe(container);

    return () => {
      obs.disconnect();
      pathAnimations.forEach((animation) => animation.cancel());
    };
  }, [dots.length, reduceMotion]);

  return (
    <div
      ref={containerRef}
      className="relative aspect-[1056/495] w-full rounded-lg bg-white font-sans"
    >
      <img
        src={mapImageSrc}
        className="absolute inset-0 h-full w-full pointer-events-none select-none"
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
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="5%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="95%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>

        <g opacity={arcsVisible ? 1 : 0}>
          {dots.map((dot, i) => {
            const startPoint = projectLatLng(
              dot.start.lat,
              dot.start.lng,
              layout
            );
            const endPoint = projectLatLng(dot.end.lat, dot.end.lng, layout);
            const d = createCurvedPath(startPoint, endPoint, layout.height);
            return (
              <g key={`path-group-${i}`}>
                <path
                  ref={(el) => {
                    pathRefs.current[i * 2] = el;
                  }}
                  d={d}
                  fill="none"
                  stroke={`url(#${gradientId})`}
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={0.32}
                />
                <path
                  ref={(el) => {
                    pathRefs.current[i * 2 + 1] = el;
                  }}
                  d={d}
                  fill="none"
                  stroke={`url(#${gradientId})`}
                  strokeWidth="0.38"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            );
          })}
        </g>

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
                  fill={dot.start.pulse ? accentColor : markerColor}
                />
                {dot.start.pulse && inView ? (
                  <g aria-hidden>
                    <circle
                      cx={start.x}
                      cy={start.y}
                      r={PULSE_RING_MIN}
                      fill="none"
                      stroke={accentColor}
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
                      stroke={accentColor}
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
                <circle cx={end.x} cy={end.y} r={DOT_R} fill={markerColor} />
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
