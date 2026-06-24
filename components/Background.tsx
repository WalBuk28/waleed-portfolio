export function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* base */}
      <div className="absolute inset-0 bg-ink-950" />
      {/* animated grid */}
      <div className="grid-bg grid-bg-fade absolute inset-0 animate-grid-pan opacity-70" />
      {/* emerald glow top-left */}
      <div className="glow-emerald absolute -left-40 -top-40 h-[34rem] w-[34rem] animate-pulse-glow rounded-full" />
      {/* electric glow right */}
      <div className="glow-electric absolute -right-40 top-1/3 h-[30rem] w-[30rem] animate-pulse-glow rounded-full [animation-delay:2s]" />
      {/* bottom vignette */}
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-ink-950 to-transparent" />
    </div>
  );
}
