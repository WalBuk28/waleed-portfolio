import type { KillStage } from "@/lib/data";

/**
 * Vertical, escalating kill-chain. Static (always visible — flagship content).
 * Each stage carries a MITRE technique tag; the severity rail deepens toward
 * "impact" using the status ramp (never a categorical hue), with a text label
 * so it never relies on colour alone.
 */
const railTone = [
  "bg-electric-mark", // recon
  "bg-threat-warnMark", // access
  "bg-threat-warnMark", // pivot
  "bg-threat-critMark", // impact
];

export function KillChain({ stages }: { stages: KillStage[] }) {
  return (
    <div className="panel p-6">
      <h3 className="font-mono text-2xs uppercase tracking-wider2 text-ink-muted">
        Reconstructed kill chain · IT → OT
      </h3>
      <ol className="mt-5 space-y-4">
        {stages.map((s, i) => (
          <li key={s.stage} className="relative flex gap-4">
            {/* rail */}
            <div className="flex flex-col items-center">
              <span
                className={`grid h-9 w-9 flex-none place-items-center rounded-lg font-mono text-xs font-bold text-void ${railTone[i] ?? "bg-electric-mark"}`}
              >
                {s.stage}
              </span>
              {i < stages.length - 1 && (
                <span className="mt-1 w-px flex-1 bg-gradient-to-b from-edge to-transparent" />
              )}
            </div>

            <div className="flex-1 pb-2">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="font-display text-sm font-semibold text-ink">
                  {s.label}
                </h4>
                <span className="chip font-mono text-emerald-accent">
                  {s.technique}
                </span>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-secondary">
                {s.detail}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
