"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { bootSequence } from "@/lib/data";

const toneClass: Record<string, string> = {
  ok: "text-emerald-accent",
  warn: "text-threat-warn",
  info: "text-electric-accent",
};

/**
 * A faux-terminal that types the boot sequence line by line. Reduced-motion
 * renders the whole log statically. Purely decorative — aria-hidden.
 */
export function Terminal() {
  const reduce = useReducedMotion();
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (reduce) {
      setLineIdx(bootSequence.length);
      return;
    }
    if (lineIdx >= bootSequence.length) return;

    const current = bootSequence[lineIdx].text;
    if (charIdx < current.length) {
      timer.current = setTimeout(() => setCharIdx((c) => c + 1), 16);
    } else {
      timer.current = setTimeout(() => {
        setLineIdx((l) => l + 1);
        setCharIdx(0);
      }, 260);
    }
    return () => clearTimeout(timer.current);
  }, [lineIdx, charIdx, reduce]);

  const done = lineIdx >= bootSequence.length;

  return (
    <div
      aria-hidden
      className="panel overflow-hidden font-mono text-2xs shadow-panel sm:text-xs"
    >
      {/* title bar */}
      <div className="flex items-center gap-2 border-b border-edge bg-void/60 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-threat-crit/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-threat-warn/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-accent/80" />
        <span className="ml-2 text-ink-muted">walsec@operator — ~/bench</span>
        <span className="ml-auto flex items-center gap-1.5 text-emerald-accent">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-accent animate-pulse-dot" />
          live
        </span>
      </div>

      {/* body */}
      <div className="min-h-[11.5rem] space-y-1.5 p-4 leading-relaxed sm:min-h-[12.5rem]">
        {bootSequence.map((line, i) => {
          if (i > lineIdx) return null;
          const text =
            i < lineIdx || reduce ? line.text : line.text.slice(0, charIdx);
          const tag = line.text.match(/^\[(ok|warn|info)\]/i);
          return (
            <div key={i} className="flex gap-2 break-all">
              <span className={toneClass[line.tone ?? "info"]}>
                {tag ? "" : "›"}
              </span>
              <span
                className={
                  line.text.startsWith("$")
                    ? "text-ink"
                    : "text-ink-secondary"
                }
              >
                {text}
                {i === lineIdx && !reduce && !done && (
                  <span className="ml-0.5 inline-block h-3.5 w-2 translate-y-0.5 bg-emerald-accent animate-blink" />
                )}
              </span>
            </div>
          );
        })}
        {done && (
          <div className="flex gap-2 pt-1">
            <span className="text-emerald-accent">$</span>
            <span className="inline-block h-3.5 w-2 translate-y-0.5 bg-emerald-accent animate-blink" />
          </div>
        )}
      </div>
    </div>
  );
}
