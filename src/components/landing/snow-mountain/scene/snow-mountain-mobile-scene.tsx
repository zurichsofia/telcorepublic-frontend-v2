"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import type { RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

import { SnowMountainSky } from "@/components/landing/snow-mountain/scene/snow-mountain-sky";
import type { HeroScrollState } from "@/lib/snow-mountain/hero-scroll-state";
import {
  applyMountainScrollCamera,
  computeModelBounds,
  frameMountainCameraPortrait,
  MOBILE_BASE_FOV,
  MOBILE_CAMERA_FRAMING,
  MOBILE_LOOK_AT_X_BEATS,
  type ApplyMountainScrollCameraScratch,
  type MountainCameraFrame,
} from "@/lib/snow-mountain/snow-mountain-camera-rig";
import {
  readHeroPinProgress,
  type HeroPinMetrics,
} from "@/lib/snow-mountain/hero-pin-metrics";
import {
  dampHeroScrollProgress,
  mapHeroScrollProgress,
  MOBILE_HERO_CAMERA_PROGRESS_DAMPING,
} from "@/lib/snow-mountain/snow-mountain-hero-scroll";
import { SNOW_MOUNTAIN_SOURCE_MODEL } from "@/lib/snow-mountain/snow-mountain-model";
import { getCanvasDprRange } from "@/lib/snow-mountain/scene-quality";
import {
  isSceneReady,
  markSceneReady,
  registerScene,
  waitForScene,
} from "@/lib/scene-ready";
import { cn } from "@/lib/utils";

const SKY_COLOR = "#e8e8e8";

registerScene();

type MobileMountainModelProps = {
  onReady: (root: THREE.Object3D) => void;
  reduceMotion: boolean;
};

function MobileMountainModel({ onReady, reduceMotion }: MobileMountainModelProps) {
  const { scene } = useGLTF(SNOW_MOUNTAIN_SOURCE_MODEL);

  useEffect(() => {
    onReady(scene);
    if (reduceMotion) markSceneReady();
  }, [onReady, reduceMotion, scene]);

  return <primitive object={scene} />;
}

type MobileScrollRigProps = {
  scrollState: HeroScrollState;
  pinMetricsRef: RefObject<HeroPinMetrics>;
  heroSectionRef: RefObject<HTMLElement | null>;
  modelRoot: THREE.Object3D | null;
  reduceMotion: boolean;
};

/** Scroll sample + camera update in one useFrame — single clock, no sticky jitter. */
function MobileScrollRig({
  scrollState,
  pinMetricsRef,
  heroSectionRef,
  modelRoot,
  reduceMotion,
}: MobileScrollRigProps) {
  const camera = useThree((s) => s.camera);
  const framed = useRef(false);
  const waitFrames = useRef(0);
  const dampedProgressRef = useRef(0);
  const frameRef = useRef<MountainCameraFrame | null>(null);
  const scratch = useRef<ApplyMountainScrollCameraScratch>({
    lookAt: new THREE.Vector3(),
    position: new THREE.Vector3(),
    lastFov: null,
  });
  const originRef = useRef(new THREE.Vector3());

  useEffect(() => {
    framed.current = false;
    waitFrames.current = 0;
    frameRef.current = null;
    scratch.current.lastFov = null;

    if (!modelRoot || !(camera instanceof THREE.PerspectiveCamera)) return;

    let raf = 0;

    const runFraming = () => {
      waitFrames.current += 1;
      if (waitFrames.current < 2) {
        raf = requestAnimationFrame(runFraming);
        return;
      }

      const { center, size } = computeModelBounds(modelRoot);
      if (size.y < 1e-6) {
        raf = requestAnimationFrame(runFraming);
        return;
      }

      modelRoot.position.sub(center);

      const { size: fittedSize } = computeModelBounds(modelRoot);
      frameRef.current = frameMountainCameraPortrait(
        camera,
        originRef.current,
        fittedSize,
        MOBILE_CAMERA_FRAMING,
      );
      framed.current = true;
      markSceneReady();
    };

    raf = requestAnimationFrame(runFraming);
    return () => cancelAnimationFrame(raf);
  }, [camera, modelRoot]);

  useFrame((_, delta) => {
    const section = heroSectionRef.current;
    if (!section) return;

    const target = readHeroPinProgress(pinMetricsRef.current);
    const progress = reduceMotion || target >= 1
      ? target
      : dampHeroScrollProgress(
          dampedProgressRef.current,
          target,
          delta,
          MOBILE_HERO_CAMERA_PROGRESS_DAMPING,
        );
    dampedProgressRef.current = progress;
    scrollState.set(progress);

    if (!framed.current || reduceMotion) return;

    const frame = frameRef.current;
    if (!frame || !(camera instanceof THREE.PerspectiveCamera)) return;

    applyMountainScrollCamera(
      camera,
      frame,
      mapHeroScrollProgress(progress),
      scratch.current,
      MOBILE_LOOK_AT_X_BEATS,
    );
  });

  return null;
}

