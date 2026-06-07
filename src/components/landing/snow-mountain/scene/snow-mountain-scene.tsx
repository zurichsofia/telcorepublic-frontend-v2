"use client";

import type { MutableRefObject, RefObject } from "react";
import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stage, useBounds, useGLTF } from "@react-three/drei";

// import { SnowMountainForegroundClouds } from "@/components/landing/snow-mountain/scene/snow-mountain-foreground-clouds";
import { SnowMountainSky } from "@/components/landing/snow-mountain/scene/snow-mountain-sky";
import * as THREE from "three";

import { HeroScrollLayoutSync } from "@/components/landing/snow-mountain/scene/hero-scroll-layout-sync";
import type { HeroScrollState } from "@/lib/snow-mountain/hero-scroll-state";
import type { SnowMountainParallaxMotion } from "@/lib/snow-mountain/snow-mountain-parallax-motion";
import { markSceneReady, registerScene } from "@/lib/scene-ready";
import { mapHeroScrollProgress } from "@/lib/snow-mountain/snow-mountain-hero-scroll";
import { cn } from "@/lib/utils";

const SKY_COLOR = "#e8e8e8";
const MODEL_PATH = "/scene/snow_mountain.glb";

/**
 * Applied after Stage Bounds fit — look above center (drops mass), camera up
 * (reinforces), look left of center (mass reads right in frame).
 */
const FRAME_LOOK_AT_Y = 0.2;
const FRAME_LOOK_AT_X = -0.10;
const FRAME_CAMERA_Y = 0.12;
const CAMERA_ADJUST = 0.48;

/** Copy-beat centers on camera progress (primary / telco / mission). */
const SECTION_CENTER_1 = 1 / 6;
const SECTION_CENTER_2 = 1 / 2;
const SECTION_CENTER_3 = 5 / 6;

/**
 * Horizontal orbit (rad) at each copy beat — tune by hand.
 * Keep all three monotonic (all increasing OR all decreasing) so spin never reverses
 * mid-scroll; use LOOK_AT_X / YAW for left-vs-right copy framing.
 */
const ORBIT_SECTION_1 = 0.3;
const ORBIT_SECTION_2 = -0.1;
const ORBIT_SECTION_3 = -1;

/**
 * Extra camera height per beat — fraction of model height (like FRAME_CAMERA_Y).
 * Raises the viewpoint; mountain sits lower in frame.
 */
const LIFT_SECTION_1 = 0.1;
const LIFT_SECTION_2 = -0.1;
const LIFT_SECTION_3 = 0;

/**
 * Look-at shifts up per beat — fraction of model height (like FRAME_LOOK_AT_Y).
 * Tilts gaze toward the sky / horizon so you see more “beyond” the mass.
 */
const LOOK_UP_SECTION_1 = 0.1;
const LOOK_UP_SECTION_2 = 0.1;
const LOOK_UP_SECTION_3 = 0;

/**
 * Pivot X shift per beat — fraction of model width (like FRAME_LOOK_AT_X).
 * Positive = look-at moves right = mountain mass reads LEFT (clears right-aligned telco copy).
 */
const LOOK_AT_X_SECTION_1 = 0;
const LOOK_AT_X_SECTION_2 = 0.14;
const LOOK_AT_X_SECTION_3 = 0;

/**
 * Small post-orbit yaw (rad) — framing nudge without huge orbit swings (v1-style).
 * Positive = mountain drifts right in frame; negative = left.
 */
const YAW_SECTION_1 = 0.14;
const YAW_SECTION_2 = -0.15;
const YAW_SECTION_3 = 0;

const WORLD_UP = new THREE.Vector3(0, 1, 0);

/**
 * Orbit radius scale per beat (1 = baseline). >1 pulls the camera back (zoom out).
 */
const DOLLY_SECTION_1 = 1;
const DOLLY_SECTION_2 = 1;
const DOLLY_SECTION_3 = 0.5;

/**
 * FOV delta (degrees) per beat on top of the Canvas base FOV. Positive = wider = zoom out.
 */
const FOV_SECTION_1 = 0;
const FOV_SECTION_2 = 0;
const FOV_SECTION_3 = 0;

function smoothstep(edge0: number, edge1: number, x: number): number {
  if (x <= edge0) return 0;
  if (x >= edge1) return 1;
  const u = (x - edge0) / (edge1 - edge0);
  return u * u * (3 - 2 * u);
}

/** Smooth blend between three hand-tuned section values. */
function v2SectionBlend(t: number, v1: number, v2: number, v3: number): number {
  if (t <= SECTION_CENTER_1) return v1;
  if (t <= SECTION_CENTER_2) {
    const u = smoothstep(SECTION_CENTER_1, SECTION_CENTER_2, t);
    return v1 + (v2 - v1) * u;
  }
  if (t <= SECTION_CENTER_3) {
    const u = smoothstep(SECTION_CENTER_2, SECTION_CENTER_3, t);
    return v2 + (v3 - v2) * u;
  }
  return v3;
}

useGLTF.preload(MODEL_PATH);
registerScene();

function SnowMountainV2Model() {
  const { scene } = useGLTF(MODEL_PATH);

  useEffect(() => {
    markSceneReady();
  }, []);

  return <primitive object={scene} />;
}

