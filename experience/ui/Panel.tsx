"use client";

import { ReactNode } from "react";
import { Html, useScroll } from "@react-three/drei";
import { Presence } from "./Presence";
import { journey } from "../state";

// constant screen position: pins the Html wrapper to the sticky layer's
// origin so it never tracks the 3D anchor (drei only re-evaluates
// visibility/z-index when this value changes — it never does)
const pinTopLeft = () => [0, 0] as [number, number];

/**
 * HTML ↔ 3D sync. Drei's <Html> projects a DOM node onto a world-space
 * anchor every frame; we portal it into ScrollControls' *sticky* layer
 * (`scroll.fixed`), which lives INSIDE the scroll element — so panels are
 * clickable while wheel events still bubble to the native scroller.
 * Presence (CSS transitions) handles the rise-in and the sink-away.
 *
 * Touch devices: world-anchored divs overflow short viewports (content
 * flows down from the anchor and gets clipped), so panels become a
 * viewport-pinned bottom sheet instead — always fully visible, scrolling
 * internally when tall. The 3D anchor still decides *when* it shows.
 */
export function Panel({
  position,
  visible,
  children,
  width = 340,
  align = "left",
  z = [30, 0],
  center = false,
}: {
  position: [number, number, number];
  visible: boolean;
  children: ReactNode;
  width?: number;
  align?: "left" | "right" | "center";
  z?: [number, number];
  /** desktop: ignore the world anchor and float dead-center in the viewport
   *  (used inside the skills vortex, where any anchored spot clips).
   *  Touch devices always use the bottom sheet regardless. */
  center?: boolean;
}) {
  const scroll = useScroll();

  if (journey.coarse) {
    return (
      <Html
        position={position}
        portal={{ current: scroll.fixed }}
        calculatePosition={pinTopLeft}
        wrapperClass="jsheet-wrap"
        className="jsheet-inner"
        zIndexRange={z}
        style={{ pointerEvents: "none" }}
      >
        <Presence show={visible} className="jpanel jsheet jfx--sheet" exitMs={400}>
          {children}
        </Presence>
      </Html>
    );
  }

  if (center) {
    return (
      <Html
        position={position}
        portal={{ current: scroll.fixed }}
        calculatePosition={pinTopLeft}
        wrapperClass="jsheet-wrap"
        className="jsheet-inner"
        zIndexRange={z}
        style={{ pointerEvents: "none" }}
      >
        <div className="jcenter" style={{ width, maxWidth: "84vw" }}>
          <Presence show={visible} className="jpanel jpanel-center w-full" exitMs={450}>
            {children}
          </Presence>
        </div>
      </Html>
    );
  }

  const shift =
    align === "center" ? "translateX(-50%)" : align === "right" ? "translateX(-100%)" : "none";

  return (
    <Html
      position={position}
      portal={{ current: scroll.fixed }}
      zIndexRange={z}
      style={{ pointerEvents: "none" }}
    >
      {/* alignment lives on the wrapper; the panel's own rise uses the translate property */}
      <div style={{ width, maxWidth: "80vw", transform: shift }}>
        <Presence show={visible} className="jpanel w-full">
          {children}
        </Presence>
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

export function MetricGrid({ metrics }: { metrics: { value: string; label: string; sub?: string }[] }) {
  return (
    <div className="mb-3 grid grid-cols-2 gap-2">
      {metrics.slice(0, 4).map((m) => (
        <div key={m.label} className="rounded-lg border border-edge bg-void/50 px-2.5 py-2">
          <div className="font-mono text-sm font-bold text-emerald-glow">{m.value}</div>
          <div className="mt-0.5 text-2xs leading-tight text-ink-muted">{m.label}</div>
          {m.sub && <div className="mt-0.5 text-2xs leading-tight text-ink-muted">{m.sub}</div>}
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
