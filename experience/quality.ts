// Adaptive quality for the 3D journey (stage 5, profiled on the Intel iGPU).
//
// A ladder of levels, cheapest last. The frame driver (Driver.tsx) watches how long rendered
// frames take and steps one level down when they run long; it never steps back up, so the
// scene can't flicker between levels. In order, as Waleed asked: device pixels first, then the
// post effects, then the particle counts. Phones start without the heavy effects at all.

import type { BufferGeometry } from "three";

export type Fx = "full" | "lite" | "off";
export type Level = { dpr: number; fx: Fx; particles: number };

function ladder(coarse: boolean, deviceDpr: number): Level[] {
  const top = Math.min(Math.max(deviceDpr, 1), 1.5);
  const dprs = [top, 1.25, 1].filter((d, i, a) => d <= top && a.indexOf(d) === i);
  const fx0: Fx = coarse ? "off" : "full";
  const out: Level[] = dprs.map((dpr) => ({ dpr, fx: fx0, particles: 1 }));
  if (!coarse) {
    out.push({ dpr: 1, fx: "lite", particles: 1 });
    out.push({ dpr: 1, fx: "off", particles: 1 });
  }
  out.push({ dpr: 1, fx: "off", particles: 0.5 });
  return out;
}

let levels: Level[] = [{ dpr: 1, fx: "off", particles: 1 }];
let index = 0;
const listeners = new Set<() => void>();

export const quality = {
  /** Set the ladder for this device (once, before the scene mounts). */
  init(coarse: boolean, deviceDpr: number) {
    levels = ladder(coarse, deviceDpr);
    index = 0;
    listeners.forEach((fn) => fn());
  },
  get: (): Level => levels[index],
  /** One level down. False at the bottom. */
  step(): boolean {
    if (index >= levels.length - 1) return false;
    index++;
    listeners.forEach((fn) => fn());
    return true;
  },
  subscribe(fn: () => void) {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
  /** For the report and the profiler: where on the ladder the scene is. */
  where: () => ({ index, of: levels.length, ...levels[index] }),
};

/** Draw a point cloud at the level's share of its particles (call it from the cloud's useFrame). */
export function thin(g: BufferGeometry) {
  const f = levels[index].particles;
  if (g.userData.share === f) return;
  g.userData.share = f;
  g.setDrawRange(0, Math.floor(g.attributes.position.count * f));
}
