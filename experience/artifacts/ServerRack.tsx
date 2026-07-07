"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { RoundedBox, useCursor, useScroll } from "@react-three/drei";
import { easing } from "maath";
import { C } from "../palette";
import { ANCHORS, SECTIONS, facing } from "../journey";
import { ART } from "../content";
import { journey } from "../state";
import { GlowSprite, NeonBox, TextPlane } from "../bits";
import { CaseLink, Chips, MetricGrid, Panel, PanelHeader } from "../ui/Panel";

const SEC = SECTIONS.find((s) => s.id === "atioc")!;
const UNITS = 6;
const LED_COLS = 10;
const LED_COLORS = [C.emerald, C.cyan, C.warn, C.emeraldGlow];

/**
 * WalSec A-TIOC Hub — an air-gapped server rack humming in the void.
 * Hover/tap racks the units out on their rails; a local-LLM core orbits
 * above inside a pulsing "air-gap" containment field. The rack emits a
 * position-panned 60Hz hum that swells as the camera closes in.
 */
export function ServerRack() {
  const scroll = useScroll();
  const camera = useThree((s) => s.camera);
  const root = useRef<THREE.Group>(null!);
  const units = useRef<THREE.Group[]>([]);
  const leds = useRef<THREE.InstancedMesh>(null!);
  const aura = useRef<THREE.Sprite>(null!);
  const ringA = useRef<THREE.Mesh>(null!);
  const ringB = useRef<THREE.Mesh>(null!);
  const core = useRef<THREE.Group>(null!);
  const [hovered, setHovered] = useState(false);
  const [show, setShow] = useState(false);
  const ledClock = useRef(0);
  useCursor(hovered);

  const quat = useMemo(() => facing(ANCHORS.atioc, SEC.center), []);
  const ledColor = useMemo(() => new THREE.Color(), []);
  const camLocal = useMemo(() => new THREE.Vector3(), []);

  // seat the LED instances on the unit faceplates
  useLayoutEffect(() => {
    const m = new THREE.Matrix4();
    for (let i = 0; i < UNITS * LED_COLS; i++) {
      const u = Math.floor(i / LED_COLS);
      const c = i % LED_COLS;
      m.setPosition(-0.28 + c * 0.075, -0.78 + u * 0.31, 0.445);
      leds.current.setMatrixAt(i, m);
      leds.current.setColorAt(i, ledColor.set("#0a232b"));
    }
    leds.current.instanceMatrix.needsUpdate = true;
    if (leds.current.instanceColor) leds.current.instanceColor.needsUpdate = true;
  }, [ledColor]);

  useFrame((state, dt) => {
    const visible = scroll.visible(SEC.from - 0.06, SEC.to - SEC.from + 0.12);
    root.current.visible = visible;

    const inRange = scroll.visible(SEC.from + 0.015, SEC.to - SEC.from - 0.045);
    if (inRange !== show) setShow(inRange);
    if (!visible) {
      journey.audio?.setHum(0, 0);
      return;
    }

    const t = state.clock.elapsedTime;

    // units slide out on their rails when engaged
    units.current.forEach((u, i) => {
      if (!u) return;
      const open = hovered ? 0.16 + (i % 3) * 0.09 : 0;
      easing.damp(u.position, "z", open, 0.28 + i * 0.04, dt);
    });

    // LED matrix flicker
    ledClock.current += dt;
    if (ledClock.current > 0.13 && leds.current.instanceColor) {
      ledClock.current = 0;
      for (let i = 0; i < UNITS * LED_COLS; i++) {
        const on = Math.random() < (hovered ? 0.55 : 0.3);
        ledColor.set(on ? LED_COLORS[i % LED_COLORS.length] : "#0a232b");
        leds.current.setColorAt(i, ledColor);
      }
      leds.current.instanceColor.needsUpdate = true;
    }

    // containment field + LLM core
    const pulse = 0.24 + 0.1 * Math.sin(t * 2.4) + (hovered ? 0.16 : 0);
    (aura.current.material as THREE.SpriteMaterial).opacity = pulse;
    aura.current.scale.setScalar(3.4 + 0.25 * Math.sin(t * 2.4));
    ringA.current.rotation.z = t * 0.5;
    ringA.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.3) * 0.2;
    ringB.current.rotation.z = -t * 0.35;
    ringB.current.rotation.y = Math.sin(t * 0.4) * 0.3;
    core.current.rotation.y = t * (hovered ? 1.6 : 0.7);
    core.current.position.y = 1.55 + Math.sin(t * 1.4) * 0.06;

    // ── localized spatial audio: proximity gain + camera-space stereo pan ──
    const d = camera.position.distanceTo(root.current.position);
    const level = Math.pow(THREE.MathUtils.clamp(1 - d / 10, 0, 1), 2) * (hovered ? 1.25 : 1);
    camLocal.copy(root.current.position);
    camera.worldToLocal(camLocal);
    journey.audio?.setHum(level, camLocal.x / 5);
  });

  return (
    <group ref={root} position={ANCHORS.atioc} quaternion={quat}>
      <group
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          journey.audio?.blip("hover");
        }}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          journey.audio?.blip("open");
        }}
      >
        {/* frame */}
        <NeonBox args={[1.5, 2.14, 1.0]} color={C.emerald} opacity={0.85} />
        {[-0.72, 0.72].map((x) =>
          [-0.47, 0.47].map((z) => (
            <mesh key={`${x}${z}`} position={[x, 0, z]}>
              <boxGeometry args={[0.05, 2.14, 0.05]} />
              <meshStandardMaterial color={C.metalLight} metalness={0.85} roughness={0.35} />
            </mesh>
          ))
        )}

        {/* server units on rails */}
        {Array.from({ length: UNITS }, (_, i) => (
          <group key={i} ref={(g) => void (units.current[i] = g!)} position={[0, -0.78 + i * 0.31, 0]}>
            <RoundedBox args={[1.32, 0.25, 0.86]} radius={0.02}>
              <meshStandardMaterial color={C.metal} metalness={0.8} roughness={0.42} />
            </RoundedBox>
            <mesh position={[-0.52, 0, 0.44]}>
              <planeGeometry args={[0.18, 0.16]} />
              <meshBasicMaterial color={C.emeraldDeep} toneMapped={false} />
            </mesh>
          </group>
        ))}

        {/* LED matrix (60 instanced dots on the unit faceplates) */}
        <instancedMesh ref={leds} args={[undefined, undefined, UNITS * LED_COLS]} raycast={() => null}>
          <planeGeometry args={[0.05, 0.05]} />
          <meshBasicMaterial toneMapped={false} />
        </instancedMesh>
      </group>

      {/* air-gap containment field */}
      <GlowSprite ref={aura} color={C.emerald} scale={3.4} opacity={0.25} />
      <mesh ref={ringA} raycast={() => null}>
        <torusGeometry args={[1.5, 0.012, 8, 72]} />
        <meshBasicMaterial color={C.emerald} transparent opacity={0.6} blending={THREE.AdditiveBlending} toneMapped={false} />
      </mesh>
      <mesh ref={ringB} raycast={() => null}>
        <torusGeometry args={[1.72, 0.008, 8, 72]} />
        <meshBasicMaterial color={C.emeraldGlow} transparent opacity={0.35} blending={THREE.AdditiveBlending} toneMapped={false} />
      </mesh>

      {/* local LLM core — the intelligence that never leaves the perimeter */}
      <group ref={core} position={[0, 1.55, 0]}>
        <mesh>
          <icosahedronGeometry args={[0.16, 1]} />
          <meshStandardMaterial
            color={C.emeraldDeep}
            emissive={C.emerald}
            emissiveIntensity={2.2}
            wireframe
          />
        </mesh>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[Math.cos((i / 3) * Math.PI * 2) * 0.38, 0, Math.sin((i / 3) * Math.PI * 2) * 0.38]}>
            <boxGeometry args={[0.05, 0.05, 0.05]} />
            <meshBasicMaterial color={C.emeraldGlow} toneMapped={false} />
          </mesh>
        ))}
      </group>
      <TextPlane text="AIR-GAPPED · 100% LOCAL" height={0.09} color={C.emeraldGlow} position={[0, -1.32, 0.3]} />

      <pointLight color={C.emerald} intensity={5} distance={7} decay={2} position={[0, 0.4, 1.2]} />

      {/* synced DOM panel */}
      <Panel position={[1.55, 0.55, 0]} visible={show} width={330}>
        <PanelHeader
          eyebrow={`${ART.atioc.category} · ${ART.atioc.year}`}
          title={ART.atioc.title}
          tagline={ART.atioc.tagline}
        />
        <MetricGrid metrics={ART.atioc.metrics} />
        <Chips items={ART.atioc.stack} max={5} />
        <CaseLink slug={ART.atioc.slug} />
      </Panel>
    </group>
  );
}
