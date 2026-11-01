"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Scene } from "./Scene";
import { Hud } from "./ui/Hud";
import { BootOverlay } from "./ui/BootOverlay";

/**
 * The full 3D takeover: persistent canvas + DOM HUD + boot airlock.
 * Mounted only after JourneyGate confirms WebGL (and, under reduced motion, a click). It is the
 * page's <main> once mounted (the gate lets the card go), so the layout's skip link lands here.
 */
export default function Journey({ onLive }: { onLive: () => void }) {
  const [booted, setBooted] = useState(false);
  const [gone, setGone] = useState(false);
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    onLive();
  }, [onLive]);

  // When the airlock leaves with focus inside it (a keyboard user pressed Enter), focus moves to
  // the scene, never back to <body>. Untouched, focus stays where it was: the next Tab starts at
  // the skip link.
  const onGone = useCallback(() => {
    const lost = !!document.activeElement?.closest(".jboot");
    setGone(true);
    if (lost) root.current?.focus({ preventScroll: true });
  }, []);

  return (
    <main
      ref={root}
      id="main"
      tabIndex={-1}
      className="journey-root fixed inset-0 z-40 bg-void outline-none"
      aria-label="Interactive 3D portfolio"
    >
      <Scene />
      <Hud />
      {!gone && <BootOverlay leaving={booted} onEnter={() => setBooted(true)} onGone={onGone} />}
    </main>
  );
}
