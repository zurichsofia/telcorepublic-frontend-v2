"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";

/** Mid-distance field above the terrain - reads as precision data, not decoration. */
const COUNT = 4200;

const vertexShader = /* glsl */ `
  attribute float aPhase;
  attribute float aSize;
  attribute float aPulse;
  uniform float uTime;
  uniform float uReduce;
  varying float vPulse;

  void main() {
    float t = uTime;
    float p = aPhase;
    float slow = sin(t * 0.35 + p) * 0.5 + 0.5;
    float mid = sin(t * 0.9 + p * 2.1) * 0.5 + 0.5;
    float pulse = mix(0.55, 1.0, slow * 0.55 + mid * 0.45);
    pulse = mix(0.72, pulse, aPulse);
    if (uReduce > 0.5) pulse = 0.92;
    vPulse = pulse;

    vec3 wind = vec3(
      sin(t * 0.22 + p * 0.7) * 1.8 + sin(t * 0.09 + p * 1.3) * 1.1,
      cos(t * 0.31 + p * 1.1) * 0.65,
      cos(t * 0.19 + p * 0.65) * 1.2 + sin(t * 0.15 + p * 0.9) * 0.9
    );
    vec3 pos = position + wind * (1.0 - uReduce);

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    float scale = 120.0 / max(-mvPosition.z, 2.5);
    gl_PointSize = clamp(aSize * scale * 1.8, 1.2, 64.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = /* glsl */ `
  varying float vPulse;

  void main() {
    vec2 q = gl_PointCoord - 0.5;
    float d = length(q) * 2.0;
    float core = 1.0 - smoothstep(0.2, 0.95, d);
    float soft = exp(-d * 5.5) * 0.45;
    float a = (core * 0.88 + soft) * vPulse;
    if (a < 0.012) discard;
    vec3 col = mix(vec3(0.62, 0.78, 0.96), vec3(0.88, 0.94, 1.0), core);
    gl_FragColor = vec4(col, a * 0.38);
  }
`;

type AtmosphericParticlesProps = {
  reduceMotion: boolean;
};

export function AtmosphericParticles({ reduceMotion }: AtmosphericParticlesProps) {
  const { geometry, shaderMaterial } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const phases = new Float32Array(COUNT);
    const sizes = new Float32Array(COUNT);
    const pulses = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.PI * 0.18 + Math.random() * Math.PI * 0.42;
      const r = 28 + Math.random() * 95;
      const sinPhi = Math.sin(phi);
      positions[i * 3] = r * sinPhi * Math.cos(theta);
      positions[i * 3 + 1] = -4 + Math.random() * 32;
      positions[i * 3 + 2] = r * sinPhi * Math.sin(theta);
      phases[i] = Math.random() * Math.PI * 2;
      sizes[i] = 0.45 + Math.random() * 1.35;
      pulses[i] = 0.25 + Math.random() * 0.75;
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geom.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    geom.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geom.setAttribute("aPulse", new THREE.BufferAttribute(pulses, 1));

    const mat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uReduce: { value: 0 },
      },
      transparent: true,
      depthWrite: false,
      depthTest: true,
      blending: THREE.AdditiveBlending,
      fog: false,
    });

    return { geometry: geom, shaderMaterial: mat };
  }, []);

  useFrame((state) => {
    shaderMaterial.uniforms.uTime.value = state.clock.elapsedTime;
    shaderMaterial.uniforms.uReduce.value = reduceMotion ? 1 : 0;
  });

  return (
    <points
      geometry={geometry}
      material={shaderMaterial}
      frustumCulled={false}
      renderOrder={1}
    />
  );
}
