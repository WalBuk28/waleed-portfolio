"use client";

/**
 * Ambient backdrop: fixed, non-interactive. A faint perspective grid + two
 * slow aurora blooms (emerald / electric) + a top vignette. Pure CSS, no JS
 * loop, so it costs almost nothing and respects reduced-motion via globals.
 */
export function Background() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-base"
    >
      {/* deep vertical gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-void via-base to-void" />

      {/* faint grid */}
      <div className="absolute inset-0 bg-grid-faint [background-size:56px_56px] opacity-[0.5] mask-fade-b" />

      {/* aurora blooms */}
      <div className="absolute -left-40 top-[-10%] h-[42rem] w-[42rem] rounded-full bg-emerald-mark/10 blur-[130px] animate-spin-slow" />
      <div className="absolute -right-40 top-[20%] h-[38rem] w-[38rem] rounded-full bg-electric-mark/10 blur-[130px]" />

      {/* subtle noise / scanline via repeating gradient */}
      <div className="absolute inset-0 opacity-[0.035] [background-image:repeating-linear-gradient(0deg,#fff_0px,#fff_1px,transparent_1px,transparent_3px)]" />
    </div>
  );
}
