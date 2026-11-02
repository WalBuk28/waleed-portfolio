// =============================================================================
//  The screen's lattice: the WalSec mark's outline tiles the plane.
//
//  The outline is a hexagon with vertical sides and roof and floor edges at
//  ±30°, 1.3 times as tall as it is wide. In units of the cell width S, the
//  apex sits 0.65 from the centre, rows are 1.0113 apart, and odd rows shift
//  by half a cell. The DOM (hero cell, h1 band, poster) and the shader use the
//  same numbers, so they always agree on which cell is where.
// =============================================================================

export const HH = 0.65; // half height (apex to centre)
export const V = 1.0113249; // row spacing
export const T30 = Math.tan(Math.PI / 6);
export const COS30 = Math.cos(Math.PI / 6);
/** The shaft's direction in CSS space (y down): down and to the left at 30°. */
export const SHAFT_DIR: readonly [number, number] = [-COS30, 0.5];

export type Grid = { margin: number; gutter: number; S: number; phone: boolean };

/**
 * Page grid and cell size for a viewport width. Desktop: 12 columns, and S is
 * tuned so a vertical cell edge meets the column 5 line (vertical edges fall
 * every S/2 from the margin). Phone: 4 columns and S = 56.
 */
export function grid(width: number): Grid {
  const margin = Math.min(40, Math.max(20, width * 0.025));
  if (width < 768) return { margin: 20, gutter: 16, S: 56, phone: true };
  const gutter = 24;
  const step = (width - 2 * margin + gutter) / 12; // one column plus its gutter
  const toCol5 = 4 * step;
  const k = Math.max(1, Math.round((2 * toCol5) / (0.064 * width)));
  return { margin, gutter, S: (2 * toCol5) / k, phone: false };
}

/** Signed distance (in cell units) from a local point to its cell's outline. */
function cellEdge(lx: number, ly: number) {
  return Math.min(0.5 - Math.abs(lx), (HH - Math.abs(lx) * T30 - Math.abs(ly)) * COS30);
}

/**
 * Centre of the cell under a page point, in page CSS px. `origin` is the page
 * point the lattice is anchored to (x on the left margin line, y at the top).
 */
export function cellCentre(px: number, py: number, S: number, ox: number, oy = 0): [number, number] {
  const ux = (px - ox) / S;
  const uy = (py - oy) / S;
  let best = -1e9;
  let cx = 0;
  let cy = 0;
  const j0 = Math.floor(uy / V + 0.5);
  for (let dj = -1; dj <= 1; dj++) {
    const j = j0 + dj;
    const off = 0.5 * (((j % 2) + 2) % 2);
    const i0 = Math.floor(ux - off + 0.5);
    for (let di = -1; di <= 1; di++) {
      const x = i0 + di + off;
      const y = j * V;
      const e = cellEdge(ux - x, uy - y);
      if (e > best) {
        best = e;
        cx = x;
        cy = y;
      }
    }
  }
  return [ox + cx * S, oy + cy * S];
}
