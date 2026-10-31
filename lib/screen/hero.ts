// The hero cell and the h1's lit band. The shaft leaves the hero cell at 30°;
// where it crosses the headline, a band of light (a background-clip gradient
// at 150°, perpendicular to the shaft) lights the letters. Both are placed
// from the same lattice numbers, with or without WebGL.
import { cellCentre, grid, SHAFT_DIR } from "@/lib/gl/lattice";
import { chapterState } from "./chapters";

/** Centre of the hero cell (page px): the cell under chapter 1's resting sun. */
export function heroCellFor(vw: number, vh: number, heroTop: number): [number, number] {
  const g = grid(vw);
  const s = chapterState(1, 0, g.phone, false);
  return cellCentre(s.sunX * vw, heroTop + s.sunY * vh, g.S, g.margin, 0);
}

/** The shaft's half width (px) at distance t from the cell: it widens as it travels. */
export const shaftWidth = (t: number) => 18 + 0.24 * Math.max(t, 0);

/**
 * Write the band's gradient stops onto the h1 (custom properties --b0..--b3), and return how
 * far along the shaft the headline's centre is (the intro times the band to the shaft's front).
 */
export function placeBand(h1: HTMLElement, hero: [number, number]): number {
  const along = bandStops(h1, hero);
  // Key words carry their own gradient (in jade): the same band, placed from their own box.
  const w = shaftWidth(along);
  h1.querySelectorAll<HTMLElement>("[data-key]").forEach((k) => bandStops(k, hero, w));
  return along;
}

function bandStops(el: HTMLElement, hero: [number, number], width?: number) {
  const r = el.getBoundingClientRect();
  const sy = window.scrollY;
  const C = [r.left + r.width / 2, r.top + sy + r.height / 2];
  const dir = [0.5, 0.8660254]; // the CSS 150deg gradient line, perpendicular to the shaft
  const L = Math.abs(r.width * dir[0]) + Math.abs(r.height * dir[1]);
  const s0 = (hero[0] - C[0]) * dir[0] + (hero[1] - C[1]) * dir[1];
  const along = (C[0] - hero[0]) * SHAFT_DIR[0] + (C[1] - hero[1]) * SHAFT_DIR[1];
  const w = width ?? shaftWidth(along);
  const at = (o: number) => `${(((s0 + o) / L + 0.5) * 100).toFixed(2)}%`;
  el.style.setProperty("--b0", at(-w * 1.1));
  el.style.setProperty("--b1", at(-w * 0.35));
  el.style.setProperty("--b2", at(w * 0.35));
  el.style.setProperty("--b3", at(w * 1.1));
  return along;
}
