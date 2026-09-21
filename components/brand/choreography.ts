// =============================================================================
//  Scroll choreography for the homepage backdrop — pure maths, no DOM.
//
//  One scroll progress value p ∈ [0, 1] (the whole homepage) drives every
//  piece of the mark through the same sequence, forwards and backwards:
//
//    0.00–0.03  locked    assembled, still
//    0.03–0.10  unlock    seams open a few units
//    0.10–0.22  separate  exploded view along each piece's lattice normal
//    0.22–0.38  reveal    the Motion Concept: roof chevrons fold into hex
//                         nodes, walls retract, the floor recedes — the
//                         W + nut hidden inside the shield steps forward
//    0.38–0.72  expand    the system spreads out around the content
//    0.72–0.80  regroup   back into the Motion Concept formation
//    0.80–0.88  return    nodes unfold into chevrons, exploded view again
//    0.88–0.955 lock      seams close; assembled for the final stretch
//
//  Keyframes are eased with smootherstep, so every phase starts and settles
//  with zero velocity (mechanical, no bounce). Pieces are staggered slightly:
//  the roof leads the separation and is the last piece home, capping the
//  shield; the floor leaves last and locks first.
// =============================================================================

import { PIECE_IDS, PIECES, WALL, centroid, hexagon, mirror, type PieceId, type Poly, type Pt } from "./wall";

export type Pose = {
  x: number; // translation (units)
  y: number;
  r: number; // rotation (deg, clockwise) about the piece's pivot
  s: number; // scale about the pivot
  o: number; // opacity multiplier
  m: number; // morph 0 → 1 along the piece's shape path
};

export type GlobalPose = {
  s: number; // scale of the whole mark
  act: number; // "system active" 0 → 1 (hairlines brighten)
  bp: number; // blueprint (home-slot outlines) visibility 0 → 1
};

export type Layout = {
  halfW: number; // viewport half-size, in mark units
  halfH: number;
  mx: number; // horizontal expansion room 0 … 1
  my: number; // vertical expansion room 0 … 1.6 (tall screens spread vertically)
  compact: boolean;
};

type Key<T> = { p: number; v: T };
export type Timeline = {
  pieces: Record<PieceId, Key<Pose>[]>;
  global: Key<GlobalPose>[];
};

export const REST: Pose = { x: 0, y: 0, r: 0, s: 1, o: 1, m: 0 };

const K = Math.tan(Math.PI / 6);
const COS30 = Math.cos(Math.PI / 6);
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const smooth = (t: number) => t * t * (3 - 2 * t);
/** Smootherstep: zero velocity and acceleration at both ends of a phase. */
const ease = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

// ── shapes ──────────────────────────────────────────────────────────────────

/**
 * A morph is a path through shapes with the same vertex count and order;
 * `stops` places each shape on m ∈ [0, 1]. Every intermediate is either
 * lattice-true or convex — the pieces never go soft.
 */
type Morph = { shapes: Poly[]; stops: number[] };

// Roof chevron → Motion Concept node, in three mechanical steps:
//   1. the head of the wall folds flush into the roof arm (a straight bar)
//   2. the bar telescopes about its midpoint (a lattice-true parallelogram)
//   3. the short bar snaps into a hex cell
const NODE_R = 78;
const [A, B, , , E, F] = PIECES.TL;
const TV = WALL.T / COS30;
const barFoot: Pt = [B[0], B[1] + TV];
const BAR: Pt[] = [A, B, barFoot, [(barFoot[0] + E[0]) / 2, (barFoot[1] + E[1]) / 2], E, F];
const SHORT_LEN = 150;
const x0 = (B[0] + A[0]) / 2 - SHORT_LEN / 2;
const x1 = x0 + SHORT_LEN;
const barTop = (x: number) => B[1] - (x - B[0]) * K;
const SHORT: Pt[] = [
  [x1, barTop(x1)],
  [x0, barTop(x0)],
  [x0, barTop(x0) + TV],
  [(x0 + x1) / 2, barTop((x0 + x1) / 2) + TV],
  [x1, barTop(x1) + TV],
  [x1, barTop(x1) + TV / 2],
];
const NODE = hexagon([(x0 + x1) / 2, barTop((x0 + x1) / 2) + TV / 2], NODE_R);

// Side wall retracted to the Motion Concept height, its head re-cut at 30°.
const [l0, l1, l2, l3, l4, l5] = PIECES.L;
const WALL_SHORT: Pt[] = [[l0[0], -55 + WALL.T * K], l1, l2, l3, l4, [l5[0], -55]];

