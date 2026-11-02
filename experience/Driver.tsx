"use client";

import { useEffect } from "react";
import { advance, useThree } from "@react-three/fiber";
import { journey } from "./state";
import { quality } from "./quality";

const IDLE_AFTER = 2000; // ms with nothing moving before the scene drops to 30 fps
const WINDOW = 40; // rendered frames per measurement
const SLOW = 1.12; // a window is slow when its frames average 12% over the target interval

/**
 * The journey's frame loop (the Canvas runs with frameloop="never"; this calls advance()).
 * - Paused while the tab is hidden or the canvas is off screen: nothing renders.
 * - At most about 60 fps: a 120 Hz screen doesn't make the GPU draw every frame twice.
 * - 30 fps while nothing moves (no scroll, no pointer, no intro), so a visitor reading a panel
 *   doesn't keep the GPU at full load; any movement brings it straight back.
 * - Adaptive quality: while moving, it times the rendered frames in windows of 40. Two slow
 *   windows in a row step the quality ladder down one level (quality.ts) and set the canvas's
 *   pixel ratio from it. It never steps back up.
 * The scene's own clock advances by real time, at most 0.1 s a frame, so a pause or a long frame
 * never makes anything jump.
 */
export function Driver() {
  const setDpr = useThree((s) => s.setDpr);
  const canvas = useThree((s) => s.gl.domElement);

  useEffect(() => {
    let raf = 0;
    let hidden = document.hidden;
    let offscreen = false;
    let sim = 0; // the scene clock, seconds
    let lastRaf = 0;
    let lastRender = 0;
    let refresh = 1000 / 60; // the display's frame interval, measured
    const rafGaps: number[] = [];
    let movedAt = performance.now();
    let lastY = window.scrollY;
    let frames: number[] = [];
    let slowWindows = 0;
    let settleUntil = 0; // ignore frames until then (after a resume or a quality change)

    const onVis = () => {
      hidden = document.hidden;
      settleUntil = performance.now() + 1000;
    };
    const onMove = () => (movedAt = performance.now());
    const io = new IntersectionObserver(([e]) => {
      offscreen = !e.isIntersecting;
      settleUntil = performance.now() + 1000;
    });
    io.observe(canvas);
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onMove, { passive: true });
    window.addEventListener("keydown", onMove);

    const apply = () => {
      setDpr(quality.get().dpr);
      settleUntil = performance.now() + 1200;
      frames = [];
      slowWindows = 0;
    };
    const unsub = quality.subscribe(apply);

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      // The display's rate: a low percentile of the last 60 gaps between animation frames. Not
      // the median: a scene stuck at 40 fps would read as a 40 Hz screen and never step down,
      // while vsync keeps some gaps at the true interval.
      if (lastRaf) {
        rafGaps.push(now - lastRaf);
        if (rafGaps.length > 60) rafGaps.shift();
        if (rafGaps.length === 60) refresh = Math.min(34, Math.max(6, [...rafGaps].sort((a, b) => a - b)[6]));
      }
      lastRaf = now;
      if (hidden || offscreen) {
        lastRender = now;
        return;
      }

      const y = window.scrollY;
      if (y !== lastY || journey.delta > 1e-4 || !journey.started || journey.intro < 1) movedAt = now;
      lastY = y;
      const idle = now - movedAt > IDLE_AFTER;
      const target = idle ? 1000 / 30 : Math.max(1000 / 60, refresh);
      const since = now - lastRender;
      if (since < target - refresh / 2) return; // not this frame

      sim += Math.min(since, 100) / 1000;
      lastRender = now;
      advance(sim);

      // adaptive quality: only frames rendered back to back while moving
      if (idle || now < settleUntil || !journey.started) {
        frames = [];
        return;
      }
      frames.push(since);
      if (frames.length < WINDOW) return;
      const sorted = frames.sort((a, b) => a - b);
      const mean = sorted.slice(0, -1).reduce((p, c) => p + c, 0) / (sorted.length - 1); // one hitch is not a trend
      frames = [];
      slowWindows = mean > target * SLOW ? slowWindows + 1 : 0;
      if (slowWindows >= 2) quality.step();
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      unsub();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
      window.removeEventListener("keydown", onMove);
    };
  }, [canvas, setDpr]);

  return null;
}
