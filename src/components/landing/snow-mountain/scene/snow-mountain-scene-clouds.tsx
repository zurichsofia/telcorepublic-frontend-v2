"use client";

import * as THREE from "three";
import type { RefObject } from "react";
import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Cloud, Clouds } from "@react-three/drei";
import type { HeroScrollState } from "@/lib/snow-mountain/hero-scroll-state";
import { heroCloudLiftFactor } from "@/lib/snow-mountain/snow-mountain-cloud-scroll";
import {
  heroCloudParallaxY,
  heroPrimaryParallaxX,
  mapHeroScrollProgress,
  readHeroScrollProgress,
} from "@/lib/snow-mountain/snow-mountain-hero-scroll";

/** Scroll-driven motion shared with CSS parallax on the hero image (clouds stay out of transformed DOM). */
export type SnowMountainParallaxMotion = {
  x: number;
  y: number;
  scale: number;
  /** 0..1 hero scroll progress (used for atmospheric fade). */
  scroll: number;
};

/** Tuned so 2D CSS px drift matches the billboard scene at this camera (adjust if clouds drift vs mountains). */
const PARALLAX_PX_TO_WORLD = 0.024;

const CLOUD_TEXTURE = "/scene/cloud-drei.png";

type CloudDistributeKind = "floor" | "crown" | "foreground";

/**
 * Foreground puffs — scattered billboards across the cluster bounds so each
 * reads as its own cumulus at the hero opening (not a merged fog slab).
 */
function createForegroundDistribute(seed: number) {
  let state = seed + 2000;
  const random = () => {
    state = Math.sin(state++) * 10000;
    return state - Math.floor(state);
  };
  const point = new THREE.Vector3();

  return (cloud: { segments: number; }, index: number) => {
    const lobes = Math.max(1, Math.min(cloud.segments, 6));
    const lobe = index % lobes;
    const spreadX = (lobe - (lobes - 1) / 2) / Math.max(1, (lobes - 1) / 2);

    point.set(
      spreadX * 0.62 + (random() - 0.5) * 0.72,
      -0.35 + random() * 0.88,
      (random() - 0.5) * 0.72,
    );

    return {
      volume: 0.58 + random() * 0.48,
      point,
    };
  };
}

/**
 * Dense ground bank — billboards hug the bottom of bounds (negative Y).
 * Reads as a soft white floor; opacity + inside concentrate keep it filled in.
 */
function createFloorDistribute(seed: number) {
  let state = seed;
  const random = () => {
    state = Math.sin(state++) * 10000;
    return state - Math.floor(state);
  };
  const point = new THREE.Vector3();

  return (cloud: { segments: number; }, index: number) => {
    const lobes = Math.max(1, Math.min(4, cloud.segments));
    const lobe = index % lobes;
    const spreadX = (lobe - (lobes - 1) / 2) / Math.max(1, (lobes - 1) / 2);

    point.set(
      spreadX * 0.96 + (random() - 0.5) * 0.18,
      -0.82 + random() * 0.22,
      (random() - 0.5) * 0.28,
    );

    return {
      volume: 0.9 + random() * 0.38,
      point,
    };
  };
}

/**
 * Puffy crown rim — billboards only in the upper half of bounds (positive Y).
 * Lower volume + outside concentrate = soft, billowy top edge of the band.
 */
function createCrownDistribute(seed: number) {
  let state = seed + 1000;
  const random = () => {
    state = Math.sin(state++) * 10000;
    return state - Math.floor(state);
  };
  const point = new THREE.Vector3();

  return (cloud: { segments: number; }, index: number) => {
    const lobes = Math.max(1, Math.min(3, cloud.segments));
    const lobe = index % lobes;
    const spreadX = (lobe - (lobes - 1) / 2) / Math.max(1, (lobes - 1) / 2);

    point.set(
      spreadX * 0.72 + (random() - 0.5) * 0.48,
      0.2 + random() * 0.62,
      (random() - 0.5) * 0.58,
    );

    return {
      volume: 0.48 + random() * 0.38,
      point,
    };
  };
}

const distributeCache = new Map<
  string,
  ReturnType<typeof createFloorDistribute> | ReturnType<typeof createForegroundDistribute>
>();

function getCloudDistribute(kind: CloudDistributeKind, seed: number) {
  const key = `${kind}-${seed}`;
  let distribute = distributeCache.get(key);
  if (!distribute) {
    distribute =
      kind === "floor"
        ? createFloorDistribute(seed)
        : kind === "foreground"
          ? createForegroundDistribute(seed)
          : createCrownDistribute(seed);
    distributeCache.set(key, distribute);
  }
  return distribute;
}

