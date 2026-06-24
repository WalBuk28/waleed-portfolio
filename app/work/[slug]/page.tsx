import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Background } from "@/components/Background";
import { Footer } from "@/components/Footer";
import { Icon } from "@/components/ui/Icon";
import { Reveal, RevealGroup } from "@/components/ui/Reveal";
import { caseStudies, profile, type CaseStudy } from "@/lib/data";

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const study = caseStudies.find((c) => c.slug === params.slug);
  if (!study) return { title: "Case study not found" };
  return {
    title: study.title,
    description: study.summary,
    openGraph: { title: study.title, description: study.summary },
  };
}

function accent(a: CaseStudy["accent"]) {
  return a === "emerald"
    ? {
        text: "text-emerald-glow",
        ring: "border-emerald-glow/40 bg-emerald-glow/10 text-emerald-glow",
        bar: "bg-emerald-glow",
      }
    : {
        text: "text-electric-glow",
        ring: "border-electric-glow/40 bg-electric-glow/10 text-electric-glow",
        bar: "bg-electric-glow",
      };
}

export default function CaseStudyPage({
  params,
}: {
  params: { slug: string };
}) {
  const idx = caseStudies.findIndex((c) => c.slug === params.slug);
  const study = caseStudies[idx];
  if (!study) notFound();

  const a = accent(study.accent);
  const next = caseStudies[(idx + 1) % caseStudies.length];

  return (
    <>
      <Background />

      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-ink-700/60 bg-ink-950/80 backdrop-blur-xl">
        <div className="container-x flex h-16 items-center justify-between">
          <Link
            href="/#work"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white"
          >
            <Icon name="ArrowRight" className="h-4 w-4 rotate-180" />
            All work
          </Link>
          <Link href="/#contact" className="btn-primary">
            Hire Me
            <Icon name="ArrowUpRight" className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <main className="container-x py-14 sm:py-20">
        {/* Hero */}
        <Reveal>
          <div className="flex items-center gap-4">
            <span
              className={`flex h-14 w-14 items-center justify-center rounded-2xl border ${a.ring}`}
            >
              <Icon name={study.icon} className="h-7 w-7" />
            </span>
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
                {study.category}
              </p>
              <p className={`font-mono text-xs ${a.text}`}>{study.year}</p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={1}>
          <h1 className="mt-6 max-w-4xl text-balance text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl">
            {study.title}
          </h1>
        </Reveal>
        <Reveal delay={2}>
          <p className={`mt-3 font-mono text-base ${a.text}`}>{study.tagline}</p>
        </Reveal>
        <Reveal delay={3}>
          <p className="mt-6 max-w-3xl text-pretty text-lg leading-relaxed text-zinc-300">
            {study.context}
          </p>
        </Reveal>

        {/* Tags */}
        <Reveal delay={4}>
          <div className="mt-6 flex flex-wrap gap-2">
            {study.tags.map((t) => (
              <span key={t} className="chip">
                {t}
              </span>
            ))}
          </div>
        </Reveal>

        {/* Metrics */}
        <RevealGroup className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {study.metrics.map((m) => (
            <Reveal as="div" key={m.label}>
              <div className="card h-full p-5">
                <p className={`text-3xl font-bold ${a.text}`}>{m.value}</p>
                <p className="mt-2 text-sm font-medium text-zinc-200">
                  {m.label}
                </p>
                {m.sub && (
                  <p className="mt-1 text-xs leading-snug text-zinc-500">
                    {m.sub}
                  </p>
                )}
              </div>
            </Reveal>
          ))}
        </RevealGroup>

        {/* Problem & Approach */}
        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          <Reveal>
            <div className="card h-full p-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                <Icon name="Target" className={`h-5 w-5 ${a.text}`} />
                The Problem
              </h2>
              <p className="mt-3 leading-relaxed text-zinc-400">
                {study.problem}
              </p>
            </div>
          </Reveal>
          <Reveal delay={1}>
            <div className="card h-full p-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                <Icon name="Layers" className={`h-5 w-5 ${a.text}`} />
                My Approach
              </h2>
              <p className="mt-3 leading-relaxed text-zinc-400">
                {study.approach}
              </p>
            </div>
          </Reveal>
        </div>

        {/* Stack */}
        <Reveal>
          <div className="mt-5 card p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
              <Icon name="Cpu" className={`h-5 w-5 ${a.text}`} />
              Stack & Techniques
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {study.stack.map((s) => (
                <span
                  key={s}
                  className="rounded-lg border border-ink-700/70 bg-ink-900/50 px-3 py-1.5 font-mono text-xs text-zinc-300"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Deep-dive sections */}
        <div className="mt-14">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Inside the work
          </h2>
          <div className="mt-6 space-y-4">
            {study.sections.map((sec, i) => (
              <Reveal as="div" key={sec.heading} delay={i}>
                <div className="card relative overflow-hidden p-6 sm:p-7">
                  <span
                    className={`absolute left-0 top-0 h-full w-1 ${a.bar} opacity-70`}
                  />
                  <div className="flex items-start gap-4">
                    <span
                      className={`mt-0.5 font-mono text-sm font-bold ${a.text}`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">
                        {sec.heading}
                      </h3>
                      <p className="mt-2 leading-relaxed text-zinc-400">
                        {sec.body}
                      </p>
                      {sec.bullets && (
                        <ul className="mt-4 space-y-2">
                          {sec.bullets.map((b) => (
                            <li
                              key={b}
                              className="flex gap-2.5 text-sm leading-relaxed text-zinc-400"
                            >
                              <Icon
                                name="ChevronRight"
                                className={`mt-0.5 h-4 w-4 shrink-0 ${a.text}`}
                              />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Outcome */}
        <Reveal>
          <div className="mt-14 card overflow-hidden p-7 sm:p-9">
            <div className="glow-emerald pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full opacity-50" />
            <h2 className="flex items-center gap-2 text-xl font-bold text-white">
              <Icon name="Zap" className={`h-5 w-5 ${a.text}`} />
              Outcome & Impact
            </h2>
            <p className="mt-3 max-w-3xl text-pretty text-lg leading-relaxed text-zinc-300">
              {study.outcome}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-zinc-500">
                Tooling:
              </span>
              {study.tools.map((t) => (
                <span key={t} className="chip">
                  <Icon name="Wrench" className="h-3 w-3" />
                  {t}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Next + CTA */}
        <div className="mt-14 grid gap-5 lg:grid-cols-2">
          <Link
            href={`/work/${next.slug}`}
            className="card group flex items-center justify-between p-6 transition-colors hover:border-emerald-glow/40"
          >
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
                Next case study
              </p>
              <p className="mt-1 text-lg font-semibold text-white">
                {next.title}
              </p>
            </div>
            <Icon
              name="ArrowRight"
              className="h-6 w-6 text-zinc-500 transition-all group-hover:translate-x-1 group-hover:text-emerald-glow"
            />
          </Link>

          <div className="card flex flex-col items-start justify-center p-6">
            <p className="text-lg font-semibold text-white">
              Want this on your team?
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              I&apos;m open to security engineering &amp; SOC roles.
            </p>
            <a href={`mailto:${profile.email}`} className="btn-primary mt-4">
              <Icon name="Mail" className="h-4 w-4" />
              Get in touch
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
