// The six chapters of the home page's screen (DESIGN.md §8). Each one is a set
// of numbers; the driver blends neighbours over the last 20% of a section.
// `local` is the reading position's progress through the section, 0 to 1.

export type Chapter = 1 | 2 | 3 | 4 | 5 | 6;
/** Weights for the three glasses: jade, scarlet, violet (they sum to 1). */
export type Glass = [number, number, number];

export type State = {
  open: number; // base openness of the screen
  sunX: number; // the sun's resting place, as a fraction of the viewport
  sunY: number;
  sunR: number; // px: how far the opening and the light reach
  back: number; // light behind the screen
  beam: number; // the shaft from the hero cell
  heroOpen: number; // the hero cell held open
  scale: number; // cell size multiplier (the fine weave)
  jali: number; // strength of the jali pool
  band: number; // where the pool sits, 0 to 1 across the viewport at 30°
  swing: number; // radians on the vertical hinge
  retract: number; // 1: the screen is gone
  day: number; // 1: the room is flooded with daylight
  glass: Glass; // the mix of glass in the screen's cells
  tint: Glass; // the colour of the room's light round the sun
  glowCol: Glass; // the second glow's colour
  glow: [number, number, number, number]; // the second glow: x, y (viewport fractions), radius px, strength
};

export const LABELS: Record<Chapter, string> = {
  1: "Home",
  2: "Work",
  3: "Skills",
  4: "Experience",
  5: "About",
  6: "Contact",
};

const DEG55 = (55 * Math.PI) / 180;
const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

const JADE: Glass = [1, 0, 0];
const SCARLET: Glass = [0, 1, 0];
const VIOLET: Glass = [0, 0, 1];

const base: State = {
  open: 0.06, sunX: 0.8, sunY: 0.45, sunR: 80, back: 0.1, beam: 0, heroOpen: 0,
  scale: 1, jali: 0, band: 0, swing: 0, retract: 0, day: 0,
  glass: [0.5, 0, 0.5], tint: JADE, glowCol: VIOLET, glow: [0.95, 0.25, 560, 0],
};

/** `daylight: false` keeps About at night (pages that don't compose it for daylight). */
export function chapterState(n: Chapter, local: number, phone: boolean, daylight: boolean): State {
  const r = phone ? 0.62 : 1;
  switch (n) {
    case 1: // First light: almost shut, the hero cell open, one shaft across the h1. Jade and scarlet.
      return {
        ...base, open: 0.05, back: 0.12, beam: 1, heroOpen: 1, sunR: 210 * r,
        sunX: phone ? 0.75 : 0.772, sunY: phone ? 0.23 : 0.298,
        glass: [0.6, 0.4, 0], tint: JADE, glowCol: SCARLET, glow: [phone ? 0.86 : 0.84, phone ? 0.12 : 0.16, 260 * r, 0.2],
      };
    case 2: // Windows: shut; a hovered row opens its window (the driver's setWindow). Jade and violet.
      return {
        ...base, open: 0.06, sunR: 80 * r, back: 0.1,
        glass: [0.5, 0, 0.5], tint: JADE, glowCol: VIOLET, glow: [0.98, 0.3, 560 * r, 0.14],
      };
    case 3: // The jali casts: a fine weave, a patterned pool sliding across at 30°. Leans violet.
      return {
        ...base, open: 0.1, sunX: 0.86, sunY: 0.62, sunR: 110 * r, back: 0.12,
        scale: 0.5, jali: 1, band: -0.25 + 1.5 * local,
        glass: [0.25, 0, 0.75], tint: VIOLET, glowCol: VIOLET, glow: [0.9, 0.8, 620 * r, 0.15],
      };
    case 4: // The screen turns on its hinge; the light sits beyond the far edge. Leans scarlet:
      // scarlet panes, the hinge's lit edge and a low lamp in scarlet, in a dim violet room.
      return {
        ...base, open: 0.16, sunX: 0.92, sunY: 0.5, sunR: 300 * r, back: 0.2,
        swing: smooth(0, 0.85, local) * DEG55,
        glass: [0.2, 0.7, 0.1], tint: VIOLET, glowCol: SCARLET, glow: [0.98, 0.98, 380 * r, phone ? 0.12 : 0.28],
      };
    case 5: // Daylight: the screen retracts and the room floods
      if (!daylight) {
        // Until About is composed for daylight (stage 3), the screen retracts into a night room
        // with one small sun behind the right-hand column, away from the text.
        return { ...base, open: 0.1, sunX: 0.8, sunY: 0.45, sunR: 170 * r, back: 0.1, retract: smooth(0.05, 0.65, local) };
      }
      // `day: 1` asks for daylight; the driver flips it in time when the reading line arrives.
      return {
        ...base, open: 0.1, sunX: 0.7, sunY: 0.4, sunR: 330 * r, back: 0.16,
        retract: smooth(0.05, 0.75, local), day: 1,
        glass: [0.5, 0.25, 0.25], tint: JADE, glowCol: SCARLET, glow: [0.5, 1.1, 600 * r, 0],
      };
    case 6: // Lantern: night again, a large open cluster around "Email me". A violet and scarlet dusk.
      return {
        ...base, open: 0.1, sunX: 0.72, sunY: 0.5, sunR: 330 * r, back: 0.16,
        glass: [0, 0.45, 0.55], tint: VIOLET, glowCol: SCARLET, glow: [phone ? 0.75 : 0.8, phone ? 0.2 : 0.42, 300 * r, 0.2],
      };
  }
}

