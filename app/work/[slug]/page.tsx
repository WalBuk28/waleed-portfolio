import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { caseStudies, profile, weaves } from "@/lib/data";
import { Frame } from "@/components/frame/Frame";
import { Palette } from "@/components/frame/Palette";
import { Footer } from "@/components/Footer";
import { CaseFigure } from "@/components/case/CaseFigure";
import { CaseMotion } from "@/components/case/CaseMotion";
import { CaseFlow } from "@/components/case/CaseFlow";
import { AttackFigure } from "@/components/case/AttackFigure";
import { posterTile } from "@/components/screen/poster";
import { paletteItems } from "@/lib/palette";

export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = caseStudies.find((c) => c.slug === slug);
  if (!study) return { title: "Case study not found" };
  const path = `/work/${study.slug}`;
  return {
    title: study.title,
    description: study.description,
    // The page's own tags, not the site-wide security keywords.
    keywords: [...study.tags, profile.name, profile.cvName],
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      url: path,
      siteName: "WalSec",
      title: study.title,
      description: study.description,
    },
    twitter: {
      card: "summary_large_image",
      title: study.title,
      description: study.description,
    },
  };
}

/** Display titles never break at a hyphen ("A-TIOC"): such words are kept whole. */
const keepWhole = (title: string) =>
  title.split(" ").map((w, i) => (
    <span key={i}>
      {i > 0 && " "}
      {w.includes("-") ? <span className="nowrap">{w}</span> : w}
    </span>
  ));

