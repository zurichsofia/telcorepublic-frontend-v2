"use client";

import {
  Suspense,
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useEffect,
  type MutableRefObject,
  type RefObject,
  type ReactNode,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stage, useGLTF } from "@react-three/drei";
import { useReducedMotion } from "motion/react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

import * as THREE from "three";
import { setConsoleFunction } from "three";

// @react-three/fiber 9.x creates `new THREE.Clock()` internally and hasn't yet
// migrated to THREE.Timer. Suppress that one deprecation so the console stays clean
// while keeping all other Three.js warnings/errors visible.
setConsoleFunction((type, message, ...params) => {
  if (type === "warn" && typeof message === "string" && message.includes("THREE.Clock")) return;
  if (type === "warn") console.warn(message, ...params);
  else if (type === "error") console.error(message, ...params);
  else console.log(message, ...params);
});

import { SNOW_MOUNTAIN_FOG_COLOR } from "@/lib/snow-mountain-fog";
import { readHeroScrollProgress } from "@/lib/snow-mountain-hero-scroll";
import { applyTerrainIceStyle } from "@/lib/snow-mountain-terrain-ice";
// import { SnowMountainDreiSkyClouds } from "@/components/snow-mountain-drei-sky-clouds";
import { AtmosphericParticles } from "@/components/snow-mountain-atmospheric-particles";
import { markSceneReady, registerScene } from "@/lib/scene-ready";

import { cn } from "@/lib/utils";
import {
  HeroCloudsThree,
  type HeroParallaxMotion,
} from "./landing/hero-clouds-three";

/** Extra Y rotation (rad) on the outer rig by end of hero — small orbit / spin with scroll. */
const HERO_SCROLL_YAW_RAD = 0.42;

/** Additional terrain Y spin (rad at t=1), combines with the yaw rig above. */
const HERO_SCROLL_TERRAIN_YAW_EXTRA = 0.14;

useGLTF.preload("/scene/snow_mountain.glb");
// Tell the PageLoader it must wait for this scene before dismissing.
registerScene();

type HeroScrollRead = { getRawProgress: () => number; };

/** `getRawProgress()` inside `useFrame` — reads hero layout (same formula as CSS scroll sync). */
const HeroScrollReadContext = createContext<HeroScrollRead | null>(null);

const FALLBACK_SCROLL_PROGRESS: MutableRefObject<number> = { current: 0 };

function clamp01(p: number): number {
  if (p <= 0) return 0;
  if (p >= 1) return 1;
  return p;
}

/** Base Y rotation (rad) for the terrain rig; scroll adds a small delta on top. */
const BASE_TERRAIN_YAW_RAD = 1;

/**
 * World-space X of the look-at target. Positive X looks “past” the peak to the right → empty
 * space on the right of the frame. Negative X by end of scroll recenters mass and hides that gap.
 */
const CAMERA_LOOK_AT_X_START = 0;
const CAMERA_LOOK_AT_X_END = -0.14;

/** Tiny upward look-at nudge at end of hero — reads as a minimal perspective lift, not a tilt. */
const CAMERA_LOOK_AT_Y_START = 0;
const CAMERA_LOOK_AT_Y_END = 0.3;

/** Negative = slightly narrower FOV at end of hero → crops sides / less empty periphery. */
const HERO_SCROLL_ZOOM_FOV_DELTA = -3.8;

/**
 * Added to Stage’s fitted camera position by scroll progress (world space).
 * Negative X drifts the eye left so the terrain fills the right side of the frame (no open gap).
 */
const CAMERA_SCROLL_OFFSET_X = -0.65;
const CAMERA_SCROLL_OFFSET_Y = 4.25;
const CAMERA_SCROLL_OFFSET_Z = 2.1;

/** Sky/clouds opt out of fog; terrain shaders still carry haze — a touch more = softer horizon blend. */
const FOG_EXP_BASE = 0.026;
const FOG_EXP_BREATH = 0.0028;

