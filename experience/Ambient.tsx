"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Grid } from "@react-three/drei";
import { C } from "./palette";
import { camAt } from "./journey";
import { dotTexture } from "./text";
import { journey } from "./state";

/**
 * The void: linear fog that swallows what's ahead (each zone *reveals*
 * itself), a cyber-grid floor under the hero desk that falls away, and a
 * data-dust field seeded around the entire flight path for depth parallax.
 */
export function Ambient() {
  const grid = useRef<THREE.Group>(null!);

  const dust = useMemo(() => {
    const count = journey.coarse ? 700 : 1600;
    const pos = new Float32Array(count * 3);
    const v = new THREE.Vector3();
    for (let i = 0; i < count; i++) {
      camAt(Math.random(), v);
      const r = 2.2 + Math.pow(Math.random(), 1.5) * 9;
      const a = Math.random() * Math.PI * 2;
      pos[i * 3 + 0] = v.x + Math.cos(a) * r;
      pos[i * 3 + 1] = v.y + (Math.random() - 0.5) * 7;
      pos[i * 3 + 2] = v.z + Math.sin(a) * r * 0.6;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, -9, -20), 50);
    return g;
  }, []);

  // the grid is the hero's floor — hide it once the dive begins so its
  // section lines never streak across the void from below
  useFrame(() => {
    grid.current.visible = journey.offset < 0.1;
  });

  return (
    <group>
      <fog attach="fog" args={[C.void, 9, 27]} />
      <ambientLight intensity={0.14} />
      <pointLight position={[2.5, 3.2, 3.5]} intensity={14} color={C.electric} distance={14} decay={2} />

      <group ref={grid}>
        <Grid
          position={[0, -0.02, 0]}
          args={[30, 30]}
          cellSize={0.55}
          cellThickness={0.6}
          cellColor="#0d2530"
          sectionSize={2.75}
          sectionThickness={1}
          sectionColor="#0f3d33"
          fadeDistance={14}
          fadeStrength={2.4}
          infiniteGrid
        />
      </group>

      <points geometry={dust} frustumCulled={false} raycast={() => null}>
        <pointsMaterial
          map={dotTexture()}
          color="#2b5a6b"
          size={0.05}
          sizeAttenuation
          transparent
          opacity={0.75}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
