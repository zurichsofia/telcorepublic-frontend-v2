"use client";

import { useMemo } from "react";
import * as THREE from "three";

import { createRadialNebulaTexture } from "@/lib/snow-mountain-atmosphere-textures";

const LAYER_COUNT = 4;

function randomOnSphere(radius: number, out: THREE.Vector3): THREE.Vector3 {
  const u = Math.random();
  const v = Math.random();
  const theta = u * Math.PI * 2;
  const phi = Math.acos(2 * v - 1);
  const sinPhi = Math.sin(phi);
  out.set(
    radius * sinPhi * Math.cos(theta),
    radius * Math.cos(phi),
    radius * sinPhi * Math.sin(theta),
  );
  return out;
}

export function SnowMountainNebula() {
  const sprites = useMemo(() => {
    const map = createRadialNebulaTexture(256);
    const tints = [
      new THREE.Color("#9ec4f0"),
      new THREE.Color("#b8d4f6"),
      new THREE.Color("#7eb0e4"),
      new THREE.Color("#a8cef2"),
    ];
    const radii = [520, 580, 640, 700];
    const scales = [420, 480, 540, 600];
    const result: THREE.Sprite[] = [];
    const pos = new THREE.Vector3();

    for (let i = 0; i < LAYER_COUNT; i++) {
      randomOnSphere(radii[i], pos);
      const mat = new THREE.SpriteMaterial({
        map,
        color: tints[i],
        transparent: true,
        opacity: 0.06 + i * 0.022,
        depthWrite: false,
        depthTest: true,
        blending: THREE.NormalBlending,
      });
      const sprite = new THREE.Sprite(mat);
      sprite.position.copy(pos);
      sprite.scale.set(scales[i], scales[i], 1);
      sprite.renderOrder = -800 + i;
      result.push(sprite);
    }
    return result;
  }, []);

  return (
    <group>
      {sprites.map((sprite, i) => (
        <primitive key={i} object={sprite} />
      ))}
    </group>
  );
}
