"use client";

import * as THREE from "three";
import type { RefObject } from "react";
import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Cloud, Clouds } from "@react-three/drei";
import type { HeroScrollState } from "@/lib/snow-mountain/hero-scroll-state";
import {
  heroPrimaryParallaxX,
  heroPrimaryParallaxY,
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

/** Same asset as pmndrs/drei default; bundled locally so the hero works offline. */
const CLOUD_TEXTURE = "/scene/cloud-drei.png";

// ---------------------------------------------------------------------------
// Cloud presets — mix and match per depth layer
// ---------------------------------------------------------------------------

type CloudPreset = {
  segments: number;
  volume: number;
  opacity: number;
  fade: number;
  growth: number;
  speed: number;
  bounds: [number, number, number];
};

/** Foreground (z ≈ +12): closest to camera — sharpest edges, most opaque, largest puffs. */
const CLOUD_NEAR: CloudPreset = {
  segments: 20,
  volume: 7,
  opacity: 0.5,
  fade: 8,
  growth: 6,
  /** 0 = no per-billboard spin; horizontal drift is applied on the group in useFrame. */
  speed: 0,
  bounds: [12, 1, 1],
};

/** Mid layer (z ≈ 0): the primary visible band — balanced puffiness. */
const CLOUD_MID: CloudPreset = {
  segments: 10,
  volume: 6.6,
  opacity: 0.66,
  fade: 10,
  growth: 7,
  speed: 0,
  bounds: [10, 1, 1],
};

/** Bottom bank (y ≈ -1): extra thickness in the center-bottom of the hero. */
const CLOUD_BANK: CloudPreset = {
  segments: 18,
  volume: 10.5,
  opacity: 0.72,
  fade: 12,
  growth: 10,
  speed: 0,
  // Wider X bounds so the "bank" reads as a broad layer, not a single puff.
  bounds: [26, 1.2, 1.6],
};

/** Background (z ≈ -12): atmospheric haze — softer edges, more transparent, cool tint. */
const CLOUD_FAR: CloudPreset = {
  segments: 20,
  volume: 8,
  opacity: 0.35,
  fade: 22,
  growth: 3,
  speed: 0,
  bounds: [8, 2, 2],
};

// ---------------------------------------------------------------------------
// Per-cloud config — position, preset, seed, color, drift direction
// ---------------------------------------------------------------------------

type CloudConfig = {
  base: [number, number, number];
  preset: CloudPreset;
  seed: number;
  color: string;
  /** +1 drifts right→left, -1 drifts left→right */
  dir: 1 | -1;
  /** World units per second. Use lower values for distant layers. */
  driftSpeed: number;
  /** Small vertical wobble to avoid rigid motion (world units). */
  bobAmpY: number;
};

const CLOUD_CONFIGS: CloudConfig[] = [
  // Near layer (fastest, most visible)
  // Keep this one lower so it doesn't read as a tall cloud crossing the top edge.
  {
    base: [-18, -3.2, 6],
    preset: CLOUD_NEAR,
    seed: 1,
    color: "white",
    dir: 1,
    driftSpeed: 0.32,
    bobAmpY: 0.075,
  },
  {
    base: [10, -1, 3],
    preset: CLOUD_NEAR,
    seed: 2,
    color: "white",
    dir: 1,
    driftSpeed: 0.36,
    bobAmpY: 0.08,
  },
  // Keep this one lower so it doesn't read as a tall cloud crossing the top edge.
  {
    base: [26, -2.1, -1],
    preset: CLOUD_NEAR,
    seed: 3,
    color: "white",
    dir: 1,
    driftSpeed: 0.32,
    bobAmpY: 0.08,
  },

  // Mid layer (slower)
  {
    base: [-22, -0.7, -6],
    preset: CLOUD_MID,
    seed: 11,
    color: "#f3f4f6",
    dir: 1,
    driftSpeed: 0.22,
    bobAmpY: 0.06,
  },
  {
    base: [8, -0.7, -8],
    preset: CLOUD_MID,
    seed: 12,
    color: "#e9ecef",
    dir: 1,
    driftSpeed: 0.2,
    bobAmpY: 0.055,
  },

  // Extra bottom bank — center + left (thick, wide layer)
  {
    base: [0, -1.15, -4.5],
    preset: CLOUD_BANK,
    seed: 31,
    color: "#f8fafc",
    dir: 1,
    driftSpeed: 0.16,
    bobAmpY: 0.05,
  },
  {
    base: [12, -1.05, -5.2],
    preset: CLOUD_BANK,
    seed: 32,
    color: "#f1f5f9",
    dir: 1,
    driftSpeed: 0.155,
    bobAmpY: 0.048,
  },
  {
    base: [-14, -1.1, -4.8],
    preset: CLOUD_BANK,
    seed: 33,
    color: "#f8fafc",
    dir: 1,
    driftSpeed: 0.158,
    bobAmpY: 0.052,
  },
  {
    base: [-26, -1.05, -5.5],
    preset: CLOUD_BANK,
    seed: 34,
    color: "#eef2f6",
    dir: 1,
    driftSpeed: 0.152,
    bobAmpY: 0.05,
  },

  // Far haze (slowest, more transparent)
  {
    base: [-10, -0.5, -14],
    preset: CLOUD_FAR,
    seed: 21,
    color: "#cbd5e1",
    dir: 1,
    driftSpeed: 0.12,
    bobAmpY: 0.04,
  },
];

/**
 * World Y shift for this camera ([0,-10,10]). More negative moves the band up on screen;
 * less negative / positive moves it down (tune slowly, e.g. -2 … +0.5).
 */
// Less negative = clouds sit lower on screen (given camera at [0, -10, 10]).
const CLOUD_Y_OFFSET = -5;

/** Wrap width so clouds drift continuously without popping. */
const DRIFT_WRAP_WIDTH_X = 70;

function wrapCentered(value: number, width: number) {
  const half = width / 2;
  return ((((value + half) % width) + width) % width) - half;
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
  const lastScrollYRef = useRef(-1);
  const cloudRefs = useRef<(THREE.Group | null)[]>(
    CLOUD_CONFIGS.map(() => null),
  );

  useFrame((state) => {
    let scrollT = THREE.MathUtils.clamp(scrollState.get(), 0, 1);
    const scrollY = window.scrollY;
    if (scrollY !== lastScrollYRef.current) {
      lastScrollYRef.current = scrollY;
      const section = sectionRef.current;
      if (section) {
        scrollT = THREE.MathUtils.clamp(readHeroScrollProgress(section), 0, 1);
      }
    }

    const rig = parallaxRig.current;
    if (rig) {
      const x = heroPrimaryParallaxX(scrollT);
      const y = heroPrimaryParallaxY(scrollT);
      const heightScale = 1 + scrollT * 0.85;
      rig.scale.set(1, heightScale, 1);
      rig.position.set(-x * PARALLAX_PX_TO_WORLD, -y * PARALLAX_PX_TO_WORLD, 0);
    }

    const scroll = scrollT;
    const canvas = state.gl.domElement;
    if (reducedMotion) {
      canvas.style.opacity = "1";
    } else {
      const t = THREE.MathUtils.clamp(scroll, 0, 1);
      canvas.style.opacity = (1 - t * 0.22).toFixed(3);
    }

    const t = state.clock.elapsedTime;

    for (let i = 0; i < CLOUD_CONFIGS.length; i++) {
      const ref = cloudRefs.current[i];
      if (!ref) continue;
      const { base, dir, driftSpeed, bobAmpY } = CLOUD_CONFIGS[i];

      const baseY = base[1] + CLOUD_Y_OFFSET;
      if (reducedMotion) {
        ref.position.set(base[0], baseY, base[2]);
        continue;
      }

      // Drift along X with wraparound; slight bob on Y; tiny Z flutter to keep it organic.
      const driftX = wrapCentered(
        base[0] + dir * t * driftSpeed + i * 7.3,
        DRIFT_WRAP_WIDTH_X,
      );
      const bobY = Math.sin(t * 0.35 + i * 1.9) * bobAmpY;
      const flutterZ = Math.sin(t * 0.18 + i * 2.4) * 0.12;

      ref.position.set(driftX, baseY + bobY, base[2] + flutterZ);
    }
  });

  return (
    <>
      <ambientLight intensity={Math.PI / 1.5} />
      <spotLight
        position={[0, 40, 0]}
        decay={0}
        distance={45}
        penumbra={1}
        intensity={100}
      />
      {/* Symmetric fill so Lambert billboards don't read heavier on one side */}
      <spotLight
        position={[-22, -8, 12]}
        color="#ffffff"
        angle={0.17}
        decay={0}
        penumbra={-1}
        intensity={24}
      />
      <spotLight
        position={[22, -8, 12]}
        color="#ffffff"
        angle={0.17}
        decay={0}
        penumbra={-1}
        intensity={24}
      />

      <group ref={parallaxRig}>
        <Clouds
          texture={CLOUD_TEXTURE}
          material={THREE.MeshLambertMaterial}
          limit={400}
        >
          {CLOUD_CONFIGS.map((cfg, i) => (
            <Cloud
              key={i}
              ref={(el) => {
                cloudRefs.current[i] = el;
              }}
              {...cfg.preset}
              seed={cfg.seed}
              color={cfg.color}
              position={cfg.base}
            />
          ))}
        </Clouds>
      </group>
    </>
  );
}

export function SnowMountainSceneClouds({
  scrollState,
  sectionRef,
  reducedMotion,
}: {
  scrollState: HeroScrollState;
  sectionRef: RefObject<HTMLElement | null>;
  reducedMotion: boolean;
}) {
  return (
    <div
      className="pointer-events-none absolute inset-0 isolate z-1 [&_canvas]:block [&_canvas]:h-full [&_canvas]:w-full"
      aria-hidden
    >
      <Canvas
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