// Three layers: soft floor fill, many foreground puffs, crown rim on top.

/** Minimum billboard count per preset (drei Cloud). */
const CLOUD_SEGMENTS = { base: 5, foreground: 6, puff: 4, accent: 3 } as const;

type CloudPreset = {
  segments: number;
  volume: number;
  opacity: number;
  fade: number;
  growth: number;
  speed: number;
  bounds: [number, number, number];
  concentrate: "random" | "inside" | "outside";
  smallestVolume: number;
};

/** Soft backdrop fill — kept light so foreground puffs stay readable. */
const CLOUD_BASE: CloudPreset = {
  segments: CLOUD_SEGMENTS.base,
  volume: 9.5,
  opacity: 0.68,
  // fade is also camera-distance attenuation in drei — keep ≤ ~10 or clouds read faint.
  fade: 0,
  growth: 0,
  speed: 0.5,
  bounds: [9.5, 0.95, 1.2],
  concentrate: "random",
  smallestVolume: 0.46,
};

/** Distinct puffy clusters at the hero opening — closer to camera, many billboards each. */
const CLOUD_FOREGROUND: CloudPreset = {
  segments: CLOUD_SEGMENTS.foreground,
  volume: 10.2,
  opacity: 0.8,
  fade: 0,
  growth: 0,
  speed: 0.5,
  bounds: [4.8, 1.55, 1.35],
  concentrate: "random",
  smallestVolume: 0.42,
};

/** Soft cumulus crowns — tall bounds, billboards in top half via crown distribute. */
const CLOUD_PUFF: CloudPreset = {
  segments: CLOUD_SEGMENTS.puff,
  volume: 11.8,
  opacity: 0.62,
  fade: 0,
  growth: 0,
  speed: 0.5,
  bounds: [5.4, 2.0, 1.5],
  concentrate: "outside",
  smallestVolume: 0.38,
};

/** Extra crown billboards along the top edge of the band. */
const CLOUD_ACCENT: CloudPreset = {
  segments: CLOUD_SEGMENTS.accent,
  volume: 10.8,
  opacity: 0.58,
  fade: 0,
  growth: 0,
  speed: 0.5,
  bounds: [4.6, 1.75, 1.45],
  concentrate: "outside",
  smallestVolume: 0.36,
};

type CloudConfig = {
  base: [number, number, number];
  preset: CloudPreset;
  distribute: CloudDistributeKind;
  seed: number;
  color: string;
  morph: number;
};

const CLOUD_CONFIGS: CloudConfig[] = [
  // Light floor fill — tiled across the wrap span.
  { base: [-38, -1.34, -2.3], preset: CLOUD_BASE, distribute: "floor", seed: 31, color: "#ffffff", morph: 0.55 },
  { base: [-25.33, -1.36, -2.15], preset: CLOUD_BASE, distribute: "floor", seed: 32, color: "#ffffff", morph: 0.55 },
  { base: [-12.67, -1.33, -2.5], preset: CLOUD_BASE, distribute: "floor", seed: 33, color: "#ffffff", morph: 0.55 },
  { base: [0, -1.35, -2.2], preset: CLOUD_BASE, distribute: "floor", seed: 34, color: "#ffffff", morph: 0.55 },
  { base: [12.67, -1.32, -2.4], preset: CLOUD_BASE, distribute: "floor", seed: 35, color: "#ffffff", morph: 0.55 },
  { base: [25.33, -1.34, -2.3], preset: CLOUD_BASE, distribute: "floor", seed: 36, color: "#ffffff", morph: 0.55 },
  // Many foreground puffs — closer Z reads larger; staggered Y for depth.
  { base: [-34, -1.02, -1.35], preset: CLOUD_FOREGROUND, distribute: "foreground", seed: 41, color: "#ffffff", morph: 0.7 },
  { base: [-26, -1.14, -1.55], preset: CLOUD_FOREGROUND, distribute: "foreground", seed: 42, color: "#ffffff", morph: 0.7 },
  { base: [-18, -0.96, -1.28], preset: CLOUD_FOREGROUND, distribute: "foreground", seed: 43, color: "#ffffff", morph: 0.7 },
  { base: [-10, -1.08, -1.48], preset: CLOUD_FOREGROUND, distribute: "foreground", seed: 44, color: "#ffffff", morph: 0.7 },
  { base: [-2, -1.0, -1.22], preset: CLOUD_FOREGROUND, distribute: "foreground", seed: 45, color: "#ffffff", morph: 0.7 },
  { base: [6, -1.12, -1.42], preset: CLOUD_FOREGROUND, distribute: "foreground", seed: 46, color: "#ffffff", morph: 0.7 },
  { base: [14, -0.94, -1.3], preset: CLOUD_FOREGROUND, distribute: "foreground", seed: 47, color: "#ffffff", morph: 0.7 },
  { base: [22, -1.06, -1.5], preset: CLOUD_FOREGROUND, distribute: "foreground", seed: 48, color: "#ffffff", morph: 0.7 },
  { base: [30, -0.98, -1.25], preset: CLOUD_FOREGROUND, distribute: "foreground", seed: 49, color: "#ffffff", morph: 0.7 },
  { base: [-22, -1.18, -1.62], preset: CLOUD_FOREGROUND, distribute: "foreground", seed: 50, color: "#ffffff", morph: 0.7 },
  { base: [2, -1.16, -1.58], preset: CLOUD_FOREGROUND, distribute: "foreground", seed: 51, color: "#ffffff", morph: 0.7 },
  { base: [26, -1.1, -1.38], preset: CLOUD_FOREGROUND, distribute: "foreground", seed: 52, color: "#ffffff", morph: 0.7 },
  // Puffy crown rim — billboards live in the top half of each cluster.
  { base: [-28.5, -0.82, -2.7], preset: CLOUD_PUFF, distribute: "crown", seed: 11, color: "#ffffff", morph: 0.95 },
  { base: [-9.5, -0.86, -3.0], preset: CLOUD_PUFF, distribute: "crown", seed: 14, color: "#ffffff", morph: 0.95 },
  { base: [9.5, -0.84, -2.85], preset: CLOUD_PUFF, distribute: "crown", seed: 12, color: "#ffffff", morph: 0.95 },
  { base: [28.5, -0.82, -2.95], preset: CLOUD_PUFF, distribute: "crown", seed: 15, color: "#ffffff", morph: 0.95 },
  { base: [-25.33, -0.72, -3.3], preset: CLOUD_ACCENT, distribute: "crown", seed: 18, color: "#ffffff", morph: 1 },
  { base: [0, -0.68, -3.35], preset: CLOUD_ACCENT, distribute: "crown", seed: 19, color: "#ffffff", morph: 1 },
  { base: [25.33, -0.7, -3.3], preset: CLOUD_ACCENT, distribute: "crown", seed: 21, color: "#ffffff", morph: 1 },
];

