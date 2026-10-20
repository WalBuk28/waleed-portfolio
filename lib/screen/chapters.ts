// The six chapters of the home page's screen (DESIGN.md §8). Each one is a set
// of numbers; the driver blends neighbours over the last 20% of a section.
// `local` is the reading position's progress through the section, 0 to 1.

export type Chapter = 1 | 2 | 3 | 4 | 5 | 6;

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

const base: State = {
  open: 0.06, sunX: 0.8, sunY: 0.45, sunR: 80, back: 0.1, beam: 0, heroOpen: 0,
  scale: 1, jali: 0, band: 0, swing: 0, retract: 0, day: 0,
};

/** `daylight: false` keeps About at night (pages that don't compose it for daylight). */
export function chapterState(n: Chapter, local: number, phone: boolean, daylight: boolean): State {
  const r = phone ? 0.62 : 1;
  switch (n) {
    case 1: // First light: almost shut, the hero cell open, one shaft across the h1
      return {
        ...base, open: 0.05, back: 0.12, beam: 1, heroOpen: 1, sunR: 210 * r,
        sunX: phone ? 0.75 : 0.772, sunY: phone ? 0.23 : 0.298,
      };
    case 2: // Windows: shut; a hovered row opens its window (the driver's setWindow)
      return { ...base, open: 0.06, sunR: 80 * r, back: 0.1 };
    case 3: // The jali casts: a fine weave, a patterned pool sliding across at 30°
      return {
        ...base, open: 0.1, sunX: 0.86, sunY: 0.62, sunR: 110 * r, back: 0.12,
        scale: 0.5, jali: 1, band: -0.25 + 1.5 * local,
      };
    case 4: // The screen turns on its hinge; the light sits beyond the far edge
      return {
        ...base, open: 0.16, sunX: 0.92, sunY: 0.5, sunR: 300 * r, back: 0.2,
        swing: smooth(0, 0.85, local) * DEG55,
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
      };
    case 6: // Lantern: night again, a large open cluster around "Email me"
      return { ...base, open: 0.1, sunX: 0.72, sunY: 0.5, sunR: 330 * r, back: 0.16 };
  }
}

export function mix(a: State, b: State, w: number): State {
  if (w <= 0) return a;
  const out = { ...a };
  for (const k of Object.keys(a) as (keyof State)[]) out[k] = a[k] + (b[k] - a[k]) * w;
  return out;
}

export { smooth };
