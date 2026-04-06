"use client";

import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { createFbmNoiseTexture } from "@/lib/snow-mountain-atmosphere-textures";

const WISP_COUNT = 8;

type Wisp = {
  sprite: THREE.Sprite;
  vx: number;
  vy: number;
};

function placeOnHemisphere(
  radius: number,
  minPhi: number,
  maxPhi: number,
  out: THREE.Vector3,
): THREE.Vector3 {
  const theta = Math.random() * Math.PI * 2;
  const phi = minPhi + Math.random() * (maxPhi - minPhi);
  const sinPhi = Math.sin(phi);
  out.set(
    radius * sinPhi * Math.cos(theta),
    radius * Math.cos(phi),
    radius * sinPhi * Math.sin(theta),
  );
  return out;
}

type SnowMountainCloudWispsProps = {
  reduceMotion: boolean;
};

export function SnowMountainCloudWisps({ reduceMotion }: SnowMountainCloudWispsProps) {
  const wisps = useMemo(() => {
    const base = createFbmNoiseTexture(512);
    const pos = new THREE.Vector3();
    const result: Wisp[] = [];
    const tints = [
      new THREE.Color("#e2eefc"),
      new THREE.Color("#c8dcf4"),
      new THREE.Color("#d8e8fa"),
      new THREE.Color("#b8d0ec"),
      new THREE.Color("#dceef8"),
      new THREE.Color("#a8c8e8"),
      new THREE.Color("#e8f2fc"),
      new THREE.Color("#c0d4f0"),
    ];
    const radii = [440, 470, 500, 530, 560, 590, 620, 650];

    for (let i = 0; i < WISP_COUNT; i++) {
      const tex = base.clone();
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.offset.set(Math.random(), Math.random());
      tex.needsUpdate = true;

      const mat = new THREE.SpriteMaterial({
        map: tex,
        color: tints[i],
        transparent: true,
        opacity: 0.09 + i * 0.012,
        depthWrite: false,
        depthTest: true,
        blending: THREE.AdditiveBlending,
      });

      const sprite = new THREE.Sprite(mat);
      placeOnHemisphere(radii[i], Math.PI * 0.12, Math.PI * 0.52, pos);
      sprite.position.copy(pos);
      const w = 400 + i * 75;
      const h = 240 + i * 42;
      sprite.scale.set(w, h, 1);
      sprite.renderOrder = -450 + i;

      result.push({
        sprite,
        vx: (0.03 + i * 0.015) * (Math.random() < 0.5 ? 1 : -1),
        vy: (0.02 + i * 0.012) * (Math.random() < 0.5 ? 1 : -1),
      });
    }
    return result;
  }, []);

  useFrame((_, delta) => {
    if (reduceMotion) return;
    for (const { sprite, vx, vy } of wisps) {
      const m = sprite.material as THREE.SpriteMaterial;
      const map = m.map;
      if (!map) continue;
      map.offset.x += vx * delta;
      map.offset.y += vy * delta;
    }
  });

  return (
    <group>
      {wisps.map(({ sprite }, i) => (
        <primitive key={i} object={sprite} />
      ))}
    </group>
  );
}
