"use client";

import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useCursor, useScroll } from "@react-three/drei";
import { easing } from "maath";
import { C } from "./palette";
import { GATE_POS, SECTIONS, UP, camAt } from "./journey";
import { allCases, profile } from "./content";
import { EV, emit, journey } from "./state";
import { GlowSprite, TextPlane } from "./bits";
import { Panel } from "./ui/Panel";

const SEC = SECTIONS.find((s) => s.id === "contact")!;

/**
 * The uplink gate — where the data stream terminates. Three counter-rotating
 * rings around a light iris; the contact panel, the full case-file index and
 * the 2D-mode escape hatch decrypt in front of it.
 */
export function ContactGate() {
  const scroll = useScroll();
  const root = useRef<THREE.Group>(null!);
  const rings = useRef<THREE.Mesh[]>([]);
  const iris = useRef<THREE.Sprite>(null!);
  const [hovered, setHovered] = useState(false);
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);
  useCursor(hovered);

  const quat = useMemo(() => {
    const m = new THREE.Matrix4().lookAt(camAt(0.97), GATE_POS, UP);
    return new THREE.Quaternion().setFromRotationMatrix(m);
  }, []);

  useFrame((state, dt) => {
    const visible = scroll.visible(SEC.from - 0.07, 1);
    root.current.visible = visible;
    const inRange = scroll.visible(SEC.from + 0.025, 1);
    if (inRange !== show) setShow(inRange);
    if (!visible) return;

    const t = state.clock.elapsedTime;
    const speed = hovered ? 2.2 : 1;
    rings.current.forEach((r, i) => {
      if (!r) return;
      r.rotation.z = t * 0.4 * speed * (i % 2 ? -1 : 1) + i;
    });
    const pulse = 0.5 + 0.18 * Math.sin(t * 1.8) + (hovered ? 0.25 : 0);
    easing.damp(iris.current.material, "opacity", pulse, 0.2, dt);
  });

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      journey.audio?.blip("click");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable — mailto still works */
    }
  };

  return (
    <group ref={root} position={GATE_POS} quaternion={quat}>
      <group
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          journey.audio?.blip("hover");
        }}
        onPointerOut={() => setHovered(false)}
      >
        {[
          { r: 1.7, tube: 0.02, color: C.emerald, seg: 6 },
          { r: 1.35, tube: 0.014, color: C.cyan, seg: 64 },
          { r: 1.0, tube: 0.01, color: C.electricGlow, seg: 64 },
        ].map((cfg, i) => (
          <mesh key={i} ref={(m) => void (rings.current[i] = m!)}>
            <torusGeometry args={[cfg.r, cfg.tube, 8, cfg.seg]} />
            <meshBasicMaterial color={cfg.color} transparent opacity={0.85} blending={THREE.AdditiveBlending} toneMapped={false} />
          </mesh>
        ))}
        <GlowSprite ref={iris} color={C.emeraldGlow} scale={2.4} opacity={0.5} position={[0, 0, 0.08]} />
        <mesh position={[0, 0, -0.03]} raycast={() => null}>
          <circleGeometry args={[0.55, 48]} />
          <meshBasicMaterial color="#031015" toneMapped={false} />
        </mesh>
      </group>

      <TextPlane text="UPLINK READY" height={0.14} color={C.emeraldGlow} position={[0, 1.98, 0]} />
      <pointLight color={C.emerald} intensity={6} distance={9} decay={2} position={[0, 0, 1.5]} />

      {/* contact + index panel */}
      <Panel position={[0, 1.45, 0]} visible={show} width={430} align="center" z={[38, 0]}>
        <div className="text-center">
          <p className="eyebrow mb-2 justify-center">
            <span className="inline-block h-1.5 w-1.5 animate-pulse-dot rounded-full bg-emerald-accent" />
            {SEC.label}
          </p>
          <h3 className="font-display text-xl font-bold text-ink">Establish uplink</h3>
          <p className="mx-auto mt-1.5 max-w-[34ch] text-xs leading-relaxed text-ink-secondary">
            {profile.availability} — {profile.location}.
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <a href={`mailto:${profile.email}`} className="btn-primary !px-4 !py-2 !text-xs">
              {profile.email}
            </a>
            <button onClick={copyEmail} className="btn-ghost !px-3 !py-2 !text-xs" aria-label="Copy email address">
              {copied ? "COPIED ✓" : "COPY"}
            </button>
          </div>
          <div className="mt-2 flex items-center justify-center gap-2">
            <a href={profile.github} target="_blank" rel="noreferrer" className="btn-ghost !px-4 !py-1.5 !text-xs">
              GitHub
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="btn-ghost !px-4 !py-1.5 !text-xs">
              LinkedIn
            </a>
          </div>

          <div className="mt-5 border-t border-edge pt-4 text-left">
            <p className="eyebrow mb-2">ALL CASE FILES</p>
            <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
              {allCases.map((c) => (
                <li key={c.slug}>
                  <a
                    href={`/work/${c.slug}`}
                    className="group flex items-baseline gap-1.5 rounded px-1 py-0.5 text-2xs text-ink-secondary transition-colors hover:text-emerald-glow"
                  >
                    <span className="text-emerald-accent transition-transform group-hover:translate-x-0.5">▸</span>
                    {c.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-edge pt-3">
            <button
              onClick={() => emit(EV.flat)}
              className="font-mono text-2xs uppercase tracking-wider2 text-ink-muted transition-colors hover:text-ink"
            >
              ▢ 2D version
            </button>
            <p className="font-mono text-2xs text-ink-muted">© {new Date().getFullYear()} {profile.name} · walsec.com</p>
          </div>
        </div>
      </Panel>
    </group>
  );
}
