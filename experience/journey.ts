// =============================================================================
//  The spatial spine of the whole site.
//
//  One camera spline (`camCurve`) is the single source of truth:
//   - scroll offset (0..1) maps 1:1 onto arc-length along the spline
//   - the fiber-optic data stream is generated *beneath* it
//   - every 3D artifact anchors itself perpendicular to it via anchor()
//  so camera framing is correct by construction — move a point here and the
//  entire journey (stream, artifacts, panels) re-flows with it.
// =============================================================================

import * as THREE from "three";

export const PAGES = 15;
export const UP = new THREE.Vector3(0, 1, 0);

const P = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

// ── Camera flight path ───────────────────────────────────────────────────────
// Hero framing → swing right around the laptop hinge → lock onto the stream
// → weaving descent through the artifact zones → straight run through the
// skills vortex → terminus in front of the uplink gate.
export const camCurve = new THREE.CatmullRomCurve3(
  [
    P(0.0, 0.98, 3.45), // hero — facing the open laptop
    P(2.45, 1.15, 1.55), // swing right
    P(2.55, 0.55, -1.1), // around the hinge
    P(0.7, -0.35, -3.8), // lock onto the stream
    P(-1.6, -1.55, -6.9),
    P(1.75, -3.1, -10.2), // ≈ A-TIOC zone
    P(-1.9, -4.9, -13.6), // ≈ pentest zone
    P(1.4, -6.9, -17.1), // ≈ forensics zone
    P(0.0, -8.9, -20.6), // vortex approach
    P(0.0, -10.9, -24.2), // straight through the vortex core
    P(-1.6, -12.9, -27.8), // relay
    P(1.1, -14.8, -31.4),
    P(-0.6, -16.5, -34.9), // dossier
    P(0.0, -17.9, -38.2),
    P(0.0, -18.4, -41.0), // terminus hold
  ],
  false,
  "centripetal"
);

// ── Scroll → narrative sections ─────────────────────────────────────────────
export type SectionId =
  | "hero"
  | "dive"
  | "atioc"
  | "pentest"
  | "forensics"
  | "vortex"
  | "relay"
  | "dossier"
  | "contact";

export type Section = {
  id: SectionId;
  label: string;
  from: number;
  to: number;
  center: number;
};

export const SECTIONS: Section[] = [
  { id: "hero", label: "01 · OPERATOR", from: 0.0, to: 0.075, center: 0.02 },
  { id: "dive", label: "02 · UPLINK ESTABLISHED", from: 0.075, to: 0.17, center: 0.12 },
  { id: "atioc", label: "03 · WALSEC A-TIOC HUB", from: 0.17, to: 0.3, center: 0.235 },
  { id: "pentest", label: "04 · OFFENSIVE OPS", from: 0.3, to: 0.43, center: 0.365 },
  { id: "forensics", label: "05 · NETWORK FORENSICS", from: 0.43, to: 0.55, center: 0.49 },
  { id: "vortex", label: "06 · ARSENAL", from: 0.55, to: 0.68, center: 0.615 },
  { id: "relay", label: "07 · FIELD OPERATIONS", from: 0.68, to: 0.8, center: 0.74 },
  { id: "dossier", label: "08 · OPERATOR DOSSIER", from: 0.8, to: 0.9, center: 0.85 },
  { id: "contact", label: "09 · OPEN UPLINK", from: 0.9, to: 1.001, center: 0.96 },
];

export function sectionAt(offset: number): Section {
  for (const s of SECTIONS) if (offset >= s.from && offset < s.to) return s;
  return SECTIONS[SECTIONS.length - 1];
}

// ── Spline helpers ───────────────────────────────────────────────────────────
const tmpTan = new THREE.Vector3();
const tmpPerp = new THREE.Vector3();
const tmpM = new THREE.Matrix4();

export function camAt(t: number, out = new THREE.Vector3()) {
  return camCurve.getPointAt(THREE.MathUtils.clamp(t, 0, 1), out);
}

/** World position offset sideways from the flight path (side: -1 left, +1 right of travel). */
export function anchor(t: number, side: 1 | -1, out = 2.1, lift = 0): THREE.Vector3 {
  const p = camAt(t + 0.02);
  camCurve.getTangentAt(THREE.MathUtils.clamp(t + 0.02, 0, 1), tmpTan).normalize();
  tmpPerp.crossVectors(tmpTan, UP).normalize();
  return p.add(tmpPerp.multiplyScalar(out * side)).add(P(0, lift, 0));
}

