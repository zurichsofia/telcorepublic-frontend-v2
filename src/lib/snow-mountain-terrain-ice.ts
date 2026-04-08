import * as THREE from "three";

/** Ice white / precision palette - terrain & theme */
export const ICE = {
  50: "#F0F4FA",
  100: "#D8E2F0",
  200: "#B8C8E0",
  400: "#7A96BC",
  600: "#4D72A0",
  800: "#2A4A78",
  950: "#12264A",
} as const;

/** Wireframe / edge highlight */
export const T_RIDGE = "#8A8882";
/** Deep valley fill (mixed in shader) */
export const T_DEEP = "#0C0D0B";
/** Subtle warm rim on peaks — kept low so snow reads photographic, not emissive CG. */
export const T_BLOOM = "#D4CEC8";

function patchTerrainMaterial(
  mesh: THREE.Mesh,
  mat: THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial,
) {
  const geo = mesh.geometry;
  if (!geo.boundingBox) geo.computeBoundingBox();
  const bbox = geo.boundingBox!;
  const minY = bbox.min.y;
  const maxY = bbox.max.y;
  const range = Math.max(maxY - minY, 1e-4);

  const uDeep = new THREE.Color(T_DEEP);
  const uAmber = new THREE.Color(T_BLOOM);

  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uDeep = { value: uDeep };
    shader.uniforms.uAmber = { value: uAmber };
    shader.uniforms.uMinY = { value: minY };
    shader.uniforms.uRange = { value: range };

    shader.vertexShader = shader.vertexShader.replace(
      "#include <common>",
      `#include <common>
varying float vWorldY;`,
    );
    shader.vertexShader = shader.vertexShader.replace(
      "#include <begin_vertex>",
      `#include <begin_vertex>
vWorldY = (modelMatrix * vec4(transformed, 1.0)).y;`,
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <common>",
      `#include <common>
varying float vWorldY;
uniform vec3 uDeep;
uniform vec3 uAmber;
uniform float uMinY;
uniform float uRange;`,
    );

    const iceMix = `{
  float valley = 1.0 - smoothstep(uMinY, uMinY + uRange * 0.48, vWorldY);
  gl_FragColor.rgb = mix(gl_FragColor.rgb, uDeep, valley * 0.48);
  float peak = smoothstep(uMinY + uRange * 0.72, uMinY + uRange, vWorldY);
  gl_FragColor.rgb += uAmber * peak * 0.018;
}`;
    if (shader.fragmentShader.includes("#include <dithering_fragment>")) {
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <dithering_fragment>",
        `#include <dithering_fragment>
${iceMix}`,
      );
    } else {
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <fog_fragment>",
        `#include <fog_fragment>
${iceMix}`,
      );
    }
  };

  mat.needsUpdate = true;
}

const ridgeColor = new THREE.Color(T_RIDGE);

/**
 * Ice terrain: valley tint, ridge edge lines, peak emissive for amber-tinted bloom.
 */
export function applyTerrainIceStyle(root: THREE.Object3D) {
  root.traverse((obj) => {
    if (!(obj instanceof THREE.Mesh)) return;
    if (obj.geometry == null) return;

    const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
    const nextMats = mats.map((m) => {
      if (
        m instanceof THREE.MeshStandardMaterial ||
        m instanceof THREE.MeshPhysicalMaterial
      ) {
        const c = m.clone();
        if ("fog" in c) (c as { fog: boolean; }).fog = true;
        /* Powder snow: diffuse, low spec — avoids mirror-like HDRI hotspots on peaks. */
        c.metalness = 0;
        c.roughness = THREE.MathUtils.clamp(
          (c.roughness ?? 0.5) + 0.28,
          0.82,
          1,
        );
        c.envMapIntensity = 0.14;
        if (c instanceof THREE.MeshPhysicalMaterial) {
          c.clearcoat = 0;
        }
        patchTerrainMaterial(obj, c);
        return c;
      }
      if (m && "fog" in m) (m as { fog: boolean; }).fog = true;
      return m;
    });
    obj.material = nextMats.length === 1 ? nextMats[0]! : nextMats;

    const geo = obj.geometry;
    if (!geo.boundingBox) geo.computeBoundingBox();
    const edgeGeo = new THREE.EdgesGeometry(geo, 24);
    const edges = new THREE.LineSegments(
      edgeGeo,
      new THREE.LineBasicMaterial({
        color: ridgeColor,
        transparent: true,
        opacity: 0.4,
        depthWrite: false,
      }),
    );
    edges.renderOrder = 2;
    obj.add(edges);
  });
}
