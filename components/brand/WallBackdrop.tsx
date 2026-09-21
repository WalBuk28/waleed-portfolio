"use client";

import { useEffect, useRef } from "react";
import { useMotionValueEvent, useScroll, useSpring } from "framer-motion";
import { PIECE_IDS, PIECES, VIEWBOX, WALL, pointsAttr, type PieceId } from "./wall";
import {
  BOXES,
  buildTimeline,
  layoutFor,
  morphs,
  pivot,
  pointsAttr as morphPoints,
  sample,
  sampleGlobal,
  type Layout,
  type Timeline,
} from "./choreography";

// Hairline brightness: calm when the shield is locked, brighter while active
// (rest values match the --wall-stroke defaults in globals.css). Quantised so
// the (repainting) change happens in a handful of steps.
const STROKE = { rest: 0.52, active: 0.68 };
const STROKE_COMPACT = { rest: 0.42, active: 0.56 };
const STROKE_STEP = 0.02;

// Critically-damped-ish follow: smooths wheel steps (~0.25s) without lagging.
const SPRING = { stiffness: 190, damping: 34, mass: 0.7, restDelta: 0.00005 };

const MARK_W = 2 * WALL.halfWidth;
const MARK_H = 2 * Math.ceil(WALL.halfHeight);
const r2 = (v: number) => Math.round(v * 100) / 100;
const r3 = (v: number) => Math.round(v * 1000) / 1000;
const pct = (v: number, of: number) => `${(v / of) * 100}%`;

type PieceEl = { id: PieceId; el: SVGSVGElement; poly: SVGPolygonElement; t: string; o: string; pts: string };

/**
 * Homepage brand backdrop: the WalSec mark, fixed behind the content,
 * deconstructs and reassembles with the page's scroll progress
 * (choreography.ts).
 *
 * Each piece is its own small composited layer moved by CSS transforms, so
 * a scroll frame is compositor work only — no layout, paint or raster (the
 * brief morph windows repaint just the morphing piece). Scroll progress →
 * spring → one imperative pass; no React re-renders, no layout reads per
 * frame, and unchanged values are never rewritten. Reduced motion gets the
 * assembled mark, static.
 */
export function WallBackdrop() {
  const stageRef = useRef<HTMLDivElement>(null);
  const renderRef = useRef<((p: number) => void) | null>(null);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, SPRING);
  useMotionValueEvent(progress, "change", (p) => renderRef.current?.(p));

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const blueprint = stage.querySelector<SVGSVGElement>("[data-wall-blueprint]")!;
    const nodes: PieceEl[] = PIECE_IDS.map((id) => {
      const el = stage.querySelector<SVGSVGElement>(`[data-piece="${id}"]`)!;
      return { id, el, poly: el.firstElementChild as SVGPolygonElement, t: "", o: "", pts: "" };
    });
    const cache = { stage: "", bp: "", stroke: "" };
    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timeline: Timeline | null = null;
    let layout: Layout | null = null;
    let unit = 1; // px per mark unit
    let size = { w: 0, h: 0 };

    const render = (p: number) => {
      if (!timeline || !layout) return;
      const g = sampleGlobal(timeline.global, p);

      const st = g.s === 1 ? "" : `translate(-50%, -50%) scale(${r3(g.s)})`;
      if (st !== cache.stage) stage.style.transform = cache.stage = st;
      const bp = String(r3(g.bp));
      if (bp !== cache.bp) blueprint.style.opacity = cache.bp = bp;
      const k = layout.compact ? STROKE_COMPACT : STROKE;
      const so = String(r2(Math.round((k.rest + (k.active - k.rest) * g.act) / STROKE_STEP) * STROKE_STEP));
      if (so !== cache.stroke) stage.style.setProperty("--wall-stroke", (cache.stroke = so));

      for (const n of nodes) {
        const q = sample(timeline.pieces[n.id], p);
        let t = "";
        if (q.x !== 0 || q.y !== 0 || q.r !== 0 || q.s !== 1) {
          // rotate/scale about the pivot, which is expressed in the piece's box
          const [px, py] = pivot(n.id, q.m);
          const box = BOXES[n.id];
          const ox = (px - box.x) * unit, oy = (py - box.y) * unit;
          t = `translate(${r2(q.x * unit + ox)}px, ${r2(q.y * unit + oy)}px) rotate(${r2(q.r)}deg) scale(${r3(q.s)}) translate(${r2(-ox)}px, ${r2(-oy)}px)`;
        }
        if (t !== n.t) n.el.style.transform = n.t = t;
        const o = q.o === 1 ? "" : String(r3(q.o));
        if (o !== n.o) n.el.style.opacity = n.o = o;
        if (morphs(n.id)) {
          const pts = morphPoints(n.id, q.m);
          if (pts !== n.pts) n.poly.setAttribute("points", (n.pts = pts));
        }
      }
    };

    const measure = (force = false) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      // Ignore height-only jitter from mobile URL bars; the mark is sized in
      // svh units so it doesn't move either.
      if (!force && w === size.w && Math.abs(h - size.h) < 140) return;
      size = { w, h };
      const markPx = stage.offsetHeight;
      unit = markPx / MARK_H;
      layout = layoutFor(w, h, markPx);
      timeline = buildTimeline(layout);
      for (const n of nodes) n.t = "\0"; // px offsets depend on `unit`: rewrite all
    };

    const reset = () => {
      renderRef.current = null;
      timeline = null;
      stage.style.transform = cache.stage = "";
      stage.style.removeProperty("--wall-stroke");
      blueprint.style.opacity = cache.bp = "";
      for (const n of nodes) {
        n.el.style.transform = n.t = "";
        n.el.style.opacity = n.o = "";
        if (morphs(n.id)) n.poly.setAttribute("points", (n.pts = pointsAttr(PIECES[n.id])));
      }
    };

    const setup = () => {
      if (reducedQuery.matches) return reset(); // static, assembled
      measure(true);
      // Start exactly where the page is (restored scroll, deep links) instead
      // of springing in from the top.
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.jump(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
      renderRef.current = render;
      render(progress.get());
    };

    let raf = 0;
    const onResize = () => {
      if (!renderRef.current) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        measure();
        render(progress.get());
      });
    };

    setup();
    window.addEventListener("resize", onResize);
    reducedQuery.addEventListener("change", setup);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      reducedQuery.removeEventListener("change", setup);
      renderRef.current = null;
    };
  }, [progress]);

  return (
    <div
      aria-hidden
      className="wall-backdrop pointer-events-none fixed inset-0 -z-[5] overflow-hidden [contain:strict]"
    >
      <div ref={stageRef} className="wall-stage">
        <svg data-wall-blueprint="" viewBox={VIEWBOX} className="wall-blueprint">
          {PIECE_IDS.map((id) => (
            <polygon key={id} points={pointsAttr(PIECES[id])} />
          ))}
        </svg>
        {PIECE_IDS.map((id) => {
          const b = BOXES[id];
          return (
            <svg
              key={id}
              data-piece={id}
              viewBox={`${b.x} ${b.y} ${b.w} ${b.h}`}
              className="wall-piece"
              style={{
                left: pct(b.x + MARK_W / 2, MARK_W),
                top: pct(b.y + MARK_H / 2, MARK_H),
                width: pct(b.w, MARK_W),
                height: pct(b.h, MARK_H),
              }}
            >
              <polygon points={pointsAttr(PIECES[id])} />
            </svg>
          );
        })}
      </div>
    </div>
  );
}
