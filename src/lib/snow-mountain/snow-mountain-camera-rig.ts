import * as THREE from "three";

/** Look above center, camera up, look left — same framing on desktop and mobile. */
export const FRAME_LOOK_AT_Y = 0.2;
export const FRAME_LOOK_AT_X = -0.1;
export const FRAME_CAMERA_Y = 0.12;
export const CAMERA_ADJUST = 0.48;
export const BASE_CAMERA_FOV = 40;

/** Copy-beat centers on camera progress (primary / telco / mission). */
export const SECTION_CENTER_1 = 1 / 6;
export const SECTION_CENTER_2 = 1 / 2;
export const SECTION_CENTER_3 = 5 / 6;

export const ORBIT_SECTION_1 = 0.3;
export const ORBIT_SECTION_2 = -0.1;
export const ORBIT_SECTION_3 = -1;

export const LIFT_SECTION_1 = 0.1;
export const LIFT_SECTION_2 = -0.1;
export const LIFT_SECTION_3 = 0;

export const LOOK_UP_SECTION_1 = 0.1;
export const LOOK_UP_SECTION_2 = 0.1;
export const LOOK_UP_SECTION_3 = 0;

export const LOOK_AT_X_SECTION_1 = 0;
export const LOOK_AT_X_SECTION_2 = 0.14;
export const LOOK_AT_X_SECTION_3 = 0;

export const YAW_SECTION_1 = 0.14;
export const YAW_SECTION_2 = -0.15;
export const YAW_SECTION_3 = 0;

export const DOLLY_SECTION_1 = 1;
export const DOLLY_SECTION_2 = 1;
export const DOLLY_SECTION_3 = 0.5;

export const FOV_SECTION_1 = 0;
export const FOV_SECTION_2 = 0;
export const FOV_SECTION_3 = 0;

const WORLD_UP = new THREE.Vector3(0, 1, 0);

function smoothstep(edge0: number, edge1: number, x: number): number {
  if (x <= edge0) return 0;
  if (x >= edge1) return 1;
  const u = (x - edge0) / (edge1 - edge0);
  return u * u * (3 - 2 * u);
}

export function sectionBlend(t: number, v1: number, v2: number, v3: number): number {
  if (t <= SECTION_CENTER_1) return v1;
  if (t <= SECTION_CENTER_2) {
    const u = smoothstep(SECTION_CENTER_1, SECTION_CENTER_2, t);
    return v1 + (v2 - v1) * u;
  }
  if (t <= SECTION_CENTER_3) {
    const u = smoothstep(SECTION_CENTER_2, SECTION_CENTER_3, t);
    return v2 + (v3 - v2) * u;
  }
  return v3;
}

export type MountainCameraFrame = {
  pivot: THREE.Vector3;
  basePosition: THREE.Vector3;
  baseFov: number;
  modelHeight: number;
  modelWidth: number;
};

/** Portrait height-fit — matches tuned desktop vertical composition. */
export function frameMountainCameraPortrait(
  camera: THREE.PerspectiveCamera,
  center: THREE.Vector3,
  modelSize: THREE.Vector3,
): MountainCameraFrame {
  const pivot = center.clone();
  pivot.y += modelSize.y * FRAME_LOOK_AT_Y;
  pivot.x += modelSize.x * FRAME_LOOK_AT_X;

  const fovRad = (camera.fov * Math.PI) / 180;
  const distance = (modelSize.y * 0.5) / Math.tan(fovRad / 2) / CAMERA_ADJUST;

  camera.position.set(
    pivot.x,
    pivot.y + modelSize.y * FRAME_CAMERA_Y,
    pivot.z + distance,
  );
  camera.lookAt(pivot);
  camera.updateProjectionMatrix();

  return {
    pivot,
    basePosition: camera.position.clone(),
    baseFov: camera.fov,
    modelHeight: modelSize.y,
    modelWidth: modelSize.x,
  };
}

/** Desktop Stage + bounds.lookAt path. */
export function frameMountainCameraDesktop(
  bounds: { lookAt: (opts: { target: THREE.Vector3 }) => void },
  camera: THREE.PerspectiveCamera,
  center: THREE.Vector3,
  modelSize: THREE.Vector3,
): MountainCameraFrame {
  const pivot = center.clone();
  pivot.y += modelSize.y * FRAME_LOOK_AT_Y;
  pivot.x += modelSize.x * FRAME_LOOK_AT_X;
  bounds.lookAt({ target: pivot });
  camera.position.y += modelSize.y * FRAME_CAMERA_Y;
  camera.updateProjectionMatrix();

  return {
    pivot,
    basePosition: camera.position.clone(),
    baseFov: camera.fov,
    modelHeight: modelSize.y,
    modelWidth: modelSize.x,
  };
}

export type ApplyMountainScrollCameraScratch = {
  lookAt: THREE.Vector3;
  position: THREE.Vector3;
  lastFov: number | null;
};

export function applyMountainScrollCamera(
  camera: THREE.PerspectiveCamera,
  frame: MountainCameraFrame,
  cameraT: number,
  scratch: ApplyMountainScrollCameraScratch,
): void {
  const h = frame.modelHeight;
  const w = frame.modelWidth;

  const orbitRad = sectionBlend(cameraT, ORBIT_SECTION_1, ORBIT_SECTION_2, ORBIT_SECTION_3);
  const liftY = sectionBlend(cameraT, LIFT_SECTION_1, LIFT_SECTION_2, LIFT_SECTION_3) * h;
  const lookUpY =
    sectionBlend(cameraT, LOOK_UP_SECTION_1, LOOK_UP_SECTION_2, LOOK_UP_SECTION_3) * h;
  const lookAtX =
    sectionBlend(cameraT, LOOK_AT_X_SECTION_1, LOOK_AT_X_SECTION_2, LOOK_AT_X_SECTION_3) * w;
  const yaw = sectionBlend(cameraT, YAW_SECTION_1, YAW_SECTION_2, YAW_SECTION_3);
  const dolly = sectionBlend(cameraT, DOLLY_SECTION_1, DOLLY_SECTION_2, DOLLY_SECTION_3);
  const fovDelta = sectionBlend(cameraT, FOV_SECTION_1, FOV_SECTION_2, FOV_SECTION_3);

  const dx = frame.basePosition.x - frame.pivot.x;
  const dz = frame.basePosition.z - frame.pivot.z;
  let r = Math.hypot(dx, dz);
  if (r < 0.02) r = 0.02;
  r *= dolly;

  const theta0 = Math.atan2(dx, dz);
  const theta = theta0 + orbitRad;
  scratch.position.set(
    frame.pivot.x + r * Math.sin(theta),
    frame.basePosition.y + liftY,
    frame.pivot.z + r * Math.cos(theta),
  );
  camera.position.copy(scratch.position);
  scratch.lookAt.set(frame.pivot.x + lookAtX, frame.pivot.y + lookUpY, frame.pivot.z);
  camera.lookAt(scratch.lookAt);
  if (yaw !== 0) camera.rotateOnWorldAxis(WORLD_UP, yaw);

  const nextFov = Math.round((frame.baseFov + fovDelta) * 10) / 10;
  if (scratch.lastFov !== nextFov) {
    camera.fov = nextFov;
    camera.updateProjectionMatrix();
    scratch.lastFov = nextFov;
  }
}

export function computeModelBounds(object: THREE.Object3D): {
  center: THREE.Vector3;
  size: THREE.Vector3;
} {
  const box = new THREE.Box3().setFromObject(object);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  return { center, size };
}