const roofMorph: Morph = { shapes: [PIECES.TL, BAR, SHORT, NODE], stops: [0, 0.3, 0.64, 1] };
const wallMorph: Morph = { shapes: [PIECES.L, WALL_SHORT], stops: [0, 1] };
const mirrored = (mo: Morph): Morph => ({ shapes: mo.shapes.map(mirror), stops: mo.stops });

const MORPHS: Partial<Record<PieceId, Morph>> = {
  TL: roofMorph,
  TR: mirrored(roofMorph),
  L: wallMorph,
  R: mirrored(wallMorph),
};

/** Vertices of a piece at morph amount m. */
export function morphPoly(id: PieceId, m: number): Poly {
  const mo = MORPHS[id];
  if (!mo || m <= 0) return PIECES[id];
  const { shapes, stops } = mo;
  let i = 0;
  while (i < stops.length - 2 && m > stops[i + 1]) i++;
  const t = smooth(clamp((m - stops[i]) / (stops[i + 1] - stops[i]), 0, 1));
  const P0 = shapes[i], P1 = shapes[i + 1];
  return P0.map(([x, y], j) => [x + (P1[j][0] - x) * t, y + (P1[j][1] - y) * t] as const);
}

// Rotation/scale pivot: the piece's centroid, drifting to its final shape's.
const PIVOT_A = Object.fromEntries(PIECE_IDS.map((id) => [id, centroid(PIECES[id])])) as Record<PieceId, Pt>;
const PIVOT_B = Object.fromEntries(
  PIECE_IDS.map((id) => {
    const mo = MORPHS[id];
    return [id, mo ? centroid(mo.shapes[mo.shapes.length - 1]) : PIVOT_A[id]];
  })
) as Record<PieceId, Pt>;

export function pivot(id: PieceId, m: number): Pt {
  const a = PIVOT_A[id], b = PIVOT_B[id];
  return [a[0] + (b[0] - a[0]) * m, a[1] + (b[1] - a[1]) * m];
}

export type Box = { x: number; y: number; w: number; h: number };

/** Each piece's box: the union of every shape it takes, padded for the hairline. */
export const BOXES = Object.fromEntries(
  PIECE_IDS.map((id) => {
    const pts = (MORPHS[id]?.shapes ?? [PIECES[id]]).flat();
    const xs = pts.map(([x]) => x), ys = pts.map(([, y]) => y);
    const x = Math.floor(Math.min(...xs)) - 2, y = Math.floor(Math.min(...ys)) - 2;
    return [id, { x, y, w: Math.ceil(Math.max(...xs)) + 2 - x, h: Math.ceil(Math.max(...ys)) + 2 - y }];
  })
) as Record<PieceId, Box>;

// Outward lattice normals: the exploded-view direction of each piece.
const DIR: Record<PieceId, Pt> = {
  TL: [-0.5, -COS30], TR: [0.5, -COS30],
  L: [-1, 0], R: [1, 0],
  NL: [-1, 0], NR: [1, 0],
  ML: [-0.5, COS30], MR: [0.5, COS30],
  BL: [-0.5, COS30], BR: [0.5, COS30],
};

// Stagger (progress units): negative leads the separation and trails the lock.
const DELAY: Record<PieceId, number> = {
  TL: -0.014, TR: -0.014,
  L: -0.005, R: -0.005,
  NL: 0.002, NR: 0.002,
  ML: 0.008, MR: 0.008,
  BL: 0.014, BR: 0.014,
};

// ── layout ──────────────────────────────────────────────────────────────────

/** Viewport → layout. `markPx` is the rendered height of the assembled mark. */
export function layoutFor(vw: number, vh: number, markPx: number): Layout {
  const unit = markPx / (2 * WALL.halfHeight);
  const halfW = vw / 2 / unit;
  const halfH = vh / 2 / unit;
  return {
    halfW,
    halfH,
    mx: clamp((halfW - WALL.halfWidth) / 380, 0.12, 1),
    my: clamp((halfH - WALL.halfHeight) / 260, 0.3, 1.6),
    compact: vw < 640,
  };
}

// ── timeline ────────────────────────────────────────────────────────────────

const P = {
  lockEnd: 0.03, unlock: 0.1, separate: 0.22, reveal: 0.38, expand: 0.54,
  drift: 0.72, regroup: 0.8, back: 0.88, locked: 0.955,
};

