"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";
import { easing } from "maath";
import {
  GATE_POS,
  GLANCES,
  LAPTOP_FOCUS,
  bell,
  camAt,
  camCurve,
  smoothstep,
} from "./journey";
import { EV, emit, journey } from "./state";

const INTRO_FROM = new THREE.Vector3(4.6, 3.3, 7.8);
const INTRO_CTRL = new THREE.Vector3(1.6, 1.7, 5.6);
const INTRO_MS = 2600;

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function CameraRig() {
  const scroll = useScroll();
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;

  const pos = useRef(new THREE.Vector3());
  const target = useRef(new THREE.Vector3());
  const ahead = useRef(new THREE.Vector3());
  const introPos = useRef(new THREE.Vector3());
  const q = useRef(new THREE.Quaternion());
  const m = useRef(new THREE.Matrix4());
  const roll = useRef(new THREE.Quaternion());
  const zAxis = useRef(new THREE.Vector3(0, 0, 1));
  const lastEmit = useRef(0);
  const par = useRef({ x: 0, y: 0 });

  // hide the ScrollControls scrollbar once
  const hidden = useRef(false);

  useFrame((state, dt) => {
    if (!hidden.current) {
      scroll.el.classList.add("no-scrollbar");
      hidden.current = true;
    }

    const off = scroll.offset;
    journey.offset = off;
    journey.delta = scroll.delta;

    // ── intro sweep progress ──
    let intro = 1;
    if (journey.started) {
      intro = easeInOut(Math.min((performance.now() - journey.introT0) / INTRO_MS, 1));
    } else {
      intro = 0;
    }
    journey.intro = intro;

    // ── flight pose from the spline ──
    camAt(off, pos.current);
    camAt(Math.min(off + 0.02, 1), ahead.current);
    target.current.copy(ahead.current);

    // hero: hold the gaze on the laptop, release into the dive
    const heroHold = 1 - smoothstep(off, 0.045, 0.14);
    if (heroHold > 0) target.current.lerp(LAPTOP_FOCUS, heroHold);

    // glances: lean the gaze onto each exhibit as we pass it
    for (const g of GLANCES) {
      const w = bell(off, g.center, g.width) * g.strength;
      if (w > 0.01) target.current.lerp(g.target, w);
    }

    // terminus: settle facing the gate
    const settle = smoothstep(off, 0.965, 1);
    if (settle > 0) target.current.lerp(GATE_POS, settle);

    // ── intro blend (quadratic bezier sweep onto the hero pose) ──
    if (intro < 1) {
      const t = intro;
      const a = INTRO_FROM;
      const b = INTRO_CTRL;
      const c = pos.current;
      introPos.current.set(
        (1 - t) * (1 - t) * a.x + 2 * (1 - t) * t * b.x + t * t * c.x,
        (1 - t) * (1 - t) * a.y + 2 * (1 - t) * t * b.y + t * t * c.y,
        (1 - t) * (1 - t) * a.z + 2 * (1 - t) * t * b.z + t * t * c.z
      );
      pos.current.copy(introPos.current);
      target.current.lerp(LAPTOP_FOCUS, 1 - intro);
    }

    // ── pointer parallax (desktop only) ──
    // Frozen while the cursor is over any interactive (useCursor sets
    // body.cursor) — otherwise hover targets flee the pointer as the
    // camera leans toward it, making them unclickable.
    if (!journey.coarse && intro > 0.6) {
      const aiming = document.body.style.cursor === "pointer";
      if (!aiming) {
        easing.damp(par.current, "x", state.pointer.x, 0.3, dt);
        easing.damp(par.current, "y", state.pointer.y, 0.3, dt);
      }
      m.current.lookAt(pos.current, target.current, THREE.Object3D.DEFAULT_UP);
      const right = new THREE.Vector3().setFromMatrixColumn(m.current, 0);
      const up = new THREE.Vector3().setFromMatrixColumn(m.current, 1);
      pos.current.addScaledVector(right, par.current.x * 0.22).addScaledVector(up, par.current.y * 0.1);
      target.current.addScaledVector(right, par.current.x * 0.55).addScaledVector(up, par.current.y * 0.3);
    }

    // ── commit: damped position, damped quaternion with banking roll ──
    easing.damp3(camera.position, pos.current, 0.16, dt);

    m.current.lookAt(camera.position, target.current, THREE.Object3D.DEFAULT_UP);
    q.current.setFromRotationMatrix(m.current);
    const tan = camCurve.getTangentAt(THREE.MathUtils.clamp(off + 0.01, 0, 1));
    const bank = THREE.MathUtils.clamp(-tan.x * 0.55, -0.28, 0.28) * smoothstep(off, 0.06, 0.14);
    roll.current.setFromAxisAngle(zAxis.current, bank);
    q.current.multiply(roll.current);
    easing.dampQ(camera.quaternion, q.current, 0.22, dt);

    // ── velocity-reactive FOV (wider base on portrait screens) ──
    const speed = Math.min(scroll.delta * 60, 1);
    const base = state.size.width < state.size.height ? 70 : 55;
    const fov = base + speed * 13;
    if (Math.abs(camera.fov - fov) > 0.01) {
      camera.fov = THREE.MathUtils.damp(camera.fov, fov, 4, dt);
      camera.updateProjectionMatrix();
    }

    // ── bridges: audio + HUD ──
    journey.audio?.update(off, scroll.delta);

    const now = performance.now();
    if (now - lastEmit.current > 120) {
      lastEmit.current = now;
      emit(EV.progress, { offset: off });
    }
  });

  return null;
}