export type SnowMountainMobileSceneProps = {
  className?: string;
  scrollState: HeroScrollState;
  pinMetricsRef: RefObject<HeroPinMetrics>;
  heroSectionRef: RefObject<HTMLElement | null>;
  reduceMotion?: boolean;
};

/** Mobile-only WebGL hero — fixed pin, portrait framing, no Stage wrapper. */
export function SnowMountainMobileScene({
  className,
  scrollState,
  pinMetricsRef,
  heroSectionRef,
  reduceMotion = false,
}: SnowMountainMobileSceneProps) {
  const [modelRoot, setModelRoot] = useState<THREE.Object3D | null>(null);
  const [sceneReady, setSceneReady] = useState(isSceneReady);
  const [frameloop, setFrameloop] = useState<"always" | "demand">("always");
  const canvasDpr = useMemo(() => getCanvasDprRange("mobile"), []);

  useEffect(() => {
    if (sceneReady) return;
    if (isSceneReady()) {
      setSceneReady(true);
      return;
    }
    void waitForScene().then(() => setSceneReady(true));
  }, [sceneReady]);

  useEffect(() => {
    if (reduceMotion) {
      setFrameloop("demand");
      return;
    }

    if (!sceneReady) {
      setFrameloop("always");
      return;
    }

    const section = heroSectionRef.current;
    if (!section) return;

    if (typeof IntersectionObserver === "undefined") {
      setFrameloop("always");
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        setFrameloop(entry?.isIntersecting ? "always" : "demand");
      },
      { root: null, rootMargin: "0px", threshold: 0 },
    );
    io.observe(section);
    return () => io.disconnect();
  }, [heroSectionRef, reduceMotion, sceneReady]);

  const glOptions = useMemo(
    () => ({
      antialias: true,
      powerPreference: "high-performance" as const,
    }),
    [],
  );

  return (
    <div className={cn("relative h-full w-full", className)}>
      <Canvas
        className="pointer-events-none absolute inset-0 h-full w-full"
        camera={{ fov: MOBILE_BASE_FOV, near: 0.1, far: 500 }}
        dpr={canvasDpr}
        frameloop={frameloop}
        gl={glOptions}
        onCreated={({ gl }) => {
          gl.setClearColor(new THREE.Color(SKY_COLOR), 1);
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1;
        }}
      >
        <SnowMountainSky quality="mobile" reduceMotion={reduceMotion} />

        <hemisphereLight args={["#b8d4f0", "#5a6a7a", 3]} />
        <ambientLight intensity={0.5} color="#f0f6ff" />
        <directionalLight
          position={[14, 28, 12]}
          intensity={0.75}
          color="#fff4e6"
        />

        <Suspense fallback={null}>
          <MobileMountainModel
            reduceMotion={reduceMotion}
            onReady={setModelRoot}
          />
          <MobileScrollRig
            scrollState={scrollState}
            pinMetricsRef={pinMetricsRef}
            heroSectionRef={heroSectionRef}
            modelRoot={modelRoot}
            reduceMotion={reduceMotion}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload(SNOW_MOUNTAIN_SOURCE_MODEL);