/** Rest scale at scroll 0 — puffiness from growth; keep Y slightly shorter. */
const CLOUD_REST_XZ_SCALE = 1.38;
const CLOUD_REST_Y_SCALE = 1.18;

// More negative = band sits lower on screen (camera at [0, -10, 10]).
const CLOUD_Y_OFFSET = -8.5;

/**
 * Steady wind — clouds travel left→right at this many world units/sec. When a
 * cloud passes CLOUD_WRAP_MAX it wraps back to CLOUD_WRAP_MIN (both off-screen),
 * so the band drifts forever with no visible pop. Base x positions are tiled
 * evenly across the span so coverage stays continuous while sliding.
 *
 * Preset `speed` (0.5) drives slow billboard rotation inside each cloud.
 * `growth` is 0 so speed does not trigger drei’s sin-wave size pulsation.
 */
const CLOUD_WIND_SPEED = 0.5;
const CLOUD_WRAP_MIN = -30;
const CLOUD_WRAP_MAX = 30;

function wrapCloudX(x: number): number {
  const span = CLOUD_WRAP_MAX - CLOUD_WRAP_MIN;
  return CLOUD_WRAP_MIN + ((((x - CLOUD_WRAP_MIN) % span) + span) % span);
}

/** Scroll 0 → bottom band; scroll 1 → slight lift only (no scale puff). */
const SCROLL_HEIGHT_SCALE_END = 1;
const SCROLL_FLUFF_SCALE_END = 1;
const SCROLL_LIFT_Y = 0.30;
const SCROLL_CLOUD_LIFT = 0.2;
const SCROLL_RIG_HEIGHT_END = 0.12;
const SCROLL_RIG_BOTTOM_ANCHOR = 0.18;

function applyScrollMorph(
  group: THREE.Group,
  liftFactor: number,
  morphStrength: number,
) {
  const t = liftFactor * morphStrength;
  const height = CLOUD_REST_Y_SCALE * (1 + t * (SCROLL_HEIGHT_SCALE_END - 1));
  const fluff = CLOUD_REST_XZ_SCALE * (1 + t * (SCROLL_FLUFF_SCALE_END - 1));
  group.scale.set(fluff, height, fluff);
}

