"use client";

import dynamic from "next/dynamic";
import { ReactNode, createContext, useCallback, useContext, useEffect, useLayoutEffect, useState } from "react";
import { EV, journey } from "./state";

const Journey = dynamic(() => import("./Journey"), { ssr: false });

/**
 * - pending: the gate hasn't looked yet (server render, and before hydration)
 * - 3d: WebGL is there and the scene is loading or running
 * - ask: WebGL is there, but the device asks for reduced motion, so the scene waits for a click
 * - flat: no WebGL (or ?view=flat): the card says so and leads home
 */
type Mode = "pending" | "3d" | "ask" | "flat";

function detect(): Mode {
  journey.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  journey.coarse = window.matchMedia("(pointer: coarse)").matches;
  if (new URLSearchParams(window.location.search).get("view") === "flat") return "flat";

  let webgl = false;
  try {
    const c = document.createElement("canvas");
    webgl = !!(c.getContext("webgl2") ?? c.getContext("webgl"));
  } catch {
    webgl = false;
  }
  if (!webgl) return "flat";
  return journey.reduced ? "ask" : "3d";
}

const GateCtx = createContext<{ mode: Mode; start: () => void }>({ mode: "pending", start: () => {} });

/**
 * The /journey gate. Its children (the frame and a server-rendered card) paint at once, so the
 * card's heading is the page's LCP and the page reads without JavaScript or WebGL. The card
 * says what is happening (loading, waiting for a click under reduced motion, or no WebGL); once
 * the 3D scene has mounted over it, the card leaves the page, so focus and the skip link land in
 * the scene.
 */
export function JourneyGate({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>("pending");
  const [live, setLive] = useState(false);

  useLayoutEffect(() => {
    setMode(detect());
  }, []);

  useEffect(() => {
    // the HUD's "2D" button: back to the plain home page
    const goFlat = () => {
      window.location.href = "/";
    };
    window.addEventListener(EV.flat, goFlat);
    return () => window.removeEventListener(EV.flat, goFlat);
  }, []);

  const start = useCallback(() => setMode("3d"), []);
  const onLive = useCallback(() => setLive(true), []);

  return (
    <GateCtx.Provider value={{ mode, start }}>
      {!live && children}
      {mode === "3d" && <Journey onLive={onLive} />}
    </GateCtx.Provider>
  );
}

/**
 * The card's status line. Before hydration, CSS picks the line from the flags the head script
 * sets (`js`, and `motion` unless reduced motion is asked for), so nothing changes size when
 * React takes over; only a browser without WebGL swaps in its own line.
 */
export function JourneyStatus({ className }: { className?: string }) {
  const { mode } = useContext(GateCtx);
  const rest = " Everything in it is also on the home page.";
  if (mode === "flat")
    return (
      <p className={className}>
        It needs WebGL, and this browser isn’t running it.{rest}
      </p>
    );
  return (
    <p className={className}>
      <span className="jline jline--nojs">It runs on JavaScript and WebGL, and this browser isn’t running JavaScript.</span>
      <span className="jline jline--load">Loading the scene.</span>
      <span className="jline jline--ask">
        Your device asks for reduced motion, and this version moves the camera the whole way through, so it waits
        for you.
      </span>
      {rest}
    </p>
  );
}

/** "Start the 3D version": shown only under reduced motion (by CSS, so it never shifts the page). */
export function JourneyStart({ className, label }: { className?: string; label: string }) {
  const { mode, start } = useContext(GateCtx);
  if (mode === "flat") return null;
  return (
    <button type="button" className={className} onClick={start} disabled={mode === "3d"}>
      <span className="btn__shape" aria-hidden="true" />
      {mode === "3d" ? "Loading the scene" : label}
    </button>
  );
}
