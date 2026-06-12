"use client";

import { useEffect, useState } from "react";

import { isSceneReady, waitForScene } from "@/lib/scene-ready";

export function useSceneReady(): boolean {
  const [ready, setReady] = useState(isSceneReady);

  useEffect(() => {
    if (ready) return;
    if (isSceneReady()) {
      setReady(true);
      return;
    }
    void waitForScene().then(() => setReady(true));
  }, [ready]);

  return ready;
}