/** Quaternion that turns an object's +Z toward the camera's position at scroll t. */
export function facing(position: THREE.Vector3, t: number): THREE.Quaternion {
  const eye = camAt(Math.max(t - 0.03, 0));
  tmpM.lookAt(eye, position, UP);
  return new THREE.Quaternion().setFromRotationMatrix(tmpM);
}

// ── The fiber-optic data stream ──────────────────────────────────────────────
// Emerges from the laptop's rear port, then snakes ~0.8–1.2u beneath the
// camera path all the way to the uplink gate.
export const LAPTOP_PORT = P(0, 0.42, -1.06);
export const LAPTOP_FOCUS = P(0, 0.62, -0.2);

export const GATE_POS = (() => {
  const end = camCurve.getPointAt(1);
  const tan = camCurve.getTangentAt(1).normalize();
  return end.clone().add(tan.multiplyScalar(3.4));
})();

export const streamCurve = (() => {
  const pts: THREE.Vector3[] = [LAPTOP_PORT.clone(), P(0, 0.28, -2.3)];
  for (let i = 0; i <= 20; i++) {
    const t = 0.14 + (i / 20) * 0.86;
    const p = camAt(t);
    const sink = 0.75 + 0.45 * Math.min((t - 0.14) / 0.2, 1); // dive below the camera
    p.y -= sink;
    p.x += Math.sin(t * 21.0) * 0.5; // organic weave
    pts.push(p);
  }
  pts.push(GATE_POS.clone());
  return new THREE.CatmullRomCurve3(pts, false, "centripetal");
})();

/** 512-sample lookup table of the stream, baked into a float texture for GPU particles. */
export function streamPathTexture(): THREE.DataTexture {
  const N = 512;
  const data = new Float32Array(N * 4);
  const v = new THREE.Vector3();
  for (let i = 0; i < N; i++) {
    streamCurve.getPointAt(i / (N - 1), v);
    data[i * 4 + 0] = v.x;
    data[i * 4 + 1] = v.y;
    data[i * 4 + 2] = v.z;
    data[i * 4 + 3] = 1;
  }
  const tex = new THREE.DataTexture(data, N, 1, THREE.RGBAFormat, THREE.FloatType);
  tex.minFilter = THREE.NearestFilter;
  tex.magFilter = THREE.NearestFilter;
  tex.needsUpdate = true;
  return tex;
}

// ── Artifact anchors (derived, never hand-placed) ────────────────────────────
const sec = (id: SectionId) => SECTIONS.find((s) => s.id === id)!;

export const ANCHORS = {
  atioc: anchor(sec("atioc").center, -1, 2.3, -0.1),
  pentest: anchor(sec("pentest").center, 1, 2.25, 0.05),
  forensics: anchor(sec("forensics").center, -1, 2.4, 0.1),
  vortex: camAt(sec("vortex").center + 0.045),
  relay: [
    anchor(0.7, 1, 1.15, 0.08),
    anchor(0.735, -1, 1.15, -0.05),
    anchor(0.77, 1, 1.15, 0.08),
    anchor(0.805, -1, 1.15, 0),
  ],
  dossier: anchor(sec("dossier").center, 1, 1.9, 0.15),
  gate: GATE_POS,
};

// Camera "glance" targets — while inside a window around each center the
// look-at target blends toward the exhibit instead of straight down the path.
export type Glance = { center: number; width: number; target: THREE.Vector3; strength: number };

export const GLANCES: Glance[] = [
  { center: sec("atioc").center, width: 0.052, target: ANCHORS.atioc, strength: 0.85 },
  { center: sec("pentest").center, width: 0.052, target: ANCHORS.pentest, strength: 0.85 },
  { center: sec("forensics").center, width: 0.052, target: ANCHORS.forensics, strength: 0.85 },
  // serpentine: lean onto each access badge as the camera threads the relay
  { center: 0.7, width: 0.02, target: ANCHORS.relay[0], strength: 0.55 },
  { center: 0.735, width: 0.02, target: ANCHORS.relay[1], strength: 0.55 },
  { center: 0.77, width: 0.02, target: ANCHORS.relay[2], strength: 0.55 },
  { center: 0.805, width: 0.02, target: ANCHORS.relay[3], strength: 0.55 },
  { center: sec("dossier").center, width: 0.045, target: ANCHORS.dossier, strength: 0.8 },
  { center: 0.985, width: 0.06, target: GATE_POS, strength: 1 },
];

export const bell = (x: number, c: number, w: number) =>
  Math.exp(-((x - c) * (x - c)) / (2 * w * w));

export const smoothstep = (x: number, a: number, b: number) => {
  const t = THREE.MathUtils.clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
