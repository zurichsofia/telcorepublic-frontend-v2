"use client";

import { useEffect, useRef } from 'react';
import {
  Clock,
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderer
} from 'three';

import { getLenisScrollY, isLenisActive, subscribeLenisScroll } from '@/lib/lenis-scroll';

const vertexShader = `
precision highp float;

void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform float iTime;
uniform vec3  iResolution;
uniform float animationSpeed;

uniform bool enableTop;
uniform bool enableMiddle;
uniform bool enableBottom;

uniform int topLineCount;
uniform int middleLineCount;
uniform int bottomLineCount;

uniform float topLineDistance;
uniform float middleLineDistance;
uniform float bottomLineDistance;

uniform vec3 topWavePosition;
uniform vec3 middleWavePosition;
uniform vec3 bottomWavePosition;

uniform vec2 iMouse;
uniform bool interactive;
uniform float bendRadius;
uniform float bendStrength;
uniform float bendInfluence;

uniform bool parallax;
uniform float parallaxStrength;
uniform vec2 parallaxOffset;

uniform vec3 lineGradient[8];
uniform int lineGradientCount;

uniform float uLightBackground;

const vec3 BLACK = vec3(0.0);
const vec3 PINK  = vec3(233.0, 71.0, 245.0) / 255.0;
const vec3 BLUE  = vec3(47.0,  75.0, 162.0) / 255.0;

mat2 rotate(float r) {
  return mat2(cos(r), sin(r), -sin(r), cos(r));
}

vec3 background_color(vec2 uv) {
  vec3 col = vec3(0.0);

  float y = sin(uv.x - 0.2) * 0.3 - 0.1;
  float m = uv.y - y;

  col += mix(BLUE, BLACK, smoothstep(0.0, 1.0, abs(m)));
  col += mix(PINK, BLACK, smoothstep(0.0, 1.0, abs(m - 0.8)));
  return col * 0.5;
}

vec3 getLineColor(float t, vec3 baseColor) {
  if (lineGradientCount <= 0) {
    return baseColor;
  }

  vec3 gradientColor;
  
  if (lineGradientCount == 1) {
    gradientColor = lineGradient[0];
  } else {
    float clampedT = clamp(t, 0.0, 0.9999);
    float scaled = clampedT * float(lineGradientCount - 1);
    int idx = int(floor(scaled));
    float f = fract(scaled);
    int idx2 = min(idx + 1, lineGradientCount - 1);

    vec3 c1 = lineGradient[idx];
    vec3 c2 = lineGradient[idx2];
    
    gradientColor = mix(c1, c2, f);
  }
  
  float tone = mix(0.5, 0.44, step(0.5, uLightBackground));
  return gradientColor * tone;
}

  float wave(vec2 uv, float offset, vec2 screenUv, vec2 mouseUv, bool shouldBend) {
  float time = iTime * animationSpeed;

  float x_offset   = offset;
  float x_movement = time * 0.1;
  float amp        = sin(offset + time * 0.2) * 0.3;
  float y          = sin(uv.x + x_offset + x_movement) * amp;

  if (shouldBend) {
    vec2 d = screenUv - mouseUv;
    float influence = exp(-dot(d, d) * bendRadius);
    float bendOffset = (mouseUv.y - screenUv.y) * influence * bendStrength * bendInfluence;
    y += bendOffset;
  }

  float m = uv.y - y;
  if (uLightBackground > 0.5) {
    return 0.0108 / max(abs(m) + 0.0046, 1e-4) + 0.0034;
  }
  return 0.0175 / max(abs(m) + 0.01, 1e-3) + 0.01;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 baseUv = (2.0 * fragCoord - iResolution.xy) / iResolution.y;
  baseUv.y *= -1.0;
  
  if (parallax) {
    baseUv += parallaxOffset;
  }

  vec3 col = vec3(0.0);

  vec3 b = lineGradientCount > 0 ? vec3(0.0) : background_color(baseUv);

  vec2 mouseUv = vec2(0.0);
  if (interactive) {
    mouseUv = (2.0 * iMouse - iResolution.xy) / iResolution.y;
    mouseUv.y *= -1.0;
  }
  
  if (enableBottom) {
    for (int i = 0; i < bottomLineCount; ++i) {
      float fi = float(i);
      float t = fi / max(float(bottomLineCount - 1), 1.0);
      vec3 lineCol = getLineColor(t, b);
      
      float angle = bottomWavePosition.z * log(length(baseUv) + 1.0);
      vec2 ruv = baseUv * rotate(angle);
      float bottomGain = mix(0.2, 0.24, step(0.5, uLightBackground));
      col += lineCol * wave(
        ruv + vec2(bottomLineDistance * fi + bottomWavePosition.x, bottomWavePosition.y),
        1.5 + 0.2 * fi,
        baseUv,
        mouseUv,
        interactive
      ) * bottomGain;
    }
  }

  if (enableMiddle) {
    for (int i = 0; i < middleLineCount; ++i) {
      float fi = float(i);
      float t = fi / max(float(middleLineCount - 1), 1.0);
      vec3 lineCol = getLineColor(t, b);
      
      float angle = middleWavePosition.z * log(length(baseUv) + 1.0);
      vec2 ruv = baseUv * rotate(angle);
      float middleGain = mix(1.0, 0.26, step(0.5, uLightBackground));
      col += lineCol * wave(
        ruv + vec2(middleLineDistance * fi + middleWavePosition.x, middleWavePosition.y),
        2.0 + 0.15 * fi,
        baseUv,
        mouseUv,
        interactive
      ) * middleGain;
    }
  }

  if (enableTop) {
    for (int i = 0; i < topLineCount; ++i) {
      float fi = float(i);
      float t = fi / max(float(topLineCount - 1), 1.0);
      vec3 lineCol = getLineColor(t, b);
      
      float angle = topWavePosition.z * log(length(baseUv) + 1.0);
      vec2 ruv = baseUv * rotate(angle);
      ruv.x *= -1.0;
      float topGain = mix(0.1, 0.22, step(0.5, uLightBackground));
      col += lineCol * wave(
        ruv + vec2(topLineDistance * fi + topWavePosition.x, topWavePosition.y),
        1.0 + 0.2 * fi,
        baseUv,
        mouseUv,
        interactive
      ) * topGain;
    }
  }

  if (uLightBackground > 0.5) {
    float energy = length(col);
    float lum = dot(col, vec3(0.2126, 0.7152, 0.0722));
    float floorEnergy = 0.058;
    if (energy < floorEnergy && lum < 0.028) {
      fragColor = vec4(1.0, 1.0, 1.0, 1.0);
    } else {
      float n = clamp((energy - floorEnergy) * 1.18, 0.0, 1.0);
      n = pow(n, 1.02) * 0.76;
      vec3 dir = normalize(max(col, vec3(1e-5)));
      vec3 soft = mix(vec3(lum), dir, 0.82);
      fragColor = vec4(mix(vec3(1.0), soft, n), 1.0);
    }
  } else {
    fragColor = vec4(col, 1.0);
  }
}

void main() {
  vec4 color = vec4(0.0);
  mainImage(color, gl_FragCoord.xy);
  gl_FragColor = color;
}
`;

