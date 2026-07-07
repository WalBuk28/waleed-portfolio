"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EV, emit, journey } from "../state";
import { ensureAudio } from "../audio/engine";
import { profile } from "../content";
import { SECTIONS, sectionAt } from "../journey";

/**
 * Fixed DOM chrome over the canvas: wordmark, sound toggle, 2D escape hatch,
 * live section readout and journey progress. Listens to the render loop via
 * custom events — zero React re-renders inside the 3D tree.
 */
export function Hud() {
  const [progress, setProgress] = useState(0);
  const [section, setSection] = useState(SECTIONS[0]);
  const [sound, setSound] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onProgress = (e: Event) => {
      const off = (e as CustomEvent<{ offset: number }>).detail.offset;
      setProgress(off);
      // derive the section from the same stream — stable objects, so React
      // bails out when it hasn't changed
      setSection(sectionAt(off));
      if (off > 0.015) setScrolled(true);
    };
    const onAudio = (e: Event) => setSound((e as CustomEvent<{ on: boolean }>).detail.on);
    window.addEventListener(EV.progress, onProgress);
    window.addEventListener(EV.audio, onAudio);
    return () => {
      window.removeEventListener(EV.progress, onProgress);
      window.removeEventListener(EV.audio, onAudio);
    };
  }, []);

  const toggleSound = () => {
    const engine = ensureAudio();
    journey.audio = engine;
    const next = !sound;
    engine.setEnabled(next);
    setSound(next);
    emit(EV.audio, { on: next });
  };

  // warp the virtual scroller to the uplink gate — the damped camera turns
  // the jump into a fast cinematic flythrough
  const warpToContact = () => {
    const el = document.querySelector<HTMLElement>("#journey-gl .no-scrollbar");
    if (el) el.scrollTop = el.scrollHeight - el.clientHeight;
    journey.audio?.blip("open");
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-50 select-none">
      {/* wordmark (hidden on narrow screens — the controls need the room) */}
      <div className="absolute left-5 top-5 hidden font-mono text-2xs uppercase tracking-wider2 text-ink-secondary sm:block">
        <span className="text-emerald-accent">▲</span> WALSEC<span className="text-ink-muted">://JOURNEY</span>
      </div>

      {/* controls */}
      <div className="pointer-events-auto absolute right-5 top-5 flex items-center gap-2">
        <button
          onClick={warpToContact}
          className="rounded-lg border border-edge bg-surface/60 px-3 py-1.5 font-mono text-2xs uppercase tracking-wider2 text-ink-secondary backdrop-blur-sm transition-colors hover:border-emerald-accent/50 hover:text-emerald-glow"
          title="Warp to the uplink gate"
        >
          ▸ Contact
        </button>
        <button
          onClick={toggleSound}
          aria-pressed={sound}
          className={`rounded-lg border px-3 py-1.5 font-mono text-2xs uppercase tracking-wider2 backdrop-blur-sm transition-colors ${
            sound
              ? "border-emerald-accent/60 bg-emerald-deep/30 text-emerald-glow"
              : "border-edge bg-surface/60 text-ink-muted hover:text-ink"
          }`}
        >
          {sound ? "◉ SND ON" : "○ SND OFF"}
        </button>
        <button
          onClick={() => emit(EV.flat)}
          className="rounded-lg border border-edge bg-surface/60 px-3 py-1.5 font-mono text-2xs uppercase tracking-wider2 text-ink-muted backdrop-blur-sm transition-colors hover:text-ink"
          title="Switch to the accessible 2D version"
        >
          ▢ 2D
        </button>
      </div>

      {/* section readout */}
      <div className="absolute bottom-6 left-5">
        <AnimatePresence initial={false}>
          <motion.p
            key={section.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8, position: "absolute" }}
            transition={{ duration: 0.25 }}
            className="font-mono text-2xs uppercase tracking-wider2 text-ink-secondary"
          >
            <span className="text-emerald-accent">▸</span> {section.label}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* depth gauge */}
      <div className="absolute bottom-6 right-5 flex items-center gap-2">
        <span className="font-mono text-2xs tabular-nums text-ink-muted">
          {String(Math.round(progress * 100)).padStart(3, "0")}%
        </span>
        <div className="h-1 w-28 overflow-hidden rounded-full bg-surface">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-accent to-electric-accent"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      {/* scroll hint */}
      <AnimatePresence>
        {!scrolled && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 3.4, duration: 0.8 } }}
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center"
          >
            <p className="font-mono text-2xs uppercase tracking-wider2 text-ink-muted">
              Scroll to descend the stream
            </p>
            <motion.p
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
              className="mt-1 text-emerald-accent"
              aria-hidden
            >
              ▼
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <span className="sr-only">
        {profile.fullName} — {profile.role}. Interactive 3D portfolio; use the 2D button for the
        accessible version.
      </span>
    </div>
  );
}
