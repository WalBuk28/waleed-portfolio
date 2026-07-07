"use client";

import { forwardRef, useMemo } from "react";
import * as THREE from "three";
import { radialTexture, textTexture } from "./text";

/** Neon wireframe outline of a box — the signature look of the scene. */
export function NeonBox({
  args,
  color = "#22d3ee",
  opacity = 0.9,
  position,
  threshold = 30,
}: {
  args: [number, number, number];
  color?: string;
  opacity?: number;
  position?: [number, number, number];
  threshold?: number;
}) {
  const geo = useMemo(() => {
    const box = new THREE.BoxGeometry(...args);
    const edges = new THREE.EdgesGeometry(box, threshold);
    box.dispose();
    return edges;
  }, [args[0], args[1], args[2], threshold]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <lineSegments geometry={geo} position={position} raycast={() => null}>
      <lineBasicMaterial color={color} transparent opacity={opacity} toneMapped={false} />
    </lineSegments>
  );
}

/** Soft additive radial glow billboard. */
export const GlowSprite = forwardRef<
  THREE.Sprite,
  { color: string; scale?: number | [number, number]; opacity?: number; position?: [number, number, number] }
>(function GlowSprite({ color, scale = 1, opacity = 0.5, position }, ref) {
  const s: [number, number, number] = Array.isArray(scale) ? [scale[0], scale[1], 1] : [scale, scale, 1];
  return (
    <sprite ref={ref} scale={s} position={position} raycast={() => null}>
      <spriteMaterial
        map={radialTexture(color)}
        transparent
        opacity={opacity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </sprite>
  );
});

/** Canvas-baked monospace text on a plane (crisp, offline, theme-true). */
export const TextPlane = forwardRef<
  THREE.Mesh,
  {
    text: string;
    height?: number;
    color?: string;
    additive?: boolean;
    opacity?: number;
    position?: [number, number, number];
    rotation?: [number, number, number];
    weight?: number;
    glow?: number;
  }
>(function TextPlane(
  { text, height = 0.12, color = "#a5f3fc", additive = true, opacity = 1, position, rotation, weight = 600, glow = 10 },
  ref
) {
  const { tex, aspect } = useMemo(() => textTexture(text, { color, weight, glow }), [text, color, weight, glow]);
  return (
    <mesh ref={ref} position={position} rotation={rotation} raycast={() => null}>
      <planeGeometry args={[height * aspect, height]} />
      <meshBasicMaterial
        map={tex}
        transparent
        opacity={opacity}
        blending={additive ? THREE.AdditiveBlending : THREE.NormalBlending}
        depthWrite={false}
        side={THREE.DoubleSide}
        toneMapped={false}
      />
    </mesh>
  );
});
