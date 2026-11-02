// The motion engine's page lifecycle (after the awwwards engine, cut to this site's needs).
// No DOM access at import time, so it's safe under SSR. The Next adapter (next.tsx) calls:
//   boot()    once, on first load: flags, scroll, cursor, the screen, page init, intro
//   enter()   after a route change commits: revert the old page, init the new one
// Page code hooks in with onPage(fn): fn runs inside a gsap.context on every page, so its
// tweens and ScrollTriggers are reverted on navigation; return a cleanup for the rest.
//   leave()   on an internal link: the curtain closes over the page (transition.ts)
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { pageInit, scan, startScreen } from "@/lib/screen/driver";
import { prepareIntro, runIntro } from "@/lib/screen/intro";
import { prefersReducedMotion } from "./env";
import { initCursor, initMagnetic, resetCursor } from "./interactions";
import { initReveals } from "./reveal";
import { initScroll, jumpTo, jumpToY, onScroll, resetScroll, scrollState } from "./scroll";
export { onScroll };
import { leftPath, open, type Point } from "./transition";

export { scrollState, scrollToTarget, smoothScroll, startScroll, stopScroll } from "./scroll";
export { ease, isMobile, isTouch, prefersReducedMotion } from "./env";
export { abort, leave, transitioning, type Point } from "./transition";

export type PageFn = (page: { intro: gsap.core.Timeline; path: string }) => void | (() => void);

const pageFns = new Set<PageFn>();
// Where each page was left, so back and forward return to it (ScrollTrigger turns the browser's
// own scroll restoration off). Recorded as the page scrolls, under the page that owns it.
const positions = new Map<string, number>();
const here = () => location.pathname + location.search;
let current = "";
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

function initPage(first: boolean) {
  syncFlags();
  current = here();
  resetCursor();
  ctx = gsap.context(() => {
    intro = initReveals(document);
    cleanups.push(initMagnetic(document));
  });
  // The screen starts on the first page that declares a state (data-screen), not before.
  const wantsScreen = !!document.querySelector("[data-screen]");
  const screen = wantsScreen ? startScreen({ source: scrollState, daylight: true }) : null;
  if (wantsScreen && !first) pageInit(); // a later page: read it, and open its screen from shut
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
  onScroll(({ y }) => {
    if (current) positions.set(current, y);
  });
  ScrollTrigger.addEventListener("refresh", scan); // layout moved: re-read sections and rects
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  const first = prepareIntro();
  const screen = initPage(true);
  intro?.play(); // text reveals start at once; they never wait for GL
  if (first && screen) runIntro(screen);
}

/** Back or forward: true (and the old page torn down) if it lands on another page, not a hash. */
export function popped() {
  if (!current || here() === current) return false;
  cleanup();
  return true;
}

/** Tear down the current page: reverts every tween, ScrollTrigger and split. */
export function cleanup() {
  current = ""; // stop recording this page's position: the next page's scroll isn't its own
  if (!ready) return;
  ready = false;
  cleanups.splice(0).forEach((c) => c());
  ctx?.revert();
  ctx = null;
}

/**
 * Init the new page after a route change. `scrollTop: false` for back/forward. After a page
 * transition (the curtain is closed), land on the hash, move focus into the page and open the
 * curtain from the page's focal point.
 */
export function enter({ scrollTop = true, transition = false } = {}) {
  if (!booted) return;
  cleanup();
  const back = scrollTop ? undefined : positions.get(here());
  if (back === undefined && !location.hash) resetScroll();
  initPage(false);
  if (location.hash || back !== undefined) {
    ScrollTrigger.refresh(); // pins and spacers first, so the target is where it will stay
    if (back !== undefined) jumpToY(back);
    else jumpTo(location.hash);
  }
  intro?.play();
  if (!transition) return;
  document.getElementById("main")?.focus({ preventScroll: true });
  open(focalPoint());
}

// Where the new page's screen opens from: the row of the case you came back from (if it's in
// view), else the page's focal element (a case's hero figure), else the hero's resting light.
function focalPoint(): Point {
  const seen = (el: Element | null) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return r.bottom > 0 && r.top < innerHeight ? { x: r.left + Math.min(r.width, 240) / 2, y: r.top + r.height / 2 } : null;
  };
  const prev = leftPath();
  const row = prev.startsWith("/work/") ? document.querySelector(`[data-slug="${CSS.escape(prev.slice(6))}"] .work__link`) : null;
  return seen(row) ?? seen(document.querySelector("[data-focal]")) ?? { x: innerWidth * 0.77, y: innerHeight * 0.3 };
}
