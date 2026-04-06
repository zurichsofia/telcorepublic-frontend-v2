"use client";

import {
  Suspense,
  useLayoutEffect,
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
import { applyTerrainIceStyle } from "@/lib/snow-mountain-terrain-ice";
import { WindParticleField } from "@/components/snow-mountain-wind-particles";
import { SnowMountainSky } from "@/components/snow-mountain-sky";
import { SnowMountainNebula } from "@/components/snow-mountain-nebula";
import { SnowMountainCloudWisps } from "@/components/snow-mountain-cloud-wisps";
import { AtmosphericParticles } from "@/components/snow-mountain-atmospheric-particles";
import { OrbitControls as ThreeOrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

useGLTF.preload("/snow_mountain.glb");

/** Y rotation π — show the opposite face of the terrain. */
const ROT_Y_180 = 1;

const FOG_EXP_BASE = 0.02;
const FOG_EXP_BREATH = 0.003;

function BreathingFogExp2({ reduceMotion }: { reduceMotion: boolean }) {
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
    if (!g) return;
    const lerp = 1 - Math.pow(0.9, delta * 60);
    const scroll = scrollProgressRef?.current ?? 0;
    if (reduceMotion) {
      smooth.current.x = 0;
      smooth.current.y = 0;
      g.rotation.x = scroll * 0.078;
      g.rotation.y = 0;
      return;
    }
    smooth.current.x += (mouse.current.x - smooth.current.x) * lerp;
    smooth.current.y += (mouse.current.y - smooth.current.y) * lerp;
    g.rotation.x = scroll * 0.078 + smooth.current.y * -0.038;
    g.rotation.y = smooth.current.x * 0.045;
  });

  return <group ref={groupRef}>{children}</group>;
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
    const t = reduceMotion ? 0 : (scrollProgressRef?.current ?? 0);
    if (rigRef.current) {
      rigRef.current.rotation.set(
        t * 0.03,
        ROT_Y_180 + t * 0.25,
        t * -0.01,
      );
    }

    if (applied.current || !controls || !rigRef.current) return;
    if (state.clock.elapsedTime < 0.2) return;
    const box = new THREE.Box3().setFromObject(rigRef.current);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const oc = controls as ThreeOrbitControls;
    oc.target.set(center.x, center.y + size.y * 0.36, center.z);
    oc.update();
    applied.current = true;
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
        luminanceThreshold={0.88}
        luminanceSmoothing={0.28}
        intensity={0.09}
        mipmapBlur
      />
    </EffectComposer>
  );
}

export type SnowMountainSceneProps = {
  /** 0 = top of hero, 1 = hero scrolled out — drives tilt + terrain motion. */
  scrollProgressRef?: MutableRefObject<number>;
};

export function SnowMountainScene({ scrollProgressRef }: SnowMountainSceneProps) {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <Canvas
      className="h-full w-full touch-none"
      camera={{ fov: 36 }}
      dpr={[1, 2]}
      gl={{
        antialias: true,
        powerPreference: "high-performance",
      }}
      onCreated={({ gl }) => {
        gl.setClearColor(new THREE.Color(SNOW_MOUNTAIN_FOG_COLOR), 1);
      }}
    >
      <BreathingFogExp2 reduceMotion={reduceMotion} />
      <SnowMountainSky />
      <SnowMountainNebula />
      <SnowMountainCloudWisps reduceMotion={reduceMotion} />
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

      <ParallaxWorld
        scrollProgressRef={scrollProgressRef}
        reduceMotion={reduceMotion}
      >
        <AtmosphericParticles reduceMotion={reduceMotion} />
        <Suspense fallback={null}>
          <Stage
            adjustCamera={0.35}
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

      <OrbitControls makeDefault enableDamping dampingFactor={0.08} />
      <PostFx enabled={!reduceMotion} />
    </Canvas>
  );
}
