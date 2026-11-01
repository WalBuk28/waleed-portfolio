"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Scene } from "./Scene";
import { Hud } from "./ui/Hud";
import { BootOverlay } from "./ui/BootOverlay";
import { PAGES } from "./journey";

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
  // the first of the scene's controls, never back to <body>; it waits for the HUD to stop being
  // inert. Untouched, focus stays where it was: the next Tab starts at the skip link.
  const refocus = useRef(false);
  const onGone = useCallback(() => {
    refocus.current = !!document.activeElement?.closest(".jboot");
    setGone(true);
  }, []);
  useEffect(() => {
    if (!gone || !refocus.current) return;
    refocus.current = false;
    root.current?.querySelector<HTMLElement>('nav[aria-label="3D controls"] button')?.focus({ preventScroll: true });
  }, [gone]);

  return (
    <>
      <main
        ref={root}
        id="main"
        tabIndex={-1}
        className="journey-root fixed inset-0 z-40 bg-void outline-none"
        aria-labelledby="journey-title"
      >
        <h1 id="journey-title" className="sr-only">
          The 3D version
        </h1>
        <Scene />
        <Hud locked={!gone} />
        {!gone && <BootOverlay leaving={booted} onEnter={() => setBooted(true)} onGone={onGone} />}
      </main>
      {/* The page's own scroll drives the camera (Scene: WindowScroll): a track PAGES screens tall. */}
      <div aria-hidden="true" style={{ height: `${PAGES * 100}lvh` }} />
    </>
  );
}
