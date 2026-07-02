"use client";

import { animate } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Count-up number, robust by construction:
 *  - Default state is the FINAL value, so SSR / no-JS / crawlers see the real
 *    number (never 0) and there's no dependence on IntersectionObserver.
 *  - On mount (before paint, via layout effect) it resets to 0 and counts up —
 *    no flash of the final value first.
 *  - A safety timeout guarantees it lands on the target even if the animation
 *    driver never ticks; reduced-motion skips the animation entirely.
 */
export function Counter({
  to,
  suffix = "",
  prefix = "",
  duration = 1.6,
}: {
  to: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}) {
  const [display, setDisplay] = useState(to);
  const started = useRef(false);

  useIsoLayoutEffect(() => {
    if (started.current) return;
    started.current = true;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) {
      setDisplay(to);
      return;
    }

    setDisplay(0); // before first paint — no flash of the final value
    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    const settle = setTimeout(() => setDisplay(to), duration * 1000 + 300);

    return () => {
      controls.stop();
      clearTimeout(settle);
    };
  }, [to, duration]);

  return (
    <span className="tabular-nums">
      {prefix}
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}
