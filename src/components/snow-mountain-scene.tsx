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
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
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
import {
  mapHeroScrollProgress,
  readHeroScrollProgress,
} from "@/lib/snow-mountain-hero-scroll";
import { applyTerrainIceStyle } from "@/lib/snow-mountain-terrain-ice";
// import { SnowMountainDreiSkyClouds } from "@/components/snow-mountain-drei-sky-clouds";
import { AtmosphericParticles } from "@/components/snow-mountain-atmospheric-particles";
import { markSceneReady, registerScene } from "@/lib/scene-ready";

import { cn } from "@/lib/utils";
import type { HeroProgressRead } from "@/lib/scroll-progress";
import {
  HeroCloudsThree,
  type HeroParallaxMotion,
} from "./landing/hero-clouds-three";

/** Total azimuth swept while scrolling (rad). Camera orbits in XZ — eased scroll for cinematic pace. */
const HERO_SCROLL_ORBIT_RAD = 0.82;

/** Extra terrain Y at t=1 — small; camera orbit carries most of the turn. */
const HERO_SCROLL_TERRAIN_YAW_EXTRA = 0.08;

/** Subtle radius breathe on the orbit (sin(π·t) scale). */
const HERO_ORBIT_RADIUS_BREATHE = 0.015;

/** Mid-scroll vertical arc (world). */
const HERO_ORBIT_HEIGHT_ARC = 0.16;

useGLTF.preload("/scene/snow_mountain.glb");
// Tell the PageLoader it must wait for this scene before dismissing.
registerScene();

type HeroScrollRead = {
  getRawProgress: () => number;
  /**
   * Increment (via ref) so `HeroScrollCameraFraming` drops its cached baseline and
   * re-snaps to whatever `Stage`/`Bounds` last fitted — avoids locking FOV/position
   * before drei's post-GLB `Refit` runs (felt as an extra zoom-out on load).
   */
  cameraBaselineGenerationRef: MutableRefObject<number>;
};

/** `getRawProgress()` inside `useFrame` — reads hero layout (same formula as CSS scroll sync). */
const HeroScrollReadContext = createContext<HeroScrollRead | null>(null);

function clamp01(p: number): number {
  if (p <= 0) return 0;
  if (p >= 1) return 1;
  return p;
}

/** Map raw hero progress to eased cinematic t (matches mont-fort-style scroll curves). */
function heroCameraProgress(raw: number, reduceMotion: boolean): number {
  const clamped = clamp01(raw);
  if (reduceMotion) return 0;
  return mapHeroScrollProgress(clamped);
}

/** Keeps exponential smoothers stable after visibility/background throttling (large `delta`). */
function clampFrameDelta(delta: number): number {
  return Math.min(delta, 1 / 24);
}

/** Base Y rotation (rad) for the terrain rig; scroll adds a small delta on top. */
const BASE_TERRAIN_YAW_RAD = 1;

/** Pivot / look-at in Stage space — keep stable so orbit stays centered on the mass. */
const CAMERA_ORBIT_PIVOT = new THREE.Vector3(0, 0.22, 0);

/** Look-at stays on the pivot’s vertical line so the mass doesn’t slide left/right in frame. */
const CAMERA_LOOK_AT_X_START = 0;
const CAMERA_LOOK_AT_X_END = 0;
const CAMERA_LOOK_AT_Y_START = 0;
const CAMERA_LOOK_AT_Y_END = 0.04;

/** FOV tighten by end of hero — eased. */
const HERO_SCROLL_ZOOM_FOV_DELTA = -0.95;

/**
 * Small vertical drift only — no X/Z scroll slide (those skewed center vs camera orbit).
 */
const CAMERA_SCROLL_OFFSET_X = 0;
const CAMERA_SCROLL_OFFSET_Y = 0.14;
const CAMERA_SCROLL_OFFSET_Z = 0;

/** Sky/clouds opt out of fog; terrain shaders still carry haze — a touch more = softer horizon blend. */
const FOG_EXP_BASE = 0.026;
const FOG_EXP_BREATH = 0.0028;

