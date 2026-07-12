import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, ExternalLink, Github } from "lucide-react";
import { caseStudies } from "@/lib/data";
import { Icon } from "@/lib/icons";
import { Background } from "@/components/Background";
import { SiteChrome } from "@/components/SiteChrome";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/ui/Reveal";
import { FlowDiagram } from "@/components/case/FlowDiagram";
import { KillChain } from "@/components/case/KillChain";

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
  return {
    title: study.title,
    description: study.summary,
    openGraph: { title: study.title, description: study.summary },
  };
}

const accentText: Record<string, string> = {
  emerald: "text-emerald-accent",
  electric: "text-electric-accent",
};

export default async function WorkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = caseStudies.find((c) => c.slug === slug);
  if (!study) notFound();

  const idx = caseStudies.findIndex((c) => c.slug === slug);
  const next = caseStudies[(idx + 1) % caseStudies.length];

  return (
    <>
      <Background />
      <SiteChrome />
      <main id="main" className="pt-24">
        <article className="section pb-16">
          {/* back */}
          <Reveal>
            <Link
              href="/#work"
              className="inline-flex items-center gap-2 font-mono text-2xs text-ink-muted transition-colors hover:text-emerald-accent"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              All work
            </Link>
          </Reveal>

          {/* header */}
          <header className="mt-6 border-b border-edge pb-10">
            <Reveal>
              <div className="flex items-center gap-3">
                <span
                  className={`grid h-12 w-12 place-items-center rounded-xl border border-edge bg-raised ${accentText[study.accent]}`}
                >
                  <Icon name={study.icon} className="h-6 w-6" />
                </span>
                <div className="font-mono text-2xs uppercase tracking-wider2 text-ink-muted">
                  <div>{study.category}</div>
                  <div className="mt-0.5 text-ink-secondary">{study.year}</div>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="mt-6 max-w-3xl text-3xl font-bold leading-tight sm:text-5xl">
                {study.title}
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-4 max-w-2xl text-lg text-ink-secondary">
                {study.tagline}
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-6 flex flex-wrap items-center gap-2">
                {study.tags.map((t) => (
                  <span key={t} className="chip">
                    {t}
                  </span>
                ))}
                {study.demo && (
                  <a
                    href={study.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1.5 rounded-full border border-emerald-accent/30 px-3 py-1 font-mono text-2xs ${accentText[study.accent]} transition-colors hover:bg-emerald-accent/10`}
                  >
                    Live <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                {study.repo && (
                  <a
                    href={study.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-edge px-3 py-1 font-mono text-2xs text-ink-secondary transition-colors hover:border-ink-muted hover:text-ink"
                  >
                    <Github className="h-3 w-3" /> Code
                  </a>
                )}
              </div>
            </Reveal>
          </header>

          {/* metrics */}
          <Reveal>
            <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-edge bg-edge lg:grid-cols-4">
              {study.metrics.map((m) => (
                <div key={m.label} className="bg-surface/80 px-5 py-6">
                  <div
                    className={`font-display text-2xl font-bold sm:text-3xl ${accentText[study.accent]}`}
                  >
                    {m.value}
                  </div>
                  <div className="mt-1.5 text-xs font-medium text-ink">
                    {m.label}
                  </div>
                  {m.sub && (
                    <div className="mt-0.5 text-2xs text-ink-muted">{m.sub}</div>
                  )}
                </div>
              ))}
            </div>
          </Reveal>

          {/* overview grid */}
          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            <Reveal className="lg:col-span-2">
              <div className="space-y-6">
                <Block label="Context" body={study.context} />
                <Block label="The problem" body={study.problem} />
                <Block label="My approach" body={study.approach} />
              </div>
            </Reveal>

            <Reveal delay={0.05}>
              <aside className="panel h-fit p-5 lg:sticky lg:top-24">
                <h3 className="font-mono text-2xs uppercase tracking-wider2 text-ink-muted">
                  Stack & tooling
                </h3>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {study.stack.map((s) => (
                    <li key={s} className="chip">
                      {s}
                    </li>
                  ))}
                </ul>
              </aside>
            </Reveal>
          </div>

          {/* visualisations */}
          {(study.architecture || study.killChain) && (
            <div className="mt-12 space-y-6">
              {study.architecture && (
                <Reveal>
                  <FlowDiagram
                    title={study.architecture.title}
                    nodes={study.architecture.nodes}
                  />
                </Reveal>
              )}
              {study.killChain && (
                <Reveal>
                  <KillChain stages={study.killChain} />
                </Reveal>
              )}
            </div>
          )}

          {/* deep-dive sections */}
          <div className="mt-12 space-y-8">
            {study.sections.map((s, i) => (
              <Reveal key={s.heading} delay={i * 0.03}>
                <div className="grid gap-3 border-t border-edge pt-8 lg:grid-cols-[0.3fr_0.7fr]">
                  <h3 className="font-display text-lg font-semibold text-ink">
                    {s.heading}
                  </h3>
                  <div>
                    <p className="text-base leading-relaxed text-ink-secondary">
                      {s.body}
                    </p>
                    {s.bullets && (
                      <ul className="mt-4 space-y-2">
                        {s.bullets.map((b) => (
                          <li
                            key={b}
                            className="flex gap-2.5 text-sm leading-relaxed text-ink-secondary"
                          >
                            <span
                              className={`mt-2 h-1 w-1 flex-none rounded-full ${study.accent === "emerald" ? "bg-emerald-accent" : "bg-electric-accent"}`}
                            />
                            {b}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* outcome */}
          <Reveal>
            <div className="panel mt-12 p-6 sm:p-8">
              <h3 className="eyebrow">
                <span className="h-1 w-1 rounded-full bg-emerald-accent" />
                Outcome
              </h3>
              <p className="mt-4 text-lg leading-relaxed text-ink">
                {study.outcome}
              </p>
            </div>
          </Reveal>

          {/* next + CTA */}
          <div className="mt-12 flex flex-col items-start justify-between gap-6 border-t border-edge pt-8 sm:flex-row sm:items-center">
            <Link
              href={`/work/${next.slug}`}
              className="group inline-flex items-center gap-3"
            >
              <span className="font-mono text-2xs uppercase tracking-wider2 text-ink-muted">
                Next case study
                <span className="mt-1 block font-sans text-base font-semibold normal-case tracking-normal text-ink transition-colors group-hover:text-emerald-accent">
                  {next.title}
                </span>
              </span>
              <ArrowUpRight className="h-5 w-5 text-ink-muted transition-colors group-hover:text-emerald-accent" />
            </Link>
            <Link href="/#contact" className="btn-primary">
              Hire me
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}

function Block({ label, body }: { label: string; body: string }) {
  return (
    <div>
      <h3 className="font-mono text-2xs uppercase tracking-wider2 text-ink-muted">
        {label}
      </h3>
      <p className="mt-3 text-base leading-relaxed text-ink-secondary">
        {body}
      </p>
    </div>
  );
}
