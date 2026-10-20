// Smooth scroll on the one clock: Lenis is driven by gsap.ticker and ScrollTrigger reads it.
// Reduced motion and /journey keep native scroll; the ticker still publishes its position.
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "./env";

export type ScrollState = { y: number; velocity: number; progress: number };

let lenis: Lenis | null = null;
let native = false;
const listeners = new Set<(s: ScrollState) => void>();
const state: ScrollState = { y: 0, velocity: 0, progress: 0 };

export function initScroll(smooth: boolean) {
  if (lenis || native) return;
  if (!smooth || prefersReducedMotion()) {
    native = true;
    gsap.ticker.add(nativeTick);
    return;
  }
  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, touchMultiplier: 1.2, anchors: true });
  lenis.on("scroll", (l: Lenis) => {
    state.y = l.scroll;
    state.velocity = l.velocity;
    state.progress = l.limit > 0 ? l.scroll / l.limit : 0; // Lenis reports 1 on pages that can't scroll
    ScrollTrigger.update();
    listeners.forEach((fn) => fn(state));
  });
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

// Native scroll, read once per frame on the ticker (no scroll listener of our own).
function nativeTick() {
  const y = window.scrollY;
  if (y === state.y && state.velocity === 0) return;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  state.velocity = y - state.y;
  state.y = y;
  state.progress = max > 0 ? y / max : 0;
  listeners.forEach((fn) => fn(state));
}

export const onScroll = (fn: (s: ScrollState) => void) => {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
};
export const scrollState = () => state;
export const stopScroll = () => lenis?.stop();
export const startScroll = () => lenis?.start();
export const smoothScroll = () => !!lenis;

export function resetScroll() {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
  else window.scrollTo(0, 0);
  state.y = 0;
  state.velocity = 0;
}

export function scrollToTarget(target: string | HTMLElement | number) {
  if (lenis) return lenis.scrollTo(target, { duration: 1.2, easing: (t) => 1 - Math.pow(1 - t, 4) });
  if (typeof target === "number") window.scrollTo({ top: target });
  else (typeof target === "string" ? document.querySelector(target) : target)?.scrollIntoView();
}
