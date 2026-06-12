"use client";

import { useState } from "react";

import {
  getSceneQuality,
  type SceneQuality,
} from "@/lib/snow-mountain/scene-quality";

export function useSceneQuality(): SceneQuality {
  const [quality] = useState<SceneQuality>(() =>
    typeof window !== "undefined" ? getSceneQuality() : "desktop",
  );

  return quality;
}
