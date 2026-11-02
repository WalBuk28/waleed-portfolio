// Bakes the screen's cell into one texture: the whole WalSec mark at four
// open states (o = 0, 1/3, 2/3, 1) side by side. As a cell opens, each of the
// ten pieces shrinks about its centroid (to 83%) and slides along its lock-in
// normal (LOCK_IN × 0.32). The shader blends the two states nearest to o.
// Drawn from the polygons in wall.ts, so the texture is the mark, exactly.
import { LOCK_IN, PIECE_IDS, PIECES, WALL, centroid } from "@/components/brand/wall";
import { HH } from "./lattice";

export const ATLAS_STATES = 4;

/** `cell` is the width of one state in texture px (240 on desktop, 160 on phones). */
export function bakeAtlas(cell: number): HTMLCanvasElement {
  const h = Math.round(cell * 2 * HH);
  const canvas = document.createElement("canvas");
  canvas.width = cell * ATLAS_STATES;
  canvas.height = h;
  const g = canvas.getContext("2d")!;
  g.fillStyle = "#fff";
  const unit = cell / (2 * WALL.halfWidth); // texture px per mark unit
  for (let k = 0; k < ATLAS_STATES; k++) {
    const o = k / (ATLAS_STATES - 1);
    const s = 1 - 0.17 * o;
    g.save();
    g.translate(k * cell + cell / 2, h / 2);
    g.scale(unit, unit);
    for (const id of PIECE_IDS) {
      const poly = PIECES[id];
      const [cx, cy] = centroid(poly);
      const [lx, ly] = LOCK_IN[id];
      g.beginPath();
      poly.forEach(([x, y], i) => {
        const X = cx + (x - cx) * s + lx * 0.32 * o;
        const Y = cy + (y - cy) * s + ly * 0.32 * o;
        if (i) g.lineTo(X, Y);
        else g.moveTo(X, Y);
      });
      g.closePath();
      g.fill();
    }
    g.restore();
  }
  return canvas;
}
