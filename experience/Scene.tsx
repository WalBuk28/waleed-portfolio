"use client";

import { useEffect } from "react";
import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber";
import { PerformanceMonitor, Preload, ScrollControls } from "@react-three/drei";
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
        gl.setClearColor("#04070b");
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        scene.matrixWorldAutoUpdate = true;
      }}
    >
      <PerformanceMonitor
        onDecline={() => (journey.quality = 0)}
        onIncline={() => (journey.quality = 1)}
      >
        <ScrollControls pages={PAGES} damping={0.32} style={{ scrollbarWidth: "none" }}>
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
