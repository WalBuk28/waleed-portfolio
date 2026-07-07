"use client";

import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useCursor, useScroll } from "@react-three/drei";
import { C } from "../palette";
import { ANCHORS, SECTIONS, facing } from "../journey";
import { ART, attackPath, forensicsEdges, forensicsNodes, killChain } from "../content";
import { journey } from "../state";
import { GlowSprite, TextPlane } from "../bits";
import { CaseLink, Chips, Panel, PanelHeader } from "../ui/Panel";

const SEC = SECTIONS.find((s) => s.id === "forensics")!;

/**
 * Network Forensics & ICS — the CTI Utilities intrusion reconstructed as a
 * constellation. Packet pulses ride the attack path (web → git → ops → HMI);
 * the compromised HMI node burns red. Hovering accelerates the replay and
 * flashes each kill-chain stage in sequence.
 */
export function ForensicsWeb() {
  const scroll = useScroll();
  const root = useRef<THREE.Group>(null!);
  const pulses = useRef<THREE.Mesh[]>([]);
  const nodeMats = useRef<THREE.MeshStandardMaterial[]>([]);
  const stageRing = useRef<THREE.Mesh>(null!);
  const carver = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);
  const [show, setShow] = useState(false);
  useCursor(hovered);

  const quat = useMemo(() => facing(ANCHORS.forensics, SEC.center), []);
  const nodePos = useMemo(() => forensicsNodes.map((n) => new THREE.Vector3(...n.pos)), []);

  const edgeGeo = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (const [a, b] of forensicsEdges) pts.push(nodePos[a], nodePos[b]);
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [nodePos]);

  useFrame((state, dt) => {
    const visible = scroll.visible(SEC.from - 0.06, SEC.to - SEC.from + 0.12);
    root.current.visible = visible;
    const inRange = scroll.visible(SEC.from + 0.015, SEC.to - SEC.from - 0.045);
    if (inRange !== show) setShow(inRange);
    if (!visible) return;

    const t = state.clock.elapsedTime;
    const speed = hovered ? 0.55 : 0.22;

    // packet pulses replaying the lateral movement
    pulses.current.forEach((p, i) => {
      if (!p) return;
      const u = (t * speed + i * 0.27) % 1;
      const leg = Math.min(Math.floor(u * (attackPath.length - 1)), attackPath.length - 2);
      const f = u * (attackPath.length - 1) - leg;
      p.position.lerpVectors(nodePos[attackPath[leg]], nodePos[attackPath[leg + 1]], f);
      (p.material as THREE.MeshBasicMaterial).opacity = 0.4 + 0.6 * Math.sin(u * Math.PI);
    });

    // stage highlight cycles the chain when engaged
    const stageIdx = Math.floor((t * (hovered ? 1.2 : 0.4)) % attackPath.length);
    nodeMats.current.forEach((m, i) => {
      if (!m) return;
      const isStage = attackPath[stageIdx] === i;
      const hot = forensicsNodes[i].hot;
      m.emissiveIntensity = THREE.MathUtils.damp(
        m.emissiveIntensity,
        (hot ? 1.6 + 0.7 * Math.sin(t * 5) : 0.7) + (isStage ? 1.4 : 0),
        6,
        dt
      );
    });
    stageRing.current.position.copy(nodePos[attackPath[stageIdx]]);
    const ringPulse = (t * 1.4) % 1;
    stageRing.current.scale.setScalar(0.2 + ringPulse * 0.35);
    (stageRing.current.material as THREE.MeshBasicMaterial).opacity = (1 - ringPulse) * 0.8;

    // CARVER assessment ring
    carver.current.rotation.z = t * 0.25;
  });

  return (
    <group ref={root} position={ANCHORS.forensics} quaternion={quat}>
      <group
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
        {/* nodes */}
        {forensicsNodes.map((n, i) => (
          <group key={n.id} position={n.pos as unknown as [number, number, number]}>
            <mesh>
              <octahedronGeometry args={[0.13, 0]} />
              <meshStandardMaterial
                ref={(m) => void (nodeMats.current[i] = m!)}
                color={C.metal}
                emissive={n.hot ? C.crit : C.electric}
                emissiveIntensity={0.7}
                wireframe={!n.hot}
              />
            </mesh>
            <TextPlane
              text={n.label}
              height={0.075}
              color={n.hot ? "#fda4af" : C.electricGlow}
              position={[0, -0.24, 0]}
            />
          </group>
        ))}

        {/* edges */}
        <lineSegments geometry={edgeGeo} raycast={() => null}>
          <lineBasicMaterial color={C.electricDeep} transparent opacity={0.85} toneMapped={false} />
        </lineSegments>

        {/* packet pulses */}
        {[0, 1, 2].map((i) => (
          <mesh key={i} ref={(m) => void (pulses.current[i] = m!)} raycast={() => null}>
            <sphereGeometry args={[0.035, 8, 8]} />
            <meshBasicMaterial color={C.electricGlow} transparent blending={THREE.AdditiveBlending} toneMapped={false} />
          </mesh>
        ))}

        {/* stage flash ring */}
        <mesh ref={stageRing} raycast={() => null}>
          <ringGeometry args={[0.9, 1, 32]} />
          <meshBasicMaterial color={C.electric} transparent opacity={0} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} toneMapped={false} />
        </mesh>
      </group>

      {/* CARVER perimeter */}
      <mesh ref={carver} raycast={() => null}>
        <torusGeometry args={[1.9, 0.006, 6, 80]} />
        <meshBasicMaterial color={C.electric} transparent opacity={0.35} blending={THREE.AdditiveBlending} toneMapped={false} />
      </mesh>
      <GlowSprite color={C.electric} scale={3} opacity={0.13} />
      <pointLight color={C.electric} intensity={4} distance={7} decay={2} position={[0, 0.5, 1.2]} />
      <TextPlane text="IT → PIVOT → OT → ICS" height={0.085} color={C.electricGlow} position={[0, -1.35, 0.1]} />

      <Panel position={[0, -1.65, 0]} visible={show} width={360} align="center">
        <PanelHeader
          eyebrow={`${ART.forensics.category} · ${ART.forensics.year}`}
          title={ART.forensics.title}
          tagline={ART.forensics.tagline}
          accent="electric"
        />
        <ol className="mb-3 space-y-1.5">
          {killChain.map((k) => (
            <li key={k.stage} className="flex items-baseline gap-2 text-2xs leading-snug">
              <span className="font-mono text-electric-accent">{k.stage}</span>
              <span className="text-ink-secondary">
                <span className="font-semibold text-ink">{k.label}</span> — {k.technique}
              </span>
            </li>
          ))}
        </ol>
        <Chips items={ART.forensics.stack} max={4} />
        <CaseLink slug={ART.forensics.slug} accent="electric" />
      </Panel>
    </group>
  );
}
