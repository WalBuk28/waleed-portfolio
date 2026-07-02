"use client";

import { useState } from "react";
import { skillRadar } from "@/lib/data";

/**
 * Single-series "proficiency profile" radar. One hue (emerald) per the
 * sequential-magnitude rule; a recessive hairline grid; every vertex carries
 * a direct numeric label so magnitude is read from the number, not the area
 * (the honest, grouped skill lists sit beside it as the source of truth).
 */
const SIZE = 340;
const C = SIZE / 2;
const R = 128;
const RINGS = [0.25, 0.5, 0.75, 1];

function pt(angleDeg: number, radius: number) {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return { x: C + radius * Math.cos(a), y: C + radius * Math.sin(a) };
}

export function SkillsRadar() {
  const n = skillRadar.length;
  const step = 360 / n;
  const [active, setActive] = useState<number | null>(null);

  const dataPoints = skillRadar.map((s, i) =>
    pt(i * step, (R * s.value) / 100)
  );
  const dataPath =
    dataPoints.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") +
    "Z";

  return (
    <figure className="relative flex flex-col items-center">
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="radar-svg h-auto w-full max-w-[360px] overflow-visible"
        role="img"
        aria-label="Skills proficiency radar across seven domains"
      >
        {/* grid rings */}
        {RINGS.map((ring) => {
          const poly = Array.from({ length: n }, (_, i) => pt(i * step, R * ring))
            .map((p) => `${p.x},${p.y}`)
            .join(" ");
          return (
            <polygon
              key={ring}
              points={poly}
              fill="none"
              stroke="#2c2c2a"
              strokeWidth={1}
            />
          );
        })}

        {/* spokes + axis labels */}
        {skillRadar.map((s, i) => {
          const edge = pt(i * step, R);
          const labelPos = pt(i * step, R + 26);
          const isActive = active === i;
          return (
            <g key={s.axis}>
              <line
                x1={C}
                y1={C}
                x2={edge.x}
                y2={edge.y}
                stroke="#2c2c2a"
                strokeWidth={1}
              />
              <text
                x={labelPos.x}
                y={labelPos.y}
                textAnchor={
                  Math.abs(labelPos.x - C) < 6
                    ? "middle"
                    : labelPos.x > C
                      ? "start"
                      : "end"
                }
                dominantBaseline="middle"
                className={`font-mono text-[9px] uppercase tracking-wide transition-colors ${
                  isActive ? "fill-emerald-accent" : "fill-[#9fb1c1]"
                }`}
              >
                {s.short}
              </text>
            </g>
          );
        })}

        {/* data polygon — always rendered; a pure-CSS draw-in plays as an
            enhancement (see .radar-poly in globals.css) and can never hide it */}
        <path
          className="radar-poly"
          d={dataPath}
          fill="rgba(52,211,153,0.12)"
          stroke="#34d399"
          strokeWidth={2}
          strokeLinejoin="round"
          style={{ transformOrigin: `${C}px ${C}px` }}
        />

        {/* vertices + value labels */}
        {dataPoints.map((p, i) => {
          const s = skillRadar[i];
          const lp = pt(i * step, (R * s.value) / 100 + 0);
          const isActive = active === i;
          return (
            <g
              key={s.axis}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              className="cursor-default"
            >
              {/* larger invisible hit target */}
              <circle cx={p.x} cy={p.y} r={16} fill="transparent" />
              <circle
                cx={p.x}
                cy={p.y}
                r={isActive ? 6 : 4}
                fill="#34d399"
                stroke="#0f151b"
                strokeWidth={2}
                className="transition-all"
              />
              <text
                x={lp.x}
                y={lp.y - 12}
                textAnchor="middle"
                className={`fill-[#e6edf3] font-mono text-[10px] font-semibold tabular-nums transition-opacity ${
                  isActive ? "opacity-100" : "opacity-70"
                }`}
              >
                {s.value}
              </text>
            </g>
          );
        })}
      </svg>

      <figcaption className="mt-3 text-center font-mono text-2xs text-ink-muted">
        Self-assessed proficiency · 0–100 across core domains
      </figcaption>
    </figure>
  );
}