const MAX_GRADIENT_STOPS = 8;

type WavePosition = {
  x: number;
  y: number;
  rotate: number;
};

type FloatingLinesProps = {
  linesGradient?: string[];
  enabledWaves?: Array<'top' | 'middle' | 'bottom'>;
  lineCount?: number | number[];
  lineDistance?: number | number[];
  topWavePosition?: WavePosition;
  middleWavePosition?: WavePosition;
  bottomWavePosition?: WavePosition;
  animationSpeed?: number;
  interactive?: boolean;
  bendRadius?: number;
  bendStrength?: number;
  mouseDamping?: number;
  /**
   * Enables parallax UV shift. When false, both mouse and scroll parallax are off.
   * When true and `scrollParallaxStrength` > 0, only scroll parallax runs (mouse is skipped).
   */
  parallax?: boolean;
  parallaxStrength?: number;
  /**
   * Scroll-driven UV shift strength (requires `parallax={true}`). Maps scroll progress to
   * `parallaxOffset` (use with `scrollParallaxSectionId` on long sections).
   */
  scrollParallaxStrength?: number;
  scrollParallaxSectionId?: string;
  mixBlendMode?: React.CSSProperties['mixBlendMode'];
  /** Map additive strokes onto a white field (Why Us / app backdrop). */
  lightBackground?: boolean;
  /** Cap device pixel ratio (default 2). */
  maxPixelRatio?: number;
  /** Max render rate for non-interactive backgrounds (default 24). */
  animationFps?: number;
};

