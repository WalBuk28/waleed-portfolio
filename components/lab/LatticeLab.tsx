"use client";

import { useEffect } from "react";
import { pinChapter, startScreen } from "@/lib/screen/driver";
import { LABELS, type Chapter } from "@/lib/screen/chapters";

// Stage 2 gate: OGL, the atlas, the six chapter states, the pointer and the idle. Nothing else
// moves here: no Lenis, no GSAP tweens. ?ch=1..6 holds a chapter (&p= its progress), ?gpu=1
// collects GPU time per frame, ?dpr= caps the device pixel ratio.
export function LatticeLab() {
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    const ch = +(q.get("ch") || 0);
    if (ch >= 1 && ch <= 6) pinChapter(ch as Chapter, +(q.get("p") || 0.6));
    let last = window.scrollY;
    startScreen({
      daylight: true,
      timing: q.get("gpu") === "1",
      dprCap: q.get("dpr") ? +q.get("dpr")! : undefined,
      source: () => {
        const y = window.scrollY;
        const velocity = y - last;
        last = y;
        return { y, velocity };
      },
    }).then((screen) => {
      (window as unknown as { __screen?: unknown }).__screen = screen;
    });
  }, []);

  return (
    <div data-screen="lab" style={{ position: "relative", zIndex: 1 }}>
      <main id="main" style={{ position: "relative", zIndex: 1 }}>
        {([1, 2, 3, 4, 5, 6] as Chapter[]).map((n) => (
          <section
            key={n}
            data-chapter={n}
            style={{ minHeight: "100svh", padding: "36px", position: "relative" }}
          >
            {n === 1 ? (
              <h1
                data-quiet
                style={{ position: "absolute", left: 36, top: "40svh", fontSize: "clamp(3.25rem, 1rem + 7.2vw, 7.75rem)", lineHeight: 0.98, fontWeight: 300, letterSpacing: "-0.04em", color: "#b7c2bd", maxWidth: "9ch" }}
              >
                Signal through the noise
              </h1>
            ) : (
              <p style={{ fontSize: 13, color: "#93a39c" }}>
                {n}. {LABELS[n]}
              </p>
            )}
          </section>
        ))}
      </main>
    </div>
  );
}
