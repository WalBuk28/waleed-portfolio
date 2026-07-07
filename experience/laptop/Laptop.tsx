"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Instance, Instances, RoundedBox, useScroll } from "@react-three/drei";
import { easing } from "maath";
import { C } from "../palette";
import { journey } from "../state";
import { NeonBox, GlowSprite } from "../bits";
import { radialTexture } from "../text";
import { useTerminalTexture } from "./useTerminalTexture";

const LID_CLOSED = 1.45;
const LID_OPEN = -0.34;

/**
 * The hacker's terminal — fully procedural (no GLTF download, nothing to
 * load): brushed-metal base, 71 instanced keycaps with a sweeping cyan
 * backlight, hinged lid that swings open during the intro sweep, and a
 * live SOC terminal CanvasTexture on the screen.
 */
export function Laptop() {
  const scroll = useScroll();
  const root = useRef<THREE.Group>(null!);
  const lid = useRef<THREE.Group>(null!);
  const screenMat = useRef<THREE.MeshBasicMaterial>(null!);
  const screenLight = useRef<THREE.PointLight>(null!);
  const portGlow = useRef<THREE.Sprite>(null!);
  const sweep = useRef<THREE.Mesh>(null!);
  const { texture, update } = useTerminalTexture();

  const keys = useMemo(() => {
    const out: { pos: [number, number, number]; scale: [number, number, number] }[] = [];
    for (let r = 0; r < 5; r++)
      for (let c = 0; c < 14; c++)
        out.push({ pos: [-1.333 + c * 0.205, 0.175, -0.85 + r * 0.205], scale: [1, 1, 1] });
    out.push({ pos: [0, 0.175, 0.18], scale: [5.4, 1, 1] }); // spacebar
    return out;
  }, []);

  const sweepTex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 256;
    c.height = 4;
    const ctx = c.getContext("2d")!;
    const g = ctx.createLinearGradient(0, 0, 256, 0);
    g.addColorStop(0, "rgba(34,211,238,0)");
    g.addColorStop(0.5, "rgba(34,211,238,0.9)");
    g.addColorStop(1, "rgba(34,211,238,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 4);
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    return tex;
  }, []);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const intro = journey.intro;

    root.current.visible = scroll.visible(0, 0.26);
    if (!root.current.visible) return;

    root.current.position.y = Math.sin(t * 0.8) * 0.02;

    // lid hinges open during the intro sweep
    const openT = THREE.MathUtils.clamp((intro - 0.22) / 0.62, 0, 1);
    const eased = 1 - Math.pow(1 - openT, 3);
    lid.current.rotation.x = THREE.MathUtils.lerp(LID_CLOSED, LID_OPEN, eased);

    // screen ignites at 55% open, terminal starts typing
    const on = THREE.MathUtils.clamp((openT - 0.55) / 0.3, 0, 1);
    screenMat.current.opacity = on;
    screenLight.current.intensity = on * 9;
    update(dt, on > 0.9);

    // keyboard backlight sweep + port pulse
    sweepTex.offset.x = -t * 0.35;
    (sweep.current.material as THREE.MeshBasicMaterial).opacity = 0.035 + on * 0.05;
    const pulse = 0.35 + 0.25 * Math.sin(t * 3.2);
    easing.damp(portGlow.current.material, "opacity", pulse * on, 0.2, dt);
  });

  return (
    <group ref={root}>
      {/* ── base ── */}
      <RoundedBox args={[3.1, 0.16, 2.15]} radius={0.045} smoothness={4} position={[0, 0.08, 0]}>
        <meshStandardMaterial color={C.metal} metalness={0.85} roughness={0.38} />
      </RoundedBox>
      <NeonBox args={[3.12, 0.17, 2.17]} position={[0, 0.08, 0]} color={C.cyan} opacity={0.55} />

      {/* keyboard */}
      <Instances limit={72} range={72}>
        <boxGeometry args={[0.172, 0.035, 0.172]} />
        <meshStandardMaterial
          color="#0d141b"
          metalness={0.4}
          roughness={0.55}
          emissive={C.cyan}
          emissiveIntensity={0.045}
        />
        {keys.map((k, i) => (
          <Instance key={i} position={k.pos} scale={k.scale} />
        ))}
      </Instances>
      <mesh ref={sweep} position={[0, 0.2, -0.4]} rotation={[-Math.PI / 2, 0, 0]} raycast={() => null}>
        <planeGeometry args={[2.75, 1.02]} />
        <meshBasicMaterial
          map={sweepTex}
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* trackpad */}
      <RoundedBox args={[1.1, 0.012, 0.62]} radius={0.005} position={[0, 0.165, 0.62]}>
        <meshStandardMaterial color="#0a1016" metalness={0.6} roughness={0.35} />
      </RoundedBox>

      {/* hinge */}
      <mesh position={[0, 0.16, -1.02]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 2.9, 12]} />
        <meshStandardMaterial color={C.metalLight} metalness={0.9} roughness={0.3} />
      </mesh>

      {/* ── lid (hinged) ── */}
      <group ref={lid} position={[0, 0.16, -1.02]} rotation={[LID_CLOSED, 0, 0]}>
        <RoundedBox args={[3.1, 2.06, 0.09]} radius={0.04} smoothness={4} position={[0, 1.03, 0]}>
          <meshStandardMaterial color={C.metal} metalness={0.85} roughness={0.4} />
        </RoundedBox>
        <NeonBox args={[3.12, 2.08, 0.1]} position={[0, 1.03, 0]} color={C.cyan} opacity={0.55} />

        {/* the live SOC terminal */}
        <mesh position={[0, 1.05, 0.051]}>
          <planeGeometry args={[2.82, 1.76]} />
          <meshBasicMaterial ref={screenMat} map={texture} transparent opacity={0} toneMapped={false} />
        </mesh>
        <pointLight ref={screenLight} position={[0, 1.0, 1.1]} color="#2dd4bf" intensity={0} distance={5.5} decay={2} />

        {/* rear emblem */}
        <mesh position={[0, 1.15, -0.052]} rotation={[0, Math.PI, 0]}>
          <circleGeometry args={[0.14, 3]} />
          <meshBasicMaterial color={C.emerald} toneMapped={false} />
        </mesh>
      </group>

      {/* ── uplink port: where the data stream plugs in ── */}
      <mesh position={[0, 0.35, -1.05]}>
        <boxGeometry args={[0.22, 0.1, 0.12]} />
        <meshStandardMaterial color={C.metalLight} emissive={C.cyan} emissiveIntensity={1.6} metalness={0.7} roughness={0.3} />
      </mesh>
      <GlowSprite ref={portGlow} color={C.cyan} scale={0.9} opacity={0.4} position={[0, 0.42, -1.06]} />

      {/* underglow */}
      <mesh position={[0, -0.015, -0.15]} rotation={[-Math.PI / 2, 0, 0]} raycast={() => null}>
        <planeGeometry args={[4.6, 3.1]} />
        <meshBasicMaterial
          map={radialTexture(C.emerald)}
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
