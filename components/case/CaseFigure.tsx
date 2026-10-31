import type { Weave as WeaveData } from "@/lib/data";
import { Weave, WeaveDefs } from "@/components/work/Weave";

/**
 * A case page's hero figure (DESIGN.md §11): the case's evidence weave, its own real count as lit
 * cells, in a chamfered frame with the screen's window open behind it (CaseMotion), and the
 * caption that says what one cell is. Until captures of his work arrive, the weave is the
 * honest image: A-TIOC's is marked as a placeholder, and Construct OS shows light only.
 */
export function CaseFigure({ weave, slug }: { weave: WeaveData; slug: string }) {
  const light = !weave.rows.length;
  return (
    <figure className={light ? "case__fig case__fig--light" : "case__fig"} data-case-fig data-random={weave.random ? "" : undefined}>
      <WeaveDefs />
      <div className="case__frame" data-case-frame data-focal>
        <Weave weave={weave} id={`case-${slug}`} />
      </div>
      <figcaption className="case__cap" data-quiet>
        {weave.caption}
      </figcaption>
    </figure>
  );
}
