// An evidence weave (DESIGN.md §14, Waleed 20 Oct 2026): a case study's own count drawn as lit
// cells of the lattice, in the mark's outline. Server-rendered SVG; the screen's window opens
// behind it on desktop, and on phones it sits inline. Every cell's light comes from lib/data.ts.
import type { FlowNode, Weave as WeaveData } from "@/lib/data";
import { HH, T30, V } from "@/lib/gl/lattice";

const W = 400; // viewBox, 8:5
const H = 250;
const PAD = 22;
const INSET = 0.84; // a cell's outline inside its lattice slot, so the seams show

// #2ee6b8 (jade light) to #d2fcef (light-hi): light is jade until it's bright enough to go white.
// One hue only: the levels are data (brighter is more severe, lit or dim), so no other glass here.
const mix = (a: number[], b: number[], t: number) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
const LIGHT = [46, 230, 184];
const HI = [210, 252, 239];
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

/** A pipeline's stages, in the order data moves through them, lit brighter nearer the analyst's
 *  screen. Shared by the case page's pipeline figure (CaseFlow) and its cover (FlowWeave). */
export const FLOW_STAGES: { kind: NonNullable<FlowNode["kind"]>; name: string; level: number }[] = [
  { kind: "in", name: "In", level: 0.45 },
  { kind: "core", name: "Core", level: 0.62 },
  { kind: "ai", name: "Local AI", level: 0.82 },
  { kind: "out", name: "Out", level: 1 },
];

const FCW = 38; // the cover's cell width, in viewBox units

/**
 * A case's pipeline as its cover (A-TIOC): the same parts as its case page's pipeline figure,
 * each a lit cell of the lattice at its stage's light. A spine of dim cells runs left to right
 * through them, brightening as it goes; each stage's first part sits above it and its second
 * below, three cells apart, and the last stage ends the spine in a glow. Stage and part names
 * sit on a halo of the ground, so they read over any light. Cells and glow lock in, in the
 * order data moves (cells.ts).
 */
function FlowWeave({ nodes, id }: { nodes: FlowNode[]; id: string }) {
  const half = HH * INSET * FCW;
  const end = 3 * (FLOW_STAGES.length - 2) + 2; // the spine's last column: the last stage's cell
  const ox = (W - end * FCW) / 2;
  const oy = 131;
  const at = (c: number, row: number): [number, number] => [ox + (c + (row & 1) * 0.5) * FCW, oy + row * V * FCW];
  const r = (v: number) => +v.toFixed(2);

  const cells: { x: number; y: number; level: number }[] = [];
  for (let c = 0; c < end; c++) cells.push({ x: at(c, 0)[0], y: oy, level: 0.06 + (0.18 * c) / (end - 1) });
  const labels: { x: number; y: number; name: string; stage?: string; stageY?: number }[] = [];
  let glow: [number, number] = [0, 0];
  FLOW_STAGES.forEach((s, k) => {
    nodes
      .filter((n) => (n.kind ?? "core") === s.kind)
      .forEach((n, i) => {
        const last = k === FLOW_STAGES.length - 1;
        const row = last ? 0 : i === 0 ? -1 : 1;
        const [x, y] = at(last ? end : 3 * k, row);
        cells.push({ x, y, level: s.level });
        if (last) glow = [x, y];
        const name = n.label.split("\n")[0];
        const stage = i === 0 ? s.name : undefined;
        if (row < 0) labels.push({ x, y: y - half - 9, name, stage, stageY: y - half - 26 });
        else labels.push({ x, y: y + half + 19, name, stage, stageY: y + half + 35 });
      });
  });
  // reading order is the order data moves: left to right, then top to bottom
  cells.sort((a, b) => a.x - b.x || a.y - b.y);
  const tileH = 2 * V * FCW;

  return (
    <svg className="weave weave--flow" viewBox={`0 0 ${W} ${H}`} aria-hidden="true" focusable="false">
      <defs>
        <pattern id={`wv-bg-${id}`} patternUnits="userSpaceOnUse" x={r(ox - FCW / 2)} y={r(oy)} width={FCW} height={r(tileH)}>
          {[[FCW / 2, 0], [0, V * FCW], [FCW, V * FCW], [FCW / 2, tileH]].map(([x, y]) => (
            <use key={`${x},${y}`} href="#wv-slot" transform={`translate(${r(x)} ${r(y)}) scale(${FCW})`} />
          ))}
        </pattern>
        <radialGradient id={`wv-glow-${id}`}>
          <stop offset="0" stopColor="#d2fcef" stopOpacity="0.5" />
          <stop offset="1" stopColor="#2ee6b8" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect className="weave__bg" width={W} height={H} fill={`url(#wv-bg-${id})`} />
      <g className="weave__cells">
        {cells.map((p, i) => (
          <g key={i} transform={`translate(${r(p.x)} ${r(p.y)}) scale(${FCW})`}>
            <use href="#wv-cell" className="weave__cell" fill={fill(p.level)} />
          </g>
        ))}
        {/* the analyst's screen glows once the light reaches it: it locks in last */}
        <g transform={`translate(${r(glow[0])} ${r(glow[1])})`}>
          <circle className="weave__cell" r={r(FCW * 1.9)} fill={`url(#wv-glow-${id})`} />
        </g>
      </g>
      <g className="weave__labels">
        {labels.map((l) => (
          <g key={l.name}>
            <text className="weave__name" x={r(l.x)} y={r(l.y)}>
              {l.name}
            </text>
            {l.stage && (
              <text className="weave__stage" x={r(l.x)} y={r(l.stageY!)}>
                {l.stage}
              </text>
            )}
          </g>
        ))}
      </g>
    </svg>
  );
}

export function Weave({ weave, id }: { weave: WeaveData; id: string }) {
  if (weave.flow) return <FlowWeave nodes={weave.flow} id={id} />;
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
    // An empty weave (light only) fills whatever strip it's given; a counted one is never cropped.
    <svg className="weave" viewBox={`0 0 ${W} ${H}`} aria-hidden="true" focusable="false" preserveAspectRatio={cells.length ? "xMidYMid meet" : "xMidYMid slice"}>
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
