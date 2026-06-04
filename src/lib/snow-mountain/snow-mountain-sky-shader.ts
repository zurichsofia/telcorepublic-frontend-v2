/** Sky dome — atmospheric gradient, soft sun disc, procedural clouds. */

export const snowMountainSkyVertexShader = /* glsl */ `
varying vec3 vWorldDirection;

void main() {
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vWorldDirection = normalize(worldPosition.xyz - cameraPosition);
  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
`;

export const snowMountainSkyFragmentShader = /* glsl */ `
precision highp float;

uniform float uTime;
uniform float uCloudSpeed;
uniform vec3 uSunPosition;
uniform vec3 uHorizonColor;
uniform vec3 uZenithColor;
uniform vec3 uSunColor;
uniform vec3 uCloudColor;

varying vec3 vWorldDirection;

float hash(vec3 p) {
  p = fract(p * 0.3183099 + 0.1);
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float noise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);

  return mix(
    mix(
      mix(hash(i + vec3(0.0, 0.0, 0.0)), hash(i + vec3(1.0, 0.0, 0.0)), f.x),
      mix(hash(i + vec3(0.0, 1.0, 0.0)), hash(i + vec3(1.0, 1.0, 0.0)), f.x),
      f.y
    ),
    mix(
      mix(hash(i + vec3(0.0, 0.0, 1.0)), hash(i + vec3(1.0, 0.0, 1.0)), f.x),
      mix(hash(i + vec3(0.0, 1.0, 1.0)), hash(i + vec3(1.0, 1.0, 1.0)), f.x),
      f.y
    ),
    f.z
  );
}

float fbm(vec3 p) {
  float value = 0.0;
  float amplitude = 0.55;
  float frequency = 1.0;
  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p * frequency);
    frequency *= 1.98;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vec3 dir = normalize(vWorldDirection);
  vec3 sunDir = normalize(uSunPosition);

  float height = clamp(dir.y * 0.5 + 0.5, 0.0, 1.0);
  float horizonGlow = pow(1.0 - abs(dir.y), 3.5);
  vec3 sky = mix(uHorizonColor, uZenithColor, pow(height, 0.85));
  sky += uHorizonColor * horizonGlow * 0.22;

  float sunDot = max(dot(dir, sunDir), 0.0);
  float sunDisc = smoothstep(0.9992, 0.99985, sunDot);
  float sunHalo = pow(sunDot, 96.0) * 0.85;
  float sunBloom = pow(sunDot, 12.0) * 0.35;
  vec3 sun = uSunColor * (sunDisc * 1.35 + sunHalo + sunBloom);

  float t = uTime * uCloudSpeed;
  vec3 windSlow = vec3(t * 0.14, t * 0.025, t * 0.05);
  vec3 windFast = vec3(t * 0.28, t * 0.04, -t * 0.11);

  vec3 cloudPosSlow = dir * 2.2 + windSlow;
  cloudPosSlow.y *= 1.35;
  float layerSlow = fbm(cloudPosSlow);
  layerSlow = fbm(cloudPosSlow * 1.65 + vec3(layerSlow * 0.55));
  layerSlow = smoothstep(0.44, 0.76, layerSlow);

  vec3 cloudPosFast = dir * 3.1 + windFast;
  cloudPosFast.y *= 1.2;
  float layerFast = fbm(cloudPosFast + vec3(4.2, 1.1, 2.8));
  layerFast = smoothstep(0.5, 0.82, layerFast) * 0.55;

  float clouds = clamp(layerSlow + layerFast, 0.0, 1.0);

  float cloudMask = smoothstep(-0.08, 0.42, dir.y);
  cloudMask *= 1.0 - smoothstep(0.992, 0.9995, sunDot) * 0.65;
  clouds *= cloudMask;

  vec3 cloudLit = mix(uCloudColor, uSunColor, pow(sunDot, 6.0) * 0.35);
  sky = mix(sky, cloudLit, clouds * 0.92);

  sky += sun;
  sky = mix(sky, uSunColor, sunDisc * 0.25);

  gl_FragColor = vec4(sky, 1.0);
}
`;
