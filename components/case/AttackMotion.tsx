"use client";

import { ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/engine";
import { usePage } from "@/lib/engine/next";

const T30 = Math.tan(Math.PI / 6);

/**
 * The light's path across the ATT&CK figure. It runs through the lit tiles in the order of the
 * attack (T1595, T1190, T1021.001, T0866, T0832), along the lattice's own directions only:
 * roofs and floors at 30° and vertical walls, never a free angle. It is scrubbed by the scroll
 * through the four kill-chain stages, pinned where the screen is at least 1024 by 800; under
 * reduced motion it is drawn in full and every stage is shown.
 */
export function AttackMotion() {
  usePage(() => {
    const scene = document.querySelector<HTMLElement>("[data-attack]");
    if (!scene) return;
    const matrix = scene.querySelector<HTMLElement>(".attack__matrix")!;
    const svg = scene.querySelector<SVGSVGElement>("[data-attack-path]")!;
    const path = svg.querySelector("path")!;
    const stops = [...scene.querySelectorAll<HTMLElement>("[data-step]")].sort((a, b) => +a.dataset.step! - +b.dataset.step!);
    const stages = [...scene.querySelectorAll<HTMLElement>("[data-stage]")];
    let total = 0;
    let marks: number[] = []; // the path's length at each stop
    let minY = 0; // roofs stay below the tactic names

    // From a to b in lattice directions. A shallow rise is a roof (up at 30°, then down to b),
    // or a floor where a roof would leave the top of the figure; a steep one is one 30° run
    // and a vertical wall.
    const route = ([x1, y1]: number[], [x2, y2]: number[]) => {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const ax = Math.abs(dx);
      const sx = Math.sign(dx) || 1;
      if (ax < 1) return [[x2, y2]];
      if (Math.abs(dy) > ax * T30) return [[x2, y1 + Math.sign(dy) * ax * T30], [x2, y2]];
      const roof = (ax - dy / T30) / 2;
      if (y1 - roof * T30 >= minY) return [[x1 + sx * roof, y1 - roof * T30], [x2, y2]];
      const floor = (ax + dy / T30) / 2;
      return [[x1 + sx * floor, y1 + floor * T30], [x2, y2]];
    };

    const build = () => {
      const m = matrix.getBoundingClientRect();
      minY = matrix.querySelector(".attack__tiles")!.getBoundingClientRect().top - m.top + 2;
      svg.setAttribute("viewBox", `0 0 ${m.width.toFixed(1)} ${m.height.toFixed(1)}`);
      const pts = stops.map((el) => {
        const r = el.getBoundingClientRect();
        return [r.left - m.left + r.width / 2, r.top - m.top + r.height / 2];
      });
      if (!pts.length) return;
      let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
      let at = pts[0];
      total = 0;
      marks = [0];
      for (let i = 1; i < pts.length; i++) {
        for (const p of route(at, pts[i])) {
          total += Math.hypot(p[0] - at[0], p[1] - at[1]);
          d += ` L${p[0].toFixed(1)} ${p[1].toFixed(1)}`;
          at = p;
        }
        marks.push(total);
      }
      path.setAttribute("d", d);
      path.style.strokeDasharray = `${total} ${total}`;
    };

    // p: 0 to 1 through the scene. Four stages; the path draws in the first two thirds of each.
    const ends = [0, 1, 2, 4]; // the stop each stage's path reaches
    const show = (p: number) => {
      const k = Math.min(3, Math.floor(p * 4));
      const local = Math.min(1, ((p * 4 - k) / 0.66));
      const from = k ? marks[ends[k - 1]] : 0;
      const to = marks[ends[k]] ?? total;
      const drawn = from + (to - from) * (1 - Math.pow(1 - local, 3));
      path.style.strokeDashoffset = `${total - drawn}`;
      stages.forEach((s, i) => {
        s.classList.toggle("is-current", i === k);
        s.classList.toggle("is-past", i < k);
      });
      stops.forEach((el, i) => el.classList.toggle("is-reached", marks[i] <= drawn + 1));
    };

    build();
    const reduce = prefersReducedMotion();
    const pin = !reduce && innerWidth >= 1024 && innerHeight >= 800;
    // The figure is text and cells, so the screen keeps its light out from under it: one quiet
    // box, followed through the pin (the driver's sticky rect: stuck at the top until the
    // spacer lets go).
    scene.dataset.quiet = pin ? "sticky" : "box";
    if (reduce) {
      path.style.strokeDashoffset = "0";
      stops.forEach((el) => el.classList.add("is-reached"));
      scene.classList.add("is-still");
      return;
    }
    ScrollTrigger.create({
      trigger: scene,
      start: pin ? "top top" : "top 75%",
      end: pin ? "+=1600" : "bottom 35%",
      pin,
      invalidateOnRefresh: true,
      onRefresh: (self) => {
        build();
        show(self.progress);
      },
      onUpdate: (self) => show(self.progress),
    });
    show(0);
  });
  return null;
}
