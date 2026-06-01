"use client";

import {
  Suspense,
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useEffect,
  useState,
  type MutableRefObject,
  type ReactNode,
  type RefObject,
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
  if (
    type === "warn" &&
    typeof message === "string" &&
    message.includes("THREE.Clock")
  )
    return;
  if (type === "warn") console.warn(message, ...params);
  else if (type === "error") console.error(message, ...params);
  else console.log(message, ...params);
});

import { SNOW_MOUNTAIN_FOG_COLOR } from "@/lib/snow-mountain/snow-mountain-fog";
import { mapHeroScrollProgress } from "@/lib/snow-mountain/snow-mountain-hero-scroll";
import type { HeroScrollState } from "@/lib/snow-mountain/hero-scroll-state";
import { applyTerrainIceStyle } from "@/lib/snow-mountain/snow-mountain-terrain-ice";
import { HeroScrollLayoutSync } from "@/components/landing/snow-mountain/scene/hero-scroll-layout-sync";
import { SnowMountainSceneParticles } from "@/components/landing/snow-mountain/scene/snow-mountain-scene-particles";
import { markSceneReady, registerScene } from "@/lib/scene-ready";

import { cn } from "@/lib/utils";
import {
  SnowMountainSceneClouds,
  type SnowMountainParallaxMotion,
} from "@/components/landing/snow-mountain/scene/snow-mountain-scene-clouds";

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
  getProgress: () => number;
  cameraBaselineGenerationRef: MutableRefObject<number>;
};

const HeroScrollReadContext = createContext<HeroScrollRead | null>(null);

function clamp01(p: number): number {
  if (p <= 0) return 0;
  if (p >= 1) return 1;
  return p;
}

function heroCameraProgress(raw: number, reduceMotion: boolean): number {
  const clamped = clamp01(raw);
  if (reduceMotion) return 0;
  return mapHeroScrollProgress(clamped);
}

/** Invert scroll orbit so Stage fit can be re-locked after GLB load at any scroll t. */
function captureOrbitCameraBaseline(
  camera: THREE.PerspectiveCamera,
  t: number,
  outBasePos: THREE.Vector3,
): number {
  const px = CAMERA_ORBIT_PIVOT.x;
  const pz = CAMERA_ORBIT_PIVOT.z;
  const yArc = HERO_ORBIT_HEIGHT_ARC * Math.sin(t * Math.PI);
  const cx = camera.position.x - t * CAMERA_SCROLL_OFFSET_X;
  const cy = camera.position.y - t * CAMERA_SCROLL_OFFSET_Y - yArc;
  const cz = camera.position.z - t * CAMERA_SCROLL_OFFSET_Z;

  const theta = Math.atan2(cx - px, cz - pz);
  const theta0 = theta - t * HERO_SCROLL_ORBIT_RAD;
  const rBreathe = 1 + HERO_ORBIT_RADIUS_BREATHE * Math.sin(t * Math.PI);
  const rEff = Math.hypot(cx - px, cz - pz);
  const r = rEff / Math.max(rBreathe, 1e-6);

  outBasePos.set(px + r * Math.sin(theta0), cy, pz + r * Math.cos(theta0));
  return camera.fov - t * HERO_SCROLL_ZOOM_FOV_DELTA;
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
    <fogExp2
      attach="fog"
      args={[new THREE.Color(SNOW_MOUNTAIN_FOG_COLOR), FOG_EXP_BASE]}
    />
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

    const p = scrollRead?.getProgress() ?? 0;
    const t = heroCameraProgress(p, reduceMotion);
    const te = t;

    if (baseFovRef.current === null || basePosRef.current === null) {
      if (basePosRef.current === null) {
        basePosRef.current = new THREE.Vector3();
      }
      baseFovRef.current = captureOrbitCameraBaseline(
        camera,
        t,
        basePosRef.current,
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

    const p = scrollRead?.getProgress() ?? 0;
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
    smoothMouse.current.x +=
      (mouse.current.x - smoothMouse.current.x) * mouseLerp;
    smoothMouse.current.y +=
      (mouse.current.y - smoothMouse.current.y) * mouseLerp;
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
    const p = scrollRead?.getProgress() ?? 0;
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
  const size = useThree((s) => s.size);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setReady(false);
      return;
    }
    let cancelled = false;
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!cancelled) setReady(true);
      });
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(id);
      setReady(false);
    };
  }, [enabled]);

  if (!enabled || !ready || size.width === 0) return null;

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

const FALLBACK_PARALLAX_MOTION: MutableRefObject<SnowMountainParallaxMotion> = {
  current: { x: 0, y: 0, scale: 1, scroll: 0 },
};

export type SnowMountainSceneProps = {
  scrollState: HeroScrollState;
  heroSectionRef: RefObject<HTMLElement | null>;
  motionRef?: MutableRefObject<SnowMountainParallaxMotion>;
  sceneActive?: boolean;
  className?: string;
};

export function SnowMountainScene({
  scrollState,
  heroSectionRef,
  motionRef,
  sceneActive = true,
  className,
}: SnowMountainSceneProps) {
  const reduceMotion = usePrefersReducedMotion();
  const parallaxMotionRef = motionRef ?? FALLBACK_PARALLAX_MOTION;
  const cameraBaselineGenerationRef = useRef(0);

  const scrollRead = useMemo((): HeroScrollRead => {
    return {
      getProgress: () => (reduceMotion ? 0 : scrollState.get()),
      cameraBaselineGenerationRef,
    };
  }, [reduceMotion, scrollState]);

  /* `SnowMountainSceneClouds` uses its own `<Canvas>` — must not nest inside this Canvas (R3F rejects it). */
  return (
    <div className={cn("relative h-full min-h-dvh w-full", className)}>
      <Canvas
        className="absolute inset-0 h-full w-full touch-none"
        frameloop={sceneActive && !reduceMotion ? "always" : "never"}
        camera={{ fov: 28, near: 0.1, far: 500 }}
        dpr={[1, 1.5]}
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
          <HeroScrollLayoutSync
            sectionRef={heroSectionRef}
            scrollState={scrollState}
            motionRef={parallaxMotionRef}
            reduceMotion={reduceMotion}
          />
          <BreathingFogExp2 reduceMotion={reduceMotion} />
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
            <SnowMountainSceneParticles reduceMotion={reduceMotion} />
            <Suspense fallback={null}>
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
              <PostFx enabled={!reduceMotion} />
            </Suspense>
          </ParallaxWorld>
        </HeroScrollReadContext.Provider>
      </Canvas>
      <SnowMountainSceneClouds
        scrollState={scrollState}
        sectionRef={heroSectionRef}
        reducedMotion={reduceMotion}
        sceneActive={sceneActive}
      />
    </div>
  );
}

