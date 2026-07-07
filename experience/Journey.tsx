"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Scene } from "./Scene";
import { Hud } from "./ui/Hud";
import { BootOverlay } from "./ui/BootOverlay";

/**
 * The full 3D takeover: persistent canvas + DOM HUD + boot airlock.
 * Mounted only after JourneyGate confirms WebGL and motion preferences.
 */
export default function Journey() {
  const [booted, setBooted] = useState(false);

  return (
    <div id="journey-gl" className="fixed inset-0 z-40 bg-void" role="region" aria-label="Interactive 3D portfolio">
      <Scene />
      <Hud />
      <AnimatePresence>{!booted && <BootOverlay onEnter={() => setBooted(true)} />}</AnimatePresence>
    </div>
  );
}
