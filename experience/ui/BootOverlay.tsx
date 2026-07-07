"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { bootSequence, profile } from "../content";
import { EV, emit, journey } from "../state";
import { ensureAudio } from "../audio/engine";

const TONE: Record<string, string> = {
  ok: "text-emerald-accent",
  warn: "text-threat-warn",
  info: "text-electric-glow",
};

/**
 * The airlock. Types the walsec boot sequence, then hands the user two ways
 * in — ENTER or ENTER+SOUND (the user gesture that legally unlocks
 * WebAudio). Auto-enters silently after a few seconds. While this overlay
 * holds the screen, the canvas behind it is already compiling shaders.
 */
export function BootOverlay({ onEnter }: { onEnter: () => void }) {
  const [lines, setLines] = useState(0);
  const [ready, setReady] = useState(false);
  const done = useRef(false);

  useEffect(() => {
    const line = setInterval(() => {
      setLines((n) => {
        if (n >= bootSequence.length) {
          clearInterval(line);
          setReady(true);
          return n;
        }
        return n + 1;
      });
    }, 230);
    return () => clearInterval(line);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const auto = setTimeout(() => enter(false), 2600);
    return () => clearTimeout(auto);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  const enter = (sound: boolean) => {
    if (done.current) return;
    done.current = true;
    if (sound) {
      const engine = ensureAudio();
      journey.audio = engine;
      engine.setEnabled(true);
      emit(EV.audio, { on: true });
    }
    journey.started = true;
    journey.introT0 = performance.now();
    onEnter();
  };

  return (
    <motion.div
      exit={{ opacity: 0, transition: { duration: 0.7, ease: "easeOut" } }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-void"
    >
      <div className="w-full max-w-xl px-6">
        <p className="eyebrow mb-4">
          <span className="inline-block h-1.5 w-1.5 animate-pulse-dot rounded-full bg-emerald-accent" />
          WALSEC OS · {profile.name.toUpperCase()} · SECURE BOOT
        </p>
        <div className="min-h-[180px] font-mono text-xs leading-6 sm:text-sm">
          {bootSequence.slice(0, lines).map((l, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={TONE[l.tone ?? "info"]}
            >
              {l.text}
            </motion.p>
          ))}
          {!ready && <span className="inline-block h-4 w-2.5 animate-blink bg-emerald-glow align-middle" />}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          className="mt-6 flex flex-wrap items-center gap-3"
        >
          <button onClick={() => enter(true)} className="btn-primary" autoFocus>
            ENTER + SOUND ▸
          </button>
          <button onClick={() => enter(false)} className="btn-ghost">
            ENTER SILENT
          </button>
          <button
            onClick={() => emit(EV.flat)}
            className="ml-auto font-mono text-2xs uppercase tracking-wider2 text-ink-muted transition-colors hover:text-ink"
          >
            ▢ 2D version
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
