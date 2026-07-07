// Shared mutable state for the 3D journey. Written by the render loop,
// read by anything that must stay outside React's render cycle (audio,
// post-processing, HUD events). Never triggers re-renders by itself.

import type { AudioEngine } from "./audio/engine";

export const journey = {
  started: false, // boot overlay dismissed → intro sweep begins
  introT0: 0, // performance.now() at the moment the user entered
  intro: 0, // eased 0..1 intro-sweep progress (written by CameraRig)
  offset: 0, // damped scroll offset mirror (0..1)
  delta: 0, // damped |scroll velocity| mirror
  quality: 1, // 1 = full post fx, 0 = degraded (PerformanceMonitor)
  coarse: false, // touch device — no pointer parallax, fewer particles
  reduced: false, // prefers-reduced-motion
  audio: null as AudioEngine | null,
};

export function emit<T>(name: string, detail?: T) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(name, { detail }));
  }
}

export const EV = {
  progress: "walsec:progress", // { offset, section }
  section: "walsec:section", // { id, label }
  flat: "walsec:flat", // user requested the 2D site
  audio: "walsec:audio", // { on }
} as const;
