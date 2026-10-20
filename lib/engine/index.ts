// The motion engine's page lifecycle (after the awwwards engine, cut to this site's needs).
// No DOM access at import time, so it's safe under SSR. The Next adapter (next.tsx) calls:
//   boot()    once, on first load: flags, scroll, cursor, the screen, page init, intro
//   enter()   after a route change commits: revert the old page, init the new one
// Page code hooks in with onPage(fn): fn runs inside a gsap.context on every page, so its
// tweens and ScrollTriggers are reverted on navigation; return a cleanup for the rest.
// Page transitions (leave and the curtain) arrive in stage 4.
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { scan, startScreen } from "@/lib/screen/driver";
import { prepareIntro, runIntro } from "@/lib/screen/intro";
import { prefersReducedMotion } from "./env";
import { initCursor, initMagnetic, resetCursor } from "./interactions";
import { initReveals } from "./reveal";
import { initScroll, resetScroll, scrollState } from "./scroll";

export { onScroll, scrollState, scrollToTarget, smoothScroll, startScroll, stopScroll } from "./scroll";
export { ease, isMobile, isTouch, prefersReducedMotion } from "./env";

export type PageFn = (page: { intro: gsap.core.Timeline; path: string }) => void | (() => void);

const pageFns = new Set<PageFn>();
const cleanups: (() => void)[] = [];
let ctx: gsap.Context | null = null;
let intro: gsap.core.Timeline | null = null;
let ready = false;
let booted = false;

// Routes that keep native scroll and no screen: the R3F journey runs its own.
const isNative = (path: string) => path.startsWith("/journey");

/** Run fn on every page load (and now, if a page is ready). Returns an unsubscribe. */
export function onPage(fn: PageFn) {
  pageFns.add(fn);
  if (ready) runPageFn(fn);
  return () => {
    pageFns.delete(fn);
  };
}

function runPageFn(fn: PageFn) {
  ctx?.add(() => {
    const c = fn({ intro: intro!, path: location.pathname });
    if (typeof c === "function") cleanups.push(c);
  });
}

function syncFlags() {
  const h = document.documentElement.classList;
  h.add("js", "is-booted");
  h.toggle("motion", !prefersReducedMotion());
}

function initPage() {
  syncFlags();
  resetCursor();
  ctx = gsap.context(() => {
    intro = initReveals(document);
    cleanups.push(initMagnetic(document));
  });
  // The screen starts on the first page that declares a state (data-screen), not before.
  const wantsScreen = !!document.querySelector("[data-screen]");
  const screen = wantsScreen ? startScreen({ source: scrollState, daylight: false }) : null;
  if (!screen) document.documentElement.classList.remove("gl-pending", "intro-pending");
  ready = true;
  pageFns.forEach(runPageFn);
  requestAnimationFrame(() => ScrollTrigger.refresh());
  return screen;
}

export function boot() {
  if (booted) return;
  booted = true;
  syncFlags();
  initScroll(!isNative(location.pathname));
  initCursor();
  ScrollTrigger.addEventListener("refresh", scan); // layout moved: re-read sections and rects
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  const first = prepareIntro();
  const screen = initPage();
  intro?.play(); // text reveals start at once; they never wait for GL
  if (first && screen) runIntro(screen);
}

/** Tear down the current page: reverts every tween, ScrollTrigger and split. */
export function cleanup() {
  if (!ready) return;
  ready = false;
  cleanups.splice(0).forEach((c) => c());
  ctx?.revert();
  ctx = null;
}

/** Init the new page after a route change. `scrollTop: false` for back/forward. */
export function enter({ scrollTop = true } = {}) {
  if (!booted) return;
  cleanup();
  if (scrollTop && !location.hash) resetScroll();
  initPage();
  intro?.play();
}
