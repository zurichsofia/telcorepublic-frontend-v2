"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const FRAG = /* glsl */ `
precision highp float;
uniform float uTime;
uniform vec2 uResolution;
uniform float uOpacity;
uniform float uStaticAmount;
varying vec2 vUv;

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float hash3(vec3 p3) {
  p3 = fract(p3 * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

void main() {
  vec2 uv = vUv * uResolution;
  vec2 cell = floor(uv);

  float t = uTime * 85.0;
  float flick = hash3(vec3(cell, floor(t * 0.5)));
  vec2 jitter = vec2(
    hash(cell + vec2(t * 3.17, t * 1.91)),
    hash(cell.yx + vec2(t * 2.71, t * 4.03))
  ) * 2.0 - 1.0;

  float n1 = hash(cell + jitter * 12.0 + vec2(t * 47.0, t * 29.0));
  float n2 = hash(cell.yx + vec2(19.0, 7.0) + vec2(t * 31.0, -t * 41.0));
  float n3 = hash(cell + vec2(-t * 53.0, t * 23.0));
  float gray = (n1 * 0.5 + n2 * 0.28 + n3 * 0.22) * (0.72 + 0.28 * flick);

  float scan = sin(uv.y * 3.14159 * uResolution.y * 0.5 + t * 2.0) * 0.5 + 0.5;
  gray = mix(gray, gray * (0.88 + 0.12 * scan), 0.08);

  float a = uOpacity * mix(1.0, gray + 0.15, uStaticAmount);
  gl_FragColor = vec4(vec3(gray), a);
}
`;

type TvStaticGrainProps = {
  className?: string;
  /** Overall layer strength (alpha into blend). */
  opacity?: number;
  /** How strongly the animated snow reads vs. a softer grain. */
  staticAmount?: number;
};

export function TvStaticGrain({
  className = "",
  opacity = 0.22,
  staticAmount = 0.92,
}: TvStaticGrainProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const reducedRef = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uOpacity: { value: opacity },
      uStaticAmount: { value: staticAmount },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const setSize = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      renderer.setSize(w, h, false);
      uniforms.uResolution.value.set(w * renderer.getPixelRatio(), h * renderer.getPixelRatio());
    };

    el.appendChild(renderer.domElement);
    const canvas = renderer.domElement;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";

    setSize();
    const ro = new ResizeObserver(setSize);
    ro.observe(el);

    const clock = new THREE.Clock();

    const tick = () => {
      if (reducedRef.current) {
        uniforms.uTime.value = 0;
      } else {
        uniforms.uTime.value = clock.getElapsedTime();
      }
      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (canvas.parentNode === el) el.removeChild(canvas);
    };
  }, [opacity, staticAmount]);

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none absolute inset-0 z-2 mix-blend-overlay ${className}`}
      aria-hidden
    />
  );
}
