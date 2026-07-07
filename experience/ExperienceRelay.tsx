"use client";

import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useCursor, useScroll } from "@react-three/drei";
import { easing } from "maath";
import { C } from "./palette";
import { ANCHORS, facing } from "./journey";
import { experience } from "./content";
import { journey } from "./state";
import { GlowSprite, TextPlane } from "./bits";
import { Panel, PanelHeader } from "./ui/Panel";

// each badge owns a slice of the relay corridor
const WINDOWS: [number, number][] = [
  [0.682, 0.716],
  [0.716, 0.752],
  [0.752, 0.788],
  [0.788, 0.826],
];
const BADGE_T = [0.7, 0.735, 0.77, 0.805];
const SHORT = ["RTC", "TELSTRA", "MASTERCARD", "DELOITTE"];

/**
 * Field operations — four holographic access badges checkpointed along the
 * stream, one per engagement (Receptive Tech, Telstra, Mastercard,
 * Deloitte). Each authenticates as the camera reaches it.
 */
export function ExperienceRelay() {
  const scroll = useScroll();
  const root = useRef<THREE.Group>(null!);

  useFrame(() => {
    root.current.visible = scroll.visible(0.64, 0.23);
  });

  return (
    <group ref={root}>
      {experience.map((xp, i) => (
        <Badge key={xp.company} index={i} xp={xp} />
      ))}
    </group>
  );
}

function Badge({ index, xp }: { index: number; xp: (typeof experience)[number] }) {
  const scroll = useScroll();
  const group = useRef<THREE.Group>(null!);
  const plate = useRef<THREE.Group>(null!);
  const ringMat = useRef<THREE.MeshBasicMaterial>(null!);
  const spin = useRef(Math.PI * 0.3);
  const [hovered, setHovered] = useState(false);
  const [show, setShow] = useState(false);
  useCursor(hovered);

  const pos = ANCHORS.relay[index];
  const quat = useMemo(() => facing(pos, BADGE_T[index]), [pos, index]);
  const hot = index % 2 === 0;
  const color = hot ? C.emerald : C.electric;
  const [from, to] = WINDOWS[index];
  const side = index % 2 === 0 ? 1 : -1;

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const inRange = scroll.visible(from, to - from);
    if (inRange !== show) setShow(inRange);

    group.current.position.y = pos.y + Math.sin(t * 0.9 + index * 2) * 0.05;
    // idle: lazy spin — engaged: settle onto the nearest full turn, face on
    if (hovered || inRange) {
      const target = Math.round(spin.current / (Math.PI * 2)) * Math.PI * 2;
      spin.current = THREE.MathUtils.damp(spin.current, target, 5, dt);
    } else {
      spin.current += dt * 0.6;
    }
    plate.current.rotation.y = spin.current;
    const s = hovered ? 1.18 : 1;
    easing.damp3(plate.current.scale, [s, s, s], 0.2, dt);
    if (ringMat.current) {
      easing.damp(ringMat.current, "opacity", inRange || hovered ? 0.95 : 0.4, 0.25, dt);
    }
  });

  return (
    <group ref={group} position={pos} quaternion={quat}>
      <group
        ref={plate}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          journey.audio?.blip("hover");
        }}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          journey.audio?.blip("click");
        }}
      >
        {/* hex access badge */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 0.06, 6]} />
          <meshStandardMaterial color={C.metal} metalness={0.7} roughness={0.4} emissive={color} emissiveIntensity={0.32} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} raycast={() => null}>
          <torusGeometry args={[0.5, 0.014, 6, 6]} />
          <meshBasicMaterial ref={ringMat} color={color} transparent opacity={0.4} blending={THREE.AdditiveBlending} toneMapped={false} />
        </mesh>
        <TextPlane text={SHORT[index]} height={0.11} color={hot ? C.emeraldGlow : C.electricGlow} position={[0, 0.08, 0.045]} />
        <TextPlane text={xp.kind.toUpperCase()} height={0.06} color="#9fb1c1" position={[0, -0.12, 0.045]} />
        <TextPlane text="ACCESS GRANTED" height={0.05} color={color} position={[0, -0.62, 0]} />
      </group>
      <GlowSprite color={color} scale={1.6} opacity={0.22} />
      <pointLight color={color} intensity={2} distance={4} decay={2} position={[0, 0, 0.8]} />

      <Panel
        position={[side * -0.95, 0.2, 0]}
        visible={show || hovered}
        width={320}
        align={side === 1 ? "right" : "left"}
      >
        <PanelHeader
          eyebrow={`${xp.kind} · ${xp.period}`}
          title={xp.company}
          tagline={`${xp.role} — ${xp.location}`}
          accent={hot ? "emerald" : "electric"}
        />
        <ul className="space-y-1.5">
          {xp.points.slice(0, 3).map((p) => (
            <li key={p} className="flex items-baseline gap-2 text-2xs leading-relaxed text-ink-secondary">
              <span className={hot ? "text-emerald-accent" : "text-electric-accent"}>▹</span>
              {p}
            </li>
          ))}
        </ul>
      </Panel>
    </group>
  );
}
