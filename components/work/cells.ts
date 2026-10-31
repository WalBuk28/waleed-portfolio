// A weave's cells lock in, in reading order: each scales up about its centre as its light comes
// on (the lock ease, 0.5 s). A weave holds up to 236 cells, so one tween drives them all and
// writes a cell only when its eased level steps (8 levels): a few writes a frame, not hundreds
// (profiled on the throttled phone, stage 4). Each cell's centre is its own origin, so scale()
// needs no bounding box. Used by the work list and the case pages.
import { gsap } from "@/lib/gsap";

const LEVELS = 8;

export const cellsIn = (root: ParentNode) => [...root.querySelectorAll<SVGUseElement>(".weave__cell")];

export function hideCells(cells: SVGUseElement[]) {
  cells.forEach((c) => {
    c.setAttribute("opacity", "0");
    c.setAttribute("transform", "scale(0.55)");
  });
}

/** Hide the cells, then lock them in. Returns the tween (kill it to stop). */
export function lockIn(cells: SVGUseElement[], delay = 0) {
  const n = cells.length;
  hideCells(cells);
  const step = Math.min(0.02, 0.45 / Math.max(1, n));
  const total = delay + step * (n - 1) + 0.5;
  const level = new Int8Array(n);
  const p = { t: 0 };
  let first = 0; // cells before this one are fully lit
  return gsap.to(p, {
    t: total,
    duration: total,
    ease: "none",
    onUpdate: () => {
      for (let i = first; i < n; i++) {
        const local = (p.t - delay - i * step) / 0.5;
        if (local <= 0) break; // later cells start later
        const l = Math.round((1 - Math.pow(1 - Math.min(1, local), 4)) * LEVELS); // power4.out
        if (l === level[i]) continue;
        level[i] = l;
        const c = cells[i];
        if (l === LEVELS) {
          c.removeAttribute("opacity");
          c.removeAttribute("transform");
          if (i === first) first++;
        } else {
          c.setAttribute("opacity", (l / LEVELS).toFixed(3));
          c.setAttribute("transform", `scale(${(0.55 + (0.45 * l) / LEVELS).toFixed(3)})`);
        }
      }
    },
  });
}
