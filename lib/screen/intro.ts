// The first-visit intro (DESIGN.md §7), at most 2.6 s and tied to real loading:
//   1. the screen's pieces lock in along their normals, outward from the hero cell; how far
//      they've got follows what's ready (the GL program and atlas, then the fonts), with a
//      1.1 s floor so it reads as one designed move
//   2. the hero cell opens, the shaft travels out of it at 30°, and the h1's band lights as
//      the shaft's front reaches the headline
// Text never waits for any of this. Later visits in the session start at the end state.
import { gsap } from "@/lib/gsap";
import { ease } from "@/lib/engine/env";
import type { Screen } from "@/lib/gl/renderer";
import { heroCell, intro, screenGrid } from "./driver";
import { placeBand } from "./hero";

const KEY = "walsec-intro";
let held = false;

const remember = () => {
  try {
    sessionStorage.setItem(KEY, "1");
  } catch {
    /* storage blocked: the intro just plays again next time */
  }
};

/** Call before the screen starts: hold it unlocked, the hero cell shut and the shaft off. */
export function prepareIntro() {
  const html = document.documentElement;
  if (held || !html.classList.contains("intro-pending") || !document.querySelector("[data-hero]")) {
    html.classList.remove("intro-pending");
    return false;
  }
  Object.assign(intro, { lock: 0, hero: 0, beam: 0, len: 0 });
  held = true;
  return true;
}

function finish() {
  Object.assign(intro, { lock: 1e9, hero: 1, beam: 1, len: 1e5 });
  document.querySelector<HTMLElement>("[data-band]")?.style.setProperty("--band", "1");
  document.documentElement.classList.remove("intro-pending");
  held = false;
  remember();
}

export async function runIntro(screen: Promise<Screen | null>) {
  if (!held) return;
  const s = await screen;
  const hero = heroCell();
  const h1 = document.querySelector<HTMLElement>("[data-band]");
  if (!s || !hero || !h1) return finish(); // the poster: the finished state at once

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const heroY = hero[1] - window.scrollY;
  const R = Math.max(...[[0, 0], [vw, 0], [0, vh], [vw, vh]].map(([x, y]) => Math.hypot(x - hero[0], y - heroY))) + screenGrid().S * 2;
  const late = performance.now() > 2000; // GL arrived late: keep the whole intro inside 2.6 s
  const MIN = late ? 0.45 : 1.1;
  const tasks = [Promise.resolve(), document.fonts.ready.then(() => undefined)];
  let done = 1; // the GL program and the atlas are ready: we're here
  tasks[1].then(() => done++);

  // 1. Lock-in: follows the share of real work done, never faster than MIN.
  const start = gsap.ticker.time;
  await new Promise<void>((resolve) => {
    const tick = () => {
      const t = gsap.ticker.time - start;
      const goal = Math.min(done / tasks.length, t / MIN) * R;
      intro.lock += (goal - intro.lock) * 0.14;
      if (done === tasks.length && t >= MIN && intro.lock > R * 0.985) {
        intro.lock = 1e9;
        gsap.ticker.remove(tick);
        resolve();
      }
      if (t > 2.4) {
        gsap.ticker.remove(tick);
        resolve();
      }
    };
    gsap.ticker.add(tick);
  });

  // 2. The hero cell opens; the shaft travels to the headline and lights it as it passes.
  const along = placeBand(h1, hero);
  const reach = along + h1.getBoundingClientRect().width * 0.6 + 400;
  const band = { v: 0 };
  gsap
    .timeline({ onComplete: finish })
    .to(intro, { hero: 1, duration: late ? 0.3 : 0.45, ease: ease.lock })
    .to(intro, { beam: 1, duration: 0.25, ease: "none" }, "<0.15")
    .to(intro, {
      len: reach,
      duration: late ? 0.5 : 0.8,
      ease: ease.out,
      onUpdate: () => {
        band.v = Math.min(1, Math.max(0, (intro.len - along + 220) / 440));
        h1.style.setProperty("--band", band.v.toFixed(3));
      },
    }, "<");
}
