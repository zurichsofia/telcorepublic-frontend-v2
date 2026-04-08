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
import { heroScrollZoomT, heroSubtleMotionT } from "@/lib/snow-mountain-hero-scroll";
import { applyTerrainIceStyle } from "@/lib/snow-mountain-terrain-ice";
// import { SnowMountainDreiSkyClouds } from "@/components/snow-mountain-drei-sky-clouds";
import { AtmosphericParticles } from "@/components/snow-mountain-atmospheric-particles";
import { markSceneReady, registerScene } from "@/lib/scene-ready";

import { cn } from "@/lib/utils";
import {
  HeroCloudsThree,
  type HeroParallaxMotion,
} from "./landing/hero-clouds-three";

/** Extra Y rotation (rad) as the user scrolls through the hero — subtle orbit. */
const HERO_SCROLL_YAW_RAD = 0.15;

useGLTF.preload("/scene/snow_mountain.glb");
// Tell the PageLoader it must wait for this scene before dismissing.
registerScene();

const HeroScrollSmoothContext = createContext<MutableRefObject<number> | null>(
  null,
);

const FALLBACK_SCROLL_PROGRESS: MutableRefObject<number> = { current: 0 };

/**
 * Lerp raw window scroll progress inside the R3F loop so terrain motion matches
 * frame timing (avoids jitter vs. irregular scroll events).
 */
function SmoothHeroScrollProvider({
  rawRef,
  reduceMotion,
  children,
}: {
  rawRef: MutableRefObject<number>;
  reduceMotion: boolean;
  children: React.ReactNode;
}) {
  const smoothRef = useRef(rawRef.current);
  useFrame((_, delta) => {
    if (reduceMotion) {
      smoothRef.current = rawRef.current;
      return;
    }
    const target = rawRef.current;
    const k = 1 - Math.pow(0.76, delta * 60);
    smoothRef.current += (target - smoothRef.current) * k;
  }, 10);
  return (
    <HeroScrollSmoothContext.Provider value={smoothRef}>
      {children}
    </HeroScrollSmoothContext.Provider>
  );
}

/** Base Y rotation (rad) for the terrain rig; scroll adds a small delta on top. */
const BASE_TERRAIN_YAW_RAD = 1;

/**
 * World-space X of the look-at target (mountain is centered near origin after Stage/Center).
 * START must be 0 so the first frame matches Bounds’ look-at at the bbox center; a non-zero START
 * fights the fit animation and reads as a snap (left) then our offset (right).
 * END eases in with scroll so framing shifts right by the end of the hero.
 */
const CAMERA_LOOK_AT_X_START = 0;
const CAMERA_LOOK_AT_X_END = 0.42;

/** Extra perspective FOV (deg) at end of hero vs. top — pull back a bit more for handoff. */
const HERO_SCROLL_ZOOM_FOV_DELTA = 5.15;

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
 * After Bounds fit: widen FOV and ease look-at X toward the right as scroll progresses
 * (same `heroScrollZoomT` curve). Priority above Bounds default.
 */
function HeroScrollCameraFraming({ reduceMotion }: { reduceMotion: boolean; }) {
  const camera = useThree((s) => s.camera);
  const smoothScrollRef = useContext(HeroScrollSmoothContext);
  const baseFovRef = useRef<number | null>(null);
  const lookAt = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    if (!(camera instanceof THREE.PerspectiveCamera)) return;
    if (baseFovRef.current === null) baseFovRef.current = camera.fov;
    const base = baseFovRef.current;
    const p = smoothScrollRef?.current ?? 0;
    const t = reduceMotion ? 0 : heroScrollZoomT(p);
    camera.fov = base + t * HERO_SCROLL_ZOOM_FOV_DELTA;
    camera.updateProjectionMatrix();
    const x = THREE.MathUtils.lerp(
      CAMERA_LOOK_AT_X_START,
      CAMERA_LOOK_AT_X_END,
      t,
    );
    lookAt.set(x, 0, 0);
    camera.lookAt(lookAt);
  }, 50);
  return null;
}

function ParallaxWorld({
  reduceMotion,
  children,
}: {
  reduceMotion: boolean;
  children: ReactNode;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const scrollYawRef = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const smooth = useRef({ x: 0, y: 0 });
  const smoothScrollRef = useContext(HeroScrollSmoothContext);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame((_, delta) => {
    const g = groupRef.current;
    const yaw = scrollYawRef.current;
    if (!g || !yaw) return;
    const lerp = 1 - Math.pow(0.945, delta * 60);
    const p = smoothScrollRef?.current ?? 0;
    const subtleT = reduceMotion ? 0 : heroSubtleMotionT(p);
    if (reduceMotion) {
      smooth.current.x = 0;
      smooth.current.y = 0;
      g.rotation.x = 0;
      g.rotation.y = 0;
      yaw.rotation.y = 0;
      return;
    }
    smooth.current.x += (mouse.current.x - smooth.current.x) * lerp;
    smooth.current.y += (mouse.current.y - smooth.current.y) * lerp;
    g.rotation.x = subtleT * 0.028 + smooth.current.y * -0.017;
    g.rotation.y = subtleT * 0.018 + smooth.current.x * 0.018;
    yaw.rotation.y = subtleT * HERO_SCROLL_YAW_RAD;
  });

  return (
    <group ref={groupRef}>
      <group ref={scrollYawRef}>{children}</group>
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
  const smoothScrollRef = useContext(HeroScrollSmoothContext);

  useLayoutEffect(() => {
    applyTerrainIceStyle(gltf.scene);
  }, [gltf]);

  // Signal the PageLoader that the GLB has loaded and the model is mounted.
  useEffect(() => {
    markSceneReady();
  }, []);

  useFrame(() => {
    const p = smoothScrollRef?.current ?? 0;
    const subtleT = reduceMotion ? 0 : heroSubtleMotionT(p);
    if (rigRef.current) {
      rigRef.current.rotation.set(
        subtleT * 0.012,
        BASE_TERRAIN_YAW_RAD + subtleT * 0.052,
        subtleT * -0.005,
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
  /** 0 = hero top, 1 = hero end. Drives `heroSubtleMotionT` (immediate ramp, hold last third). */
  scrollProgressRef?: MutableRefObject<number>;
  /** Shared with CSS `--sm-primary-x` / `--sm-primary-y` so WebGL clouds track the same parallax. */
  motionRef?: MutableRefObject<HeroParallaxMotion>;
  /** Merged onto the R3F canvas (e.g. `cursor-none` with a custom cursor overlay). */
  className?: string;
};

export function SnowMountainScene({
  scrollProgressRef,
  motionRef,
  className,
}: SnowMountainSceneProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const rawScrollRef = scrollProgressRef ?? FALLBACK_SCROLL_PROGRESS;
  const parallaxMotionRef = motionRef ?? FALLBACK_PARALLAX_MOTION;

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
        <SmoothHeroScrollProvider
          rawRef={rawScrollRef}
          reduceMotion={reduceMotion}
        >
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
                adjustCamera={0.36}
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
        </SmoothHeroScrollProvider>
      </Canvas>
      <HeroCloudsThree
        motionRef={parallaxMotionRef}
        reducedMotion={reduceMotion}
      />
    </div>
  );
}