/**
 * The 404 (DESIGN.md §8, "Shut"): the screen closed, a faint back light, and a sun only about a
 * cell across, so the cell under the pointer (or a tap's ripple) is the only one that opens.
 * Every page's screen also opens from this state when the page arrives.
 */
export function shutState(phone: boolean): State {
  return {
    ...base, open: 0, back: 0.04, sunR: phone ? 34 : 58, sunX: 0.72, sunY: 0.42,
    glass: [0.5, 0, 0.5], tint: VIOLET, glowCol: VIOLET, glow: [0.9, 0.3, 400, 0],
  };
}

// The glass mixes the home page's chapters use; a case page takes one of them.
const MIXES: { glass: Glass; tint: Glass; glowCol: Glass }[] = [
  { glass: [0.6, 0.4, 0], tint: JADE, glowCol: SCARLET },
  { glass: [0.5, 0, 0.5], tint: JADE, glowCol: VIOLET },
  { glass: [0.25, 0, 0.75], tint: VIOLET, glowCol: VIOLET },
  { glass: [0.2, 0.7, 0.1], tint: VIOLET, glowCol: SCARLET },
  { glass: [0, 0.45, 0.55], tint: VIOLET, glowCol: SCARLET },
];

/** A stable 32-bit hash of a string (FNV-1a), and the k-th number in [0, 1) drawn from it. */
function hash(s: string) {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 0x01000193);
  return h >>> 0;
}
const draw = (h: number, k: number) => (Math.imul(h ^ Math.imul(k + 1, 0x9e3779b1), 0x85ebca6b) >>> 0) / 4294967296;

/**
 * A case page's own screen (DESIGN.md §8), seeded from its slug so it is the same on every
 * visit: where its sun rests (in the right-hand columns, beside the hero figure's window),
 * how far the light reaches, and which glass it is cut from. Night, and nearly shut, so long
 * reading stays quiet; the window behind the hero figure carries the light.
 */
export function caseState(seed: string, phone: boolean): State {
  const h = hash(seed);
  const r = phone ? 0.62 : 1;
  const m = MIXES[h % MIXES.length];
  return {
    ...base, open: 0.05, back: 0.1, sunR: (150 + 90 * draw(h, 0)) * r,
    // on desktop past the text column's measure (it ends near 0.84 of the width at 1440)
    sunX: phone ? 0.68 + 0.2 * draw(h, 1) : 0.88 + 0.08 * draw(h, 1),
    sunY: 0.2 + 0.45 * draw(h, 2),
    glass: m.glass, tint: m.tint, glowCol: m.glowCol,
    glow: [0.82 + 0.16 * draw(h, 3), 0.1 + 0.75 * draw(h, 4), (320 + 220 * draw(h, 5)) * r, 0.16],
  };
}

export function mix(a: State, b: State, w: number): State {
  if (w <= 0) return a;
  const out: Record<string, number | number[]> = { ...a };
  for (const k of Object.keys(a) as (keyof State)[]) {
    const x = a[k];
    const y = b[k];
    out[k] = Array.isArray(x) ? x.map((v, i) => v + ((y as number[])[i] - v) * w) : x + ((y as number) - x) * w;
  }
  return out as State;
}

export { smooth };