function BreathingFogExp2({ reduceMotion }: { reduceMotion: boolean; }) {
  const scene = useThree((s) => s.scene);

  useFrame(({ clock }) => {
    const fog = scene.fog;
    if (!fog || !(fog instanceof THREE.FogExp2)) return;
    if (reduceMotion) {
      fog.density = FOG_EXP_BASE;
      return;
    }
    fog.density =
      FOG_EXP_BASE + Math.sin(clock.elapsedTime * 0.11) * FOG_EXP_BREATH;
  });

  return (
    <fogExp2 attach="fog" args={[new THREE.Color(SNOW_MOUNTAIN_FOG_COLOR), FOG_EXP_BASE]} />
  );
}

/**
 * After Bounds fit: FOV + look-at + world position offset → scroll toward a higher, more top-down read.
 * Base position/FOV are captured once per layout (reset when canvas size changes).
 */
function HeroScrollCameraFraming({ reduceMotion }: { reduceMotion: boolean; }) {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const scrollRead = useContext(HeroScrollReadContext);
  const baseFovRef = useRef<number | null>(null);
  const basePosRef = useRef<THREE.Vector3 | null>(null);
  const lastSizeRef = useRef({ w: 0, h: 0 });
  const lookAt = useMemo(() => new THREE.Vector3(), []);
  const posScratch = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    if (!(camera instanceof THREE.PerspectiveCamera)) return;

    const { width, height } = size;
    if (width !== lastSizeRef.current.w || height !== lastSizeRef.current.h) {
      lastSizeRef.current = { w: width, h: height };
      baseFovRef.current = null;
      basePosRef.current = null;
    }

    if (baseFovRef.current === null) baseFovRef.current = camera.fov;
    if (basePosRef.current === null) basePosRef.current = camera.position.clone();

    const base = baseFovRef.current;
    const p = scrollRead?.getRawProgress() ?? 0;
    const t = reduceMotion ? 0 : clamp01(p);

    const { x: bx, y: by, z: bz } = basePosRef.current;
    posScratch.set(bx, by, bz);
    posScratch.x += t * CAMERA_SCROLL_OFFSET_X;
    posScratch.y += t * CAMERA_SCROLL_OFFSET_Y;
    posScratch.z += t * CAMERA_SCROLL_OFFSET_Z;
    camera.position.copy(posScratch);

    camera.fov = base + t * HERO_SCROLL_ZOOM_FOV_DELTA;
    camera.updateProjectionMatrix();
    const x = THREE.MathUtils.lerp(
      CAMERA_LOOK_AT_X_START,
      CAMERA_LOOK_AT_X_END,
      t,
    );
    const y = THREE.MathUtils.lerp(
      CAMERA_LOOK_AT_Y_START,
      CAMERA_LOOK_AT_Y_END,
      t,
    );
    lookAt.set(x, y, 0);
    camera.lookAt(lookAt);
  }, 50);
  return null;
}

/**
 * Two-rig design keeps scroll-preset positions and mouse tracking completely
 * independent so they never fight each other's lerp targets:
 *
 *   scrollRigRef  – driven exclusively by smooth scroll progress (preset positions).
 *     mouseRigRef – driven exclusively by mouse direction (parallax overlay).
 *       yawRigRef – additional scroll-driven yaw preset.
 *
 * Separating them means scrolling never causes mouse lag artefacts and vice-versa.
 */
function ParallaxWorld({
  reduceMotion,
  children,
}: {
  reduceMotion: boolean;
  children: ReactNode;
}) {
  const scrollRigRef = useRef<THREE.Group>(null);
  const mouseRigRef = useRef<THREE.Group>(null);
  const yawRigRef = useRef<THREE.Group>(null);

  const mouse = useRef({ x: 0, y: 0 });
  const smoothMouse = useRef({ x: 0, y: 0 });
  const scrollRead = useContext(HeroScrollReadContext);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame((_, delta) => {
    const scrollRig = scrollRigRef.current;
    const mouseRig = mouseRigRef.current;
    const yaw = yawRigRef.current;
    if (!scrollRig || !mouseRig || !yaw) return;

    const p = scrollRead?.getRawProgress() ?? 0;
    const t = reduceMotion ? 0 : clamp01(p);

    if (reduceMotion) {
      scrollRig.rotation.set(0, 0, 0);
      mouseRig.rotation.set(0, 0, 0);
      yaw.rotation.y = 0;
      return;
    }

    scrollRig.rotation.x = t * 0.05;
    scrollRig.rotation.y = t * 0.052;
    yaw.rotation.y = t * HERO_SCROLL_YAW_RAD;

    // Mouse parallax — independent lerp, faster for a more direct feel.
    // This adds a subtle offset on top of the scroll position without disturbing it.
    const mouseLerp = 1 - Math.pow(0.88, delta * 60);
    smoothMouse.current.x += (mouse.current.x - smoothMouse.current.x) * mouseLerp;
    smoothMouse.current.y += (mouse.current.y - smoothMouse.current.y) * mouseLerp;
    mouseRig.rotation.x = smoothMouse.current.y * -0.038;
    mouseRig.rotation.y = smoothMouse.current.x * 0.042;
  });

  return (
    <group ref={scrollRigRef}>
      <group ref={mouseRigRef}>
        <group ref={yawRigRef}>{children}</group>
      </group>
    </group>
  );
}

