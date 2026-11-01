"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerformanceMonitor, Preload, ScrollControls, useScroll } from "@react-three/drei";
import { PAGES } from "./journey";
import { journey } from "./state";
import { CameraRig } from "./CameraRig";
import { Effects } from "./Effects";
import { Ambient } from "./Ambient";
import { DataStream } from "./DataStream";
import { Laptop } from "./laptop/Laptop";
import { HoloCode } from "./laptop/HoloCode";
import { ServerRack } from "./artifacts/ServerRack";
import { CipherLock } from "./artifacts/CipherLock";
import { ForensicsWeb } from "./artifacts/ForensicsWeb";
import { SkillsVortex } from "./SkillsVortex";
import { ExperienceRelay } from "./ExperienceRelay";
import { DossierNode } from "./DossierNode";
import { ContactGate } from "./ContactGate";

// R3F 9 (up to 9.8.2, the latest) still creates a THREE.Clock, which three r183+ marks as
// deprecated with a console warning on every visit. Nothing on our side uses Clock: drop that one
// message and pass every other log, warning and error through unchanged.
THREE.setConsoleFunction((type: string, message: string, ...params: unknown[]) => {
  if (type === "warn" && message.startsWith("THREE.Clock:")) return;
  (console[type as "log" | "warn" | "error"] ?? console.log)(message, ...params);
});

/**
 * The journey scrolls the page itself, not drei's inner scroller (held at overflow: hidden, so it
 * still takes the pointer for the 3D hovers): Journey adds a track PAGES screens tall, and this
 * feeds the window's progress into ScrollControls' target, which it damps into `offset` as
 * before. Native page scroll means touch momentum, the keyboard (Space, Page Down, arrows) and
 * anything else that scrolls a page all move the camera. `scroll` is drei's own target ref: on
 * the state at runtime, though its type leaves it out.
 */
function WindowScroll() {
  const state = useScroll() as unknown as { scroll: { current: number } };
  const max = useRef(1);
  useEffect(() => {
    const measure = () => (max.current = Math.max(1, document.documentElement.scrollHeight - window.innerHeight));
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);
  useFrame(() => {
    state.scroll.current = Math.min(1, Math.max(0, window.scrollY / max.current));
  });
  return null;
}

/**
 * three's Raycaster ignores `visible` entirely — without this filter the
 * range-culled artifacts would keep stealing hovers and clicks from
 * anywhere on the journey (phantom cursors, hijacked vortex clicks).
 */
function RaycastVisibilityFilter() {
  const setEvents = useThree((s) => s.setEvents);
  useEffect(() => {
    setEvents({
      filter: (items: THREE.Intersection[]) =>
        items.filter((hit) => {
          let o: THREE.Object3D | null = hit.object;
          while (o) {
            if (!o.visible) return false;
            o = o.parent;
          }
          return true;
        }),
    });
  }, [setEvents]);
  return null;
}

/**
 * ONE persistent <Canvas> for the entire site. <ScrollControls> virtualises
 * 15 pages of native scroll into a 0..1 offset; CameraRig maps it onto the
 * flight spline. Everything else hangs off that same coordinate.
 */
export function Scene() {
  return (
    <Canvas
      gl={{
        antialias: false,
        alpha: false,
        powerPreference: "high-performance",
        stencil: false,
      }}
      dpr={journey.coarse ? [1, 1.5] : [1, 1.75]}
      camera={{ fov: 55, near: 0.1, far: 60, position: [4.6, 3.3, 7.8] }}
      onCreated={({ gl, scene }) => {
        gl.setClearColor("#070b1c");
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        scene.matrixWorldAutoUpdate = true;
      }}
    >
      <PerformanceMonitor
        onDecline={() => (journey.quality = 0)}
        onIncline={() => (journey.quality = 1)}
      >
        <ScrollControls pages={PAGES} damping={0.32} style={{ scrollbarWidth: "none", overflowY: "hidden" }}>
          <WindowScroll />
          <RaycastVisibilityFilter />
          <CameraRig />
          <Ambient />
          <DataStream />

          {/* 01 · the hacker's terminal */}
          <Laptop />
          <HoloCode />

          {/* 03–05 · project artifacts along the stream */}
          <ServerRack />
          <CipherLock />
          <ForensicsWeb />

          {/* 06 · skills vortex (camera flies through) */}
          <SkillsVortex />

          {/* 07–08 · field ops + operator dossier */}
          <ExperienceRelay />
          <DossierNode />

          {/* 09 · terminus */}
          <ContactGate />
        </ScrollControls>

        <Effects />
        <Preload all />
      </PerformanceMonitor>
    </Canvas>
  );
}