type Left = "TL" | "L" | "NL" | "ML" | "BL";
type Script = [p: number, pose: Partial<Pose>][];

const TWIN: Record<Left, PieceId> = { TL: "TR", L: "R", NL: "NR", ML: "MR", BL: "BR" };

const along = (id: PieceId, d: number): Partial<Pose> => ({ x: DIR[id][0] * d, y: DIR[id][1] * d });

/** Mirror a left-side pose onto its right-side twin. */
const flip = (v: Partial<Pose>): Partial<Pose> => ({
  ...v,
  ...(v.x !== undefined && { x: -v.x }),
  ...(v.r !== undefined && { r: -v.r }),
});

function scripts({ mx, my }: Layout): Record<Left, Script> {
  // Motion Concept node: beside the retracted wall's head on wide screens,
  // above it on narrow ones (so the formation needn't shrink to fit).
  const node: Pt = [-(290 + 65 * mx), -94 - 70 * (1 - mx)];
  // Sideways travel only where there is room for it; tall screens push the
  // nodes up instead.
  const hx = clamp((mx - 0.3) / 0.7, 0, 1);
  const up = 80 * my + 120 * Math.max(0, my - 1);
  const toNode = (dx = 0, dy = 0): Partial<Pose> => ({
    x: node[0] + dx - PIVOT_B.TL[0],
    y: node[1] + dy - PIVOT_B.TL[1],
  });
  const receded: Partial<Pose> = { ...along("BL", 120), s: 0.92, o: 0.34 };
  return {
    TL: [
      [P.lockEnd, {}],
      [P.unlock, along("TL", 10)],
      [P.separate, along("TL", 56)],
      [P.reveal, { ...toNode(), m: 1 }],
      [P.expand, { ...toNode(-150 * hx, -up), m: 1, r: -30, s: 1.06 }],
      [P.drift, { ...toNode(-162 * hx, -up * 1.12), m: 1, r: -36, s: 1.07 }],
      // the node keeps turning to a full flat (-60°, identical to 0° for a
      // regular hexagon), then the angle resets invisibly before it unfolds
      [P.regroup, { ...toNode(), m: 1, r: -60 }],
      [P.regroup + 0.0001, { ...toNode(), m: 1 }],
      [P.back, along("TL", 28)],
      [P.locked, {}],
    ],
    L: [
      [P.lockEnd, {}],
      [P.unlock, { x: -6 }],
      [P.separate, { x: -24 }],
      [P.reveal, { x: -24, m: 1 }],
      [P.expand, { x: -24 - 150 * hx, y: 24 * my, m: 1 }],
      [P.drift, { x: -24 - 160 * hx, y: 28 * my, m: 1 }],
      [P.regroup, { x: -24, m: 1 }],
      [P.back, { x: -12 }],
      [P.locked, {}],
    ],
    NL: [
      [P.lockEnd, {}],
      [P.unlock, { x: -3 }],
      [P.separate, { x: -10 }],
      [P.reveal, { x: -10 }],
      [P.expand, { x: -18 - 44 * mx, y: -14 * my, r: -8, s: 1.04 }],
      [P.drift, { x: -20 - 50 * mx, y: -16 * my, r: -9.5, s: 1.05 }],
      [P.regroup, { x: -10 }],
      [P.back, { x: -5 }],
      [P.locked, {}],
    ],
    ML: [
      [P.lockEnd, {}],
      [P.unlock, along("ML", 5)],
      [P.separate, along("ML", 18)],
      [P.reveal, along("ML", 18)],
      [P.expand, { x: -9 - 96 * mx, y: 16 + 104 * my, s: 0.97 }],
      [P.drift, { x: -10 - 104 * mx, y: 17 + 114 * my, s: 0.97 }],
      [P.regroup, along("ML", 18)],
      [P.back, along("ML", 9)],
      [P.locked, {}],
    ],
    BL: [
      [P.lockEnd, {}],
      [P.unlock, along("BL", 8)],
      [P.separate, along("BL", 44)],
      [P.reveal, receded],
      [P.expand, { x: -60 - 80 * mx, y: 104 + 150 * my, r: -8, s: 0.86, o: 0.28 }],
      [P.drift, { x: -64 - 88 * mx, y: 110 + 162 * my, r: -9, s: 0.85, o: 0.28 }],
      [P.regroup, receded],
      [P.back, along("BL", 22)],
      [P.locked, {}],
    ],
  };
}

