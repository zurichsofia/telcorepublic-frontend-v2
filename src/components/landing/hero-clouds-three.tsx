"use client";

import * as THREE from "three";
import type { MutableRefObject } from "react";
import { Suspense, useRef, useSyncExternalStore } from "react";
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
const CLOUD_TEXTURE = "/cloud-drei.png";

/** Tuned for a lighter mist: lower volume/growth/segments/opacity = thinner, less “stacked” billboards. */
const CLOUD_PRESET = {
  segments: 32,
  volume: 10,
  opacity: 0.52,
  fade: 12,
  growth: 3.5,
  bounds: [10.6, 6.12, 0.06] as [number, number, number],
};

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (onStoreChange) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", onStoreChange);
      return () => mq.removeEventListener("change", onStoreChange);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

/** Base positions (from the reference layout); X is offset each frame for horizontal drift. */
const CLOUD_BASE: [number, number, number][] = [
  [0, 0, 0],
  [15, 0, 0],
  [-15, 0, 0],
  [0, 0, -12],
  [0, 0, 12],
];

/**
 * World Y shift for this camera ([0,-10,10]). **More negative moves the band up** on screen;
 * less negative / positive moves it **down** (tune slowly, e.g. -2 … +0.5).
 */
const CLOUD_Y_OFFSET = -4.95;

function HeroCloudScene({
  reducedMotion,
  motionRef,
}: {
  reducedMotion: boolean;
  motionRef: MutableRefObject<HeroParallaxMotion>;
}) {
  const parallaxRig = useRef<THREE.Group>(null);
  const cloud0 = useRef<THREE.Group>(null);
  const cloud1 = useRef<THREE.Group>(null);
  const cloud2 = useRef<THREE.Group>(null);
  const cloud3 = useRef<THREE.Group>(null);
  const cloud4 = useRef<THREE.Group>(null);
  const cloudRefs = [cloud0, cloud1, cloud2, cloud3, cloud4];

  useFrame((state) => {
    const rig = parallaxRig.current;
    if (rig) {
      const { x, y, scale } = motionRef.current;
      rig.scale.setScalar(scale);
      rig.position.set(-x * PARALLAX_PX_TO_WORLD, -y * PARALLAX_PX_TO_WORLD, 0);
    }

    const t = state.clock.elapsedTime;
    const freq = 0.085;
    const amplitude = reducedMotion ? 0 : 3.2;
    for (let i = 0; i < cloudRefs.length; i++) {
      const ref = cloudRefs[i].current;
      if (!ref) continue;
      const [bx, by, bz] = CLOUD_BASE[i];
      // Alternate phase so some drift left→right while others go right→left
      const dir = i % 2 === 0 ? 1 : -1;
      ref.position.set(
        bx + dir * Math.sin(t * freq) * amplitude,
        by + CLOUD_Y_OFFSET,
        bz,
      );
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
      {/* Symmetric fill so Lambert billboards don’t read heavier on one side */}
      <spotLight
        position={[-22, -8, 12]}
        color="red"
        angle={0.17}
        decay={0}
        penumbra={-1}
        intensity={24}
      />
      <spotLight
        position={[22, -8, 12]}
        color="red"
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
          <Cloud
            ref={cloud0}
            {...CLOUD_PRESET}
            seed={1}
            speed={0}
            color="white"
            position={CLOUD_BASE[0]}
          />
          <Cloud
            ref={cloud1}
            {...CLOUD_PRESET}
            seed={2}
            speed={0}
            color="#d0dce8"
            position={CLOUD_BASE[1]}
          />
          <Cloud
            ref={cloud2}
            {...CLOUD_PRESET}
            seed={3}
            speed={0}
            color="#c8d8e8"
            position={CLOUD_BASE[2]}
          />
          <Cloud
            ref={cloud3}
            {...CLOUD_PRESET}
            seed={4}
            speed={0}
            color="#90a8c8"
            position={CLOUD_BASE[3]}
          />
          <Cloud
            ref={cloud4}
            {...CLOUD_PRESET}
            seed={5}
            speed={0}
            color="#b8c8e0"
            position={CLOUD_BASE[4]}
          />
        </Clouds>
      </group>
    </>
  );
}

export function HeroCloudsThree({
  motionRef,
}: {
  motionRef: MutableRefObject<HeroParallaxMotion>;
}) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div
      className="pointer-events-none absolute inset-0 isolate z-1 [&_canvas]:block [&_canvas]:h-full [&_canvas]:w-full"
      aria-hidden
      style={{
        // Opaque stops = visible (same idea as before). Band shifted **down** vs #000 at 0–32%.
        maskImage:
          "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,1) 34%, rgba(0,0,0,0.88) 50%, rgba(0,0,0,0) 62%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,1) 34%, rgba(0,0,0,0.88) 50%, rgba(0,0,0,0) 62%)",
        maskSize: "100% 100%",
        WebkitMaskSize: "100% 100%",
      }}
    >
      <Canvas
        camera={{ position: [0, -10, 10], fov: 75 }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 1.5]}
        style={{ width: "100%", height: "100%" }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <Suspense fallback={null}>
          <HeroCloudScene reducedMotion={reducedMotion} motionRef={motionRef} />
        </Suspense>
      </Canvas>
    </div>
  );
}