/** Soft point light along the camera ray through the cursor - reads as a handheld beam on the snow. */
function CursorWorldLight({ reduceMotion }: { reduceMotion: boolean; }) {
  const lightRef = useRef<THREE.PointLight>(null);
  const raw = useRef({ x: 0, y: 0 });
  const smooth = useRef({ x: 0, y: 0 });
  const scratch = useMemo(
    () => ({
      v: new THREE.Vector3(),
      dir: new THREE.Vector3(),
    }),
    [],
  );

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      raw.current.x = (e.clientX / w) * 2 - 1;
      raw.current.y = -(e.clientY / h) * 2 + 1;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const camera = useThree((s) => s.camera);

  useFrame((_, delta) => {
    const light = lightRef.current;
    if (!light) return;
    if (reduceMotion) {
      light.intensity = 0;
      return;
    }
    const lerp = 1 - Math.pow(0.9, delta * 60);
    smooth.current.x += (raw.current.x - smooth.current.x) * lerp;
    smooth.current.y += (raw.current.y - smooth.current.y) * lerp;

    const { v, dir } = scratch;
    v.set(smooth.current.x, smooth.current.y, 0.5);
    v.unproject(camera);
    dir.copy(v).sub(camera.position).normalize();
    /* Sit between camera and terrain so the beam grazes the landscape. */
    const dist = 26;
    light.position.copy(camera.position).add(dir.multiplyScalar(dist));
    /* Grazing highlight — keep below key sun so snow doesn’t stack into overexposure. */
    light.intensity = 0.22;
  }, 55);

  return (
    <pointLight
      ref={lightRef}
      color="#E4EAEE"
      intensity={0}
      distance={110}
      decay={1.85}
    />
  );
}

function SnowMountainModel({ reduceMotion }: { reduceMotion: boolean; }) {
  const gltf = useGLTF("/scene/snow_mountain.glb");
  const rigRef = useRef<THREE.Group>(null);
  const scrollRead = useContext(HeroScrollReadContext);

  useLayoutEffect(() => {
    applyTerrainIceStyle(gltf.scene);
  }, [gltf]);

  // Signal the PageLoader that the GLB has loaded and the model is mounted.
  useEffect(() => {
    markSceneReady();
  }, []);

  useFrame(() => {
    const p = scrollRead?.getRawProgress() ?? 0;
    const t = reduceMotion ? 0 : clamp01(p);
    if (rigRef.current) {
      rigRef.current.rotation.set(
        t * 0.025,
        BASE_TERRAIN_YAW_RAD + t * HERO_SCROLL_TERRAIN_YAW_EXTRA,
        t * -0.012,
      );
    }
  });

  return (
    <group ref={rigRef}>
      <primitive object={gltf.scene} />
    </group>
  );
}

function PostFx({ enabled }: { enabled: boolean; }) {
  if (!enabled) return null;
  return (
    <EffectComposer multisampling={4} enableNormalPass={false}>
      <Bloom
        luminanceThreshold={0.985}
        luminanceSmoothing={0.14}
        intensity={0.004}
        mipmapBlur
      />
    </EffectComposer>
  );
}

const FALLBACK_PARALLAX_MOTION: MutableRefObject<HeroParallaxMotion> = {
  current: { x: 0, y: 0, scale: 1 },
};

