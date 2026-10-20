// =============================================================================
//  The driver: one variable, every visual (DESIGN.md §8).
//
//  The reading position (scroll, resolved to a chapter and its local progress)
//  sets the shader's uniforms, the global ink variables on <html> and the
//  frame's section label. The pointer (on touch: the reading line and taps)
//  places the sun; an idle term keeps it breathing. Everything runs on
//  gsap.ticker. The GL module is imported only once this starts, after first
//  paint, and only where WebGL, motion and data allow it.
// =============================================================================
import { gsap } from "@/lib/gsap";
import { COS30, grid } from "@/lib/gl/lattice";
import type { Screen } from "@/lib/gl/renderer";
import { LABELS, chapterState, mix, smooth, type Chapter, type State } from "./chapters";
import { heroCellFor } from "./hero";
import { pointer, startPointer } from "./pointer";

type Source = () => { y: number; velocity: number };
type Section = { n: Chapter; top: number; h: number; sun: [number, number] | null };
// Page px (viewport px if fixed). A sticky rect's top is worked out each frame from where it
// sits in its container (top0), its sticky offset and where it has to let go (end).
type Rect = { x: number; y: number; w: number; h: number; fixed?: boolean; sticky?: { top0: number; stick: number; end: number } };
type Box = { x: number; y: number; w: number; h: number };

/** Tweened by the hero's intro; at rest the screen is locked, the hero cell open, the shaft on. */
export const intro = { lock: 1e9, hero: 1, beam: 1, len: 1e5 };

const INK = {
  night: { ink: [233, 238, 235], soft: [183, 194, 189], muted: [147, 163, 156], ground: [10, 14, 13], lit: [217, 246, 234] },
  day: { ink: [6, 17, 13], soft: [6, 17, 13], muted: [46, 74, 63], ground: [207, 233, 222], lit: [31, 107, 85] },
} as const;

const st = {
  screen: null as Screen | null,
  starting: null as Promise<Screen | null> | null,
  source: (() => ({ y: window.scrollY, velocity: 0 })) as Source,
  daylight: false,
  touch: false,
  vw: 0,
  vh: 0,
  g: grid(1440),
  sections: [] as Section[],
  quiet: [] as Rect[],
  hero: null as [number, number] | null, // the hero cell's centre, page px
  enabled: false,
  pinned: null as { n: Chapter; local: number } | null,
  label: "",
  day: -1,
  sun: [0, 0],
  sunSet: false,
  vel: 0,
  tap: { x: 0, y: 0, t: -10 },
  slow: { frames: 0, avg: 0, warm: false },
  running: false,
  chapter: null as Chapter | null,
  // the work list's window: where it's going, where it is (page px), how open it is
  win: { to: null as Box | null, at: null as Box | null, open: 0 },
  // the skills hover: the jali pool's band follows the hovered group (page px), or the scroll
  pool: { to: null as [number, number] | null, band: null as number | null },
  // daylight: 0 to 1 over 0.7 s when the reading line enters or leaves About (never scrubbed)
  dayP: 0,
  scanFns: new Set<() => void>(),
  chapterFns: new Set<(n: Chapter) => void>(),
};

export const screenGrid = () => st.g;
export const heroCell = () => st.hero;
export const screenOn = () => !!st.screen;
/** Run fn after every page scan (layout known): the hero uses it to place the h1's band. */
export function onScan(fn: () => void) {
  st.scanFns.add(fn);
  return () => st.scanFns.delete(fn);
}
/** Run fn whenever the reader enters another section (the nav marker follows it). */
export function onChapter(fn: (n: Chapter) => void) {
  st.chapterFns.add(fn);
  return () => {
    st.chapterFns.delete(fn);
  };
}
export const currentChapter = () => st.chapter;
/** Open the work list's window over a page rect, or close it (null). Fine pointers only. */
export function setWindow(r: Box | null) {
  st.win.to = r;
}
/** Draw the jali pool onto a point (page px), or give it back to the scroll (null). */
export function setPool(at: [number, number] | null) {
  st.pool.to = at;
}
/** Hold one chapter (case pages, stage 4): `local` is its progress. */
export function pinChapter(n: Chapter | null, local = 0.6) {
  st.pinned = n ? { n, local } : null;
}

