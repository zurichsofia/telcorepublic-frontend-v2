"use client";

import * as THREE from "three";
import type { MutableRefObject } from "react";
import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Cloud, Clouds } from "@react-three/drei";

/** Scroll-driven motion shared with CSS parallax on the hero image (clouds stay out of transformed DOM). */
export type HeroParallaxMotion = {
  x: number;
  y: number;
  scale: number;
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
  speed: 0.5,
  bounds: [12, 1, 1],
};

/** Mid layer (z ≈ 0): the primary visible band — balanced puffiness. */
const CLOUD_MID: CloudPreset = {
  segments: 10,
  volume: 6,
  opacity: 0.6,
  fade: 10,
  growth: 7,
  speed: 0.5,
  bounds: [10, 1, 1],
};

/** Background (z ≈ -12): atmospheric haze — softer edges, more transparent, cool tint. */
const CLOUD_FAR: CloudPreset = {
  segments: 20,
  volume: 8,
  opacity: 0.35,
  fade: 22,
  growth: 3,
  speed: 0.05,
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
};

const CLOUD_CONFIGS: CloudConfig[] = [
  { base: [-12, -1, 0], preset: CLOUD_NEAR, seed: 1, color: "white", dir: 1 },
  { base: [12, -1, 0], preset: CLOUD_NEAR, seed: 1, color: "white", dir: 1 },
  // { base: [15, 0, 0], preset: CLOUD_MID, seed: 2, color: "#eed0d0", dir: -1 },
  // { base: [-15, 0, 0], preset: CLOUD_MID, seed: 3, color: "#d0e0d0", dir: 1 },
  // { base: [0, 0, -12], preset: CLOUD_FAR, seed: 4, color: "#a0b0d0", dir: -1 },
  // { base: [0, 0, 12], preset: CLOUD_NEAR, seed: 5, color: "white", dir: 1 },
];

/**
 * World Y shift for this camera ([0,-10,10]). More negative moves the band up on screen;
 * less negative / positive moves it down (tune slowly, e.g. -2 … +0.5).
 */
const CLOUD_Y_OFFSET = -4.95;

/** Gentle breathing pulsation — clouds stay fixed, scale varies ±3%. */
const PULSE_AMPLITUDE = 0.03;
const PULSE_FREQ = 0.22;

// ---------------------------------------------------------------------------

function HeroCloudScene({
  reducedMotion,
  motionRef,
}: {
  reducedMotion: boolean;
  motionRef: MutableRefObject<HeroParallaxMotion>;
}) {
  const parallaxRig = useRef<THREE.Group>(null);
  const cloudRefs = useRef<(THREE.Group | null)[]>(
    CLOUD_CONFIGS.map(() => null),
  );

  useFrame((state) => {
    const rig = parallaxRig.current;
    if (rig) {
      const { x, y, scale } = motionRef.current;
      rig.scale.setScalar(scale);
      rig.position.set(-x * PARALLAX_PX_TO_WORLD, -y * PARALLAX_PX_TO_WORLD, 0);
    }

    const t = state.clock.elapsedTime;

    for (let i = 0; i < CLOUD_CONFIGS.length; i++) {
      const ref = cloudRefs.current[i];
      if (!ref) continue;
      const { base } = CLOUD_CONFIGS[i];
      ref.position.set(base[0], base[1] + CLOUD_Y_OFFSET, base[2]);
      if (!reducedMotion) {
        const pulse = 1 + Math.sin(t * PULSE_FREQ + i * Math.PI * 0.7) * PULSE_AMPLITUDE;
        ref.scale.setScalar(pulse);
      }
    }
  });

  return (
    <>
      <ambientLight intensity={Math.PI / 1.5} />
      <spotLight position={[0, 40, 0]} decay={0} distance={45} penumbra={1} intensity={100} />
      {/* Symmetric fill so Lambert billboards don't read heavier on one side */}
      <spotLight position={[-22, -8, 12]} color="#ffffff" angle={0.17} decay={0} penumbra={-1} intensity={24} />
      <spotLight position={[22, -8, 12]} color="#ffffff" angle={0.17} decay={0} penumbra={-1} intensity={24} />

      <group ref={parallaxRig}>
        <Clouds texture={CLOUD_TEXTURE} material={THREE.MeshLambertMaterial} limit={400}>
          {CLOUD_CONFIGS.map((cfg, i) => (
            <Cloud
              key={i}
              ref={(el) => { cloudRefs.current[i] = el; }}
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

export function HeroCloudsThree({
  motionRef,
  reducedMotion,
}: {
  motionRef: MutableRefObject<HeroParallaxMotion>;
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
        onCreated={({ gl }) => { gl.setClearColor(0x000000, 0); }}
      >
        <Suspense fallback={null}>
          <HeroCloudScene reducedMotion={reducedMotion} motionRef={motionRef} />
        </Suspense>
      </Canvas>
    </div>
  );
}
