"use client";

import { useEffect, useState } from "react";
import { Presence } from "./Presence";
import { EV, emit, journey } from "../state";
import { ensureAudio } from "../audio/engine";
import { profile } from "../content";
import { SECTIONS, sectionAt } from "../journey";

/**
 * Fixed DOM chrome over the canvas: wordmark, sound toggle, 2D escape hatch,
 * live section readout and journey progress. Listens to the render loop via
 * custom events — zero React re-renders inside the 3D tree.
 */
export function Hud({ locked = false }: { locked?: boolean }) {
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
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" });
    journey.audio?.blip("open");
  };

  return (
    // inert while the airlock covers it: no focus can land on controls nobody can see
    <div className="pointer-events-none fixed inset-0 z-50 select-none" inert={locked}>
      {/* wordmark (hidden on narrow screens — the controls need the room) */}
      <div className="absolute left-5 top-5 hidden font-mono text-2xs uppercase tracking-wider2 text-ink-secondary sm:block">
        <span className="text-emerald-accent">▲</span> WALSEC<span className="text-ink-muted">://JOURNEY</span>
      </div>

      {/* controls: the site's ghost buttons, which flood with the tint under the hand */}
      <nav aria-label="3D controls" className="pointer-events-auto absolute right-5 top-5 flex items-center gap-2">
        <button type="button" onClick={warpToContact} className="btn btn--ghost btn--hud" title="Fly to the contact gate">
          <span className="btn__shape" aria-hidden="true" />
          Contact
        </button>
        <button type="button" onClick={toggleSound} aria-pressed={sound} className="btn btn--ghost btn--hud">
          <span className="btn__shape" aria-hidden="true" />
          {sound ? "Sound on" : "Sound off"}
        </button>
        <button
          type="button"
          onClick={() => emit(EV.flat)}
          className="btn btn--ghost btn--hud"
          title="Switch to the 2D site"
        >
          <span className="btn__shape" aria-hidden="true" />
          2D
        </button>
      </nav>

      {/* section readout */}
      <div className="absolute bottom-6 left-5">
        <p key={section.id} className="jfade font-mono text-2xs uppercase tracking-wider2 text-ink-secondary">
          <span className="text-emerald-accent">▸</span> {section.label}
        </p>
      </div>

      {/* depth gauge */}
      <div className="absolute bottom-6 right-5 flex items-center gap-2">
        <span className="font-mono text-2xs tabular-nums text-ink-muted">
          {String(Math.round(progress * 100)).padStart(3, "0")}%
        </span>
        <div className="hidden h-1 w-28 overflow-hidden rounded-full bg-surface sm:block">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-accent to-electric-accent"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      {/* scroll hint */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-center sm:bottom-6">
        <Presence show={!scrolled} exitMs={400}>
          <div className="jfade--late">
            <p className="font-mono text-2xs uppercase tracking-wider2 text-ink-muted">Scroll to descend the stream</p>
            <p className="jbob mt-1 text-emerald-accent" aria-hidden>
              ▼
            </p>
          </div>
        </Presence>
      </div>

      <span className="sr-only">
        {profile.fullName}, {profile.role}. Interactive 3D portfolio; use the 2D button for the
        accessible version.
      </span>
    </div>
  );
}
