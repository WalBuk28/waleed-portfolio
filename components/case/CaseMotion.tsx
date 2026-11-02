"use client";

import { prefersReducedMotion } from "@/lib/engine";
import { usePage } from "@/lib/engine/next";
import { onScan, setWindow } from "@/lib/screen/driver";
import { cellsIn, lockIn } from "@/components/work/cells";
import { weaveFill } from "@/components/work/Weave";

/**
 * A case page's code. The screen holds a window open behind the hero figure, so its light
 * comes through the weave (on every device), and the weave's cells lock in as the page
 * arrives. The vault's weave is drawn at random each time, as its IV is.
 */
export function CaseMotion() {
  usePage(() => {
    const frame = document.querySelector<HTMLElement>("[data-case-frame]");
    if (!frame) return;
    const place = () => {
      const r = frame.getBoundingClientRect();
      setWindow({ x: r.left, y: r.top + window.scrollY, w: r.width, h: r.height });
    };
    place();
    const offScan = onScan(place); // layout moved (fonts, resize): the window follows
    const cells = cellsIn(frame);
    if (frame.closest("[data-random]")) cells.forEach((c) => c.setAttribute("fill", Math.random() < 0.5 ? weaveFill(1) : weaveFill(0.14)));
    const tween = !prefersReducedMotion() && cells.length ? lockIn(cells, 0.3) : null;
    return () => {
      offScan();
      tween?.kill();
      setWindow(null);
    };
  });
  return null;
}
