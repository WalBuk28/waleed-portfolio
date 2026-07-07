"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { terminalScript } from "../content";
import { monoFamily } from "../text";

const W = 1024;
const H = 640;
const LINE_H = 34;
const MAX_LINES = 14;
const TONE: Record<string, string> = {
  ok: "#34d399",
  warn: "#fbbf24",
  crit: "#f87171",
  info: "#7dd3fc",
  dim: "#5f7080",
};

/**
 * A live SOC terminal rendered to a CanvasTexture: boot sequence, then a
 * looping DPI / RAG / MITRE feed, typed character-by-character with a
 * blinking block cursor, scanlines and phosphor vignette.
 */
export function useTerminalTexture() {
  const state = useRef({
    canvas: null as HTMLCanvasElement | null,
    ctx: null as CanvasRenderingContext2D | null,
    lines: [] as { text: string; tone: string }[],
    scriptIdx: 0,
    chars: 0,
    accum: 0,
    redraw: 0,
    time: 0,
  });

  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    state.current.canvas = canvas;
    state.current.ctx = canvas.getContext("2d");
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    tex.generateMipmaps = false;
    tex.minFilter = THREE.LinearFilter;
    draw(state.current, 0);
    tex.needsUpdate = true;
    return tex;
  }, []);

  const update = (dt: number, active: boolean) => {
    const s = state.current;
    if (!s.ctx || !active) return;
    s.time += dt;
    s.accum = Math.min(s.accum + dt, 0.5); // never burst-type after a long frame
    s.redraw += dt;

    // typing: ~34 chars/sec with jitter
    const step = 1 / (30 + Math.sin(s.time * 7) * 8);
    while (s.accum > step) {
      s.accum -= step;
      s.chars++;
      const cur = terminalScript[s.scriptIdx % terminalScript.length];
      if (s.chars > cur.text.length + 14) {
        // hold finished line briefly, then commit
        s.lines.push({ text: cur.text, tone: cur.tone });
        if (s.lines.length > MAX_LINES) s.lines.shift();
        s.scriptIdx++;
        s.chars = 0;
      }
    }

    if (s.redraw > 0.08) {
      s.redraw = 0;
      draw(s, s.time);
      texture.needsUpdate = true;
    }
  };

  return { texture, update };
}

function draw(s: { canvas: HTMLCanvasElement | null; ctx: CanvasRenderingContext2D | null; lines: { text: string; tone: string }[]; scriptIdx: number; chars: number; time?: number }, time: number) {
  const ctx = s.ctx!;
  const mono = monoFamily();

  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#050b10");
  bg.addColorStop(1, "#07131a");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // window chrome
  ctx.fillStyle = "#0a141c";
  ctx.fillRect(0, 0, W, 46);
  for (const [i, c] of ["#f87171", "#fbbf24", "#34d399"].entries()) {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(28 + i * 26, 23, 6.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.font = `500 19px ${mono}`;
  ctx.fillStyle = "#5f7080";
  ctx.fillText("walsec@a-tioc:~ — tshark -i eth0 · soc/live", 110, 30);

  // lines
  ctx.font = `500 22px ${mono}`;
  const cur = terminalScript[s.scriptIdx % terminalScript.length];
  const typed = cur.text.slice(0, Math.min(s.chars, cur.text.length));
  const rows = [...s.lines, { text: typed, tone: cur.tone, cursor: true } as { text: string; tone: string; cursor?: boolean }];
  const y0 = H - 26 - (rows.length - 1) * LINE_H;
  rows.forEach((line, i) => {
    const y = y0 + i * LINE_H;
    ctx.fillStyle = TONE[line.tone] ?? TONE.info;
    ctx.fillText(line.text, 26, y);
    if ((line as { cursor?: boolean }).cursor && Math.floor(time * 2.4) % 2 === 0) {
      const w = ctx.measureText(line.text).width;
      ctx.fillStyle = "#5eead4";
      ctx.fillRect(30 + w, y - 19, 12, 24);
    }
  });

  // scanlines + phosphor vignette
  ctx.fillStyle = "rgba(0,0,0,0.16)";
  for (let y = 48; y < H; y += 4) ctx.fillRect(0, y, W, 1.4);
  const vg = ctx.createRadialGradient(W / 2, H / 2, H / 3, W / 2, H / 2, H);
  vg.addColorStop(0, "rgba(0,0,0,0)");
  vg.addColorStop(1, "rgba(0,0,0,0.55)");
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, W, H);
}