function toTrack(id: PieceId, script: Script): Key<Pose>[] {
  const d = DELAY[id];
  const keys: Key<Pose>[] = [{ p: 0, v: REST }];
  for (const [p, pose] of script) {
    // the stagger mirrors across the midpoint: first out is last home
    keys.push({ p: p + (p <= 0.6 ? d : -d), v: { ...REST, ...pose } });
  }
  keys.push({ p: 1, v: REST });
  return keys;
}

/** Widest |x| of the formation at progress p (vertex-exact). */
function extentX(pieces: Record<PieceId, Key<Pose>[]>, p: number) {
  let ex = 0;
  for (const id of PIECE_IDS) {
    const q = sample(pieces[id], p);
    const [px, py] = pivot(id, q.m);
    const cos = Math.cos((q.r * Math.PI) / 180), sin = Math.sin((q.r * Math.PI) / 180);
    for (const [x, y] of morphPoly(id, q.m)) {
      const rx = (x - px) * cos - (y - py) * sin;
      ex = Math.max(ex, Math.abs(px + q.x + rx * q.s));
    }
  }
  return ex;
}

export function buildTimeline(L: Layout): Timeline {
  const s = scripts(L);
  const pieces = {} as Record<PieceId, Key<Pose>[]>;
  for (const left of Object.keys(s) as Left[]) {
    pieces[left] = toTrack(left, s[left]);
    pieces[TWIN[left]] = toTrack(TWIN[left], s[left].map(([p, v]) => [p, flip(v)]));
  }

  // Scale of the whole mark, capped so the formation always fits the width.
  const fit = (p: number, want: number) => Math.min(want, (0.95 * L.halfW) / extentX(pieces, p));
  const grow = L.compact ? 1.06 : 1.2;

  const global: Key<GlobalPose>[] = [
    { p: 0, v: { s: 1, act: 0, bp: 0 } },
    { p: P.lockEnd, v: { s: 1, act: 0, bp: 0 } },
    { p: P.unlock, v: { s: fit(P.unlock, 1.01), act: 0.55, bp: 0.3 } },
    { p: P.separate, v: { s: fit(P.separate, 1.03), act: 1, bp: 1 } },
    { p: P.reveal, v: { s: fit(P.reveal, 1.06), act: 1, bp: 1 } },
    { p: P.expand, v: { s: fit(P.expand, grow), act: 1, bp: 1 } },
    { p: P.drift, v: { s: fit(P.drift, grow + 0.03), act: 1, bp: 1 } },
    { p: P.regroup, v: { s: fit(P.regroup, 1.06), act: 1, bp: 1 } },
    { p: P.back, v: { s: fit(P.back, 1.02), act: 0.7, bp: 0.6 } },
    { p: P.locked, v: { s: 1, act: 0, bp: 0 } },
    { p: 1, v: { s: 1, act: 0, bp: 0 } },
  ];
  return { pieces, global };
}

// ── sampling ────────────────────────────────────────────────────────────────

function segment<T>(keys: Key<T>[], p: number): [T, T, number] {
  const q = clamp(p, 0, 1);
  let i = 0;
  while (i < keys.length - 2 && q > keys[i + 1].p) i++;
  const a = keys[i], b = keys[i + 1];
  return [a.v, b.v, ease(b.p > a.p ? clamp((q - a.p) / (b.p - a.p), 0, 1) : 1)];
}

export function sample(keys: Key<Pose>[], p: number): Pose {
  const [a, b, e] = segment(keys, p);
  return {
    x: a.x + (b.x - a.x) * e,
    y: a.y + (b.y - a.y) * e,
    r: a.r + (b.r - a.r) * e,
    s: a.s + (b.s - a.s) * e,
    o: a.o + (b.o - a.o) * e,
    m: a.m + (b.m - a.m) * e,
  };
}

export function sampleGlobal(keys: Key<GlobalPose>[], p: number): GlobalPose {
  const [a, b, e] = segment(keys, p);
  return {
    s: a.s + (b.s - a.s) * e,
    act: a.act + (b.act - a.act) * e,
    bp: a.bp + (b.bp - a.bp) * e,
  };
}

// ── serialisation ───────────────────────────────────────────────────────────

const f = (v: number) => Math.round(v * 100) / 100;

export function pointsAttr(id: PieceId, m: number): string {
  return morphPoly(id, m)
    .map(([x, y]) => `${f(x)},${f(y)}`)
    .join(" ");
}

/** True for pieces whose outline changes shape (their `points` need rewriting). */
export const morphs = (id: PieceId) => id in MORPHS;