/** Frame nudge once, then orbit camera in XZ around the look-at pivot on scroll. */
function V2ScrollCamera({
  scrollState,
  reduceMotion,
}: {
  scrollState?: HeroScrollState;
  reduceMotion: boolean;
}) {
  const bounds = useBounds();
  const camera = useThree((s) => s.camera);
  const framed = useRef(false);
  const waitFrames = useRef(0);
  const pivotRef = useRef<THREE.Vector3 | null>(null);
  const basePosRef = useRef<THREE.Vector3 | null>(null);
  const baseFovRef = useRef<number | null>(null);
  const modelHeightRef = useRef(1);
  const modelWidthRef = useRef(1);
  const lookAt = useMemo(() => new THREE.Vector3(), []);
  const posScratch = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    if (!(camera instanceof THREE.PerspectiveCamera)) return;

    const { center, size } = bounds.getSize();
    if (size.y < 1e-6) return;

    if (!framed.current) {
      waitFrames.current += 1;
      if (waitFrames.current < 4) return;

      const target = center.clone();
      target.y += size.y * FRAME_LOOK_AT_Y;
      target.x += size.x * FRAME_LOOK_AT_X;
      bounds.lookAt({ target });
      camera.position.y += size.y * FRAME_CAMERA_Y;
      camera.updateProjectionMatrix();

      pivotRef.current = target;
      basePosRef.current = camera.position.clone();
      baseFovRef.current = camera.fov;
      modelHeightRef.current = size.y;
      modelWidthRef.current = size.x;
      framed.current = true;
      return;
    }

    const pivot = pivotRef.current;
    const base = basePosRef.current;
    const baseFov = baseFovRef.current;
    if (!pivot || !base || baseFov == null) return;

    const raw = scrollState?.get() ?? 0;
    const t = reduceMotion ? 0 : mapHeroScrollProgress(raw);
    const h = modelHeightRef.current;
    const w = modelWidthRef.current;

    const orbitRad = v2SectionBlend(t, ORBIT_SECTION_1, ORBIT_SECTION_2, ORBIT_SECTION_3);
    const liftY = v2SectionBlend(t, LIFT_SECTION_1, LIFT_SECTION_2, LIFT_SECTION_3) * h;
    const lookUpY =
      v2SectionBlend(t, LOOK_UP_SECTION_1, LOOK_UP_SECTION_2, LOOK_UP_SECTION_3) * h;
    const lookAtX =
      v2SectionBlend(t, LOOK_AT_X_SECTION_1, LOOK_AT_X_SECTION_2, LOOK_AT_X_SECTION_3) * w;
    const yaw = v2SectionBlend(t, YAW_SECTION_1, YAW_SECTION_2, YAW_SECTION_3);
    const dolly = v2SectionBlend(t, DOLLY_SECTION_1, DOLLY_SECTION_2, DOLLY_SECTION_3);
    const fovDelta = v2SectionBlend(t, FOV_SECTION_1, FOV_SECTION_2, FOV_SECTION_3);

    const dx = base.x - pivot.x;
    const dz = base.z - pivot.z;
    let r = Math.hypot(dx, dz);
    if (r < 0.02) r = 0.02;
    r *= dolly;

    const theta0 = Math.atan2(dx, dz);
    const theta = theta0 + orbitRad;
    posScratch.set(
      pivot.x + r * Math.sin(theta),
      base.y + liftY,
      pivot.z + r * Math.cos(theta),
    );
    camera.position.copy(posScratch);
    lookAt.set(pivot.x + lookAtX, pivot.y + lookUpY, pivot.z);
    camera.lookAt(lookAt);
    if (yaw !== 0) camera.rotateOnWorldAxis(WORLD_UP, yaw);
    camera.fov = baseFov + fovDelta;
    camera.updateProjectionMatrix();
  });

  return null;
}

export type SnowMountainV2SimpleSceneProps = {
  className?: string;
  scrollState?: HeroScrollState;
  heroSectionRef?: RefObject<HTMLElement | null>;
  motionRef?: MutableRefObject<SnowMountainParallaxMotion>;
  reduceMotion?: boolean;
};

/** Minimal preview: blue sky, Stage auto-fit, model centered on camera. */
export function SnowMountainV2SimpleScene({
  className,
  scrollState,
  heroSectionRef,
  motionRef,
  reduceMotion = false,
}: SnowMountainV2SimpleSceneProps) {
  const syncScroll =
    scrollState != null && heroSectionRef != null && motionRef != null;

  return (
    <div className={cn("relative h-full w-full", className)}>
      <Canvas
        className="absolute inset-0 h-full w-full touch-none"
        camera={{ fov: 40, near: 0.1, far: 500 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.setClearColor(new THREE.Color(SKY_COLOR), 1);
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1;
        }}
      >
        <SnowMountainSky reduceMotion={reduceMotion} />

        {syncScroll ? (
          <HeroScrollLayoutSync
            sectionRef={heroSectionRef}
            scrollState={scrollState}
            motionRef={motionRef}
            reduceMotion={reduceMotion}
          />
        ) : null}
        <hemisphereLight args={["#b8d4f0", "#5a6a7a", 3]} />
        <ambientLight intensity={0.50} color="#f0f6ff" />
        <directionalLight
          position={[14, 28, 12]}
          intensity={0.75}
          color="#fff4e6"
        />


        <Suspense fallback={null}>
          <Stage
            adjustCamera={CAMERA_ADJUST}
            intensity={0.55}
            shadows={false}
            environment={null}
            preset="soft"
            // @ts-expect-error Bounds props forwarded from Stage
            observe={false}
            maxDuration={0}
          >
            <SnowMountainV2Model />
            <V2ScrollCamera
              scrollState={scrollState}
              reduceMotion={reduceMotion}
            />
            {/* <SnowMountainForegroundClouds reduceMotion={reduceMotion} /> */}
          </Stage>
        </Suspense>
      </Canvas>
    </div>
  );
}
