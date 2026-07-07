"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ReactNode, useEffect, useLayoutEffect, useState } from "react";
import { EV, journey } from "./state";

const Journey = dynamic(() => import("./Journey"), { ssr: false });

type Mode = "pending" | "3d" | "flat";

/**
 * The 2D site is the default everywhere — recruiters get instant, scannable
 * content. The 3D journey is strictly opt-in: the /journey route (or a
 * ?view=3d link) requests it, and it still requires working WebGL.
 */
function detect(routeDefault?: "3d" | "flat"): Mode {
  journey.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  journey.coarse = window.matchMedia("(pointer: coarse)").matches;

  const query = new URLSearchParams(window.location.search).get("view");
  const pref = query ?? routeDefault ?? "flat";
  if (pref !== "3d") return "flat";

  let webgl = false;
  try {
    const c = document.createElement("canvas");
    webgl = !!(c.getContext("webgl2") ?? c.getContext("webgl"));
  } catch {
    webgl = false;
  }
  return webgl ? "3d" : "flat";
}

/**
 * Progressive-enhancement gate. Children (the 2D site) are always
 * server-rendered for crawlers, no-JS readers and every default visit; the
 * 3D takeover mounts only on explicit request with WebGL available. Both
 * modes keep an escape hatch to the other.
 */
export function JourneyGate({
  children,
  defaultMode,
}: {
  children: ReactNode;
  defaultMode?: "3d" | "flat";
}) {
  const [mode, setMode] = useState<Mode>("pending");

  useLayoutEffect(() => {
    setMode(detect(defaultMode));
  }, [defaultMode]);

  useEffect(() => {
    const goFlat = () => {
      // from /journey (or a ?view=3d deep link) return to the plain home
      // page; on the bare home route just swap in place
      if (window.location.pathname !== "/" || window.location.search) {
        window.location.href = "/";
        return;
      }
      setMode("flat");
    };
    window.addEventListener(EV.flat, goFlat);
    return () => window.removeEventListener(EV.flat, goFlat);
  }, []);

  return (
    <>
      <div hidden={mode === "3d"}>{children}</div>
      {mode === "3d" && <Journey />}
      {mode === "flat" && (
        <Link
          href="/journey"
          className="fixed bottom-5 right-5 z-50 rounded-xl border border-emerald-accent/40 bg-surface/80 px-4 py-2 font-mono text-2xs uppercase tracking-wider2 text-emerald-glow shadow-glow-emerald backdrop-blur-md transition-all hover:border-emerald-accent hover:brightness-110"
        >
          ◉ Enter 3D journey
        </Link>
      )}
    </>
  );
}
