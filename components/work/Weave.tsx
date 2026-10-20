// An evidence weave (DESIGN.md §14, Waleed 20 Oct 2026): a case study's own count drawn as lit
// cells of the lattice, in the mark's outline. Server-rendered SVG; the screen's window opens
// behind it on desktop, and on phones it sits inline. Every cell's light comes from lib/data.ts.
import type { Weave as WeaveData } from "@/lib/data";
import { HH, T30, V } from "@/lib/gl/lattice";

const W = 400; // viewBox, 8:5
const H = 250;
const PAD = 22;
const INSET = 0.84; // a cell's outline inside its lattice slot, so the seams show

// #33997d (light) to #d9f6ea (light-hi): light is green until it's bright enough to go white.
const mix = (a: number[], b: number[], t: number) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
const LIGHT = [51, 153, 125];
const HI = [217, 246, 234];
function fill(level: number) {
  if (level >= 0.6) return `rgb(${mix(LIGHT, HI, (level - 0.6) / 0.4).join(" ")})`;
  return `rgb(${LIGHT.join(" ")} / ${(0.18 + (level / 0.6) * 0.82).toFixed(2)})`;
}

/** The outline at cell width 1, centred on 0. */
function outline(scale: number) {
  const hw = 0.5 * scale;
  const hh = HH * scale;
  const side = hh - hw * T30;
  const pts = [[0, -hh], [hw, -side], [hw, side], [0, hh], [-hw, side], [-hw, -side]];
  return pts.map(([x, y]) => `${+x.toFixed(4)},${+y.toFixed(4)}`).join(" ");
}

/** Lattice positions (column, row) for every cell, in reading order. */
function positions(w: WeaveData) {
  const out: { c: number; r: number; level: number }[] = [];
  if (w.layout === "path") {
    // Alternate a step right and a step down-right: about 34° on the lattice.
    let c = 0;
    let r = 0;
    w.rows.flat().forEach((level, k) => {
      if (k) {
        if (k % 2) c += 1;
        else {
          c += 0.5;
          r += 1;
        }
      }
      out.push({ c, r, level });
    });
    return out;
  }
  w.rows.forEach((row, r) => row.forEach((level, c) => out.push({ c: c + (r % 2) * 0.5, r, level })));
  return out;
}

/** The defs every weave on the page shares: one cell outline. Render once, above the list. */
export function WeaveDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute" }}>
      <defs>
        <polygon id="wv-cell" points={outline(INSET)} />
        <polygon id="wv-slot" points={outline(0.92)} fill="none" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      </defs>
    </svg>
  );
}

export function Weave({ weave, id }: { weave: WeaveData; id: string }) {
  const cells = positions(weave);
  const cols = cells.length ? Math.max(...cells.map((p) => p.c)) + 1 : 1;
  const rows = cells.length ? Math.max(...cells.map((p) => p.r)) + 1 : 1;
  // The cell width that fits the block; the background lattice uses the same width so the
  // lit cells sit in its slots.
  const cw = Math.min(56, (W - 2 * PAD) / cols, (H - 2 * PAD) / ((rows - 1) * V + 2 * HH));
  const bw = (cols - 1) * cw;
  const bh = (rows - 1) * V * cw;
  const ox = (W - bw) / 2;
  const oy = (H - bh) / 2;
  const tileH = 2 * V * cw;
  const r = (v: number) => +v.toFixed(2);
  return (
    // The figure's caption says what the cells are; the drawing itself is aria-hidden.
    <svg className="weave" viewBox={`0 0 ${W} ${H}`} aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet">
      <defs>
        <pattern
          id={`wv-bg-${id}`}
          patternUnits="userSpaceOnUse"
          x={r(ox - cw / 2)}
          y={r(oy)}
          width={r(cw)}
          height={r(tileH)}
        >
          {[[cw / 2, 0], [0, V * cw], [cw, V * cw], [cw / 2, tileH]].map(([x, y]) => (
            <use key={`${x},${y}`} href="#wv-slot" transform={`translate(${r(x)} ${r(y)}) scale(${r(cw)})`} />
          ))}
        </pattern>
      </defs>
      <rect className="weave__bg" width={W} height={H} fill={`url(#wv-bg-${id})`} />
      <g className="weave__cells">
        {/* Each cell's place is on its <g>, so motion can scale the cell itself about its centre. */}
        {cells.map((p, i) => (
          <g key={i} transform={`translate(${r(ox + p.c * cw)} ${r(oy + p.r * V * cw)}) scale(${r(cw)})`}>
            <use href="#wv-cell" className="weave__cell" fill={fill(p.level)} />
          </g>
        ))}
      </g>
    </svg>
  );
}

export const weaveFill = fill;