export type SnowMountainSceneProps = {
  /** Hero `<section>` ref — progress is read from layout every R3F frame (continuous with scroll). */
  heroSectionRef?: RefObject<HTMLElement | null>;
  /** Mirrored progress for non-WebGL consumers (updated on scroll/resize in hero). */
  scrollProgressRef?: MutableRefObject<number>;
  /** Shared with CSS `--sm-primary-x` / `--sm-primary-y` so WebGL clouds track the same parallax. */
  motionRef?: MutableRefObject<HeroParallaxMotion>;
  className?: string;
};

export function SnowMountainScene({
  heroSectionRef,
  scrollProgressRef,
  motionRef,
  className,
}: SnowMountainSceneProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const rawScrollRef = scrollProgressRef ?? FALLBACK_SCROLL_PROGRESS;
  const parallaxMotionRef = motionRef ?? FALLBACK_PARALLAX_MOTION;

  const scrollRead = useMemo((): HeroScrollRead => {
    return {
      getRawProgress: () => {
        if (reduceMotion) return 0;
        const el = heroSectionRef?.current ?? null;
        if (el) return readHeroScrollProgress(el);
        return rawScrollRef.current;
      },
    };
  }, [reduceMotion, heroSectionRef, rawScrollRef]);

  /* `HeroCloudsThree` uses its own `<Canvas>` — must not nest inside this Canvas (R3F rejects it). */
  return (
    <div className={cn("relative h-full min-h-dvh w-full", className)}>
      <Canvas
        className="absolute inset-0 h-full w-full touch-none"
        camera={{ fov: 28, near: 0.1, far: 500 }}
        dpr={[1, 2]}
        resize={{
          scroll: false,
          debounce: { scroll: 0, resize: 0 },
        }}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(new THREE.Color(SNOW_MOUNTAIN_FOG_COLOR), 1);
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          /* Exposure after fixing drei Stage stacking its own spot (2× intensity) on top of scene lights. */
          gl.toneMappingExposure = 0.68;
        }}
      >
        <HeroScrollReadContext.Provider value={scrollRead}>
          <BreathingFogExp2 reduceMotion={reduceMotion} />
          {/* <SnowMountainDreiSkyClouds reduceMotion={
        reduceMotion} /> */}
          <hemisphereLight args={["#a2acb5", "#3A3830", 0.6]} />
          {/* Warm daylight fill — brightens shadowed faces without adding hue */}
          <ambientLight intensity={0.38} color="#FFF8F0" />
          <directionalLight
            position={[22, 38, 18]}
            intensity={0.46}
            color="#FFE8C8"
          />
          <directionalLight
            position={[-16, 8, -22]}
            intensity={0.18}
            color="#C8C0B0"
          />

          <HeroScrollCameraFraming reduceMotion={reduceMotion} />
          <CursorWorldLight reduceMotion={reduceMotion} />

          <ParallaxWorld reduceMotion={reduceMotion}>
            <AtmosphericParticles reduceMotion={reduceMotion} />
            <Suspense fallback={null}>
              {/*
              observe={false}: default Bounds observe refits whenever R3F `size` changes.
              First pointer move / cursor UI can change viewport (scrollbar) or layout,
              which retriggers reset().fit() and reads as an abrupt zoom-out.
              Stage still refits when the model radius is known (Refit on radius).
            */}
              {/*
              drei Stage always adds ambient + spot (2× intensity) + point — on top of our lights.
              intensity={0} turns those off; we only want Bounds/Center + IBL from Environment.
            */}
              <Stage
                adjustCamera={0.32}
                intensity={0}
                environment={{
                  preset: "apartment",
                  background: false,
                  environmentIntensity: 0.32,
                }}
                preset="soft"
                shadows={false}
                // Forwarded to Bounds via Stage ...props (drei merge); not on StageProps.
                // @ts-expect-error Bounds observe
                observe={false}
              >
                <SnowMountainModel reduceMotion={reduceMotion} />
              </Stage>
            </Suspense>
          </ParallaxWorld>

          <PostFx enabled={!reduceMotion} />
        </HeroScrollReadContext.Provider>
      </Canvas>
      <HeroCloudsThree
        motionRef={parallaxMotionRef}
        reducedMotion={reduceMotion}
      />
    </div>
  );
}