function BreathingFogExp2({ reduceMotion }: { reduceMotion: boolean; }) {
  const scene = useThree((s) => s.scene);
  const gl = useThree((s) => s.gl);
  const iceFog = useMemo(() => new THREE.Color(SNOW_MOUNTAIN_FOG_COLOR), []);
  const clearScratch = useMemo(() => new THREE.Color(), []);

  useFrame(({ clock }) => {
    const fog = scene.fog;
    if (!fog || !(fog instanceof THREE.FogExp2)) return;

    if (reduceMotion) {
      fog.density = FOG_EXP_BASE;
      fog.color.copy(iceFog);
      clearScratch.copy(iceFog);
      gl.setClearColor(clearScratch, 1);
      return;
    }

    const breath = Math.sin(clock.elapsedTime * 0.11) * FOG_EXP_BREATH;
    fog.density = FOG_EXP_BASE + breath;
    fog.color.copy(iceFog);
    clearScratch.copy(iceFog);
    gl.setClearColor(clearScratch, 1);
  });

  return (
    <fogExp2 attach="fog" args={[new THREE.Color(SNOW_MOUNTAIN_FOG_COLOR), FOG_EXP_BASE]} />
  );
}

/**
 * After Bounds fit: orbit, eased FOV, look-at, and small layered offsets (see `observe={false}` note).
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
  const lastBaselineGenRef = useRef(-1);

  useFrame(() => {
    if (!(camera instanceof THREE.PerspectiveCamera)) return;

    const { width, height } = size;
    if (width !== lastSizeRef.current.w || height !== lastSizeRef.current.h) {
      lastSizeRef.current = { w: width, h: height };
      baseFovRef.current = null;
      basePosRef.current = null;
    }

    const gen = scrollRead?.cameraBaselineGenerationRef.current;
    if (gen !== undefined && gen !== lastBaselineGenRef.current) {
      lastBaselineGenRef.current = gen;
      baseFovRef.current = null;
      basePosRef.current = null;
    }

    const p = scrollRead?.getRawProgress() ?? 0;
    const t = heroCameraProgress(p, reduceMotion);
    const te = t;

    /*
     * Bounds uses `observe={false}`, so the fitted camera is not reset when the canvas resizes.
     * This component already bakes scroll into `camera` each frame; naïvely cloning position/FOV
     * after a resize would treat “scrolled” state as the new base and double-apply offsets.
     * Recover the Stage baseline by reversing the scroll-driven deltas.
     */
    if (baseFovRef.current === null) {
      baseFovRef.current = camera.fov - te * HERO_SCROLL_ZOOM_FOV_DELTA;
    }
    if (basePosRef.current === null) {
      basePosRef.current = new THREE.Vector3(
        camera.position.x - t * CAMERA_SCROLL_OFFSET_X,
        camera.position.y - t * CAMERA_SCROLL_OFFSET_Y,
        camera.position.z - t * CAMERA_SCROLL_OFFSET_Z,
      );
    }

    const base = baseFovRef.current;
    const B = basePosRef.current;
    const px = CAMERA_ORBIT_PIVOT.x;
    const pz = CAMERA_ORBIT_PIVOT.z;
    const dx = B.x - px;
    const dz = B.z - pz;
    let r = Math.hypot(dx, dz);
    const theta0 = Math.atan2(dx, dz);
    if (r < 0.02) {
      r = 0.02;
    }
    const rBreathe = 1 + HERO_ORBIT_RADIUS_BREATHE * Math.sin(t * Math.PI);
    const rEff = r * rBreathe;
    const theta = theta0 + t * HERO_SCROLL_ORBIT_RAD;
    const yArc = HERO_ORBIT_HEIGHT_ARC * Math.sin(t * Math.PI);
    posScratch.set(
      px + rEff * Math.sin(theta) + t * CAMERA_SCROLL_OFFSET_X,
      B.y + t * CAMERA_SCROLL_OFFSET_Y + yArc,
      pz + rEff * Math.cos(theta) + t * CAMERA_SCROLL_OFFSET_Z,
    );
    camera.position.copy(posScratch);

    camera.fov = base + te * HERO_SCROLL_ZOOM_FOV_DELTA;
    camera.updateProjectionMatrix();
    lookAt.set(
      CAMERA_ORBIT_PIVOT.x +
      THREE.MathUtils.lerp(CAMERA_LOOK_AT_X_START, CAMERA_LOOK_AT_X_END, te),
      CAMERA_ORBIT_PIVOT.y +
      THREE.MathUtils.lerp(CAMERA_LOOK_AT_Y_START, CAMERA_LOOK_AT_Y_END, te),
      CAMERA_ORBIT_PIVOT.z,
    );
    camera.lookAt(lookAt);
  }, 50);
  return null;
}