export function glAllowed() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if ((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData) return false;
  return "WebGLRenderingContext" in window;
}

/**
 * Start once. The driver runs on every page that declares a screen state, GL or not (the label
 * and the ink still follow the reader); the WebGL screen joins it when WebGL, motion and data
 * allow. Resolves to the screen, or null when the poster stays.
 */
export function startScreen(opts: { source?: Source; daylight?: boolean; timing?: boolean; dprCap?: number } = {}) {
  if (st.starting) return st.starting;
  st.starting = (async () => {
    const html = document.documentElement;
    if (opts.source) st.source = opts.source;
    st.daylight = !!opts.daylight;
    st.touch = matchMedia("(hover: none), (pointer: coarse)").matches;
    measure(false);
    st.running = true;
    scan();
    addEventListener("resize", () => measure(true));
    gsap.ticker.add(tick);
    const host = document.getElementById("gl");
    if (!host || !glAllowed()) return fail();
    const { createScreen } = await import("@/lib/gl/renderer");
    const screen = createScreen(host, { phone: st.g.phone || st.touch, timing: opts.timing, dprCap: opts.dprCap });
    if (!screen) return fail();
    st.screen = screen;
    screen.resize(st.vw, st.vh);
    scan();
    if (!st.touch) startPointer();
    addEventListener("pointerdown", onTap, { passive: true });
    tick(gsap.ticker.time, 16.7); // first frame before the canvas shows: no flash of an empty buffer
    html.classList.remove("gl-pending");
    html.classList.add("gl-on");
    return screen;
  })();
  return st.starting;
}

function fail() {
  const html = document.documentElement;
  html.classList.remove("gl-pending");
  html.classList.add("no-gl");
  return null;
}

function measure(rescan: boolean) {
  st.vw = window.innerWidth;
  st.vh = window.innerHeight;
  st.g = grid(st.vw);
  st.screen?.resize(st.vw, st.vh);
  if (rescan) scan();
}

/** Read the page's layout once (page init, resize, ScrollTrigger refresh): no layout reads per frame. */
export function scan() {
  if (!st.running) return;
  const sy = window.scrollY;
  const page = (el: Element): Rect => {
    const r = el.getBoundingClientRect();
    return { x: r.left, y: r.top + sy, w: r.width, h: r.height };
  };
  st.enabled = !!document.querySelector("[data-screen]");
  document.documentElement.classList.toggle("screen-on", st.enabled);
  st.sections = [...document.querySelectorAll<HTMLElement>("[data-chapter]")]
    .map((el) => {
      const r = page(el);
      const target = el.querySelector("[data-sun]");
      const t = target ? page(target) : null;
      return { n: Math.min(6, Math.max(1, +el.dataset.chapter! || 1)) as Chapter, top: r.y, h: Math.max(1, r.h), sun: t ? ([t.x + t.w / 2, t.y + t.h / 2] as [number, number]) : null };
    })
    .sort((a, b) => a.top - b.top);
  // data-quiet: page text; "fixed": the frame's corners, which stay in the viewport; "box": the
  // element's own box (a whole row); "sticky": a sticky element's box, followed per frame;
  // "shown": line boxes, only while the element is visible (a closed window's caption).
  // Plain rects are the text's own line boxes (a headline's short last line doesn't quiet the
  // cells beside it); neighbouring lines of similar width merge into one block.
  st.quiet = [];
  document.querySelectorAll<HTMLElement>("[data-quiet]").forEach((el) => {
    const mode = el.dataset.quiet;
    if (mode === "shown" && getComputedStyle(el).visibility === "hidden") return;
    if (mode === "box" || mode === "sticky") {
      const r = el.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) return;
      const box: Rect = { x: r.left, y: r.top + sy, w: r.width, h: r.height };
      if (mode === "sticky") {
        const c = el.parentElement!.getBoundingClientRect();
        box.sticky = { top0: c.top + sy, stick: parseFloat(getComputedStyle(el).top) || 0, end: c.bottom + sy - r.height };
      }
      st.quiet.push(box);
      return;
    }
    const fixed = mode === "fixed";
    const dy = fixed ? 0 : sy;
    for (const r of textBlocks(el)) st.quiet.push({ x: r.left, y: r.top + dy, w: r.width, h: r.height, fixed });
  });
  const first = st.sections.find((s) => s.n === 1);
  st.hero = first ? heroCellFor(st.vw, st.vh, first.top) : null;
  st.label = "";
  st.scanFns.forEach((fn) => fn());
}