function hexToVec3(hex: string): Vector3 {
  let value = hex.trim();

  if (value.startsWith('#')) {
    value = value.slice(1);
  }

  let r = 255;
  let g = 255;
  let b = 255;

  if (value.length === 3) {
    r = parseInt(value[0] + value[0], 16);
    g = parseInt(value[1] + value[1], 16);
    b = parseInt(value[2] + value[2], 16);
  } else if (value.length === 6) {
    r = parseInt(value.slice(0, 2), 16);
    g = parseInt(value.slice(2, 4), 16);
    b = parseInt(value.slice(4, 6), 16);
  }

  return new Vector3(r / 255, g / 255, b / 255);
}

export default function FloatingLines({
  linesGradient,
  enabledWaves = ['top', 'middle', 'bottom'],
  lineCount = [6],
  lineDistance = [5],
  topWavePosition,
  middleWavePosition,
  bottomWavePosition = { x: 2.0, y: -0.7, rotate: -1 },
  animationSpeed = 1,
  interactive = true,
  bendRadius = 5.0,
  bendStrength = -0.5,
  mouseDamping = 0.05,
  parallax = true,
  parallaxStrength = 0.2,
  scrollParallaxStrength = 0,
  scrollParallaxSectionId,
  mixBlendMode = 'screen',
  lightBackground = false,
  maxPixelRatio = 2,
  animationFps = 24,
}: FloatingLinesProps) {
  const useScrollParallax = parallax && scrollParallaxStrength > 0;
  const useMouseParallax = parallax && scrollParallaxStrength <= 0;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const targetMouseRef = useRef<Vector2>(new Vector2(-1000, -1000));
  const currentMouseRef = useRef<Vector2>(new Vector2(-1000, -1000));
  const targetInfluenceRef = useRef<number>(0);
  const currentInfluenceRef = useRef<number>(0);
  const targetParallaxRef = useRef<Vector2>(new Vector2(0, 0));
  const currentParallaxRef = useRef<Vector2>(new Vector2(0, 0));

  const getLineCount = (waveType: 'top' | 'middle' | 'bottom'): number => {
    if (typeof lineCount === 'number') return lineCount;
    if (!enabledWaves.includes(waveType)) return 0;
    const index = enabledWaves.indexOf(waveType);
    return lineCount[index] ?? 6;
  };

  const getLineDistance = (waveType: 'top' | 'middle' | 'bottom'): number => {
    if (typeof lineDistance === 'number') return lineDistance;
    if (!enabledWaves.includes(waveType)) return 0.1;
    const index = enabledWaves.indexOf(waveType);
    return lineDistance[index] ?? 0.1;
  };

  const topLineCount = enabledWaves.includes('top') ? getLineCount('top') : 0;
  const middleLineCount = enabledWaves.includes('middle') ? getLineCount('middle') : 0;
  const bottomLineCount = enabledWaves.includes('bottom') ? getLineCount('bottom') : 0;

  const topLineDistance = enabledWaves.includes('top') ? getLineDistance('top') * 0.01 : 0.01;
  const middleLineDistance = enabledWaves.includes('middle') ? getLineDistance('middle') * 0.01 : 0.01;
  const bottomLineDistance = enabledWaves.includes('bottom') ? getLineDistance('bottom') * 0.01 : 0.01;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let active = true;

    const scene = new Scene();

    const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    camera.position.z = 1;

    const renderer = new WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, maxPixelRatio),
    );
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    const uniforms = {
      iTime: { value: 0 },
      iResolution: { value: new Vector3(1, 1, 1) },
      animationSpeed: { value: animationSpeed },

      enableTop: { value: enabledWaves.includes('top') },
      enableMiddle: { value: enabledWaves.includes('middle') },
      enableBottom: { value: enabledWaves.includes('bottom') },

      topLineCount: { value: topLineCount },
      middleLineCount: { value: middleLineCount },
      bottomLineCount: { value: bottomLineCount },

      topLineDistance: { value: topLineDistance },
      middleLineDistance: { value: middleLineDistance },
      bottomLineDistance: { value: bottomLineDistance },

      topWavePosition: {
        value: new Vector3(topWavePosition?.x ?? 10.0, topWavePosition?.y ?? 0.5, topWavePosition?.rotate ?? -0.4)
      },
      middleWavePosition: {
        value: new Vector3(
          middleWavePosition?.x ?? 5.0,
          middleWavePosition?.y ?? 0.0,
          middleWavePosition?.rotate ?? 0.2
        )
      },
      bottomWavePosition: {
        value: new Vector3(
          bottomWavePosition?.x ?? 2.0,
          bottomWavePosition?.y ?? -0.7,
          bottomWavePosition?.rotate ?? 0.4
        )
      },

      iMouse: { value: new Vector2(-1000, -1000) },
      interactive: { value: interactive },
      bendRadius: { value: bendRadius },
      bendStrength: { value: bendStrength },
      bendInfluence: { value: 0 },

      parallax: { value: useMouseParallax || useScrollParallax },
      parallaxStrength: { value: parallaxStrength },
      parallaxOffset: { value: new Vector2(0, 0) },

      lineGradient: {
        value: Array.from({ length: MAX_GRADIENT_STOPS }, () => new Vector3(1, 1, 1))
      },
      lineGradientCount: { value: 0 },

      uLightBackground: { value: lightBackground ? 1 : 0 }
    };

    if (linesGradient && linesGradient.length > 0) {
      const stops = linesGradient.slice(0, MAX_GRADIENT_STOPS);
      uniforms.lineGradientCount.value = stops.length;

      stops.forEach((hex, i) => {
        const color = hexToVec3(hex);
        uniforms.lineGradient.value[i].set(color.x, color.y, color.z);
      });
    }

    const material = new ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader
    });

    const geometry = new PlaneGeometry(2, 2);
    const mesh = new Mesh(geometry, material);
    scene.add(mesh);

    const clock = new Clock();

    const setSize = () => {
      if (!active) return;
      const width = container.clientWidth || 1;
      const height = container.clientHeight || 1;

      renderer.setSize(width, height, false);

      const canvasWidth = renderer.domElement.width;
      const canvasHeight = renderer.domElement.height;
      uniforms.iResolution.value.set(canvasWidth, canvasHeight, 1);
    };

    setSize();

    const ro =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => {
          if (!active) return;
          setSize();
        })
        : null;

    if (ro) ro.observe(container);

    let sectionScrollTop = 0;
    let sectionScrollHeight = 0;

    const syncSectionScrollMetrics = () => {
      if (!scrollParallaxSectionId || typeof document === 'undefined') return;

      const section = document.getElementById(scrollParallaxSectionId);
      if (!section) return;

      const vh = Math.max(window.innerHeight, 1);
      const rect = section.getBoundingClientRect();
      const scrollY = getLenisScrollY();
      sectionScrollTop = scrollY + rect.top;
      sectionScrollHeight = Math.max(rect.height, vh);
    };

    if (scrollParallaxSectionId) {
      syncSectionScrollMetrics();
      window.addEventListener('resize', syncSectionScrollMetrics, { passive: true });
    }

    const sectionMetricsRo =
      scrollParallaxSectionId && typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => {
          if (!active) return;
          syncSectionScrollMetrics();
        })
        : null;

    if (sectionMetricsRo && scrollParallaxSectionId) {
      const sectionEl = document.getElementById(scrollParallaxSectionId);
      if (sectionEl) sectionMetricsRo.observe(sectionEl);
    }

    const applyPointer = (clientX: number, clientY: number) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const dpr = renderer.getPixelRatio();

      if (interactive) {
        targetMouseRef.current.set(x * dpr, (rect.height - y) * dpr);
        targetInfluenceRef.current = 1.0;
      }

      if (useMouseParallax) {
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const offsetX = (x - centerX) / rect.width;
        const offsetY = -(y - centerY) / rect.height;
        targetParallaxRef.current.set(
          offsetX * parallaxStrength,
          offsetY * parallaxStrength,
        );
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      applyPointer(event.clientX, event.clientY);
    };

    const handleWindowPointerMove = (event: PointerEvent) => {
      applyPointer(event.clientX, event.clientY);
    };

    const handlePointerLeave = () => {
      targetInfluenceRef.current = 0.0;
      if (useMouseParallax) {
        targetParallaxRef.current.set(0, 0);
      }
    };

    const trackPointerOnWindow = useMouseParallax && !interactive;

    if (trackPointerOnWindow) {
      window.addEventListener('pointermove', handleWindowPointerMove, {
        passive: true,
      });
    } else if (interactive || useMouseParallax) {
      renderer.domElement.addEventListener('pointermove', handlePointerMove);
      renderer.domElement.addEventListener('pointerleave', handlePointerLeave);
    }

    const PREWARM_VH = 1;
    let sectionVisible = !scrollParallaxSectionId;

    let raf = 0;
    let loopRunning = false;
    let lastRenderMs = 0;
    const minFrameMs = 1000 / Math.max(animationFps, 1);

    const scheduleLoop = () => {
      if (!active || loopRunning) return;
      if (scrollParallaxSectionId && !sectionVisible) return;
      loopRunning = true;
      raf = requestAnimationFrame(renderLoop);
    };

    const getSectionInView = () => {
      const scrollY = getLenisScrollY();
      const vh = Math.max(window.innerHeight, 1);
      const sectionBottom = sectionScrollTop + sectionScrollHeight;
      return (
        scrollY + vh > sectionScrollTop - vh * PREWARM_VH &&
        scrollY < sectionBottom
      );
    };

    const shouldAnimate = () => {
      if (!active) return false;
      if (scrollParallaxSectionId && !sectionVisible) return false;
      if (scrollParallaxSectionId && typeof window !== 'undefined') {
        return getSectionInView();
      }
      return true;
    };

    const renderFrame = (now: number) => {
      if (!shouldAnimate()) return;
      if (now - lastRenderMs < minFrameMs) return;
      lastRenderMs = now;

      uniforms.iTime.value = clock.getElapsedTime();

      if (interactive) {
        currentMouseRef.current.lerp(targetMouseRef.current, mouseDamping);
        uniforms.iMouse.value.copy(currentMouseRef.current);

        currentInfluenceRef.current += (targetInfluenceRef.current - currentInfluenceRef.current) * mouseDamping;
        uniforms.bendInfluence.value = currentInfluenceRef.current;
      }

      let scrollPx = 0;
      let scrollPy = 0;

      if (useScrollParallax && typeof window !== 'undefined') {
        const s = scrollParallaxStrength;
        const vh = Math.max(window.innerHeight, 1);
        const scrollY = getLenisScrollY();

        if (scrollParallaxSectionId) {
          if (sectionScrollHeight <= 0) syncSectionScrollMetrics();
          const traveled = scrollY - sectionScrollTop + vh * 0.12;
          const progress = Math.max(0, traveled / sectionScrollHeight);
          scrollPx = progress * s * 0.032;
          scrollPy = progress * s * 0.068;
        } else {
          const rawVy = scrollY / vh;
          const vy = Math.tanh(rawVy / 2.6) * 4.2;
          scrollPx = vy * s * 0.028;
          scrollPy = vy * s * 0.058;
        }
      }

      if (useMouseParallax) {
        currentParallaxRef.current.lerp(targetParallaxRef.current, mouseDamping);
        uniforms.parallaxOffset.value.set(
          currentParallaxRef.current.x + scrollPx,
          currentParallaxRef.current.y + scrollPy,
        );
      } else if (useScrollParallax) {
        const target = targetParallaxRef.current;
        target.set(scrollPx, scrollPy);
        const lerp = scrollParallaxSectionId ? 0.14 : 1;
        if (lerp >= 1) {
          uniforms.parallaxOffset.value.copy(target);
        } else {
          currentParallaxRef.current.lerp(target, lerp);
          uniforms.parallaxOffset.value.copy(currentParallaxRef.current);
        }
      }

      renderer.render(scene, camera);
    };

    const renderLoop = (now: number) => {
      loopRunning = false;
      if (!shouldAnimate()) return;
      renderFrame(now);
      scheduleLoop();
    };

    uniforms.iTime.value = 0;
    renderer.render(scene, camera);
    lastRenderMs = performance.now();
    scheduleLoop();

    let sectionIo: IntersectionObserver | undefined;
    if (scrollParallaxSectionId && typeof IntersectionObserver !== 'undefined') {
      const sectionEl = document.getElementById(scrollParallaxSectionId);
      if (sectionEl) {
        sectionIo = new IntersectionObserver(
          (entries) => {
            const entry = entries[0];
            if (!entry || !active) return;
            sectionVisible = entry.isIntersecting;
            renderer.domElement.style.visibility = sectionVisible
              ? 'visible'
              : 'hidden';
            if (sectionVisible) scheduleLoop();
          },
          {
            root: null,
            rootMargin: `${PREWARM_VH * 100}% 0px 0px 0px`,
            threshold: 0,
          },
        );
        sectionIo.observe(sectionEl);
      }
    }

    const wakeLoop = useScrollParallax && scrollParallaxSectionId
      ? () => {
          if (sectionScrollHeight <= 0) syncSectionScrollMetrics();
          if (sectionVisible || getSectionInView()) {
            lastRenderMs = 0;
            scheduleLoop();
          }
        }
      : undefined;

    const offLenisScroll = wakeLoop
      ? subscribeLenisScroll(wakeLoop)
      : undefined;

    if (wakeLoop && !isLenisActive()) {
      window.addEventListener('scroll', wakeLoop, { passive: true });
    }

    return () => {
      active = false;

      cancelAnimationFrame(raf);

      if (ro) ro.disconnect();
      sectionMetricsRo?.disconnect();
      sectionIo?.disconnect();

      if (scrollParallaxSectionId) {
        window.removeEventListener('resize', syncSectionScrollMetrics);
      }

      offLenisScroll?.();
      if (wakeLoop) {
        window.removeEventListener('scroll', wakeLoop);
      }

      if (trackPointerOnWindow) {
        window.removeEventListener('pointermove', handleWindowPointerMove);
      } else if (interactive || useMouseParallax) {
        renderer.domElement.removeEventListener('pointermove', handlePointerMove);
        renderer.domElement.removeEventListener('pointerleave', handlePointerLeave);
      }

      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, [
    linesGradient,
    enabledWaves,
    lineCount,
    lineDistance,
    topWavePosition,
    middleWavePosition,
    bottomWavePosition,
    animationSpeed,
    interactive,
    bendRadius,
    bendStrength,
    mouseDamping,
    parallax,
    parallaxStrength,
    scrollParallaxStrength,
    scrollParallaxSectionId,
    lightBackground,
    maxPixelRatio,
    animationFps,
  ]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden floating-lines-container"
      style={{
        mixBlendMode: lightBackground ? 'normal' : mixBlendMode
      }}
    />
  );
}
