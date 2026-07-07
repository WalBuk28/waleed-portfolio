"use client";

import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useCursor, useScroll } from "@react-three/drei";
import { easing } from "maath";
import { motion } from "framer-motion";
import { C } from "./palette";
import { ANCHORS, SECTIONS, facing } from "./journey";
import { vortexNodes } from "./content";
import { journey } from "./state";
import { GlowSprite, TextPlane } from "./bits";
import { Panel } from "./ui/Panel";
import { dotTexture } from "./text";

const SEC = SECTIONS.find((s) => s.id === "vortex")!;
const RING_R = 1.5;

/**
 * The arsenal — a stargate of six domain nodes ringing the flight path; the
 * camera flies straight through the middle. Click a node to decrypt its
 * proficiency dossier. All additive energy fades with camera proximity so
 * the fly-through never washes out.
 */
export function SkillsVortex() {
  const scroll = useScroll();
  const camera = useThree((s) => s.camera);
  const root = useRef<THREE.Group>(null!);
  const ring = useRef<THREE.Group>(null!);
  const swirlA = useRef<THREE.Points>(null!);
  const swirlB = useRef<THREE.Points>(null!);
  const core = useRef<THREE.Sprite>(null!);
  const [selected, setSelected] = useState<number | null>(null);
  const [show, setShow] = useState(false);

  // orient the whole system perpendicular to the incoming flight path
  const quat = useMemo(() => facing(ANCHORS.vortex, SEC.center), []);

  // two thin accretion discs — the camera crosses their plane in an instant
  // instead of swimming through a particle cloud
  const swirl = useMemo(() => {
    const count = journey.coarse ? 300 : 700;
    const make = (rMin: number, rMax: number, zSpread: number) => {
      const pos = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2;
        const r = rMin + Math.pow(Math.random(), 0.7) * (rMax - rMin);
        pos[i * 3] = Math.cos(a) * r;
        pos[i * 3 + 1] = Math.sin(a) * r;
        pos[i * 3 + 2] = (Math.random() - 0.5) * zSpread * (r / rMax);
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      return g;
    };
    return { a: make(0.9, 3.2, 0.8), b: make(0.55, 2.4, 0.5) };
  }, []);

  useFrame((state, dt) => {
    const visible = scroll.visible(SEC.from - 0.035, SEC.to - SEC.from + 0.1);
    root.current.visible = visible;
    const inRange = scroll.visible(SEC.from + 0.01, SEC.to - SEC.from - 0.02);
    if (inRange !== show) {
      setShow(inRange);
      if (!inRange) setSelected(null);
    }
    if (!visible) return;

    const t = state.clock.elapsedTime;
    ring.current.rotation.z = t * 0.07;
    swirlA.current.rotation.z = t * 0.14;
    swirlB.current.rotation.z = -t * 0.1;

    // proximity fade — the fly-through must never white out
    const d = camera.position.distanceTo(root.current.position);
    const fade = THREE.MathUtils.clamp((d - 1.1) / 2.6, 0, 1);
    (core.current.material as THREE.SpriteMaterial).opacity = 0.2 * fade;
    (swirlA.current.material as THREE.PointsMaterial).opacity = 0.75 * (0.25 + 0.75 * fade);
    (swirlB.current.material as THREE.PointsMaterial).opacity = 0.65 * (0.25 + 0.75 * fade);
  });

  return (
    <group ref={root} position={ANCHORS.vortex} quaternion={quat}>
      {/* gravity well */}
      <GlowSprite ref={core} color={C.electricDeep} scale={3.2} opacity={0.2} />
      <mesh raycast={() => null}>
        <icosahedronGeometry args={[0.3, 1]} />
        <meshStandardMaterial color={C.metal} emissive={C.electric} emissiveIntensity={1.6} wireframe />
      </mesh>

      {/* particle accretion disc, perpendicular to the flight path */}
      <points ref={swirlA} geometry={swirl.a} raycast={() => null}>
        <pointsMaterial map={dotTexture()} color={C.electricDeep} size={0.03} transparent opacity={0.75} blending={THREE.AdditiveBlending} depthWrite={false} sizeAttenuation />
      </points>
      <points ref={swirlB} geometry={swirl.b} rotation={[0.22, 0.12, 0]} raycast={() => null}>
        <pointsMaterial map={dotTexture()} color={C.emeraldDeep} size={0.026} transparent opacity={0.65} blending={THREE.AdditiveBlending} depthWrite={false} sizeAttenuation />
      </points>

      {/* domain nodes — the stargate */}
      <group ref={ring}>
        {vortexNodes.map((n, i) => (
          <VortexNode
            key={n.title}
            index={i}
            title={n.title}
            hot={n.hot}
            active={selected === i}
            ringRef={ring}
            onPick={() => {
              setSelected((cur) => (cur === i ? null : i));
              journey.audio?.blip("click");
            }}
          />
        ))}
      </group>

      {/* proficiency dossier — screen-centered between the nodes on desktop,
          bottom sheet on touch */}
      <Panel center position={[0, -0.62, 2.05]} visible={show && selected !== null} width={330} align="center" z={[35, 0]}>
        {selected !== null && (
          <div>
            <div className="mb-2 flex items-start justify-between gap-3">
              <div>
                <p className="eyebrow mb-1">DOMAIN // {String(selected + 1).padStart(2, "0")}</p>
                <h3 className="font-display text-base font-bold text-ink">{vortexNodes[selected].title}</h3>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="rounded-md border border-edge px-2 py-0.5 font-mono text-2xs text-ink-muted transition-colors hover:border-emerald-accent/60 hover:text-ink"
                aria-label="Close skill details"
              >
                ✕
              </button>
            </div>
            <div className="mb-3">
              <div className="mb-1 flex justify-between font-mono text-2xs text-ink-muted">
                <span>PROFICIENCY</span>
                <span className="text-emerald-glow">{vortexNodes[selected].value}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-void">
                <motion.div
                  key={selected}
                  initial={{ width: 0 }}
                  animate={{ width: `${vortexNodes[selected].value}%` }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className={`h-full rounded-full ${vortexNodes[selected].hot ? "bg-emerald-accent" : "bg-electric-accent"}`}
                />
              </div>
            </div>
            <ul className="grid grid-cols-1 gap-1">
              {vortexNodes[selected].skills.map((s) => (
                <li key={s} className="flex items-baseline gap-2 text-2xs text-ink-secondary">
                  <span className={vortexNodes[selected].hot ? "text-emerald-accent" : "text-electric-accent"}>▹</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Panel>

      <Panel center position={[0, -0.68, 2.3]} visible={show && selected === null} width={300} align="center" z={[20, 0]}>
        <p className="text-center font-mono text-2xs uppercase tracking-wider2 text-ink-muted">
          ◈ Select a node to decrypt proficiency data
        </p>
      </Panel>
    </group>
  );
}

function VortexNode({
  index,
  title,
  hot,
  active,
  ringRef,
  onPick,
}: {
  index: number;
  title: string;
  hot: boolean;
  active: boolean;
  ringRef: React.RefObject<THREE.Group | null>;
  onPick: () => void;
}) {
  const group = useRef<THREE.Group>(null!);
  const mat = useRef<THREE.MeshStandardMaterial>(null!);
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);
  const color = hot ? C.emerald : C.electric;

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const a = (index / vortexNodes.length) * Math.PI * 2;
    group.current.position.set(
      Math.cos(a) * RING_R,
      Math.sin(a) * RING_R,
      Math.sin(t * 0.7 + index * 1.3) * 0.3
    );
    // counter-roll so labels stay upright while the gate turns
    if (ringRef.current) group.current.rotation.z = -ringRef.current.rotation.z;
    const s = hovered || active ? 1.45 : 1;
    easing.damp3(group.current.scale, [s, s, s], 0.2, dt);
    if (mat.current) {
      easing.damp(mat.current, "emissiveIntensity", hovered || active ? 3 : 1.3, 0.2, dt);
    }
  });

  return (
    <group ref={group}>
      <mesh
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          journey.audio?.blip("hover");
        }}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          onPick();
        }}
      >
        <sphereGeometry args={[0.17, 20, 20]} />
        <meshStandardMaterial ref={mat} color={C.metal} emissive={color} emissiveIntensity={1.3} roughness={0.3} />
      </mesh>
      <GlowSprite color={color} scale={0.85} opacity={0.5} />
      <TextPlane text={title.toUpperCase()} height={0.1} color={hot ? C.emeraldGlow : C.electricGlow} position={[0, -0.42, 0]} />
      {active && (
        <mesh raycast={() => null}>
          <torusGeometry args={[0.28, 0.012, 8, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.9} blending={THREE.AdditiveBlending} toneMapped={false} />
        </mesh>
      )}
    </group>
  );
}
