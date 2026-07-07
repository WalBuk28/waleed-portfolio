"use client";

import { useMemo } from "react";
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

/**
 * The cinematic grade. Bloom carries the neon; chromatic aberration is
 * *velocity-modulated* — the faster you fall down the stream, the more the
 * signal degrades. The offset Vector2 is mutated in place: postprocessing
 * wraps it in a Uniform by reference, so no React state, no ref (React 19
 * would leak a ref into wrapEffect's JSON.stringify memo key and crash on
 * the circular scene graph).
 */
export function Effects() {
  const caOffset = useMemo(() => new THREE.Vector2(0.0004, 0.00024), []);

  useFrame(() => {
    const vel = Math.min(journey.delta * 60, 1);
    const amt = journey.quality > 0 ? 0.00035 + vel * 0.0028 : 0;
    caOffset.set(amt, amt * 0.6);
  });

  return (
    <EffectComposer multisampling={0}>
      <Bloom
        mipmapBlur
        intensity={1.15}
        luminanceThreshold={0.17}
        luminanceSmoothing={0.28}
        radius={0.82}
      />
      <ChromaticAberration offset={caOffset} radialModulation modulationOffset={0.18} />
      <Scanline blendFunction={BlendFunction.OVERLAY} density={1.4} opacity={0.045} />
      <Noise premultiply opacity={0.55} />
      <Vignette eskil={false} offset={0.22} darkness={0.86} />
    </EffectComposer>
  );
}
