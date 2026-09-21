// =============================================================================
//  WalSec "Interlocking Wall" mark — the vector master.
//
//  Rebuilt from the brand board (Option 1: The Interlocking Wall) as exact
//  lattice geometry: every edge runs vertical or at ±30°, every piece is
//  separated by the same seam. The parameters below were fitted to the board
//  (98.7% pixel overlap), then normalised so the outer shield is 600 wide.
//
//  One source of truth: the static mark (nav, footer, hero lockup, favicon)
//  and the scroll-driven homepage backdrop all read these polygons.
// =============================================================================

export type Pt = readonly [number, number];
export type Poly = readonly Pt[];

export type PieceId =
  | "BL" | "BR" // floor — the base of the rhombic "cube"
  | "ML" | "MR" // plates under the nut
  | "L" | "R" // side walls with angled feet
  | "NL" | "NR" // the split nut
  | "TL" | "TR"; // roof chevrons

/** Paint order, back → front. */
export const PIECE_IDS: readonly PieceId[] = [
  "BL", "BR", "ML", "MR", "L", "R", "NL", "NR", "TL", "TR",
];

export const BRAND_GREEN = "#33997d";

const K = Math.tan(Math.PI / 6); // rise per unit run of a 30° edge
const COS30 = Math.cos(Math.PI / 6);

/** Lattice parameters (units; the shield spans x ∈ [-300, 300]). */
const P = {
  W: 300, // outer half-width
  T: 72, // wall thickness, measured perpendicular to the edge
  G: 10, // seam width, measured perpendicular to the seam
  cornerLow: 590, // y of the outer lower corners
  roofCut: 255, // y (at the outer edge) of the roof / side-wall seam centre
  footSeam: 170, // |x| of the seam between a side-wall foot and the plates
  nutApex: 240.5, // virtual apex of the nut
  nutW: 129.5, // nut half-width
  nutLow: 489.5, // y of the nut's lower corners
  frameTop: 485.5, // y at x=0 of the rhombic frame's outer upper edges
  frameBot: 785.5, // y at x=0 of the rhombic frame's outer lower edges
} as const;

function build() {
  const { W, T, G, cornerLow, roofCut, footSeam, nutApex, nutW, nutLow, frameTop, frameBot } = P;
  const Tv = T / COS30; // vertical thickness of a 30° band
  const Gv = G / COS30; // vertical height of a 30° seam
  const h = G / 2; // half the centre seam

  // Roof chevron: top-left edge + the head of the left wall.
  const roofLow = roofCut - Gv / 2;
  const TL: Pt[] = [
    [-h, h * K],
    [-W, W * K],
    [-W, roofLow],
    [-(W - T), roofLow + T * K],
    [-(W - T), Tv + (W - T) * K],
    [-h, Tv + h * K],
  ];

  // Side wall: from the roof seam down, turning along the lower edge into a foot.
  const wallTop = roofCut + Gv / 2;
  const foot = footSeam + h;
  const L: Pt[] = [
    [-W, wallTop],
    [-W, cornerLow],
    [-foot, cornerLow + (W - foot) * K],
    [-foot, cornerLow - Tv + (W - foot) * K],
    [-(W - T), cornerLow - Tv + T * K],
    [-(W - T), wallTop + T * K],
  ];

  // Nut (left half): a hexagonal ring split on the vertical axis.
  const nutBot = nutLow + nutW * K;
  const holeW = nutW - T;
  const holeTop = nutApex + Tv;
  const holeBot = nutBot - Tv;
  const NL: Pt[] = [
    [-h, nutApex + h * K],
    [-nutW, nutApex + nutW * K],
    [-nutW, nutLow],
    [-h, nutBot - h * K],
    [-h, holeBot - h * K],
    [-holeW, holeBot - holeW * K],
    [-holeW, holeTop + holeW * K],
    [-h, holeTop + h * K],
  ];

  // Rhombic frame under the nut, clipped by the foot seam and cut into
  // plate (ML) + floor (BL) by the inner edge line.
  const innerTop = frameTop + Tv;
  const innerBot = frameBot - Tv;
  const clip = footSeam - h;
  const nutSeam = nutBot + Gv; // plate's right edge: y = nutSeam - K|x|
  const xa = (nutSeam - frameTop) / (2 * K);
  const xb = (nutSeam - innerTop) / (2 * K);
  const ML: Pt[] = [
    [-clip, frameTop + clip * K],
    [-xa, frameTop + xa * K],
    [-xb, innerTop + xb * K],
    [-clip, innerTop + clip * K],
  ];
  const floorLine = innerTop + Gv; // floor's upper-left edge sits one seam below
  const xv = (innerBot - floorLine) / (2 * K);
  const BL: Pt[] = [
    [-clip, floorLine + clip * K],
    [-xv, floorLine + xv * K],
    [-h, innerBot - h * K],
    [-h, frameBot - h * K],
    [-clip, frameBot - clip * K],
  ];

  // Centre the bounding box on the origin.
  const top = h * K;
  const bottom = frameBot - h * K;
  const dy = -(top + bottom) / 2;
  const shift = (poly: Pt[]): Pt[] =>
    poly.map(([x, y]) => [round(x), round(y + dy)] as const);

  const left = { TL: shift(TL), L: shift(L), NL: shift(NL), ML: shift(ML), BL: shift(BL) };
  return {
    pieces: {
      ...left,
      TR: mirror(left.TL),
      R: mirror(left.L),
      NR: mirror(left.NL),
      MR: mirror(left.ML),
      BR: mirror(left.BL),
    } as Record<PieceId, Poly>,
    halfHeight: round((bottom - top) / 2),
  };
}

function round(v: number) {
  return Math.round(v * 100) / 100;
}

/** Reflect across the vertical axis, keeping the winding order. */
export function mirror(poly: Poly): Pt[] {
  return poly.map(([x, y]) => [round(-x), y] as const).reverse();
}

export function centroid(poly: Poly): Pt {
  // area-weighted polygon centroid
  let a = 0, cx = 0, cy = 0;
  for (let i = 0; i < poly.length; i++) {
    const [x0, y0] = poly[i];
    const [x1, y1] = poly[(i + 1) % poly.length];
    const f = x0 * y1 - x1 * y0;
    a += f;
    cx += (x0 + x1) * f;
    cy += (y0 + y1) * f;
  }
  return [round(cx / (3 * a)), round(cy / (3 * a))];
}

/** Pointy-top hexagon, vertices ordered top → upper-left → … → upper-right. */
export function hexagon([cx, cy]: Pt, r: number): Pt[] {
  const w = r * COS30;
  return [
    [cx, cy - r],
    [cx - w, cy - r / 2],
    [cx - w, cy + r / 2],
    [cx, cy + r],
    [cx + w, cy + r / 2],
    [cx + w, cy - r / 2],
  ].map(([x, y]) => [round(x), round(y)] as const);
}

export function pointsAttr(poly: Poly): string {
  return poly.map(([x, y]) => `${x},${y}`).join(" ");
}

const built = build();

export const PIECES = built.pieces;
export const WALL = { ...P, halfWidth: P.W, halfHeight: built.halfHeight };

/** Tight viewBox around the assembled mark. */
export const VIEWBOX = `${-P.W} ${-Math.ceil(built.halfHeight)} ${2 * P.W} ${2 * Math.ceil(built.halfHeight)}`;
