"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import { createSoftCircleTexture } from "@/lib/snow-mountain-atmosphere-textures";

const COUNT = 3400;

const COL_SKY = new THREE.Color(0.72, 0.86, 0.98);
const COL_MIST = new THREE.Color(0.62, 0.78, 0.94);
const COL_BRIGHT = new THREE.Color(0.88, 0.94, 1);

const BOUND = 320;
const RANGE = BOUND * 2;

type WindParticleFieldProps = {
  reduceMotion: boolean;
};

/** High-altitude ice crystals / airborne snow — reads as wind, not stars. */
export function WindParticleField({ reduceMotion }: WindParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);

  const { geometry, material, speeds, phases } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const spd = new Float32Array(COUNT);
    const ph = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * RANGE;
      positions[i * 3 + 1] = 90 + Math.random() * 340;
      positions[i * 3 + 2] = (Math.random() - 0.5) * RANGE;

      const pick = Math.random();
      const c =
        pick < 0.42 ? COL_BRIGHT : pick < 0.78 ? COL_SKY : COL_MIST;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      spd[i] = 0.55 + Math.random() * 0.95;
      ph[i] = Math.random() * Math.PI * 2;
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geom.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const map = createSoftCircleTexture(64);
    const mat = new THREE.PointsMaterial({
      size: 1.45,
      vertexColors: true,
      map,
      transparent: true,
      opacity: 0.38,
      alphaTest: 0.03,
      sizeAttenuation: true,
      depthWrite: false,
      depthTest: true,
      blending: THREE.NormalBlending,
      fog: false,
    });

    return { geometry: geom, material: mat, speeds: spd, phases: ph };
  }, []);

  useFrame((state, delta) => {
    const pts = pointsRef.current;
    if (!pts || reduceMotion) return;
    const pos = pts.geometry.attributes.position as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;
    const t = state.clock.elapsedTime;
    const dt = Math.min(delta, 0.05);

    const windX = 42;
    const windZ = 9;

    for (let i = 0; i < COUNT; i++) {
      const ix = i * 3;
      const sp = speeds[i]!;
      arr[ix] += (windX + Math.sin(t * 0.31 + phases[i]!) * 6) * sp * dt;
      arr[ix + 1] +=
        Math.sin(t * 0.55 + phases[i]! * 1.7) * 0.35 * dt * sp * 18;
      arr[ix + 2] +=
        (windZ + Math.cos(t * 0.22 + phases[i]!) * 4) * sp * dt;

      if (arr[ix]! > BOUND) arr[ix] -= RANGE;
      if (arr[ix]! < -BOUND) arr[ix] += RANGE;
      if (arr[ix + 2]! > BOUND) arr[ix + 2] -= RANGE;
      if (arr[ix + 2]! < -BOUND) arr[ix + 2] += RANGE;
    }
    pos.needsUpdate = true;
  });

  return (
    <group renderOrder={-200}>
      <points
        ref={pointsRef}
        geometry={geometry}
        material={material}
        frustumCulled={false}
      />
    </group>
  );
}
