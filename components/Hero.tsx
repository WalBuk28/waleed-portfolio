"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Download, MapPin, Terminal as TIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { profile } from "@/lib/data";
import { Terminal } from "./hero/Terminal";
import { ThreatTicker } from "./hero/ThreatTicker";
import { Counter } from "./ui/Counter";

export function Hero() {
  const reduce = useReducedMotion();
  const [roleIdx, setRoleIdx] = useState(0);
  const spotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setInterval(
      () => setRoleIdx((i) => (i + 1) % profile.rotatingRoles.length),
      2600
    );
    return () => clearInterval(id);
  }, []);

  // Cursor spotlight — writes CSS vars, no React re-render.
  const onMove = useCallback(
    (e: React.MouseEvent) => {
      if (reduce || !spotRef.current) return;
      const r = spotRef.current.getBoundingClientRect();
      spotRef.current.style.setProperty("--mx", `${e.clientX - r.left}px`);
      spotRef.current.style.setProperty("--my", `${e.clientY - r.top}px`);
    },
    [reduce]
  );

  return (
    <section
      id="top"
      onMouseMove={onMove}
      className="relative overflow-hidden pt-28 sm:pt-32"
    >
      {/* cursor spotlight layer */}
      <div ref={spotRef} className="spotlight absolute inset-0 -z-[1]" />

      <div className="section grid items-center gap-12 pb-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        {/* ── Left: copy ── */}
        <div>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="eyebrow"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-accent/60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-accent" />
            </span>
            {profile.availability}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-5 text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl"
          >
            {profile.name}
            <span className="mt-2 block text-2xl font-medium text-ink-secondary sm:text-3xl lg:text-[2rem]">
              Engineering defence across{" "}
              <span className="relative inline-block align-baseline">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={roleIdx}
                    initial={{ opacity: 0, y: reduce ? 0 : 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: reduce ? 0 : -14 }}
                    transition={{ duration: 0.4 }}
                    className="grad-text inline-block font-display font-bold"
                  >
                    {profile.rotatingRoles[roleIdx]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-ink-secondary sm:text-lg"
          >
            {profile.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <a href="#contact" className="btn-primary">
              Hire me
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <a href="#work" className="btn-ghost">
              <TIcon className="h-4 w-4 text-emerald-accent" />
              View the work
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              <Download className="h-4 w-4 text-electric-accent" />
              GitHub
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 flex items-center gap-2 font-mono text-2xs text-ink-muted"
          >
            <MapPin className="h-3.5 w-3.5" />
            {profile.location}
          </motion.div>
        </div>

        {/* ── Right: terminal ── */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <Terminal />
        </motion.div>
      </div>

      {/* ── Threat ticker ── */}
      <div className="mt-4">
        <ThreatTicker />
      </div>

      {/* ── Stat strip ── */}
      <div className="section">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-edge bg-edge lg:grid-cols-4">
          {profile.stats.map((s) => (
            <div key={s.label} className="bg-surface/80 px-5 py-6 text-center">
              <div className="font-display text-3xl font-bold text-ink sm:text-4xl">
                <Counter to={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-1.5 text-xs leading-snug text-ink-muted">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
