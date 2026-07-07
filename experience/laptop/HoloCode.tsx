"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";
import { easing } from "maath";
import { holoCode } from "../content";
import { textTexture } from "../text";
import { journey } from "../state";
import { smoothstep } from "../journey";

type Line = {
  tex: THREE.Texture;
  aspect: number;
  seed: number;
  speed: number;
  from: THREE.Vector3;
  to: THREE.Vector3;
};

/**
 * Holographic code drifting off the terminal into the Z-axis. Each line
 * loops screen → out along its own lane; the whole cloud parallaxes against
 * mouse movement. Fades out as the dive begins.
 */
export function HoloCode() {
  const scroll = useScroll();
  const group = useRef<THREE.Group>(null!);
  const mats = useRef<THREE.MeshBasicMaterial[]>([]);
  const meshes = useRef<THREE.Mesh[]>([]);

  const lines = useMemo<Line[]>(
    () =>
      holoCode.map((text, i) => {
        const hot = i % 2 === 0;
        const { tex, aspect } = textTexture(text, {
          color: hot ? "#7dd3fc" : "#5eead4",
          size: 42,
          glow: 8,
        });
        const side = i % 2 === 0 ? 1 : -1;
        return {
          tex,
          aspect,
          seed: (i * 0.83) % 1,
          speed: 0.045 + (i % 3) * 0.012,
          from: new THREE.Vector3(0, 1.38, -0.82),
          to: new THREE.Vector3(
            side * (0.9 + (i % 4) * 0.42),
            0.9 + ((i * 7) % 10) * 0.19,
            0.4 + ((i * 5) % 8) * 0.33
          ),
        };
      }),
    []
  );

  useFrame((state, dt) => {
    const heroFade = 1 - smoothstep(scroll.offset, 0.055, 0.125);
    const on = heroFade > 0.02 && journey.intro > 0.62;
    group.current.visible = on;
    if (!on) return;

    // mouse parallax on the whole hologram cloud
    if (!journey.coarse) {
      easing.damp(group.current.rotation, "y", state.pointer.x * 0.17, 0.3, dt);
      easing.damp(group.current.rotation, "x", -state.pointer.y * 0.1, 0.3, dt);
    }

    const t = state.clock.elapsedTime;
    lines.forEach((l, i) => {
      const mesh = meshes.current[i];
      const mat = mats.current[i];
      if (!mesh || !mat) return;
      const u = (t * l.speed + l.seed) % 1;
      const e = 1 - (1 - u) * (1 - u);
      mesh.position.lerpVectors(l.from, l.to, e);
      mesh.rotation.y = Math.sin(u * Math.PI) * 0.12 * (i % 2 ? 1 : -1);
      mat.opacity = Math.sin(u * Math.PI) * 0.85 * heroFade;
    });
  });

  return (
    <group ref={group}>
      {lines.map((l, i) => (
        <mesh key={i} ref={(m) => void (meshes.current[i] = m!)} raycast={() => null}>
          <planeGeometry args={[0.085 * l.aspect, 0.085]} />
          <meshBasicMaterial
            ref={(m) => void (mats.current[i] = m!)}
            map={l.tex}
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}
