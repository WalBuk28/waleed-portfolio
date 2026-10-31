"use client";

import { gsap, ScrollTrigger } from "@/lib/gsap";
import { ease, onScroll, prefersReducedMotion } from "@/lib/engine";
import { usePage } from "@/lib/engine/next";
import { setWindow } from "@/lib/screen/driver";
import { weaveFill } from "./Weave";

const ON = weaveFill(1);
const OFF = weaveFill(0.14);

/**
 * The work list's page code. On a desktop pointer, the hovered or focused row opens its window:
 * the screen opens over the row's frame (the driver's setWindow) and the weave's cells open in
 * reading order. The window follows the pointer when the page scrolls under it. On phones and
 * tablets each weave opens as it reaches the reading line. The rules draw in from the left and
 * the titles rise from behind them as the list arrives.
 */
export function WorkMotion() {
  usePage(() => {
    const list = document.querySelector<HTMLElement>("[data-work]");
    if (!list) return;
    const rows = [...list.querySelectorAll<HTMLElement>("[data-row]")];
    const reduce = prefersReducedMotion();
    const cellsOf = (row: HTMLElement) => [...row.querySelectorAll<SVGUseElement>(".weave__cell")];
    // The vault's IV is random, so its weave is too: a fresh draw each time it opens.
    const reroll = (row: HTMLElement) => {
      if (!row.querySelector("[data-random]")) return;
      cellsOf(row).forEach((c) => c.setAttribute("fill", Math.random() < 0.5 ? ON : OFF));
    };
    // The cells lock in, in reading order: each scales up about its centre as its light comes on
    // (the lock ease, 0.5 s). A weave holds up to 236 cells, so one tween per row drives them all
    // and writes a cell only when its eased level steps (8 levels): a few writes a frame, not
    // hundreds. Each cell's centre is its own origin, so scale() needs no bounding box.
    const LEVELS = 8;
    const hide = (cells: SVGUseElement[]) =>
      cells.forEach((c) => {
        c.setAttribute("opacity", "0");
        c.setAttribute("transform", "scale(0.55)");
      });
    const running = new WeakMap<HTMLElement, gsap.core.Tween>();
    const openCells = (row: HTMLElement, delay = 0) => {
      if (reduce) return;
      const cells = cellsOf(row);
      const n = cells.length;
      if (!n) return;
      running.get(row)?.kill();
      hide(cells);
      const step = Math.min(0.02, 0.45 / n);
      const level = new Int8Array(n);
      const p = { t: 0 };
      let first = 0; // cells before this one are fully lit
      running.set(
        row,
        gsap.to(p, {
          t: delay + step * (n - 1) + 0.5,
          duration: delay + step * (n - 1) + 0.5,
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
        }),
      );
    };

    if (!reduce) {
      const go = { trigger: list, start: "top 85%", once: true };
      gsap.from(list.querySelectorAll(".work__rule"), { scaleX: 0, transformOrigin: "0% 50%", duration: 1.1, ease: ease.out, stagger: 0.06, scrollTrigger: go });
      gsap.from(list.querySelectorAll(".work__name"), { yPercent: 115, duration: 1.1, ease: ease.out, stagger: 0.06, delay: 0.1, scrollTrigger: go });
    }

    const off: (() => void)[] = [];
    const listen = <K extends keyof HTMLElementEventMap>(el: HTMLElement | Window, type: K, fn: (e: HTMLElementEventMap[K]) => void) => {
      el.addEventListener(type, fn as EventListener, { passive: true });
      off.push(() => el.removeEventListener(type, fn as EventListener));
    };

    if (matchMedia("(hover: hover) and (pointer: fine) and (min-width: 1024px)").matches) {
      let current: HTMLElement | null = null;
      // The window stays inside the viewport, clear of the frame's top corners.
      const place = (row: HTMLElement) => {
        const fig = row.querySelector<HTMLElement>(".work__fig")!;
        fig.style.setProperty("--dy", "0px");
        const f = fig.getBoundingClientRect();
        const lo = 96;
        const hi = window.innerHeight - 24;
        const dy = f.top < lo ? lo - f.top : f.bottom > hi ? Math.max(lo - f.top, hi - f.bottom) : 0;
        fig.style.setProperty("--dy", `${Math.round(dy)}px`);
        const r = row.querySelector(".work__frame")!.getBoundingClientRect();
        return { x: r.left, y: r.top + window.scrollY, w: r.width, h: r.height };
      };
      const open = (row: HTMLElement | null) => {
        if (row === current) return;
        current?.classList.remove("is-open");
        current = row;
        if (!row) return setWindow(null);
        row.classList.add("is-open");
        reroll(row);
        setWindow(row.querySelector(".work__frame") ? place(row) : null);
        openCells(row, 0.08);
      };
      rows.forEach((row) => {
        listen(row, "pointerenter", () => open(row));
        listen(row, "focusin", () => open(row));
      });
      listen(list, "pointerleave", () => open(null));
      listen(list, "focusout", (e) => {
        if (!list.contains(e.relatedTarget as Node | null)) open(null);
      });
      // pointerleave never fires when the page scrolls out from under a still pointer.
      let px = -1;
      let py = -1;
      listen(window, "pointermove", (e) => {
        px = e.clientX;
        py = e.clientY;
      });
      off.push(
        onScroll(() => {
          if (px < 0) return;
          const row = document.elementFromPoint(px, py)?.closest<HTMLElement>("[data-row]") ?? null;
          if (row && list.contains(row)) open(row);
          else if (current && !list.contains(document.activeElement)) open(null);
        }),
      );
      off.push(() => open(null));
    } else if (!reduce) {
      rows.forEach((row) => {
        const frame = row.querySelector(".work__frame");
        const cells = cellsOf(row);
        if (!frame || !cells.length) return;
        hide(cells);
        ScrollTrigger.create({
          trigger: frame,
          start: "top 62%",
          once: true,
          onEnter: () => {
            reroll(row);
            openCells(row);
          },
        });
      });
    }
    return () => {
      off.forEach((f) => f());
      rows.forEach((row) => running.get(row)?.kill());
    };
  });
  return null;
}
