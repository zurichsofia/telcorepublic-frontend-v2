"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import {
  Clouds,
  Cloud,
  Sky as SkyImpl,
  calcPosFromAngles,
} from "@react-three/drei";
import type { Sky as SkyMesh } from "three-stdlib";

/**
 * Drei Clouds extend this class - `fog={false}` keeps Exp2 fog from washing billboards
 * to the same color as the mountain haze (they sit far from the camera).
 */
class CloudLambertNoFog extends THREE.MeshLambertMaterial {
  constructor() {
    super();
    this.fog = false;
  }
}

/**
 * Sky shader otherwise picks up scene FogExp2 and reads as flat grey-blue mush.
 * Keep inclination fairly high so the sun stays up — lower values read as dusk (warm rim).
 * Only **azimuth** is nudged vs default 0.1 so the solar disk sits a bit more to the right in the dome.
 */
function SkyWithoutSceneFog() {
  const ref = useRef<SkyMesh | null>(null);
  /* Higher inclination + lower turbidity = less orange/pink at the horizon (overcast-cool read). */
  const sunPosition = useMemo(
    () => calcPosFromAngles(0.66, 0.52),
    [],
  );
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const mat = mesh.material;
    if (mat && typeof mat === "object" && "fog" in mat) {
      (mat as { fog: boolean; }).fog = false;
    }
  }, []);
  return (
    <SkyImpl
      ref={ref}
      distance={6000}
      sunPosition={sunPosition}
      turbidity={7}
      rayleigh={0.45}
      mieCoefficient={0.003}
      mieDirectionalG={0.8}
    />
  );
}

/**
 * Hero-scale: clouds sit behind the Stage-framed mountain (pushed on −Z / +Y).
 * Higher fade so billboards near the camera fade out instead of washing the terrain.
 */
const CLOUD_PRESET = {
  seed: 1,
  segments: 10,
  volume: 6,
  opacity: 0.58,
  fade: 32,
  growth: 4,
  /** 0 = no per-billboard spin (drei multiplies this into rotation); drift is from group position only. */
  speed: 0,
  x: 6,
  y: 1,
  z: 1,
};

/** Off-white billboards read as sunlit tops; slightly softer opacity so they layer over grey. */
const WHITE_CLOUD = {
  ...CLOUD_PRESET,
  opacity: 0.5,
};

/** Darker body / shadow mass — cumulus depth. */
const GREY_CLOUD = {
  ...CLOUD_PRESET,
  opacity: 0.56,
};

/** Shared bounds shorthand */
const BOUNDS_MAIN: [number, number, number] = [
  CLOUD_PRESET.x,
  CLOUD_PRESET.y,
  CLOUD_PRESET.z,
];

/** World offset: back and above the GLB so instances sit in the sky, not in front of the peak. */
const CLOUD_LAYER_POS: [number, number, number] = [0, 42, -120];

/** Horizontal drift amplitude (world units) - back-and-forth, not spin. */
const DRIFT_AMP_X = 22;
const DRIFT_SPEED = 0.11;

type SnowMountainDreiSkyCloudsProps = {
  reduceMotion: boolean;
};

export function SnowMountainDreiSkyClouds({
  reduceMotion,
}: SnowMountainDreiSkyCloudsProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const g = groupRef.current;
    if (!g) return;
    if (reduceMotion) {
      g.position.x = 0;
      g.position.z = 0;
      return;
    }
    const t = state.clock.elapsedTime;
    /* Oscillate along X (and a touch of Z) - reads as wind drift, not orbiting. */
    g.position.x = Math.sin(t * DRIFT_SPEED) * DRIFT_AMP_X;
    g.position.z = Math.sin(t * DRIFT_SPEED * 0.65) * 5;
  });

  return (
    <>
      <SkyWithoutSceneFog />
      <group position={CLOUD_LAYER_POS}>
        <group ref={groupRef}>
          <Clouds material={CloudLambertNoFog} limit={480}>
            {/* Grey — volume and shadow */}
            <Cloud
              {...GREY_CLOUD}
              bounds={BOUNDS_MAIN}
              color="#5c6067"
            />
            <Cloud
              {...GREY_CLOUD}
              bounds={BOUNDS_MAIN}
              color="#4f535a"
              seed={2}
              position={[15, 0, 0]}
            />
            <Cloud
              {...GREY_CLOUD}
              bounds={BOUNDS_MAIN}
              color="#4a4e55"
              seed={3}
              position={[-15, 0, 0]}
            />
            <Cloud
              {...GREY_CLOUD}
              bounds={BOUNDS_MAIN}
              color="#565b62"
              seed={4}
              position={[0, 0, -12]}
            />
            <Cloud
              {...GREY_CLOUD}
              bounds={BOUNDS_MAIN}
              color="#5e636a"
              seed={5}
              position={[0, 0, 12]}
            />
            {/* White / off-white — lit tops and thin wisps (offset +Y / +Z toward sun) */}
            <Cloud
              {...WHITE_CLOUD}
              bounds={[5.2, 0.85, 4.2]}
              color="#f4f6f8"
              seed={11}
              position={[2, 3.5, 8]}
            />
            <Cloud
              {...WHITE_CLOUD}
              bounds={[4.8, 0.75, 3.8]}
              color="#e8ecf0"
              seed={12}
              position={[14, 2.5, 4]}
            />
            <Cloud
              {...WHITE_CLOUD}
              opacity={0.46}
              bounds={[4.5, 0.7, 3.5]}
              color="#eef1f4"
              seed={13}
              position={[-12, 3, 5]}
            />
            <Cloud
              {...WHITE_CLOUD}
              opacity={0.42}
              bounds={[6, 1, 5]}
              color="#fafcfd"
              seed={14}
              position={[0, 4, 10]}
            />
            <Cloud
              {...GREY_CLOUD}
              opacity={0.4}
              bounds={[38, 38, 38]}
              color="#b8bdc4"
              seed={0.25}
              volume={36}
              growth={32}
              concentrate="outside"
              position={[0, 4, -14]}
            />
            <Cloud
              concentrate="outside"
              growth={36}
              color="#3a3f45"
              opacity={0.36}
              seed={0.3}
              bounds={[48, 48, 48]}
              volume={42}
              position={[0, 6, -18]}
            />
          </Clouds>
        </group>
      </group>
    </>
  );
}