const repoName = (url: string) => url.replace(/^https:\/\/github\.com\//, "github.com/");

/**
 * A case study (DESIGN.md §11), written up like an engagement report, in the order the content
 * rules set: the problem, what he did, the evidence, the result, its limitations, the links.
 * Server-rendered and complete without JavaScript. The page holds its own screen, seeded from
 * the slug (data-screen="case"), with a window open behind the hero figure; each section names
 * itself to the frame's bottom-left label (data-label).
 */
export default async function WorkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const idx = caseStudies.findIndex((c) => c.slug === slug);
  if (idx < 0) notFound();
  const study = caseStudies[idx];
  const next = caseStudies[(idx + 1) % caseStudies.length];
  const weave = weaves[study.slug];
  const limits = study.sections.filter((s) => s.heading === "Limitations");
  const details = study.sections.filter((s) => s.heading !== "Limitations");

  return (
    <div
      className="screen-page case-page"
      data-screen="case"
      data-seed={study.slug}
      style={{ "--poster-tile": posterTile() } as CSSProperties}
    >
      <Frame page="case" label="Case study" />
      <Palette items={paletteItems()} />
      <main id="main" tabIndex={-1}>
        <article className="case" aria-labelledby="case-title">
          <header className="case__head" data-label="Case study">
            <p className="case__back">
              <Link className="ulink" href="/#work" data-quiet>
                <span className="ulink__arrow ulink__arrow--back" aria-hidden="true">
                  ←
                </span>
                All work
              </Link>
            </p>
            <h1 id="case-title" className="case__h1" data-quiet>
              {keepWhole(study.title)}
            </h1>
            <p className="case__tagline" data-reveal="fade" data-intro data-quiet>
              {study.tagline}
            </p>
            <dl className="case__meta" data-reveal="fade" data-intro data-delay="0.1" data-quiet>
              <div>
                <dt>Context</dt>
                <dd>{study.category}</dd>
              </div>
              {study.year && (
                <div>
                  <dt>Year</dt>
                  <dd>{study.year}</dd>
                </div>
              )}
              <div>
                <dt>{study.repos && study.repos.length > 1 ? "Repositories" : "Repository"}</dt>
                <dd>
                  {study.repos?.length
                    ? study.repos.map((r) => (
                        <a key={r} className="ilink" href={r} target="_blank" rel="noopener noreferrer">
                          {repoName(r)}
                        </a>
                      ))
                    : (study.repoNote ?? "None public")}
                </dd>
              </div>
            </dl>
            {weave && <CaseFigure weave={weave} slug={study.slug} />}
          </header>

          <Section id="problem" label="Problem" title="Problem">
            <p className="case__lead" data-reveal="fade">
              {study.problem}
            </p>
            <p data-reveal="fade">
              {study.context}
            </p>
          </Section>

          <Section id="what-i-did" label="What I did" title="What I did">
            <p className="case__lead" data-reveal="fade">
              {study.approach}
            </p>
            {details.map((d) => (
              <div key={d.heading} className="case__detail">
                <h3 className="case__h3">
                  {d.heading}
                </h3>
                <p data-reveal="fade">
                  {d.body}
                </p>
                {d.bullets && (
                  <ul className="case__list" data-reveal="fade">
                    {d.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </Section>

          <Section id="evidence" label="Evidence" title="Evidence">
            {study.evidenceNote && (
              <p className="case__lead" data-reveal="fade">
                {study.evidenceNote}
              </p>
            )}
            {study.metrics.length > 0 && (
              <dl className="case__facts">
                {study.metrics.map((m) => (
                  <div key={m.label} className="case__fact">
                    <dt>{m.label}</dt>
                    <dd className="case__value">{m.value}</dd>
                    {m.sub && <dd className="case__method">{m.sub}</dd>}
                  </div>
                ))}
              </dl>
            )}
            {study.architecture && <CaseFlow title={study.architecture.title} nodes={study.architecture.nodes} />}
            <div className="case__stack">
              <h3 className="case__h3">
                Stack and tools
              </h3>
              <ul className="case__tags mono">
                {study.stack.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          </Section>

          {/* Full width, outside Evidence's sticky heading: the matrix needs every column. */}
          {study.killChain && (
            <div className="case__wide" data-label="Evidence">
              <AttackFigure stages={study.killChain} />
            </div>
          )}

          <Section id="result" label="Result" title="Result">
            <p className="case__lead" data-reveal="fade">
              {study.outcome}
            </p>
          </Section>

          {limits.length > 0 && (
            <Section id="limitations" label="Limitations" title="Limitations">
              {limits.map((l) => (
                <p key={l.body} data-reveal="fade">
                  {l.body}
                </p>
              ))}
            </Section>
          )}

          <Section id="links" label="Links" title="Links">
            <ul className="case__links">
              {study.repos?.map((r) => (
                <li key={r}>
                  <a className="ulink" href={r} target="_blank" rel="noopener noreferrer">
                    {repoName(r)}
                    <span className="ulink__arrow ulink__arrow--out" aria-hidden="true">
                      ↗
                    </span>
                  </a>
                </li>
              ))}
              {study.demo && (
                <li>
                  <a className="ulink" href={study.demo} target="_blank" rel="noopener noreferrer">
                    Live demo
                    <span className="ulink__arrow ulink__arrow--out" aria-hidden="true">
                      ↗
                    </span>
                  </a>
                </li>
              )}
              <li>
                <Link className="ulink" href="/#work">
                  All work
                  <span className="ulink__arrow ulink__arrow--back" aria-hidden="true">
                    ←
                  </span>
                </Link>
              </li>
            </ul>
            <a className="btn btn--primary case__cta" href={`mailto:${profile.email}`} data-magnetic data-cursor-fill>
              <span className="btn__shape" aria-hidden="true" />
              Email me
              <span className="btn__arrow" aria-hidden="true">
                →
              </span>
            </a>
          </Section>
        </article>

        <nav className="case__next" aria-label="Next case study" data-label="Next">
          <Link className="case__nextlink" href={`/work/${next.slug}`} data-cursor="Open">
            <span className="case__nextlabel mono">Next case study</span>
            <span className="case__nextmask">
              <span className="case__nexttitle" data-quiet>
                {next.title}
                {/* the arrow follows the last word */}
                <span className="case__nextarrow" aria-hidden="true">
                  →
                </span>
              </span>
            </span>
          </Link>
        </nav>
      </main>
      <Footer />
      <CaseMotion />
    </div>
  );
}

function Section({ id, label, title, children }: { id: string; label: string; title: string; children: React.ReactNode }) {
  return (
    <section className="case__sec" data-label={label} aria-labelledby={id}>
      <h2 id={id} className="case__h2" data-split data-quiet="sticky">
        {title}
      </h2>
      {/* One quiet box for the whole text column: the screen's light stays out of it, and it
          costs one of the shader's sixteen quiet rects, not one per paragraph. */}
      <div className="case__body" data-quiet="box">
        {children}
      </div>
    </section>
  );
}
