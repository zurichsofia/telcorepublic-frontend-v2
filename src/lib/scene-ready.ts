/**
 * Signal used by the landing hero loader to wait until the Three.js scene is
 * framed and ready to reveal.
 *
 * Usage:
 *   1. Call `registerScene()` at module level in the scene file.
 *   2. Call `markSceneReady()` once the model is mounted and the first frame
 *      is composed (or immediately for reduced-motion fallbacks).
 *   3. The hero loader calls `waitForScene()` via `useSceneReady()`.
 */

let _registered = false;
let _resolved = false;
let _resolve: (() => void) | undefined;

const _promise = new Promise<void>((res) => {
  _resolve = res;
});

/** Register at module level so the loader knows to wait. */
export function registerScene(): void {
  _registered = true;
}

/** Fire from a useEffect once the Three.js model is mounted and rendered. */
export function markSceneReady(): void {
  if (_resolved) return;
  _resolved = true;
  _resolve?.();
}

/** True if a scene has called registerScene(). */
export function isSceneRegistered(): boolean {
  return _registered;
}

/** True once markSceneReady() has been called. */
export function isSceneReady(): boolean {
  return _resolved;
}

/** Promise that resolves when markSceneReady() is called. */
export function waitForScene(): Promise<void> {
  if (_resolved) return Promise.resolve();
  return _promise;
}
