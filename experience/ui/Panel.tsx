"use client";

import { ReactNode } from "react";
import { Html, useScroll } from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";
import { journey } from "../state";

/**
 * HTML ↔ 3D sync. Drei's <Html> projects a DOM node onto a world-space
 * anchor every frame; we portal it into ScrollControls' *sticky* layer
 * (`scroll.fixed`), which lives INSIDE the scroll element — so panels are
 * clickable while wheel events still bubble to the native scroller.
 * Framer Motion handles the decrypt-in / dissolve-out.
 */
export function Panel({
  position,
  visible,
  children,
  width = 340,
  align = "left",
  z = [30, 0],
  mobilePosition,
}: {
  position: [number, number, number];
  visible: boolean;
  children: ReactNode;
  width?: number;
  align?: "left" | "right" | "center";
  z?: [number, number];
  /** touch devices: side anchors fall off narrow screens — default drops the
   *  panel below the artifact, centered. Pass a tuple to override. */
  mobilePosition?: [number, number, number];
}) {
  const scroll = useScroll();
  const coarse = journey.coarse;
  const pos = coarse ? (mobilePosition ?? [0, -0.95, 0.6]) : position;
  const effAlign = coarse ? "center" : align;
  const shift =
    effAlign === "center" ? "translateX(-50%)" : effAlign === "right" ? "translateX(-100%)" : "none";

  return (
    <Html
      position={pos}
      portal={{ current: scroll.fixed }}
      zIndexRange={z}
      style={{ pointerEvents: "none" }}
    >
      {/* alignment lives on the wrapper — framer-motion owns the inner transform */}
      <div style={{ width, maxWidth: "80vw", transform: shift }}>
        <AnimatePresence>
          {visible && (
            <motion.div
              initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="jpanel w-full"
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Html>
  );
}

/** Standard panel furniture. */
export function PanelHeader({
  eyebrow,
  title,
  tagline,
  accent = "emerald",
}: {
  eyebrow: string;
  title: string;
  tagline?: string;
  accent?: "emerald" | "electric" | "crit";
}) {
  const dot =
    accent === "crit" ? "bg-threat-crit" : accent === "electric" ? "bg-electric-accent" : "bg-emerald-accent";
  return (
    <header className="mb-3">
      <p className="eyebrow mb-1.5">
        <span className={`inline-block h-1.5 w-1.5 rounded-full ${dot} animate-pulse-dot`} />
        {eyebrow}
      </p>
      <h3 className="font-display text-lg font-bold leading-tight text-ink">{title}</h3>
      {tagline && <p className="mt-1 text-xs leading-relaxed text-ink-secondary">{tagline}</p>}
    </header>
  );
}

export function MetricGrid({ metrics }: { metrics: { value: string; label: string }[] }) {
  return (
    <div className="mb-3 grid grid-cols-2 gap-2">
      {metrics.slice(0, 4).map((m) => (
        <div key={m.label} className="rounded-lg border border-edge bg-void/50 px-2.5 py-2">
          <div className="font-mono text-sm font-bold text-emerald-glow">{m.value}</div>
          <div className="mt-0.5 text-2xs leading-tight text-ink-muted">{m.label}</div>
        </div>
      ))}
    </div>
  );
}

export function Chips({ items, max = 6 }: { items: string[]; max?: number }) {
  return (
    <div className="mb-3 flex flex-wrap gap-1.5">
      {items.slice(0, max).map((s) => (
        <span key={s} className="chip !py-0.5">
          {s}
        </span>
      ))}
    </div>
  );
}

export function CaseLink({ slug, accent = "emerald" }: { slug: string; accent?: "emerald" | "electric" | "crit" }) {
  const color =
    accent === "crit"
      ? "text-threat-crit hover:text-red-300"
      : accent === "electric"
        ? "text-electric-accent hover:text-electric-glow"
        : "text-emerald-accent hover:text-emerald-glow";
  return (
    <a
      href={`/work/${slug}`}
      className={`inline-flex items-center gap-1.5 font-mono text-2xs uppercase tracking-wider2 ${color} transition-colors`}
    >
      Open case file <span aria-hidden>▸</span>
    </a>
  );
}
