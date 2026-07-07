// Canvas-baked text + glow textures. Zero font/CDN dependencies: we resolve
// the next/font mono family from the CSS variable at runtime, so 3D text
// matches the DOM exactly and works offline.

import * as THREE from "three";

let monoCache: string | null = null;
export function monoFamily(): string {
  if (monoCache) return monoCache;
  if (typeof window === "undefined") return "ui-monospace, monospace";
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue("--font-mono")
    .trim();
  monoCache = v ? `${v}` : `"JetBrains Mono", ui-monospace, monospace`;
  return monoCache;
}

export type TextTex = { tex: THREE.CanvasTexture; aspect: number };

const textCache = new Map<string, TextTex>();

export function textTexture(
  text: string,
  {
    size = 46,
    color = "#a5f3fc",
    weight = 600,
    glow = 10,
    glowColor,
  }: { size?: number; color?: string; weight?: number; glow?: number; glowColor?: string } = {}
): TextTex {
  const key = `${text}|${size}|${color}|${weight}|${glow}|${glowColor}`;
  const hit = textCache.get(key);
  if (hit) return hit;

  const font = `${weight} ${size}px ${monoFamily()}`;
  const pad = glow + 8;
  const probe = document.createElement("canvas").getContext("2d")!;
  probe.font = font;
  const w = Math.ceil(probe.measureText(text).width) + pad * 2;
  const h = Math.ceil(size * 1.45) + pad * 2;

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.font = font;
  ctx.textBaseline = "middle";
  ctx.shadowColor = glowColor ?? color;
  ctx.shadowBlur = glow;
  ctx.fillStyle = color;
  ctx.fillText(text, pad, h / 2);
  ctx.shadowBlur = 0;
  ctx.fillText(text, pad, h / 2);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearFilter;
  tex.generateMipmaps = false;
  tex.anisotropy = 2;

  const out = { tex, aspect: w / h };
  textCache.set(key, out);
  return out;
}

const radialCache = new Map<string, THREE.CanvasTexture>();

/** Soft radial glow sprite texture. */
export function radialTexture(color: string, innerAlpha = 0.85): THREE.CanvasTexture {
  const key = `${color}|${innerAlpha}`;
  const hit = radialCache.get(key);
  if (hit) return hit;
  const S = 256;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = S;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  const c = new THREE.Color(color);
  const rgb = `${Math.round(c.r * 255)},${Math.round(c.g * 255)},${Math.round(c.b * 255)}`;
  g.addColorStop(0, `rgba(${rgb},${innerAlpha})`);
  g.addColorStop(0.35, `rgba(${rgb},${innerAlpha * 0.35})`);
  g.addColorStop(1, `rgba(${rgb},0)`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, S, S);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  radialCache.set(key, tex);
  return tex;
}

/** Tiny soft dot for point sprites. */
let dotTex: THREE.CanvasTexture | null = null;
export function dotTexture(): THREE.CanvasTexture {
  if (dotTex) return dotTex;
  const S = 64;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = S;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.4, "rgba(255,255,255,0.6)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, S, S);
  dotTex = new THREE.CanvasTexture(canvas);
  return dotTex;
}
