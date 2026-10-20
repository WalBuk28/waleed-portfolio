// The screen: one fullscreen fragment shader. Every chapter is a set of
// uniforms (lib/screen/chapters.ts); the driver writes them, nothing else does.
// Coordinates are CSS px in the viewport, y down. The lattice is anchored to
// the page (x on the left margin line), so it scrolls with the content.

export const vertex = /* glsl */ `
attribute vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }`;

export const fragment = /* glsl */ `
precision highp float;
uniform vec2 uRes;
uniform float uDpr, uTime;
uniform sampler2D uAtlas;
uniform float uS, uS0, uMargin, uScroll;
uniform vec2 uSun;
uniform float uSunR, uOpen, uBack, uGlint, uVel, uRim, uDust;
uniform vec2 uHero;
uniform float uHeroOpen, uBeam, uBeamLen, uLock;
uniform vec4 uHot;
uniform float uJali, uBand, uSwing, uRetract, uDay;
uniform vec4 uTap;
uniform vec4 uQuiet[12];
uniform float uQuietN;

const vec3 GROUND = vec3(0.039, 0.055, 0.051); // #0a0e0d
const vec3 FACE = vec3(0.066, 0.094, 0.086);   // #111816
const vec3 LIGHT = vec3(0.200, 0.600, 0.490);  // #33997d
const vec3 HI = vec3(0.851, 0.965, 0.918);     // #d9f6ea
const vec3 DAY = vec3(0.812, 0.914, 0.871);    // #cfe9de
const float HH = 0.65, V = 1.0113249, T30 = 0.5773503, C30 = 0.8660254;

float h21(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float cellEdge(vec2 l) { return min(0.5 - abs(l.x), (HH - abs(l.x) * T30 - abs(l.y)) * C30); }

// The cell under u (lattice units): local coords, centre, distance to its outline.
void markCell(vec2 u, out vec2 lo, out vec2 ce, out float e) {
  float j0 = floor(u.y / V + 0.5);
  e = -1e9; lo = vec2(0.0); ce = vec2(0.0);
  for (int dj = -1; dj <= 1; dj++) {
    float j = j0 + float(dj);
    float off = 0.5 * mod(j, 2.0);
    float i0 = floor(u.x - off + 0.5);
    for (int di = -1; di <= 1; di++) {
      vec2 c = vec2(i0 + float(di) + off, j * V);
      vec2 l = u - c;
      float ed = cellEdge(l);
      if (ed > e) { e = ed; lo = l; ce = c; }
    }
  }
}

// The mark's mask at open state k (0..3) for a local point.
float piece(vec2 l, float k) {
  vec2 t = vec2((clamp(l.x + 0.5, 0.004, 0.996) + k) * 0.25, clamp((l.y + HH) / (2.0 * HH), 0.003, 0.997));
  return texture2D(uAtlas, t).a;
}

void main() {
  vec2 p = gl_FragCoord.xy / uDpr;
  p.y = uRes.y - p.y;

  // The screen turns on a vertical hinge at the margin line; past its far edge is the room.
  vec2 q = p;
  float depth = 1.0, beyond = 0.0;
  float f = 1500.0, sa = sin(uSwing), ca = cos(uSwing);
  if (uSwing > 0.001) {
    float xs = p.x - uMargin;
    float xp = xs / max(ca - xs * sa / f, 1e-3);
    depth = f / (f + xp * sa);
    q = vec2(uMargin + xp, uRes.y * 0.5 + (p.y - uRes.y * 0.5) / depth);
    beyond = smoothstep(uRes.x - 4.0, uRes.x + 4.0, uMargin + xp);
  }

  float S = uS;
  vec2 u = vec2((q.x - uMargin) / S, (q.y - uRes.y * 0.5) / S + (uScroll + uRes.y * 0.5) / uS0);
  vec2 lo, ce; float e;
  markCell(u, lo, ce, e);
  vec2 c = vec2(uMargin + ce.x * S, uRes.y * 0.5 + (ce.y - (uScroll + uRes.y * 0.5) / uS0) * S);
  float rnd = h21(ce);
  // Where that cell's centre lands on screen (it differs from c only while the screen turns):
  // light and quiet rects are tested there.
  vec2 cv = c;
  if (uSwing > 0.001) {
    float xpc = c.x - uMargin;
    float dc = f / (f + xpc * sa);
    cv = vec2(uMargin + xpc * ca * dc, uRes.y * 0.5 + (c.y - uRes.y * 0.5) * dc);
  }

  // How open the cell is: the base, the sun, the hero cell, the row window, the thumb.
  float sunD = distance(cv, uSun);
  float open = uOpen + (rnd - 0.5) * 0.06 + 0.95 * exp(-pow(sunD / uSunR, 2.0));
  open += uVel * exp(-pow(sunD / (uSunR * 1.7), 2.0));
  float heroD = distance(c, uHero);
  float hero = 1.0 - smoothstep(0.35 * S, 0.6 * S, heroD);
  open = max(open, uHeroOpen * hero);
  float hot = 0.0;
  if (uHot.w > 0.0) {
    hot = uHot.w * (1.0 - smoothstep(uHot.y * 0.5, uHot.y * 0.5 + S * 0.6, abs(c.y - uHot.x)))
        * smoothstep(uHot.z - S, uHot.z + S * 2.0, c.x);
    open = max(open, 0.9 * hot);
  }
  float tap = 0.0;
  if (uTap.w > 0.0) {
    // a tap opens the cell, then ring 1 and ring 2, 60 ms apart; holds 0.8 s, then closes,
    // and lets light through where it opens
    float ring = floor(distance(c, uTap.xy) / S + 0.5);
    float t = uTime - uTap.z - ring * 0.06;
    tap = smoothstep(0.0, 0.16, t) * (1.0 - smoothstep(0.96, 1.4, t)) * step(ring, 2.5) * (1.0 - ring * 0.25);
    open = max(open, tap);
  }

  // The jali casts: the open pattern projected and skewed at 30° as a pool of light.
  float pool = 0.0, jl = 0.0;
  if (uJali > 0.0) {
    pool = uJali * exp(-pow((dot(p, vec2(0.5, C30)) - uBand) / 240.0, 2.0));
    vec2 pj = vec2(p.x + (p.y + uScroll) * T30, p.y + uScroll) / (uS0 * 1.35);
    vec2 lj, cj; float ej;
    markCell(pj, lj, cj, ej);
    jl = (1.0 - piece(lj, 3.0) * smoothstep(0.004, 0.03, ej)) * pool;
    open = max(open, 0.5 * pool);
  }

  // Quiet rects: openness and light are capped behind text.
  float quiet = 0.0;
  for (int i = 0; i < 12; i++) {
    if (float(i) >= uQuietN) break;
    vec4 r = uQuiet[i];
    vec2 d = max(r.xy - cv, cv - r.xy - r.zw);
    // any cell that touches the text (half a cell wide, 0.65 of one tall) is fully quiet
    quiet = max(quiet, 1.0 - smoothstep(0.0, S * 0.4, max(d.x - S * 0.5, d.y - S * HH)));
  }
  open = mix(open, min(open, 0.14), quiet);
  jl *= 1.0 - quiet; // the cast pattern stays off the text too

  // The intro: pieces fade in already apart, then lock together, outward from the hero cell.
  float lockP = clamp((uLock - heroD) / (S * 2.0), 0.0, 1.0);
  float alpha = smoothstep(0.0, 0.45, lockP);
  open = mix(1.0, open, smoothstep(0.25, 1.0, lockP));

  // Daylight: the pieces retract toward the cell centre until the screen is gone.
  vec2 lr = lo / (1.0 - uRetract * 0.985);
  float inCell = step(abs(lr.x), 0.5) * step(abs(lr.y), HH);

  open = clamp(open, 0.0, 1.0);
  float o3 = open * 3.0, k = min(floor(o3), 2.0), fr = o3 - k;
  float aa = 1.5 / (S * uDpr);
  float edge = smoothstep(0.006, 0.006 + aa, e);
  float m = mix(piece(lr, k), piece(lr, k + 1.0), fr) * edge * inCell * alpha;
  float m2 = m;
  vec2 toSun = normalize(uSun - c + vec2(0.01, 0.0));
  if (uRim > 0.0) {
    vec2 lr2 = lr + toSun * 0.014;
    m2 = mix(piece(lr2, k), piece(lr2, k + 1.0), fr) * inCell;
  }

  // Light behind the screen, and how much of it comes through.
  float back = uBack + 1.15 * exp(-pow(sunD / (uSunR * 1.8), 2.0)) + 0.9 * hot + 0.6 * pool + 0.9 * tap;
  back += uHeroOpen * 1.2 * exp(-pow(heroD / (S * 1.3), 2.0));
  float glint = uGlint * step(0.82, rnd) * pow(max(0.0, sin(uTime * 0.7 + rnd * 61.0)), 40.0);
  back = mix(back, min(back, 0.2), quiet) + glint * 0.5 * (1.0 - quiet);
  float through = clamp(back * (0.22 + 0.78 * open), 0.0, 1.2) * mix(0.25, 1.0, lockP);
  vec3 lightCol = mix(LIGHT * 0.75, HI, pow(clamp(through - 0.45, 0.0, 1.0), 1.6));
  vec3 gap = mix(FACE * 0.62, lightCol, smoothstep(0.03, 1.0, through)) + LIGHT * 0.35 * jl;
  float spill = exp(-pow(sunD / (uSunR * 1.4), 2.0)) * (1.0 - 0.7 * quiet);
  vec3 face = FACE * (0.8 + 0.9 * spill) + LIGHT * 0.05 * spill + HI * 0.09 * jl;
  vec3 col = mix(gap, face, m);
  col += lightCol * m * (1.0 - m2) * 0.55 * clamp(through, 0.0, 1.0);     // rims facing the light
  col += LIGHT * 0.10 * exp(-pow(distance(p, uSun) / (uSunR * 2.4), 2.0)) * (1.0 - 0.9 * quiet);
  col = mix(GROUND, col, alpha);

  if (uSwing > 0.001) {
    col = mix(GROUND, col, clamp(depth * 1.15 - 0.1, 0.0, 1.0));
    vec3 room = GROUND + LIGHT * (0.05 + 0.2 * exp(-pow(distance(p, uSun) / (uSunR * 2.0), 2.0)));
    col = mix(col, room, beyond);
  }

  if (uBeam > 0.0) {
    // One shaft from the hero cell at the lattice's 30°, its front travelling along it.
    vec2 D = vec2(-C30, 0.5);
    vec2 rel = p - uHero;
    float t = dot(rel, D);
    float s = rel.x * D.y - rel.y * D.x;
    float w = 18.0 + 0.24 * max(t, 0.0);
    float shaft = exp(-pow(s / w, 2.0)) * exp(-max(t, 0.0) / 950.0) * smoothstep(0.0, 40.0, t);
    shaft *= 1.0 - smoothstep(uBeamLen - 160.0, uBeamLen, t);
    shaft *= 1.0 - 0.5 * exp(-pow(s / (0.10 * w), 2.0));                 // the mullion's shadow
    shaft *= mix(1.0, 0.55, quiet);
    float dust = uDust * step(0.996, h21(floor((p - D * uTime * 9.0) / 2.0))) * shaft;
    col += ((LIGHT * 0.40 + HI * 0.16) * shaft + HI * dust * 0.6) * uBeam;
  }

  col = mix(col, DAY, uDay);
  gl_FragColor = vec4(col, 1.0);
}`;
