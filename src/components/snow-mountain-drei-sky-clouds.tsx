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
 * Keep **inclination ~0.6** (drei default) so the sun stays high - lower values look like dusk/midnight.
 * Only **azimuth** is nudged vs default 0.1 so the solar disk sits a bit more to the right in the dome.
 */
function SkyWithoutSceneFog() {
  const ref = useRef<SkyMesh | null>(null);
  const sunPosition = useMemo(
    () => calcPosFromAngles(0.6, 0.52),
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
      turbidity={8}
      rayleigh={0.5}
      mieCoefficient={0.005}
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
  /** Darker desaturated purples (read as storm / dusk against blue sky). */
  color: "#6b5a7a" as const,
};

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

  const { x, y, z, color, ...config } = CLOUD_PRESET;

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
          <Clouds material={CloudLambertNoFog} limit={400}>
            <Cloud {...config} bounds={[x, y, z]} color={color} />
            <Cloud
              {...config}
              bounds={[x, y, z]}
              color="#5a4a68"
              seed={2}
              position={[15, 0, 0]}
            />
            <Cloud
              {...config}
              bounds={[x, y, z]}
              color="#4d3f5c"
              seed={3}
              position={[-15, 0, 0]}
            />
            <Cloud
              {...config}
              bounds={[x, y, z]}
              color="#554466"
              seed={4}
              position={[0, 0, -12]}
            />
            <Cloud
              {...config}
              bounds={[x, y, z]}
              color="#5c4a6e"
              seed={5}
              position={[0, 0, 12]}
            />
            <Cloud
              concentrate="outside"
              growth={36}
              color="#3d2f4a"
              opacity={0.38}
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
