import * as THREE from "three";

function hash2D(n: number): number {
  const s = Math.sin(n) * 43758.5453123;
  return s - Math.floor(s);
}

function valueNoise2D(x: number, y: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  const a = hash2D(ix * 57 + iy * 131);
  const b = hash2D((ix + 1) * 57 + iy * 131);
  const c = hash2D(ix * 57 + (iy + 1) * 131);
  const d = hash2D((ix + 1) * 57 + (iy + 1) * 131);
  const x1 = a + (b - a) * ux;
  const x2 = c + (d - c) * ux;
  return x1 + (x2 - x1) * uy;
}

/** Fractal brownian motion — used for cloud-wisp sprite maps. */
export function fbm2D(x: number, y: number, octaves: number): number {
  let value = 0;
  let amplitude = 0.5;
  let frequency = 1;
  for (let i = 0; i < octaves; i++) {
    value += amplitude * valueNoise2D(x * frequency, y * frequency);
    amplitude *= 0.5;
    frequency *= 2;
  }
  return value;
}

/** Soft circular point — additive-friendly alpha falloff. */
export function createSoftCircleTexture(size = 64): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2d context unavailable");
  const cx = size / 2;
  const g = ctx.createRadialGradient(cx, cx, 0, cx, cx, cx * 0.98);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.22, "rgba(255,255,255,0.55)");
  g.addColorStop(0.55, "rgba(255,255,255,0.12)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

/** Blurred radial blob for additive nebula layers. */
export function createRadialNebulaTexture(size = 256): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2d context unavailable");
  const cx = size / 2;
  const g = ctx.createRadialGradient(cx, cx, 0, cx, cx, size * 0.48);
  g.addColorStop(0, "rgba(255,255,255,0.95)");
  g.addColorStop(0.12, "rgba(255,255,255,0.45)");
  g.addColorStop(0.35, "rgba(255,255,255,0.12)");
  g.addColorStop(0.65, "rgba(255,255,255,0.02)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

/** Single 512×512 FBM grayscale — shared; clone per sprite for independent UV scroll. */
export function createFbmNoiseTexture(resolution = 512): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = resolution;
  canvas.height = resolution;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2d context unavailable");
  const img = ctx.createImageData(resolution, resolution);
  const data = img.data;
  const octaves = 6;
  for (let y = 0; y < resolution; y++) {
    for (let x = 0; x < resolution; x++) {
      const nx = (x / resolution) * 4;
      const ny = (y / resolution) * 4;
      const v = fbm2D(nx, ny, octaves);
      const g = Math.floor(Math.min(255, Math.max(0, v * 255)));
      const i = (y * resolution + x) * 4;
      data[i] = g;
      data[i + 1] = g;
      data[i + 2] = g;
      data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.needsUpdate = true;
  return tex;
}
