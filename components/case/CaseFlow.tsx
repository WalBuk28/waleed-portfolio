import type { FlowNode } from "@/lib/data";
import { FLOW_STAGES as STAGES, weaveFill } from "@/components/work/Weave";

/**
 * The A-TIOC pipeline on the lattice (DESIGN.md §14, R4): its parts as cells of the screen, in
 * the order data moves through them, lit a little brighter as they near the analyst's screen.
 * The stages' top edges step at the lattice's 30°, so together they draw the mark's roofline.
 * Real text; the cells are decoration. From the case study's architecture, nothing added; the
 * case's cover draws the same parts (Weave: FlowWeave).
 */
export function CaseFlow({ title, nodes }: { title: string; nodes: FlowNode[] }) {
  return (
    <figure className="flow" aria-labelledby="flow-cap">
      <ol className="flow__stages">
        {STAGES.map((s) => (
          <li key={s.kind} className="flow__stage">
            <span className="flow__kind mono">{s.name}</span>
            <ul className="flow__nodes">
              {nodes
                .filter((n) => (n.kind ?? "core") === s.kind)
                .map((n) => {
                  const [name, detail] = n.label.split("\n");
                  return (
                    <li key={n.id} className="flow__node">
                      <svg className="flow__cell" viewBox="-14 -18 28 36" aria-hidden="true">
                        <polygon points="0,-17 13,-9.5 13,9.5 0,17 -13,9.5 -13,-9.5" fill={weaveFill(s.level)} />
                      </svg>
                      <span className="flow__name">{name}</span>
                      {detail && <span className="flow__detail">{detail}</span>}
                    </li>
                  );
                })}
            </ul>
          </li>
        ))}
      </ol>
      <figcaption id="flow-cap" className="flow__cap">
        {title}, in the order data moves through it.
      </figcaption>
    </figure>
  );
}
