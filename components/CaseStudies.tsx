import Link from "next/link";
import { caseStudies, indicators, weaves } from "@/lib/data";
import { EvidenceLookup } from "./EvidenceLookup";
import { Weave, WeaveDefs } from "./work/Weave";
import { WorkMotion } from "./work/WorkMotion";

/**
 * Work (DESIGN.md §11, index list): ten rows on columns 1 to 8. Hovering or focusing a row
 * opens its window in the lattice from column 9 to the margin, and the case's evidence weave
 * shows through it: its own count as lit cells, with a caption saying what one cell is. On
 * phones the weave sits inline and opens at the reading line. Server-rendered; without JS a
 * row's weave shows on hover and focus.
 */
export function CaseStudies() {
  return (
    <section id="work" data-chapter="2" className="work" aria-labelledby="work-title">
      <div className="work__head">
        <h2 id="work-title" className="work__h2" data-split data-quiet>
          Work
        </h2>
        <p className="work__lede" data-reveal="fade" data-quiet>
          Each one is written up like an engagement report: the problem, what I did, the evidence, the
          result and how it was measured, and the limitations.
        </p>
      </div>

      <WeaveDefs />
      <ul className="work__list" data-work>
        {caseStudies.map((c) => {
          const weave = weaves[c.slug];
          return (
            <li key={c.slug} className="work__row" data-row data-slug={c.slug}>
              <span className="work__rule" aria-hidden="true" />
              <div className="work__text" data-quiet="box">
                <h3 className="work__title">
                  <Link href={`/work/${c.slug}`} className="work__link" data-cursor="Open">
                    <span className="work__mask">
                      <span className="work__name">{c.title}</span>
                    </span>
                  </Link>
                </h3>
                <p className="work__tag">{c.tagline}</p>
                <p className="work__meta">
                  <span className="work__ctx">{c.category}</span>
                  {c.year && <span className="work__year">{c.year}</span>}
                </p>
              </div>
              {weave && (
                <figure className="work__fig" data-random={weave.random ? "" : undefined}>
                  <div className="work__frame">
                    <Weave weave={weave} id={c.slug} />
                  </div>
                  <figcaption className="work__cap" data-quiet="shown">
                    {weave.caption}
                  </figcaption>
                </figure>
              )}
            </li>
          );
        })}
      </ul>

      <p className="work__note" data-reveal="fade">
        Nine are university coursework or my final-year project; one is a personal build. Each page
        says which, and links its repo where it’s public.
      </p>
      <EvidenceLookup indicators={indicators} titles={Object.fromEntries(caseStudies.map((c) => [c.slug, c.title]))} />
      <WorkMotion />
    </section>
  );
}
