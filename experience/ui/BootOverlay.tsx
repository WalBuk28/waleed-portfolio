"use client";

import { useEffect, useRef, useState } from "react";
import { bootSequence, profile } from "../content";
import { EV, emit, journey } from "../state";
import { ensureAudio } from "../audio/engine";

const TONE: Record<string, string> = {
  ok: "text-emerald-accent",
  warn: "text-threat-warn",
  info: "text-electric-glow",
};

/** A boot line's run of leader dots, set apart so narrow screens can drop it. */
const lead = (t: string) => {
  const m = t.match(/^(.*?)( ?·{3,} ?)(.*)$/);
  return m ? (
    <>
      {m[1]}
      <span className="jlead">{m[2]}</span>
      {m[3] && <span> {m[3].trim()}</span>}
    </>
  ) : (
    t
  );
};

/**
 * The airlock. Types the walsec boot sequence, then hands the user two ways
 * in — ENTER or ENTER+SOUND (the user gesture that legally unlocks
 * WebAudio). Auto-enters silently after a few seconds. While this overlay
 * holds the screen, the canvas behind it is already compiling shaders.
 */
export function BootOverlay({ leaving, onEnter, onGone }: { leaving: boolean; onEnter: () => void; onGone: () => void }) {
  const [lines, setLines] = useState(0);
  const [ready, setReady] = useState(false);
  const done = useRef(false);
  const chosen = useRef(false); // a keyboard user has been in the airlock: it waits for them

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
    }, 170);
    return () => clearInterval(line);
  }, []);

  useEffect(() => {
    if (!ready) return;
    // Enters by itself unless a keyboard user is in the airlock, choosing.
    const auto = setTimeout(() => {
      if (!chosen.current && !document.activeElement?.closest(".jboot")) enter(false);
    }, 1600);
    return () => clearTimeout(auto);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  // Scrolling the page is a way in too: the camera is already moving with it.
  useEffect(() => {
    const go = () => enter(false);
    window.addEventListener("scroll", go, { once: true, passive: true });
    return () => window.removeEventListener("scroll", go);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The airlock fades out (0.7 s) once entered, then leaves the page.
  useEffect(() => {
    if (!leaving) return;
    const t = setTimeout(onGone, 700);
    return () => clearTimeout(t);
  }, [leaving, onGone]);

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

  // Every line is in the box from the start, unwritten lines kept invisible, so the box never
  // grows while the sequence types (it grew by 120 px on a phone: CLS 0.12).
  return (
    <div
      className={`jboot fixed inset-0 z-[60] flex items-center justify-center bg-void${leaving ? " is-leaving" : ""}`}
      onFocus={() => (chosen.current = true)}
    >
      <div className="w-full max-w-3xl px-6">
        <p className="eyebrow mb-4">
          <span className="inline-block h-1.5 w-1.5 animate-pulse-dot rounded-full bg-emerald-accent" />
          WALSEC OS · {profile.name.toUpperCase()} · SECURE BOOT
        </p>
        <div className="font-mono text-xs leading-6 sm:text-sm">
          {bootSequence.map((l, i) => (
            <p
              key={i}
              className={i < lines ? `jfade ${TONE[l.tone ?? "info"]}` : "invisible"}
              aria-hidden={i < lines ? undefined : true}
            >
              {lead(l.text)}
              {!ready && i === Math.max(0, lines - 1) && (
                <span className="ml-1 inline-block h-4 w-2.5 animate-blink bg-emerald-glow align-middle" aria-hidden="true" />
              )}
            </p>
          ))}
        </div>

        <div className={`jboot__go mt-6 flex flex-wrap items-center gap-3${ready ? " is-ready" : ""}`}>
          <button type="button" onClick={() => enter(true)} className="btn btn--primary btn--hud">
            <span className="btn__shape" aria-hidden="true" />
            Enter with sound
            <span className="btn__arrow" aria-hidden="true">
              →
            </span>
          </button>
          <button type="button" onClick={() => enter(false)} className="btn btn--ghost btn--hud">
            <span className="btn__shape" aria-hidden="true" />
            Enter silently
          </button>
          <button type="button" onClick={() => emit(EV.flat)} className="ulink ml-auto">
            2D version
          </button>
        </div>
      </div>
    </div>
  );
}
