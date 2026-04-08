/**
 * Opt-in signal so the PageLoader waits until the Three.js scene has actually
 * rendered rather than dismissing as soon as fonts + window.load are done.
 *
 * Usage:
 *   1. Call `registerScene()` at module level in the scene file — this must
 *      happen synchronously during JS evaluation, before any React effects run.
 *   2. Call `markSceneReady()` inside a `useEffect` in the innermost model
 *      component (fires after Suspense resolves and the GLB is mounted).
 *   3. The PageLoader calls `isSceneRegistered()` to decide whether to include
 *      `waitForScene()` in its Promise.all.
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

/** True if a scene has called registerScene() — loader uses this to opt in. */
export function isSceneRegistered(): boolean {
  return _registered;
}

/** Promise that resolves when markSceneReady() is called. */
export function waitForScene(): Promise<void> {
  if (_resolved) return Promise.resolve();
  return _promise;
}
