"use client";

import { ReactNode, useEffect, useState } from "react";

/**
 * Shows children while `show` is true: mounts them, lets the CSS enter run (.jfx -> .is-in),
 * and on hide plays the exit before unmounting. What framer-motion's AnimatePresence did for
 * the journey's few DOM pieces, on CSS transitions (reduced motion makes them instant).
 */
export function Presence({ show, className = "", exitMs = 500, children }: { show: boolean; className?: string; exitMs?: number; children: ReactNode }) {
  const [mounted, setMounted] = useState(show);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (show) {
      setMounted(true);
      const t = window.setTimeout(() => setShown(true), 30); // after the first paint, so it transitions
      return () => clearTimeout(t);
    }
    setShown(false);
    const t = window.setTimeout(() => setMounted(false), exitMs);
    return () => clearTimeout(t);
  }, [show, exitMs]);
  if (!mounted) return null;
  return <div className={`jfx ${className}${shown ? " is-in" : ""}`}>{children}</div>;
}
