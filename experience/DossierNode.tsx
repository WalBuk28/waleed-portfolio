"use client";

import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useCursor, useScroll } from "@react-three/drei";
import { easing } from "maath";
import { C } from "./palette";
import { ANCHORS, SECTIONS, facing } from "./journey";
import { certifications, education, profile } from "./content";
import { journey } from "./state";
import { GlowSprite, TextPlane } from "./bits";
import { Panel, PanelHeader } from "./ui/Panel";

const SEC = SECTIONS.find((s) => s.id === "dossier")!;

/**
 * Operator dossier — an identity core orbited by the four headline stats.
 * The About section, spatialised: summary, education and certifications
 * decrypt alongside it.
 */
export function DossierNode() {
  const scroll = useScroll();
  const root = useRef<THREE.Group>(null!);
  const core = useRef<THREE.Mesh>(null!);
  const orbit = useRef<THREE.Group>(null!);
  const chips = useRef<THREE.Group[]>([]);
  const [hovered, setHovered] = useState(false);
  const [show, setShow] = useState(false);
  useCursor(hovered);

  const quat = useMemo(() => facing(ANCHORS.dossier, SEC.center), []);
  const stats = useMemo(
    () => profile.stats.map((s) => ({ head: `${s.value}${s.suffix}`, label: s.label.toUpperCase() })),
    []
  );

  useFrame((state, dt) => {
    const visible = scroll.visible(SEC.from - 0.06, SEC.to - SEC.from + 0.12);
    root.current.visible = visible;
    const inRange = scroll.visible(SEC.from + 0.01, SEC.to - SEC.from - 0.03);
    if (inRange !== show) setShow(inRange);
    if (!visible) return;

    const t = state.clock.elapsedTime;
    core.current.rotation.y = t * (hovered ? 1.1 : 0.4);
    core.current.rotation.x = Math.sin(t * 0.3) * 0.3;
    orbit.current.rotation.y = t * 0.28;
    const s = hovered ? 1.15 : 1;
    easing.damp3(core.current.scale, [s, s, s], 0.22, dt);

    // stat chips counter-rotate to stay legible
    chips.current.forEach((c) => {
      if (c) c.rotation.y = -orbit.current.rotation.y;
    });
  });

  return (
    <group ref={root} position={ANCHORS.dossier} quaternion={quat}>
      <mesh
        ref={core}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          journey.audio?.blip("hover");
        }}
        onPointerOut={() => setHovered(false)}
      >
        <icosahedronGeometry args={[0.42, 1]} />
        <meshStandardMaterial color={C.metal} emissive={C.emerald} emissiveIntensity={1.7} wireframe />
      </mesh>
      <mesh raycast={() => null}>
        <sphereGeometry args={[0.18, 20, 20]} />
        <meshBasicMaterial color={C.emeraldGlow} toneMapped={false} />
      </mesh>
      <GlowSprite color={C.emerald} scale={2.2} opacity={0.3} />

      {/* orbiting headline stats */}
      <group ref={orbit}>
        {stats.map((s, i) => {
          const a = (i / stats.length) * Math.PI * 2;
          return (
            <group
              key={s.label}
              ref={(g) => void (chips.current[i] = g!)}
              position={[Math.cos(a) * 1.15, Math.sin(a * 2) * 0.28, Math.sin(a) * 1.15]}
            >
              <TextPlane text={s.head} height={0.16} color={i % 2 ? C.electricGlow : C.emeraldGlow} position={[0, 0.07, 0]} />
              <TextPlane text={s.label} height={0.05} color="#9fb1c1" position={[0, -0.08, 0]} />
            </group>
          );
        })}
      </group>

      <pointLight color={C.emerald} intensity={3} distance={5} decay={2} position={[0, 0.4, 1]} />
      <TextPlane text="OPERATOR // WALBUK28" height={0.08} color={C.emeraldGlow} position={[0, -1.05, 0]} />

      <Panel position={[-1.35, 0.3, 0]} visible={show} width={380} align="right">
        <PanelHeader eyebrow={`OPERATOR DOSSIER · ${profile.location.toUpperCase()}`} title={profile.fullName} tagline={profile.role} />
        <p className="mb-3 text-2xs leading-relaxed text-ink-secondary">{profile.tagline}</p>
        <div className="mb-3 rounded-lg border border-edge bg-void/50 px-3 py-2">
          <p className="font-mono text-2xs text-emerald-glow">{education.degree}</p>
          <p className="mt-0.5 text-2xs text-ink-muted">
            {education.school} · {education.period}
          </p>
        </div>
        <ul className="space-y-1">
          {certifications.map((c) => (
            <li key={c.name} className="flex items-baseline gap-2 text-2xs text-ink-secondary">
              <span className="text-electric-accent">◈</span>
              <span>
                <span className="text-ink">{c.name}</span> — {c.issuer} · {c.date}
              </span>
            </li>
          ))}
        </ul>
      </Panel>
    </group>
  );
}
