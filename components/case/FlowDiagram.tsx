import { ChevronRight } from "lucide-react";
import type { FlowNode } from "@/lib/data";

const kindStyle: Record<string, string> = {
  in: "border-electric-accent/40 text-electric-accent",
  core: "border-edge text-ink",
  ai: "border-emerald-accent/50 text-emerald-accent shadow-glow-emerald",
  out: "border-emerald-accent/40 text-emerald-accent",
};

/**
 * Horizontal data-flow pipeline. Rendered statically (always visible — this is
 * flagship content, never gated behind JS): nodes wrap on small screens and the
 * chevron connectors rotate to point down when stacked.
 */
export function FlowDiagram({
  title,
  nodes,
}: {
  title: string;
  nodes: FlowNode[];
}) {
  return (
    <div className="panel p-6">
      <h3 className="font-mono text-2xs uppercase tracking-wider2 text-ink-muted">
        {title}
      </h3>
      <div className="mt-5 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        {nodes.map((n, i) => (
          <div
            key={n.id}
            className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center"
          >
            <div
              className={`relative min-w-[9rem] flex-1 rounded-xl border bg-void/40 px-4 py-3 ${kindStyle[n.kind ?? "core"]}`}
            >
              {n.kind === "ai" && (
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-emerald-accent animate-pulse-dot" />
              )}
              {n.label.split("\n").map((line, j) => (
                <div
                  key={j}
                  className={
                    j === 0
                      ? "font-display text-sm font-semibold"
                      : "mt-0.5 font-mono text-2xs text-ink-muted"
                  }
                >
                  {line}
                </div>
              ))}
            </div>

            {i < nodes.length - 1 && (
              <ChevronRight className="mx-auto h-4 w-4 flex-none rotate-90 text-ink-muted sm:rotate-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
