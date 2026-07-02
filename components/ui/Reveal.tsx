"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  type ReactNode,
} from "react";

/**
 * Scroll-reveal that is robust by construction:
 *  - SSR / no-JS / crawlers render it fully visible (content is never gated).
 *  - On the client it hides *before paint* (layout effect, so no flash), then
 *    reveals when scrolled into view.
 *  - A safety timeout guarantees it reveals even if IntersectionObserver never
 *    fires (background tabs, headless capture).
 *  - prefers-reduced-motion leaves it visible with no transform.
 *
 * CSS lives in globals.css under the [data-reveal] selectors.
 */

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

function useReveal(
  ref: React.RefObject<HTMLElement | null>,
  { delay = 0, y = 18 }: { delay?: number; y?: number }
) {
  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) return; // stays visible, no motion

    el.style.setProperty("--reveal-y", `${y}px`);
    el.style.setProperty("--reveal-delay", `${Math.round(delay * 1000)}ms`);
    el.classList.add("reveal-init");

    let done = false;
    const reveal = () => {
      if (done || !el) return;
      done = true;
      el.classList.add("reveal-in");
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            reveal();
            io.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -80px 0px" }
    );
    io.observe(el);

    // If already in view at mount, reveal on the next frame.
    const raf = requestAnimationFrame(() => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) reveal();
    });
    // Absolute safety net.
    const t = setTimeout(reveal, 1500);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      clearTimeout(t);
    };
  }, [ref, delay, y]);
}

export function Reveal({
  children,
  delay = 0,
  y = 18,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useReveal(ref, { delay, y });
  return (
    <div ref={ref} data-reveal className={className}>
      {children}
    </div>
  );
}

/** Container — children reveal individually as they enter. */
export function RevealGroup({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
}) {
  return <div className={className}>{children}</div>;
}

export function RevealItem({
  children,
  className,
  y = 16,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useReveal(ref, { y });
  return (
    <div ref={ref} data-reveal className={className}>
      {children}
    </div>
  );
}
