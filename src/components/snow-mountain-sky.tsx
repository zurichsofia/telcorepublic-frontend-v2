"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { Sky } from "three/examples/jsm/objects/Sky.js";

/** Preetham-style sky - high sun, crisp cool blue (terrestrial daylight, not night). */
export function SnowMountainSky() {
  const sky = useMemo(() => {
    const s = new Sky();
    s.scale.setScalar(450_000);
    s.renderOrder = -1000;
    const mat = s.material as THREE.ShaderMaterial;
    mat.uniforms.turbidity.value = 2.4;
    mat.uniforms.rayleigh.value = 1.35;
    mat.uniforms.mieCoefficient.value = 0.0045;
    mat.uniforms.mieDirectionalG.value = 0.78;
    mat.uniforms.sunPosition.value.copy(
      new THREE.Vector3(0.42, 0.78, 0.46).normalize(),
    );
    mat.uniforms.up.value.set(0, 1, 0);
    mat.uniforms.cloudCoverage.value = 0.12;
    return s;
  }, []);

  return <primitive object={sky} />;
}
