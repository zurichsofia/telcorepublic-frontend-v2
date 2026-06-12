"use client";

import type { MutableRefObject, RefObject } from "react";
import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stage, useBounds, useGLTF } from "@react-three/drei";
import * as THREE from "three";

import { HeroScrollLayoutSync } from "@/components/landing/snow-mountain/scene/hero-scroll-layout-sync";
import { SnowMountainSky } from "@/components/landing/snow-mountain/scene/snow-mountain-sky";
import { useSceneQuality } from "@/hooks/use-scene-quality";
import type { HeroScrollState } from "@/lib/snow-mountain/hero-scroll-state";
import type { SnowMountainParallaxMotion } from "@/lib/snow-mountain/snow-mountain-parallax-motion";
import {
  applyMountainScrollCamera,
  BASE_CAMERA_FOV,
  CAMERA_ADJUST,
  frameMountainCameraDesktop,
  frameMountainCameraPortrait,
  type ApplyMountainScrollCameraScratch,
  type MountainCameraFrame,
} from "@/lib/snow-mountain/snow-mountain-camera-rig";
import { SNOW_MOUNTAIN_SOURCE_MODEL } from "@/lib/snow-mountain/snow-mountain-model";
import { getCanvasDprRange } from "@/lib/snow-mountain/scene-quality";
import {
  isSceneReady,
  markSceneReady,
  registerScene,
  waitForScene,
} from "@/lib/scene-ready";
import { mapHeroScrollProgress } from "@/lib/snow-mountain/snow-mountain-hero-scroll";
import { cn } from "@/lib/utils";

const SKY_COLOR = "#e8e8e8";

useGLTF.preload(SNOW_MOUNTAIN_SOURCE_MODEL);
registerScene();

function SnowMountainV2Model({ reduceMotion }: { reduceMotion: boolean }) {
  const { scene } = useGLTF(SNOW_MOUNTAIN_SOURCE_MODEL);

  useEffect(() => {
    if (reduceMotion) markSceneReady();
  }, [reduceMotion]);

  return <primitive object={scene} />;
}

function V2ScrollCamera({
  scrollState,
  reduceMotion,
}: {
  scrollState?: HeroScrollState;
  reduceMotion: boolean;
}) {
  const bounds = useBounds();
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const framed = useRef(false);
  const waitFrames = useRef(0);
  const frameRef = useRef<MountainCameraFrame | null>(null);
  const scratch = useRef<ApplyMountainScrollCameraScratch>({
    lookAt: new THREE.Vector3(),
    position: new THREE.Vector3(),
    lastFov: null,
  });
  const modelCenterRef = useRef(new THREE.Vector3());
  const modelSizeRef = useRef(new THREE.Vector3());

  useFrame(() => {
    if (!(camera instanceof THREE.PerspectiveCamera)) return;

    const { center, size: modelSize } = framed.current
      ? { center: modelCenterRef.current, size: modelSizeRef.current }
      : bounds.getSize();
    if (modelSize.y < 1e-6) return;

    if (!framed.current) {
      waitFrames.current += 1;
      if (waitFrames.current < 4) return;

      const usePortrait = size.width < size.height;
      frameRef.current = usePortrait
        ? frameMountainCameraPortrait(camera, center, modelSize)
        : frameMountainCameraDesktop(bounds, camera, center, modelSize);

      modelCenterRef.current.copy(center);
      modelSizeRef.current.copy(modelSize);
      framed.current = true;
      markSceneReady();
      return;
    }

    const frame = frameRef.current;
    if (!frame || reduceMotion) return;

    const raw = scrollState?.get() ?? 0;
    applyMountainScrollCamera(
      camera,
      frame,
      mapHeroScrollProgress(raw),
      scratch.current,
    );
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

/** Desktop hero scene — Stage auto-fit, Lenis scroll, demand frameloop off-screen. */
export function SnowMountainV2SimpleScene({
  className,
  scrollState,
  heroSectionRef,
  motionRef,
  reduceMotion = false,
}: SnowMountainV2SimpleSceneProps) {
  const syncScroll =
    scrollState != null && heroSectionRef != null && motionRef != null;
  const quality = useSceneQuality();
  const canvasDpr = useMemo(() => getCanvasDprRange(quality), [quality]);
  const [sceneReady, setSceneReady] = useState(isSceneReady);
  const [frameloop, setFrameloop] = useState<"always" | "demand">("always");

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

    const section = heroSectionRef?.current;
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
      antialias: quality !== "low",
      powerPreference: "high-performance" as const,
    }),
    [quality],
  );

  return (
    <div className={cn("relative h-full w-full", className)}>
      <Canvas
        className="pointer-events-none absolute inset-0 h-full w-full"
        camera={{ fov: BASE_CAMERA_FOV, near: 0.1, far: 500 }}
        dpr={canvasDpr}
        frameloop={frameloop}
        gl={glOptions}
        onCreated={({ gl }) => {
          gl.setClearColor(new THREE.Color(SKY_COLOR), 1);
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1;
        }}
      >
        <SnowMountainSky quality={quality} reduceMotion={reduceMotion} />

        {syncScroll ? (
          <HeroScrollLayoutSync
            sectionRef={heroSectionRef}
            scrollState={scrollState}
            motionRef={motionRef}
            reduceMotion={reduceMotion}
          />
        ) : null}

        <hemisphereLight args={["#b8d4f0", "#5a6a7a", 3]} />
        <ambientLight intensity={0.5} color="#f0f6ff" />
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
            <SnowMountainV2Model reduceMotion={reduceMotion} />
            <V2ScrollCamera
              scrollState={scrollState}
              reduceMotion={reduceMotion}
            />
          </Stage>
        </Suspense>
      </Canvas>
    </div>
  );
}
