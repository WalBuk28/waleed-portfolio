"use client";

import { useMemo, useSyncExternalStore } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Noise,
  Scanline,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { journey } from "./state";
import { quality } from "./quality";

/**
 * The cinematic grade, at the quality ladder's level (quality.ts). Measured on the Intel iGPU at
 * 1920 x 969: the full grade costs about 3.5 ms a frame (the composer about 1.5, bloom 1.5, the
 * rest 0.5). "full" is bloom with the velocity-modulated chromatic aberration, scanlines, grain
 * and vignette; "lite" keeps the bloom (fewer MIP levels) and the vignette; "off" renders straight
 * to the canvas, and a CSS vignette stands in (Journey). Phones start at "off".
 *
 * Chromatic aberration is *velocity-modulated*: the faster you fall down the stream, the more the
 * signal degrades. The offset Vector2 is mutated in place: postprocessing wraps it in a Uniform by
 * reference, so no React state, no ref (React 19 would leak a ref into wrapEffect's
 * JSON.stringify memo key and crash on the circular scene graph).
 */
export function Effects() {
  const fx = useSyncExternalStore(quality.subscribe, () => quality.get().fx, () => "off" as const);
  const caOffset = useMemo(() => new THREE.Vector2(0.0004, 0.00024), []);

  useFrame(() => {
    if (fx !== "full") return;
    const vel = Math.min(journey.delta * 60, 1);
    const amt = 0.00035 + vel * 0.0028;
    caOffset.set(amt, amt * 0.6);
  });

  if (fx === "off") return null;
  if (fx === "lite")
    return (
      <EffectComposer multisampling={0}>
        <Bloom mipmapBlur levels={5} intensity={1.15} luminanceThreshold={0.17} luminanceSmoothing={0.28} radius={0.82} />
        <Vignette eskil={false} offset={0.22} darkness={0.86} />
      </EffectComposer>
    );
  return (
    <EffectComposer multisampling={0}>
      <Bloom mipmapBlur intensity={1.15} luminanceThreshold={0.17} luminanceSmoothing={0.28} radius={0.82} />
      <ChromaticAberration offset={caOffset} radialModulation modulationOffset={0.18} />
      <Scanline blendFunction={BlendFunction.OVERLAY} density={1.4} opacity={0.045} />
      <Noise premultiply opacity={0.55} />
      <Vignette eskil={false} offset={0.22} darkness={0.86} />
    </EffectComposer>
  );
}
