"use client";

import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";

/**
 * The exhibits' point lights, pooled (stage 5, profiled on the Intel iGPU).
 *
 * three.js compiles each lit material for the number of point lights in view. The exhibits'
 * lights used to come and go with their exhibits, so every section boundary recompiled every
 * lit material: frames of 50 to 130 ms as the A-TIOC rack, the cipher lock, the vortex and the
 * relay came into range. Lighting them all at once instead cost 2 to 4 ms a frame.
 *
 * So an exhibit declares a <PoolLight> (an empty marker where its light should be), and
 * <LightPool> keeps POOL real point lights at the scene root that take the nearest lit markers
 * each frame. The number of lights never changes, so nothing recompiles, and drei's <Preload>
 * compiles every material once, for exactly this count, before the airlock opens.
 */
const POOL = 4;

export type PoolLightHandle = { intensity: number };
type Source = {
  handle: PoolLightHandle;
  obj: THREE.Object3D | null;
  color: THREE.Color;
  distance: number;
  decay: number;
  world: THREE.Vector3;
  d2: number;
};
const sources = new Set<Source>();

/** A marker for one of the scene's point lights. Its intensity can be animated through the ref. */
export const PoolLight = forwardRef<
  PoolLightHandle,
  { color: string; intensity: number; distance: number; decay?: number; position?: [number, number, number] }
>(function PoolLight({ color, intensity, distance, decay = 2, position }, ref) {
  const obj = useRef<THREE.Object3D>(null!);
  const src = useMemo<Source>(
    () => ({ handle: { intensity }, obj: null, color: new THREE.Color(color), distance, decay, world: new THREE.Vector3(), d2: 0 }),
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );
  useImperativeHandle(ref, () => src.handle, [src]);
  useEffect(() => {
    src.obj = obj.current;
    sources.add(src);
    return () => {
      sources.delete(src);
    };
  }, [src]);
  return <object3D ref={obj} position={position} />;
});

/** Shown when the marker and every group above it are visible (the exhibits cull by group). */
function shown(o: THREE.Object3D | null) {
  for (; o; o = o.parent) if (!o.visible) return false;
  return true;
}

/** The pool. Mount it after every exhibit, so it reads their visibility for this frame. */
export function LightPool() {
  const camera = useThree((s) => s.camera);
  const lights = useRef<THREE.PointLight[]>([]);
  const active = useMemo<Source[]>(() => [], []);

  useFrame(() => {
    active.length = 0;
    for (const s of sources) {
      if (!s.obj || s.handle.intensity <= 0 || !shown(s.obj)) continue;
      s.obj.getWorldPosition(s.world);
      s.d2 = s.world.distanceToSquared(camera.position);
      active.push(s);
    }
    active.sort((a, b) => a.d2 - b.d2);
    for (let i = 0; i < POOL; i++) {
      const light = lights.current[i];
      const s = active[i];
      if (!light) continue;
      if (!s) {
        light.intensity = 0;
        continue;
      }
      light.position.copy(s.world);
      light.color.copy(s.color);
      light.intensity = s.handle.intensity;
      light.distance = s.distance;
      light.decay = s.decay;
    }
  });

  return (
    <>
      {Array.from({ length: POOL }, (_, i) => (
        <pointLight key={i} ref={(l) => void (lights.current[i] = l!)} intensity={0} />
      ))}
    </>
  );
}
