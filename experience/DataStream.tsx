"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { C } from "./palette";
import { journey } from "./state";
import { streamCurve, streamPathTexture } from "./journey";

// ── Core tube: light pulses race down the fiber ──────────────────────────────
const tubeVert = /* glsl */ `
  varying vec2 vUv;
  varying float vViewZ;
  void main() {
    vUv = uv;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vViewZ = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

// Additive energy fades out within ~2.5u of the lens — the stream guides the
// eye without ever washing the frame white as the camera skims it.
const tubeFrag = /* glsl */ `
  uniform float uTime;
  uniform float uEnergy;
  uniform float uDive;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying vec2 vUv;
  varying float vViewZ;
  void main() {
    vec3 base = mix(uColorA, uColorB, smoothstep(0.0, 1.0, vUv.x));
    float p1 = smoothstep(0.972, 1.0, fract(vUv.x * 46.0 - uTime * 0.85));
    float p2 = smoothstep(0.955, 1.0, fract(vUv.x * 17.0 - uTime * 0.38)) * 0.6;
    float shimmer = 0.82 + 0.18 * sin(uTime * 2.1 + vUv.x * 90.0);
    vec3 col = base * shimmer * (0.55 + uEnergy * 0.5) + vec3(1.0) * (p1 + p2) * (0.6 + uEnergy * 0.5);
    // during the hero hold, the first metres stay dim so nothing flares
    // beneath the laptop; ignites as the dive begins
    col *= mix(smoothstep(0.0, 0.055, vUv.x), 1.0, uDive);
    float nearFade = smoothstep(0.5, 2.6, vViewZ);
    gl_FragColor = vec4(col, nearFade);
  }
`;

// ── Particles: advected along a baked 512-sample path texture ────────────────
const ptsVert = /* glsl */ `
  uniform float uTime;
  uniform sampler2D uPath;
  uniform float uSize;
  attribute float aSeed;
  attribute float aSpeed;
  attribute float aRadius;
  attribute float aPhase;
  varying float vFade;
  varying float vT;

  vec3 pathAt(float t) {
    float ft = clamp(t, 0.0, 1.0) * 511.0;
    float i0 = floor(ft);
    float f = ft - i0;
    vec3 a = texture2D(uPath, vec2((i0 + 0.5) / 512.0, 0.5)).xyz;
    vec3 b = texture2D(uPath, vec2((min(i0 + 1.0, 511.0) + 0.5) / 512.0, 0.5)).xyz;
    return mix(a, b, f);
  }

  void main() {
    float t = fract(aSeed + uTime * aSpeed * 0.02);
    vT = t;
    vec3 p = pathAt(t);
    vec3 p2 = pathAt(t + 1.0 / 512.0);
    vec3 tanv = normalize(p2 - p + vec3(1e-5));
    vec3 n = normalize(cross(tanv, vec3(0.0, 1.0, 0.0)) + vec3(1e-5));
    vec3 b = cross(tanv, n);
    float ang = aPhase + uTime * 0.45;
    p += (n * cos(ang) + b * sin(ang)) * aRadius;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float nearFade = smoothstep(0.6, 2.4, -mv.z);
    vFade = sin(t * 3.14159) * (0.55 + 0.45 * sin(uTime * 2.6 + aPhase * 9.0)) * nearFade;
    gl_PointSize = uSize * (1.0 + 0.4 * sin(aPhase * 13.0)) * (140.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const ptsFrag = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying float vFade;
  varying float vT;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float mask = smoothstep(0.5, 0.08, d);
    vec3 col = mix(uColorA, uColorB, vT) * 1.25;
    gl_FragColor = vec4(col, mask * vFade * 0.55);
  }
`;

export function DataStream() {
  const tubeMat = useRef<THREE.ShaderMaterial>(null!);
  const ptsMat = useRef<THREE.ShaderMaterial>(null!);

  const tubeGeo = useMemo(() => new THREE.TubeGeometry(streamCurve, 420, 0.028, 8, false), []);

  const count = journey.coarse ? 500 : 1100;
  const ptsGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3); // real positions come from the shader
    const seed = new Float32Array(count);
    const speed = new Float32Array(count);
    const radius = new Float32Array(count);
    const phase = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      seed[i] = Math.random();
      speed[i] = 0.5 + Math.random() * 1.6;
      radius[i] = 0.05 + Math.pow(Math.random(), 2.2) * 0.36;
      phase[i] = Math.random() * Math.PI * 2;
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    g.setAttribute("aSpeed", new THREE.BufferAttribute(speed, 1));
    g.setAttribute("aRadius", new THREE.BufferAttribute(radius, 1));
    g.setAttribute("aPhase", new THREE.BufferAttribute(phase, 1));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, -9, -20), 45);
    return g;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      tube: {
        uTime: { value: 0 },
        uEnergy: { value: 0 },
        uDive: { value: 0 },
        uColorA: { value: new THREE.Color(C.cyan) },
        uColorB: { value: new THREE.Color(C.emerald) },
      },
      pts: {
        uTime: { value: 0 },
        uSize: { value: 1.7 },
        uPath: { value: streamPathTexture() },
        uColorA: { value: new THREE.Color(C.electricGlow) },
        uColorB: { value: new THREE.Color(C.emeraldGlow) },
      },
    }),
    []
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const energy = Math.min(journey.delta * 60, 1);
    tubeMat.current.uniforms.uTime.value = t;
    tubeMat.current.uniforms.uEnergy.value = energy;
    tubeMat.current.uniforms.uDive.value = THREE.MathUtils.smoothstep(journey.offset, 0.075, 0.15);
    ptsMat.current.uniforms.uTime.value = t;
  });

  return (
    <group>
      <mesh geometry={tubeGeo} frustumCulled={false} raycast={() => null}>
        <shaderMaterial
          ref={tubeMat}
          vertexShader={tubeVert}
          fragmentShader={tubeFrag}
          uniforms={uniforms.tube}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <points geometry={ptsGeo} frustumCulled={false} raycast={() => null}>
        <shaderMaterial
          ref={ptsMat}
          vertexShader={ptsVert}
          fragmentShader={ptsFrag}
          uniforms={uniforms.pts}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </points>
    </group>
  );
}
