"use client";

import { threatFeed } from "@/lib/data";

const dot: Record<string, string> = {
  crit: "bg-threat-crit",
  warn: "bg-threat-warn",
  ok: "bg-emerald-accent",
};
const label: Record<string, string> = {
  crit: "text-threat-crit",
  warn: "text-threat-warn",
  ok: "text-emerald-accent",
};

/**
 * Infinite marquee of illustrative IOCs. The track is duplicated so the
 * -50% translate loops seamlessly. Edge-masked; pauses on hover.
 */
export function ThreatTicker() {
  const items = [...threatFeed, ...threatFeed];
  return (
    <div className="group relative w-full overflow-hidden border-y border-edge bg-void/40 py-2.5 mask-fade-x">
      <div className="flex w-max animate-marquee items-center gap-3 group-hover:[animation-play-state:paused]">
        {items.map((t, i) => (
          <div
            key={i}
            className="flex items-center gap-2 whitespace-nowrap rounded-md border border-edge bg-surface/60 px-2.5 py-1 font-mono text-2xs"
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${dot[t.sev]} ${
                t.sev === "crit" ? "animate-pulse-dot" : ""
              }`}
            />
            <span className="text-ink-muted">{t.type}</span>
            <span className={label[t.sev]}>{t.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
