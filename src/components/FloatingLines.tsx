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

import { getLenisScrollY, isLenisActive } from '@/lib/lenis-scroll';

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
uniform float uAlphaTop;
uniform float uAlphaMiddle;
uniform float uAlphaBottom;
uniform vec2 uLayoutBias;

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
    float influence = exp(-dot(d, d) * bendRadius); // radial falloff around cursor
    float bendOffset = (mouseUv.y - screenUv.y) * influence * bendStrength * bendInfluence;
    y += bendOffset;
  }

  float m = uv.y - y;
  /* Default: soft ribbons. Light mode: tighter core + much lower tail so red does not bloom across white. */
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
  /* Scroll-driven framing: bias shifts where ribbons read on screen (e.g. right → mid / lower-right). */
  baseUv += uLayoutBias;

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
      ) * bottomGain * uAlphaBottom;
    }
  }

  if (enableMiddle) {
    for (int i = 0; i < middleLineCount; ++i) {
      float fi = float(i);
      float t = fi / max(float(middleLineCount - 1), 1.0);
      vec3 lineCol = getLineColor(t, b);
      
      float angle = middleWavePosition.z * log(length(baseUv) + 1.0);
      vec2 ruv = baseUv * rotate(angle);
      /* Default middle uses implicit 1.0 gain — much stronger than top/bottom in React Bits. */
      float middleGain = mix(1.0, 0.26, step(0.5, uLightBackground));
      col += lineCol * wave(
        ruv + vec2(middleLineDistance * fi + middleWavePosition.x, middleWavePosition.y),
        2.0 + 0.15 * fi,
        baseUv,
        mouseUv,
        interactive
      ) * middleGain * uAlphaMiddle;
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
      ) * topGain * uAlphaTop;
    }
  }

  /* Light mode: gate on energy + luminance; cap tint so strokes stay crisp, not neon smear. */
  if (uLightBackground > 0.5) {
    float energy = length(col);
    float lum = dot(col, vec3(0.2126, 0.7152, 0.0722));
    /* Keep very light gradient stops (e.g. first line) visible after UV scroll-shift. */
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
  parallax?: boolean;
  parallaxStrength?: number;
  /**
   * When > 0, maps page scroll to `parallaxOffset` so the field drifts with scroll
   * (useful with `interactive={false}` for a site backdrop).
   */
  scrollParallaxStrength?: number;
  /**
   * When set, parallax follows linear progress through this element (0 at section
   * entry → increases through its full height). Keeps drift continuous on long sections.
   */
  scrollParallaxSectionId?: string;
  mixBlendMode?: React.CSSProperties['mixBlendMode'];
  /** Map the shader’s additive strokes onto a white field (avoids graying the whole canvas). */
  lightBackground?: boolean;
  /**
   * After `#hero`’s fold, fade top/middle so only the bottom wave remains for long editorial
   * scroll (parallax still applies to the surviving field).
   */
  consolidateWavesOnEditorialScroll?: boolean;
  /**
   * Nudges the field toward the **right** when scroll is low, then eases toward **center + lower-right**
   * as `scrollY` increases (pairs well with `consolidateWavesOnEditorialScroll`).
   */
  scrollBiasedFieldLayout?: boolean;
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
  consolidateWavesOnEditorialScroll = false,
  scrollBiasedFieldLayout = false
}: FloatingLinesProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const targetMouseRef = useRef<Vector2>(new Vector2(-1000, -1000));
  const currentMouseRef = useRef<Vector2>(new Vector2(-1000, -1000));
  const targetInfluenceRef = useRef<number>(0);
  const currentInfluenceRef = useRef<number>(0);
  const targetParallaxRef = useRef<Vector2>(new Vector2(0, 0));
  const currentParallaxRef = useRef<Vector2>(new Vector2(0, 0));
  const waveAlphaSmoothedRef = useRef({ top: 1, middle: 1, bottom: 1 });
  const layoutBiasSmoothedRef = useRef(new Vector2(-0.38, -0.05));

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
      Math.min(window.devicePixelRatio || 1, scrollParallaxSectionId ? 1.5 : 2),
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

      parallax: { value: parallax },
      parallaxStrength: { value: parallaxStrength },
      parallaxOffset: { value: new Vector2(0, 0) },

      lineGradient: {
        value: Array.from({ length: MAX_GRADIENT_STOPS }, () => new Vector3(1, 1, 1))
      },
      lineGradientCount: { value: 0 },

      uLightBackground: { value: lightBackground ? 1 : 0 },

      uAlphaTop: { value: 1 },
      uAlphaMiddle: { value: 1 },
      uAlphaBottom: { value: 1 },

      uLayoutBias: { value: new Vector2(0, 0) }
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

    const handlePointerMove = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const dpr = renderer.getPixelRatio();

      targetMouseRef.current.set(x * dpr, (rect.height - y) * dpr);
      targetInfluenceRef.current = 1.0;

      if (parallax) {
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const offsetX = (x - centerX) / rect.width;
        const offsetY = -(y - centerY) / rect.height;
        targetParallaxRef.current.set(offsetX * parallaxStrength, offsetY * parallaxStrength);
      }
    };

    const handlePointerLeave = () => {
      targetInfluenceRef.current = 0.0;
    };

    if (interactive) {
      renderer.domElement.addEventListener('pointermove', handlePointerMove);
      renderer.domElement.addEventListener('pointerleave', handlePointerLeave);
    }

    let raf = 0;
    const renderLoop = () => {
      if (!active) return;

      uniforms.iTime.value = clock.getElapsedTime();

      let shouldRender = true;
      if (scrollParallaxSectionId && typeof document !== "undefined") {
        const section = document.getElementById(scrollParallaxSectionId);
        if (section) {
          const rect = section.getBoundingClientRect();
          shouldRender = rect.bottom > 0 && rect.top < window.innerHeight;
        }
      }

      if (interactive) {
        currentMouseRef.current.lerp(targetMouseRef.current, mouseDamping);
        uniforms.iMouse.value.copy(currentMouseRef.current);

        currentInfluenceRef.current += (targetInfluenceRef.current - currentInfluenceRef.current) * mouseDamping;
        uniforms.bendInfluence.value = currentInfluenceRef.current;
      }

      if (parallax) {
        const s = scrollParallaxStrength;
        let scrollPx = 0;
        let scrollPy = 0;
        if (s > 0 && typeof window !== "undefined") {
          const vh = Math.max(window.innerHeight, 1);
          const scrollY = getLenisScrollY();

          if (scrollParallaxSectionId) {
            const section = document.getElementById(scrollParallaxSectionId);
            if (section) {
              const sectionTop = section.offsetTop;
              const sectionHeight = Math.max(section.offsetHeight, vh);
              const traveled = scrollY - sectionTop + vh * 0.12;
              const progress = Math.max(0, traveled / sectionHeight);
              scrollPx = progress * s * 0.032;
              scrollPy = progress * s * 0.068;
            }
          } else {
            const rawVy = scrollY / vh;
            /* Cap drift so strokes do not shear out of frame or collapse under the light-mode gate. */
            const vy = Math.tanh(rawVy / 2.6) * 4.2;
            scrollPx = vy * s * 0.028;
            scrollPy = vy * s * 0.058;
          }
        }

        if (interactive) {
          currentParallaxRef.current.lerp(targetParallaxRef.current, mouseDamping);
          uniforms.parallaxOffset.value.set(
            currentParallaxRef.current.x + scrollPx,
            currentParallaxRef.current.y + scrollPy,
          );
        } else {
          const target = targetParallaxRef.current;
          target.set(scrollPx, scrollPy);
          if (scrollParallaxSectionId && isLenisActive()) {
            uniforms.parallaxOffset.value.copy(target);
          } else if (scrollParallaxSectionId) {
            currentParallaxRef.current.lerp(target, 0.12);
            uniforms.parallaxOffset.value.copy(currentParallaxRef.current);
          } else {
            uniforms.parallaxOffset.value.copy(target);
          }
        }
      }

      if (consolidateWavesOnEditorialScroll && typeof document !== "undefined") {
        const hero = document.getElementById("hero");
        const vh = Math.max(window.innerHeight, 1);
        let t = 0;
        if (hero) {
          const foldY = hero.offsetTop + hero.offsetHeight;
          const rel = getLenisScrollY() - foldY + vh * 0.06;
          t = Math.min(1, Math.max(0, rel / (vh * 2.15)));
        }
        const smoothstep = (e0: number, e1: number, x: number) => {
          const u = Math.min(1, Math.max(0, (x - e0) / Math.max(1e-6, e1 - e0)));
          return u * u * (3 - 2 * u);
        };
        const targetTop = 1 - smoothstep(0, 0.5, t);
        const targetMiddle = 1 - smoothstep(0.08, 0.58, t);
        const w = waveAlphaSmoothedRef.current;
        const k = 0.11;
        w.top += (targetTop - w.top) * k;
        w.middle += (targetMiddle - w.middle) * k;
        w.bottom = 1;
        uniforms.uAlphaTop.value = w.top;
        uniforms.uAlphaMiddle.value = w.middle;
        uniforms.uAlphaBottom.value = w.bottom;
      } else {
        uniforms.uAlphaTop.value = 1;
        uniforms.uAlphaMiddle.value = 1;
        uniforms.uAlphaBottom.value = 1;
        waveAlphaSmoothedRef.current.top = 1;
        waveAlphaSmoothedRef.current.middle = 1;
        waveAlphaSmoothedRef.current.bottom = 1;
      }

      if (scrollBiasedFieldLayout && typeof window !== "undefined") {
        const vh = Math.max(window.innerHeight, 1);
        const raw = getLenisScrollY() / vh;
        const t = Math.min(1, Math.tanh(raw / 1.72));
        /* Negative x pulls dominant ribbons to the viewport right early; ease toward center + down for lower-right read. */
        const targetX = -0.44 * (1.0 - t) + 0.06 * t;
        const targetY = -0.05 * (1.0 - t) + 0.24 * t;
        const lb = layoutBiasSmoothedRef.current;
        lb.x += (targetX - lb.x) * 0.1;
        lb.y += (targetY - lb.y) * 0.1;
        uniforms.uLayoutBias.value.copy(lb);
      } else {
        uniforms.uLayoutBias.value.set(0, 0);
        layoutBiasSmoothedRef.current.set(0, 0);
      }

      if (shouldRender) {
        renderer.render(scene, camera);
      }
      raf = requestAnimationFrame(renderLoop);
    };
    renderLoop();

    return () => {
      active = false;

      cancelAnimationFrame(raf);

      if (ro) ro.disconnect();

      if (interactive) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- React Bits vendor effect
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
    consolidateWavesOnEditorialScroll,
    scrollBiasedFieldLayout
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
