"use client";

import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useCursor, useScroll } from "@react-three/drei";
import { easing } from "maath";
import { C } from "../palette";
import { ANCHORS, SECTIONS, facing } from "../journey";
import { ART, lockIocs } from "../content";
import { journey } from "../state";
import { GlowSprite, NeonBox, TextPlane } from "../bits";
import { CaseLink, Chips, MetricGrid, Panel, PanelHeader } from "../ui/Panel";

const SEC = SECTIONS.find((s) => s.id === "pentest")!;

type Shard = {
  size: [number, number, number];
  home: THREE.Vector3;
  out: THREE.Vector3;
  rot: THREE.Euler;
  spin: THREE.Euler;
};

/**
 * Penetration Testing & Malware — a weaponised padlock. Hover cracks the
 * body apart shard by shard, exposing a burning payload core orbited by
 * live IOC tags from the malware investigations. Denial buzz on contact.
 */
export function CipherLock() {
  const scroll = useScroll();
  const root = useRef<THREE.Group>(null!);
  const shardRefs = useRef<THREE.Mesh[]>([]);
  const coreMat = useRef<THREE.MeshStandardMaterial>(null!);
  const coreLight = useRef<THREE.PointLight>(null!);
  const shackle = useRef<THREE.Group>(null!);
  const iocGroup = useRef<THREE.Group>(null!);
  const iocMats = useRef<THREE.MeshBasicMaterial[]>([]);
  const [hovered, setHovered] = useState(false);
  const [show, setShow] = useState(false);
  useCursor(hovered);

  const quat = useMemo(() => facing(ANCHORS.pentest, SEC.center), []);

  // fracture the 1.1×1.2×0.5 body into 8 shards with precomputed exit paths
  const shards = useMemo<Shard[]>(() => {
    const rng = mulberry(1337);
    const out: Shard[] = [];
    for (let ix = 0; ix < 2; ix++)
      for (let iy = 0; iy < 2; iy++)
        for (let iz = 0; iz < 2; iz++) {
          const home = new THREE.Vector3((ix - 0.5) * 0.55, (iy - 0.5) * 0.6, (iz - 0.5) * 0.25);
          const dir = home.clone().normalize().add(new THREE.Vector3(rng() - 0.5, rng() - 0.5, rng() - 0.5).multiplyScalar(0.7)).normalize();
          out.push({
            size: [0.52, 0.57, 0.23],
            home,
            out: home.clone().add(dir.multiplyScalar(0.55 + rng() * 0.5)),
            rot: new THREE.Euler(0, 0, 0),
            spin: new THREE.Euler((rng() - 0.5) * 1.6, (rng() - 0.5) * 1.6, (rng() - 0.5) * 1.2),
          });
        }
    return out;
  }, []);

  useFrame((state, dt) => {
    const visible = scroll.visible(SEC.from - 0.06, SEC.to - SEC.from + 0.12);
    root.current.visible = visible;
    const inRange = scroll.visible(SEC.from + 0.015, SEC.to - SEC.from - 0.045);
    if (inRange !== show) setShow(inRange);
    if (!visible) return;

    const t = state.clock.elapsedTime;
    const k = hovered ? 1 : 0;

    shards.forEach((s, i) => {
      const mesh = shardRefs.current[i];
      if (!mesh) return;
      easing.damp3(mesh.position, k ? s.out : s.home, 0.24 + i * 0.018, dt);
      easing.dampE(
        mesh.rotation,
        k ? [s.spin.x, s.spin.y, s.spin.z] : [0, 0, 0],
        0.3,
        dt
      );
    });

    // payload core ignites as the lock cracks
    easing.damp(coreMat.current, "emissiveIntensity", hovered ? 3.2 : 0.35, 0.25, dt);
    easing.damp(coreLight.current, "intensity", hovered ? 10 : 3.6, 0.25, dt);
    easing.damp(shackle.current.position, "y", hovered ? 1.06 : 0.82, 0.3, dt);
    shackle.current.rotation.y = THREE.MathUtils.damp(shackle.current.rotation.y, hovered ? 0.5 : 0, 3, dt);

    // orbiting IOC tags
    iocGroup.current.rotation.y = t * 0.5;
    iocMats.current.forEach((m, i) => {
      if (m) easing.damp(m, "opacity", hovered ? 0.9 : 0, 0.3 + i * 0.05, dt);
    });

    root.current.position.y = ANCHORS.pentest.y + Math.sin(t * 0.9 + 2) * 0.05;
  });

  return (
    <group ref={root} position={ANCHORS.pentest} quaternion={quat}>
      <group
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          journey.audio?.blip("deny");
        }}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          journey.audio?.blip("open");
        }}
      >
        {/* fractured body */}
        {shards.map((s, i) => (
          <mesh key={i} ref={(m) => void (shardRefs.current[i] = m!)} position={s.home}>
            <boxGeometry args={s.size} />
            <meshStandardMaterial
              color="#241017"
              metalness={0.8}
              roughness={0.4}
              emissive="#4c1120"
              emissiveIntensity={0.4}
            />
          </mesh>
        ))}
        <NeonBox args={[1.14, 1.26, 0.54]} color={C.critMark} opacity={0.8} />

        {/* keyhole */}
        <mesh position={[0, -0.08, 0.28]}>
          <circleGeometry args={[0.09, 24]} />
          <meshBasicMaterial color={C.crit} toneMapped={false} />
        </mesh>

        {/* shackle */}
        <group ref={shackle} position={[0, 0.82, 0]}>
          <mesh>
            <torusGeometry args={[0.42, 0.075, 12, 40, Math.PI]} />
            <meshStandardMaterial color={C.metalLight} metalness={0.95} roughness={0.25} />
          </mesh>
          {[-0.42, 0.42].map((x) => (
            <mesh key={x} position={[x, -0.14, 0]}>
              <cylinderGeometry args={[0.075, 0.075, 0.3, 12]} />
              <meshStandardMaterial color={C.metalLight} metalness={0.95} roughness={0.25} />
            </mesh>
          ))}
        </group>

        {/* payload core */}
        <mesh>
          <icosahedronGeometry args={[0.2, 1]} />
          <meshStandardMaterial
            ref={coreMat}
            color="#2b0a12"
            emissive={C.crit}
            emissiveIntensity={0.35}
            roughness={0.3}
          />
        </mesh>
      </group>

      {/* orbiting IOCs from the live investigations */}
      <group ref={iocGroup}>
        {lockIocs.map((ioc, i) => {
          const a = (i / lockIocs.length) * Math.PI * 2;
          return (
            <TextPlane
              key={ioc}
              ref={(m) => {
                if (m) iocMats.current[i] = m.material as THREE.MeshBasicMaterial;
              }}
              text={ioc}
              height={0.07}
              color={C.crit}
              position={[Math.cos(a) * 0.95, (i - 2) * 0.16, Math.sin(a) * 0.95]}
              rotation={[0, -a + Math.PI / 2, 0]}
              opacity={0}
            />
          );
        })}
      </group>

      <GlowSprite color={C.critMark} scale={2.6} opacity={0.16} />
      <pointLight ref={coreLight} color={C.crit} intensity={3.6} distance={6} decay={2} position={[0, 0.2, 0.9]} />
      <pointLight color={C.electricDeep} intensity={2} distance={5} decay={2} position={[-1.4, 0.8, 1]} />
      <TextPlane text="96 FINDINGS · 4 SAMPLES" height={0.085} color="#fda4af" position={[0, -1.05, 0.2]} />

      <Panel position={[-1.5, 0.5, 0]} visible={show} width={330} align="right">
        <PanelHeader
          eyebrow={`${ART.pentest.category} · ${ART.pentest.year}`}
          title={ART.pentest.title}
          tagline={ART.pentest.tagline}
          accent="crit"
        />
        <MetricGrid metrics={ART.pentest.metrics} />
        <Chips items={ART.pentest.stack} max={5} />
        <CaseLink slug={ART.pentest.slug} accent="crit" />
      </Panel>
    </group>
  );
}

function mulberry(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let z = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    z = (z + Math.imul(z ^ (z >>> 7), 61 | z)) ^ z;
    return ((z ^ (z >>> 14)) >>> 0) / 4294967296;
  };
}