function HeroCloudScene({
  reducedMotion,
  scrollState,
  sectionRef,
}: {
  reducedMotion: boolean;
  scrollState: HeroScrollState;
  sectionRef: RefObject<HTMLElement | null>;
}) {
  const parallaxRig = useRef<THREE.Group>(null);
  const cloudRefs = useRef<(THREE.Group | null)[]>(
    CLOUD_CONFIGS.map(() => null),
  );

  useFrame((state) => {
    const section = sectionRef.current;
    const scrollT = section
      ? THREE.MathUtils.clamp(readHeroScrollProgress(section), 0, 1)
      : THREE.MathUtils.clamp(scrollState.get(), 0, 1);

    const scroll = mapHeroScrollProgress(scrollT);
    const liftFactor = heroCloudLiftFactor(scroll);

    const rig = parallaxRig.current;
    if (rig) {
      const x = heroPrimaryParallaxX(scrollT);
      const y = heroCloudParallaxY(scrollT);
      const rigHeight = 1 + liftFactor * SCROLL_RIG_HEIGHT_END;
      rig.scale.set(1, rigHeight, 1);
      const rigLift = liftFactor * SCROLL_LIFT_Y;
      const rigAnchor = (rigHeight - 1) * SCROLL_RIG_BOTTOM_ANCHOR;
      rig.position.set(
        -x * PARALLAX_PX_TO_WORLD,
        -y * PARALLAX_PX_TO_WORLD + rigLift - rigAnchor,
        0,
      );
    }

    state.gl.domElement.style.opacity = "1";

    const elapsed = state.clock.elapsedTime;

    for (let i = 0; i < CLOUD_CONFIGS.length; i++) {
      const ref = cloudRefs.current[i];
      if (!ref) continue;
      const { base, morph } = CLOUD_CONFIGS[i];

      const baseY =
        base[1] + CLOUD_Y_OFFSET + liftFactor * SCROLL_CLOUD_LIFT * morph;

      if (reducedMotion) {
        ref.position.set(base[0], baseY, base[2]);
        ref.scale.set(CLOUD_REST_XZ_SCALE, CLOUD_REST_Y_SCALE, CLOUD_REST_XZ_SCALE);
        continue;
      }

      applyScrollMorph(ref, liftFactor, morph);

      // Continuous left→right wind, wrapped off-screen so it never pops.
      const driftX = wrapCloudX(base[0] + elapsed * CLOUD_WIND_SPEED);

      ref.position.set(driftX, baseY, base[2]);
    }
  });

  return (
    <>
      <ambientLight intensity={Math.PI * 1.15} color="#ffffff" />
      <spotLight
        position={[0, 40, 0]}
        color="#ffffff"
        decay={0}
        distance={45}
        penumbra={1}
        intensity={120}
      />
      <spotLight
        position={[-22, -8, 12]}
        color="#ffffff"
        angle={0.22}
        decay={0}
        penumbra={-1}
        intensity={22}
      />
      <spotLight
        position={[22, -8, 12]}
        color="#ffffff"
        angle={0.22}
        decay={0}
        penumbra={-1}
        intensity={22}
      />

      <group ref={parallaxRig}>
        <Clouds
          texture={CLOUD_TEXTURE}
          material={THREE.MeshLambertMaterial}
          limit={250}
          // Billboards spread far from the mesh origin, but its bounding sphere
          // is just the tiny plane — without this the whole cloud mesh gets
          // culled (and vanishes) whenever the origin leaves the frustum.
          frustumCulled={false}
        >
          {CLOUD_CONFIGS.map((cfg, i) => {
            const { concentrate, smallestVolume, ...preset } = cfg.preset;
            return (
              <Cloud
                key={i}
                ref={(el) => {
                  cloudRefs.current[i] = el;
                }}
                {...preset}
                concentrate={concentrate}
                smallestVolume={smallestVolume}
                seed={cfg.seed}
                color={cfg.color}
                position={cfg.base}
                distribute={getCloudDistribute(cfg.distribute, cfg.seed)}
              />
            );
          })}
        </Clouds>
      </group>
    </>
  );
}

export function SnowMountainSceneClouds({
  scrollState,
  sectionRef,
  reducedMotion,
  sceneActive = true,
}: {
  scrollState: HeroScrollState;
  sectionRef: RefObject<HTMLElement | null>;
  reducedMotion: boolean;
  sceneActive?: boolean;
}) {
  return (
    <div
      className="pointer-events-none absolute inset-0 isolate z-15 [&_canvas]:block [&_canvas]:h-full [&_canvas]:w-full"
      aria-hidden
    >
      <Canvas
        frameloop={!reducedMotion ? "always" : "never"}
        camera={{ position: [0, -10, 10], fov: 75 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
        style={{ width: "100%", height: "100%" }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <Suspense fallback={null}>
          <HeroCloudScene
            reducedMotion={reducedMotion}
            scrollState={scrollState}
            sectionRef={sectionRef}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