/**
 * Two-rig design keeps scroll-preset positions and mouse tracking completely
 * independent so they never fight each other's lerp targets:
 *
 *   scrollRigRef  – kept at identity; scroll motion is camera orbit only (avoids lateral drift).
 *     mouseRigRef – mouse parallax only (subtle).
 *       yawRigRef – identity; avoids stacking yaw with camera orbit.
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
    const t = heroCameraProgress(p, reduceMotion);
    const dt = clampFrameDelta(delta);

    if (reduceMotion) {
      scrollRig.rotation.set(0, 0, 0);
      mouseRig.rotation.set(0, 0, 0);
      yaw.rotation.y = 0;
      return;
    }

    /* No scroll yaw/tilt on the world rig — camera orbit already turns the mountain; extra yaw read as off-center drift. */
    scrollRig.rotation.set(0, 0, 0);
    yaw.rotation.y = 0;

    // Mouse parallax — gentle; slower follow so hover doesn’t yank the scene.
    const mouseLerp = 1 - Math.pow(0.94, dt * 60);
    smoothMouse.current.x += (mouse.current.x - smoothMouse.current.x) * mouseLerp;
    smoothMouse.current.y += (mouse.current.y - smoothMouse.current.y) * mouseLerp;
    const parallaxScale = 1 - t * 0.35;
    mouseRig.rotation.x = smoothMouse.current.y * -0.018 * parallaxScale;
    mouseRig.rotation.y = smoothMouse.current.x * 0.02 * parallaxScale;
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
    const dt = clampFrameDelta(delta);
    const lerp = 1 - Math.pow(0.9, dt * 60);
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
  const baselineGenRef = scrollRead?.cameraBaselineGenerationRef;

  useLayoutEffect(() => {
    applyTerrainIceStyle(gltf.scene);
  }, [gltf]);

  // Signal the PageLoader that the GLB has loaded and the model is mounted.
  useEffect(() => {
    markSceneReady();
    if (!baselineGenRef) return;
    let cancelled = false;
    let raf1 = 0;
    let raf2 = 0;
    /* After drei's Stage `Refit` effect + a frame, re-lock scroll framing to fitted camera. */
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        if (!cancelled) baselineGenRef.current += 1;
      });
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [baselineGenRef]);

  useFrame(() => {
    const p = scrollRead?.getRawProgress() ?? 0;
    const t = heroCameraProgress(p, reduceMotion);
    if (rigRef.current) {
      rigRef.current.rotation.set(
        t * 0.008,
        BASE_TERRAIN_YAW_RAD + t * HERO_SCROLL_TERRAIN_YAW_EXTRA,
        t * -0.005,
      );
    }
  });

  return (
    <group ref={rigRef}>
      <primitive object={gltf.scene} />
    </group>
  );
}

function PostFx({ enabled }: { enabled: boolean }) {
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
  /** Hero `<section>` ref — progress is read from layout every R3F frame. */
  heroSectionRef?: RefObject<HTMLElement | null>;
  /** Hero scroll progress — drives camera orbit. */
  heroProgress?: HeroProgressRead;
  /** Cloud parallax driven from hero scroll (updated in `SnowMountainHero`). */
  motionRef?: MutableRefObject<HeroParallaxMotion>;
  className?: string;
};

export function SnowMountainScene({
  heroSectionRef,
  heroProgress,
  motionRef,
  className,
}: SnowMountainSceneProps) {
  const reduceMotion = usePrefersReducedMotion();
  const parallaxMotionRef = motionRef ?? FALLBACK_PARALLAX_MOTION;
  const cameraBaselineGenerationRef = useRef(0);

  useLayoutEffect(() => {
    cameraBaselineGenerationRef.current += 1;
  }, []);

  const scrollRead = useMemo((): HeroScrollRead => {
    return {
      getRawProgress: () => {
        if (reduceMotion) return 0;
        if (heroProgress) return heroProgress.get();
        const el = heroSectionRef?.current ?? null;
        return readHeroScrollProgress(el);
      },
      cameraBaselineGenerationRef,
    };
  }, [reduceMotion, heroSectionRef, heroProgress]);

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
              Bounds defaults to maxDuration=1 and lerps the camera each frame. Our
              HeroScrollCameraFraming (useFrame priority 50) overwrites the camera from a
              cached baseline — during that lerp it captures a mid-flight position and then
              pulls the camera back every frame (felt as “loads then zooms back”). Snap fit.
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
                // Forwarded to Bounds via Stage ...props; not declared on StageProps.
                // @ts-expect-error Bounds props forwarded from Stage
                observe={false}
                maxDuration={0}
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