function textBlocks(el: HTMLElement): DOMRect[] {
  const range = document.createRange();
  range.selectNodeContents(el);
  const lines: DOMRect[] = [];
  for (const r of range.getClientRects()) {
    if (r.width < 1 || r.height < 1) continue;
    const line = lines.find((l) => Math.abs(l.top - r.top) < r.height * 0.5);
    if (line) {
      const x0 = Math.min(line.left, r.left);
      const x1 = Math.max(line.right, r.right);
      lines[lines.indexOf(line)] = new DOMRect(x0, Math.min(line.top, r.top), x1 - x0, Math.max(line.bottom, r.bottom) - Math.min(line.top, r.top));
    } else lines.push(new DOMRect(r.left, r.top, r.width, r.height));
  }
  lines.sort((a, b) => a.top - b.top);
  const blocks: DOMRect[] = [];
  for (const l of lines) {
    const b = blocks[blocks.length - 1];
    const close = b && l.top - b.bottom < 12;
    const similar = b && Math.min(l.width, b.width) / Math.max(l.width, b.width) > 0.7;
    if (close && similar) {
      const x0 = Math.min(b.left, l.left);
      const x1 = Math.max(b.right, l.right);
      blocks[blocks.length - 1] = new DOMRect(x0, b.top, x1 - x0, l.bottom - b.top);
    } else blocks.push(l);
  }
  return blocks;
}

function onTap(e: PointerEvent) {
  if (e.pointerType !== "touch" || !st.enabled) return;
  if ((e.target as Element).closest?.("a, button, input, textarea, select, label, summary, [role='button'], [data-no-ripple]")) return;
  st.tap = { x: e.clientX, y: e.clientY + st.source().y, t: gsap.ticker.time };
}

function sunOf(n: Chapter, s: State, sec: Section | undefined, y: number): [number, number] {
  if (sec?.sun) return [sec.sun[0], sec.sun[1] - y];
  return [s.sunX * st.vw, s.sunY * st.vh];
}

const QUIET_MAX = 16; // the shader's uQuiet array

const tri = (x: number) => 1 - Math.abs((((x % 2) + 2) % 2) - 1); // 0 → 1 → 0 every 2 units
const DRIFT: [number, number] = [COS30, -0.5];

// Down-only quality governor: if frames keep running long (software GL, a slow GPU), render
// the screen at a lower resolution. It's soft light, so it survives the scale; the text is DOM.
function govern(screen: Screen, dt: number) {
  const s = st.slow;
  if (dt > 1000) return; // a stall or a tab coming back, not the shader
  s.frames++;
  s.avg += dt; // ms accumulated over the current window
  if (s.avg < 1200) return;
  const mean = s.avg / s.frames;
  if (s.warm && mean > 24 && screen.dpr > 0.5) {
    screen.quality *= mean > 60 ? 0.5 : 0.7;
    screen.resize(st.vw, st.vh);
  }
  s.warm = true; // the first window holds the shader compile and the atlas upload
  s.frames = 0;
  s.avg = 0;
}

