"use client";

import {
  Suspense,
  useLayoutEffect,
  useMemo,
  useRef,
  useEffect,
  type MutableRefObject,
  type ReactNode,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stage, useGLTF } from "@react-three/drei";
import { useReducedMotion } from "motion/react";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

import * as THREE from "three";

import { SNOW_MOUNTAIN_FOG_COLOR } from "@/lib/snow-mountain-fog";
import { heroSubtleMotionT } from "@/lib/snow-mountain-hero-scroll";

/** Extra Y rotation (rad) during 100–200vh scroll - reads as camera orbiting slightly right. */
const HERO_SCROLL_YAW_RAD = 0.11;
import { applyTerrainIceStyle } from "@/lib/snow-mountain-terrain-ice";
import { WindParticleField } from "@/components/snow-mountain-wind-particles";
import { SnowMountainDreiSkyClouds } from "@/components/snow-mountain-drei-sky-clouds";
import { AtmosphericParticles } from "@/components/snow-mountain-atmospheric-particles";
import { OrbitControls as ThreeOrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import { cn } from "@/lib/utils";

useGLTF.preload("/snow_mountain.glb");

/** Y rotation π - show the opposite face of the terrain. */
const ROT_Y_180 = 1;

/** Slightly lighter than before - sky/clouds opt out of fog; terrain shaders still carry haze. */
const FOG_EXP_BASE = 0.012;
const FOG_EXP_BREATH = 0.002;

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

function ParallaxWorld({
  scrollProgressRef,
  reduceMotion,
  children,
}: {
  scrollProgressRef?: MutableRefObject<number>;
  reduceMotion: boolean;
  children: ReactNode;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const scrollYawRef = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const smooth = useRef({ x: 0, y: 0 });

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
    const lerp = 1 - Math.pow(0.9, delta * 60);
    const p = scrollProgressRef?.current ?? 0;
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
    /* Scroll-driven tilt scales with subtleT from first scroll; keep amplitudes small. */
    g.rotation.x = subtleT * 0.028 + smooth.current.y * -0.038;
    g.rotation.y = subtleT * 0.018 + smooth.current.x * 0.042;
    /* Orbit camera slightly right as subtleT ramps. */
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
    /* Strong enough to read over Stage env + fill lights. */
    light.intensity = 1.65;
  });

  return (
    <pointLight
      ref={lightRef}
      color="#FFF8F0"
      intensity={0}
      distance={110}
      decay={1.85}
    />
  );
}

type SnowMountainModelProps = {
  scrollProgressRef?: MutableRefObject<number>;
  reduceMotion: boolean;
};

function SnowMountainModel({
  scrollProgressRef,
  reduceMotion,
}: SnowMountainModelProps) {
  const gltf = useGLTF("/snow_mountain.glb");
  const rigRef = useRef<THREE.Group>(null);
  const controls = useThree((s) => s.controls);
  const applied = useRef(false);

  useLayoutEffect(() => {
    applyTerrainIceStyle(gltf.scene);
  }, [gltf]);

  useFrame((state) => {
    const p = scrollProgressRef?.current ?? 0;
    const subtleT = reduceMotion ? 0 : heroSubtleMotionT(p);
    if (rigRef.current) {
      rigRef.current.rotation.set(
        subtleT * 0.012,
        ROT_Y_180 + subtleT * 0.052,
        subtleT * -0.005,
      );
    }

    if (applied.current || !controls || !rigRef.current) return;
    if (state.clock.elapsedTime < 0.45) return;
    const box = new THREE.Box3().setFromObject(rigRef.current);
    if (box.isEmpty()) return;
    const size = box.getSize(new THREE.Vector3());
    if (Math.max(size.x, size.y, size.z) < 1e-4) return;
    const center = box.getCenter(new THREE.Vector3());
    const oc = controls as ThreeOrbitControls;
    oc.target.set(center.x, center.y + size.y * 0.3, center.z);
    oc.update();
    applied.current = true;
  });

  return (
    <group ref={rigRef}>
      <primitive object={gltf.scene} />
    </group>
  );
}

/**
 * Stage fits the camera; OrbitControls defaults allow infinite dolly-out - hero looks empty.
 * Lock zoom (and pan) so the framed shot stays; user can still orbit slightly.
 */
function HeroOrbitControls() {
  return (
    <OrbitControls
      makeDefault
      enableDamping
      dampingFactor={0.08}
      enableZoom={false}
      enablePan={false}
    />
  );
}

function PostFx({ enabled }: { enabled: boolean; }) {
  if (!enabled) return null;
  return (
    <EffectComposer multisampling={4} enableNormalPass={false}>
      <Bloom
        luminanceThreshold={0.9}
        luminanceSmoothing={0.26}
        intensity={0.065}
        mipmapBlur
      />
    </EffectComposer>
  );
}

export type SnowMountainSceneProps = {
  /** 0 = hero top, 1 = hero end. Drives `heroSubtleMotionT` (immediate ramp, hold last third). */
  scrollProgressRef?: MutableRefObject<number>;
  /** Merged onto the R3F canvas (e.g. `cursor-none` with a custom cursor overlay). */
  className?: string;
};

export function SnowMountainScene({
  scrollProgressRef,
  className,
}: SnowMountainSceneProps) {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <Canvas
      className={cn("h-full min-h-dvh w-full touch-none", className)}
      camera={{ fov: 28, near: 0.1, far: 500 }}
      dpr={[1, 2]}
      resize={{ debounce: { scroll: 0, resize: 0 } }}
      gl={{
        antialias: true,
        powerPreference: "high-performance",
      }}
      onCreated={({ gl }) => {
        gl.setClearColor(new THREE.Color(SNOW_MOUNTAIN_FOG_COLOR), 1);
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.02;
      }}
    >
      <BreathingFogExp2 reduceMotion={reduceMotion} />
      <SnowMountainDreiSkyClouds reduceMotion={reduceMotion} />
      <WindParticleField reduceMotion={reduceMotion} />
      <hemisphereLight args={["#F5FAFF", "#6FA0D4", 0.85]} />
      <ambientLight intensity={0.38} color="#D0E4F8" />
      <directionalLight
        position={[22, 38, 18]}
        intensity={1.12}
        color="#FAFCFF"
      />
      <directionalLight
        position={[-16, 8, -22]}
        intensity={0.52}
        color="#A8C8EC"
      />

      <CursorWorldLight reduceMotion={reduceMotion} />

      <ParallaxWorld
        scrollProgressRef={scrollProgressRef}
        reduceMotion={reduceMotion}
      >
        <AtmosphericParticles reduceMotion={reduceMotion} />
        <Suspense fallback={null}>
          <Stage
            adjustCamera={0.36}
            intensity={0.58}
            environment="dawn"
            preset="soft"
            shadows={false}
          >
            <SnowMountainModel
              scrollProgressRef={scrollProgressRef}
              reduceMotion={reduceMotion}
            />
          </Stage>
        </Suspense>
      </ParallaxWorld>

      <HeroOrbitControls />
      <PostFx enabled={!reduceMotion} />
    </Canvas>
  );
}
