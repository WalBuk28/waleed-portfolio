// Page transitions (DESIGN.md §7). The screen closes over the page in rings from the point you
// clicked: a hexagon in the mark's own outline (vertical sides, roof and floor at 30°) growing
// one cell at a time. The route changes behind it. Then the new page's screen opens the same way,
// ring by ring from its focal point (a case's hero figure, or the row you came back to). The
// curtain is the poster's lattice relief (#curtain in the layout), so it needs no WebGL; a thin
// rim of light runs round its edge. Under reduced motion it crossfades in 0.2 s.
import { gsap } from "@/lib/gsap";
import { ease, prefersReducedMotion } from "./env";
import { startScroll, stopScroll } from "./scroll";

export type Point = { x: number; y: number };

let busy = false;
let closed = false;
let from = "";
/** A transition is running (the menu leaves the scroll alone meanwhile). */
export const transitioning = () => busy;
/** The path the last transition left. */
export const leftPath = () => from;

const parts = () => {
  const c = document.getElementById("curtain");
  return c ? { c, panel: c.querySelector<HTMLElement>(".curtain__panel")!, rim: c.querySelector<HTMLElement>(".curtain__rim")! } : null;
};
// One ring is one cell of the screen (DESIGN.md §6: S is 56 px on phones, 6.4vw from 72 to 112).
const ring = () => (innerWidth < 768 ? 56 : Math.min(112, Math.max(72, innerWidth * 0.064)));

const f = (v: number) => v.toFixed(1);
/** The mark's outline centred on (x, y) at half-width r: 1.3 times as tall as it is wide. */
function hex(x: number, y: number, r: number) {
  const t = 0.7226 * r;
  const h = 1.3 * r;
  return `M${f(x)} ${f(y - h)}L${f(x + r)} ${f(y - t)}L${f(x + r)} ${f(y + t)}L${f(x)} ${f(y + h)}L${f(x - r)} ${f(y + t)}L${f(x - r)} ${f(y - t)}Z`;
}
/** The half-width at which that outline covers the whole viewport. */
function reach(p: Point) {
  let r = 0;
  for (const [x, y] of [[0, 0], [innerWidth, 0], [0, innerHeight], [innerWidth, innerHeight]]) {
    const dx = Math.abs(x - p.x);
    const dy = Math.abs(y - p.y);
    r = Math.max(r, dx, (dy + 0.5774 * dx) / 1.3);
  }
  return r + ring();
}

/** Close the screen over the page from `at`. Resolves once the page is covered. */
export function leave(at: Point): Promise<void> {
  busy = true;
  from = location.pathname;
  stopScroll();
  const p = parts();
  if (!p) return Promise.resolve();
  const { c, panel, rim } = p;
  c.style.visibility = "visible";
  if (prefersReducedMotion()) {
    panel.style.clipPath = rim.style.clipPath = "none";
    return new Promise((done) => gsap.fromTo(c, { opacity: 0 }, { opacity: 1, duration: 0.2, onComplete: () => ((closed = true), done()) }));
  }
  gsap.set(c, { opacity: 1 });
  const S = ring();
  const R = reach(at);
  const v = { r: 0 };
  return new Promise((done) =>
    gsap.to(v, {
      r: R,
      duration: 0.5,
      ease: ease.inOut,
      onUpdate: () => {
        const r = Math.ceil(v.r / S) * S; // ring by ring
        panel.style.clipPath = `path("${hex(at.x, at.y, r)}")`;
        rim.style.clipPath = `path("${hex(at.x, at.y, r + 3)}")`;
      },
      onComplete: () => {
        panel.style.clipPath = rim.style.clipPath = "none";
        closed = true;
        done();
      },
    }),
  );
}

/** Open the new page's screen from its focal point. Nothing to do if no leave ran. */
export function open(at: Point) {
  const p = parts();
  const finish = () => {
    if (p) {
      p.c.style.visibility = "hidden";
      p.panel.style.clipPath = p.rim.style.clipPath = "";
      gsap.set(p.c, { opacity: 1 });
    }
    closed = false;
    busy = false;
    startScroll();
  };
  if (!closed || !p) return finish();
  const { c, panel, rim } = p;
  if (prefersReducedMotion()) {
    gsap.to(c, { opacity: 0, duration: 0.2, onComplete: finish });
    return;
  }
  const S = ring();
  const R = reach(at);
  const frame = `M0 0H${innerWidth}V${innerHeight}H0Z`;
  const v = { r: 0 };
  gsap.to(v, {
    r: R,
    duration: 0.6,
    delay: 0.05,
    ease: ease.inOut,
    onUpdate: () => {
      const r = Math.ceil(v.r / S) * S;
      panel.style.clipPath = `path(evenodd, "${frame}${hex(at.x, at.y, r)}")`;
      rim.style.clipPath = `path(evenodd, "${frame}${hex(at.x, at.y, Math.max(0, r - 3))}")`;
    },
    onComplete: finish,
  });
}

/** A transition that never reached its new page (a failed push): open where it closed. */
export function abort() {
  if (busy) open({ x: innerWidth / 2, y: innerHeight / 2 });
}
