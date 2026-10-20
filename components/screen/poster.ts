// The poster (DESIGN.md §10): the same screen as a static SVG tile, for reduced motion, no
// WebGL and no JavaScript. One tile is one cell wide and two rows tall, and holds every mark
// that crosses it, drawn from the polygons in wall.ts. Built on the server into a data URI.
import { PIECE_IDS, PIECES, WALL } from "@/components/brand/wall";
import { V } from "@/lib/gl/lattice";

const W = 100; // tile units per cell
const r1 = (v: number) => Math.round(v * 10) / 10;

export function posterTile(face = "#111816") {
  const k = W / (2 * WALL.halfWidth);
  const h = 2 * V * W;
  const centres: [number, number][] = [
    [0, 0],
    [W, 0],
    [W / 2, V * W],
    [0, h],
    [W, h],
  ];
  const polys = centres
    .flatMap(([cx, cy]) =>
      PIECE_IDS.map((id) => `<polygon points='${PIECES[id].map(([x, y]) => `${r1(cx + x * k)},${r1(cy + y * k)}`).join(" ")}'/>`),
    )
    .join("");
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${W}' height='${r1(h)}' viewBox='0 0 ${W} ${r1(h)}'><g fill='${face}'>${polys}</g></svg>`;
  return `url("data:image/svg+xml,${svg.replace(/#/g, "%23").replace(/</g, "%3C").replace(/>/g, "%3E")}")`;
}
