"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import type { SceneQuality } from "@/lib/snow-mountain/scene-quality";
import {
  snowMountainSkyFragmentShader,
  snowMountainSkyVertexShader,
} from "@/lib/snow-mountain/snow-mountain-sky-shader";

const SKY_RADIUS = 480;
const SKY_SEGMENTS: Record<SceneQuality, [number, number]> = {
  desktop: [64, 40],
  mobile: [64, 40],
  low: [48, 28],
};

/** 1 = default drift; raise for faster cloud motion. */
const CLOUD_DRIFT_SPEED = 0.25;

/** Matches legacy drei Sky sun vector — high Y reads as midday alpine light. */
const SUN_POSITION = new THREE.Vector3(1, 200, 1).normalize();

type SnowMountainSkyProps = {
  quality?: SceneQuality;
  reduceMotion?: boolean;
};

/** Infinite sky dome with procedural clouds and soft sun (follows camera). */
export function SnowMountainSky({
  quality = "desktop",
  reduceMotion = false,
}: SnowMountainSkyProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [widthSegments, heightSegments] = SKY_SEGMENTS[quality];

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uCloudSpeed: { value: CLOUD_DRIFT_SPEED },
      uSunPosition: { value: SUN_POSITION.clone() },
      uHorizonColor: { value: new THREE.Color("#c9c9c9") },
      uZenithColor: { value: new THREE.Color("#9eabb6") },
      uSunColor: { value: new THREE.Color("#fff6e8") },
      uCloudColor: { value: new THREE.Color("#f2f5f8") },
    }),
    [],
  );

  useFrame(({ camera }, delta) => {
    const mesh = meshRef.current;
    if (mesh) mesh.position.copy(camera.position);

    if (!reduceMotion) {
      uniforms.uTime.value += delta;
    }
  });

  return (
    <mesh ref={meshRef} frustumCulled={false} renderOrder={-2}>
      <sphereGeometry args={[SKY_RADIUS, widthSegments, heightSegments]} />
      <shaderMaterial
        side={THREE.BackSide}
        depthWrite={false}
        fog={false}
        uniforms={uniforms}
        vertexShader={snowMountainSkyVertexShader}
        fragmentShader={snowMountainSkyFragmentShader}
      />
    </mesh>
  );
}