function tick(time: number, dt: number) {
  if (!st.running || !st.enabled || document.hidden) return;
  const screen = st.screen;
  if (screen) govern(screen, dt);
  const ratio = gsap.ticker.deltaRatio(60);
  const { vw, vh, g } = st;
  const { y, velocity } = st.source();

  // Where the reader is: a chapter and the progress through it.
  let i = 0;
  let n: Chapter = 1;
  let local = 0.6;
  let next: Section | undefined;
  if (st.pinned) {
    n = st.pinned.n;
    local = st.pinned.local;
  } else if (st.sections.length) {
    const a = y + vh * 0.5;
    while (i < st.sections.length - 1 && st.sections[i + 1].top <= a) i++;
    const sec = st.sections[i];
    n = sec.n;
    local = Math.min(1, Math.max(0, (a - sec.top) / sec.h));
    next = st.sections[i + 1];
  }
  const sec = st.pinned ? undefined : st.sections[i];
  const A = chapterState(n, local, g.phone, st.daylight);
  const w = next ? smooth(0.8, 1, local) : 0;
  const s = next && w > 0 ? mix(A, chapterState(next.n, 0, g.phone, st.daylight), w) : A;

  // Daylight flips in time, not with the scroll: no resting position sits at half contrast.
  const dayTo = st.daylight && A.day > 0.5 ? 1 : 0;
  st.dayP = Math.min(1, Math.max(0, st.dayP + (dayTo ? 1 : -1) * (dt / 1000 / 0.7)));
  const day = st.dayP * st.dayP * (3 - 2 * st.dayP);
  // The DOM follows the same variable: the ink (only while the screen floods it; without GL the
  // daylight section paints its own) and the section label (always).
  writeInk(screen ? day : 0);
  const label = LABELS[n];
  if (label !== st.label) {
    st.label = label;
    st.chapter = n;
    document.querySelectorAll("[data-screen-label]").forEach((el) => (el.textContent = label));
    st.chapterFns.forEach((fn) => fn(n));
  }
  if (!screen) return;

  // The sun: the pointer, or the chapter's resting place (on touch: the reading line).
  const rest = sunOf(n, A, sec, y);
  if (next && w > 0) {
    const b = sunOf(next.n, chapterState(next.n, 0, g.phone, st.daylight), next, y);
    rest[0] += (b[0] - rest[0]) * w;
    rest[1] += (b[1] - rest[1]) * w;
  }
  const k = 1 - Math.pow(1 - 0.16, ratio);
  if (!st.sunSet) {
    st.sun = [rest[0], rest[1]];
    st.sunSet = true;
  }
  if (st.touch) {
    const h = smooth(0, vh * 0.5, y);
    const read: [number, number] = [g.margin + (vw - 2 * g.margin) * tri(y / vh), vh * 0.4];
    const target = n === 1 ? [rest[0] + (read[0] - rest[0]) * h, rest[1] + (read[1] - rest[1]) * h] : read;
    st.sun[0] += (target[0] - st.sun[0]) * k;
    st.sun[1] += (target[1] - st.sun[1]) * k;
    st.vel = Math.max(Math.min(1, Math.abs(velocity) / 25) * 0.55, st.vel * Math.pow(0.92, ratio));
  } else if (pointer.active) {
    st.sun[0] = pointer.x; // the follower and the light are the same point
    st.sun[1] = pointer.y;
  } else {
    const d = 12 * Math.sin(time * 0.35); // idle: the resting sun drifts ±12 px along 30°
    st.sun[0] += (rest[0] + DRIFT[0] * d - st.sun[0]) * k;
    st.sun[1] += (rest[1] + DRIFT[1] * d - st.sun[1]) * k;
    pointer.x = st.sun[0]; // park the pointer on the sun: the next move starts from the light
    pointer.y = st.sun[1];
    pointer.anchored = true;
  }

  const u = screen.uniforms;
  u.uTime.value = time;
  u.uS.value = g.S * s.scale;
  u.uS0.value = g.S;
  u.uMargin.value = g.margin;
  u.uScroll.value = y;
  u.uSun.value = [st.sun[0], st.sun[1]];
  u.uSunR.value = s.sunR;
  u.uOpen.value = s.open;
  u.uBack.value = s.back;
  u.uVel.value = st.vel;
  u.uHero.value = st.hero ? [st.hero[0], st.hero[1] - y] : [-1e5, -1e5];
  u.uHeroOpen.value = s.heroOpen * intro.hero;
  u.uBeam.value = s.beam * intro.beam;
  u.uBeamLen.value = intro.len;
  u.uLock.value = intro.lock;
  u.uJali.value = s.jali;
  // The pool: the scroll's band, or the hovered skills group (eased between the two).
  const scrollBand = s.band * (vw * 0.5 + vh * COS30);
  const poolTo = st.pool.to ? (st.pool.to[0] * 0.5 + (st.pool.to[1] - y) * COS30) : scrollBand;
  st.pool.band = st.pool.band === null ? poolTo : st.pool.band + (poolTo - st.pool.band) * (1 - Math.pow(0.9, ratio));
  u.uBand.value = st.pool.band;
  u.uSwing.value = s.swing;
  u.uRetract.value = s.retract;
  u.uDay.value = day;

  // The window: it glides to its rect and eases open; on the first open it starts in place.
  const win = st.win;
  if (win.to && (!win.at || win.open < 0.02)) win.at = { ...win.to };
  else if (win.to && win.at) {
    const g = 1 - Math.pow(0.82, ratio);
    win.at.x += (win.to.x - win.at.x) * g;
    win.at.y += (win.to.y - win.at.y) * g;
    win.at.w += (win.to.w - win.at.w) * g;
    win.at.h += (win.to.h - win.at.h) * g;
  }
  win.open = Math.min(1, Math.max(0, win.open + (win.to ? 1 : -1) * (dt / 1000 / 0.45)));
  const wo = win.open * win.open * (3 - 2 * win.open);
  u.uHotOpen.value = win.at ? wo : 0;
  if (win.at) u.uHot.value = [win.at.x, win.at.y - y, win.at.w, win.at.h];
  u.uTap.value = [st.tap.x, st.tap.y - y, st.tap.t, time - st.tap.t < 2 ? 1 : 0];

  // Quiet rects, at most sixteen: the ones on screen first, then those just off it.
  const q = u.uQuiet.value as number[];
  let nq = 0;
  for (const pass of [0, 1]) {
    for (const r of st.quiet) {
      const top = r.sticky ? Math.min(Math.max(r.sticky.top0 - y, r.sticky.stick), r.sticky.end - y) : r.fixed ? r.y : r.y - y;
      const on = top + r.h > 0 && top < vh;
      if (pass === 0 ? !on : on || top + r.h < -vh * 0.25 || top > vh * 1.25) continue;
      q[nq * 4] = r.x;
      q[nq * 4 + 1] = top;
      q[nq * 4 + 2] = r.w;
      q[nq * 4 + 3] = r.h;
      if (++nq === QUIET_MAX) break;
    }
    if (nq === QUIET_MAX) break;
  }
  u.uQuietN.value = nq;
  screen.render();
}

// The global ink follows the ground (only the daylight chapter flips it).
function writeInk(day: number) {
  const d = Math.round(day * 50) / 50;
  if (d === st.day) return;
  st.day = d;
  const style = document.documentElement.style;
  const lerp = (a: readonly number[], b: readonly number[]) => `rgb(${a.map((v, j) => Math.round(v + (b[j] - v) * d)).join(" ")})`;
  if (d === 0) {
    for (const name of ["--ink", "--ink-soft", "--muted", "--ground", "--lit"]) style.removeProperty(name);
    return;
  }
  style.setProperty("--ink", lerp(INK.night.ink, INK.day.ink));
  style.setProperty("--ink-soft", lerp(INK.night.soft, INK.day.soft));
  style.setProperty("--muted", lerp(INK.night.muted, INK.day.muted));
  style.setProperty("--ground", lerp(INK.night.ground, INK.day.ground));
  style.setProperty("--lit", lerp(INK.night.lit, INK.day.lit));
}
