import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Reveal, RevealGroup } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { caseStudies, type CaseStudy } from "@/lib/data";

export function CaseStudies() {
  const [hero, ...rest] = caseStudies;

  return (
    <section id="work" className="relative py-20 sm:py-28">
      <div className="container-x">
        <SectionHeading
          label="Selected Work"
          title="Case studies, end to end"
          description="Real coursework, internships and a final-year project — each one a complete loop from problem to engineered outcome. Click any card for the deep dive."
        />

        <div className="mt-12 space-y-5">
          <Reveal>
            <FeaturedCard study={hero} />
          </Reveal>

          <RevealGroup className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((study) => (
              <Reveal as="div" key={study.slug}>
                <CompactCard study={study} />
              </Reveal>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}

function accentClasses(accent: CaseStudy["accent"]) {
  return accent === "emerald"
    ? {
        text: "text-emerald-glow",
        border: "hover:border-emerald-glow/50",
        chipBorder: "border-emerald-glow/30",
        iconBg: "border-emerald-glow/40 bg-emerald-glow/10 text-emerald-glow",
        glow: "group-hover:shadow-glow",
      }
    : {
        text: "text-electric-glow",
        border: "hover:border-electric-glow/50",
        chipBorder: "border-electric-glow/30",
        iconBg: "border-electric-glow/40 bg-electric-glow/10 text-electric-glow",
        glow: "group-hover:shadow-glow-blue",
      };
}

function FeaturedCard({ study }: { study: CaseStudy }) {
  const a = accentClasses(study.accent);
  return (
    <Link
      href={`/work/${study.slug}`}
      className={`card group relative block overflow-hidden p-6 transition-all duration-300 sm:p-8 ${a.border}`}
    >
      <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <span
              className={`flex h-12 w-12 items-center justify-center rounded-xl border ${a.iconBg}`}
            >
              <Icon name={study.icon} className="h-6 w-6" />
            </span>
            <div>
              <span className={`chip ${a.chipBorder}`}>
                <Icon name="Sparkles" className="h-3 w-3" />
                Flagship · Final-Year Project
              </span>
            </div>
          </div>

          <h3 className="mt-5 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {study.title}
          </h3>
          <p className={`mt-1.5 font-mono text-sm ${a.text}`}>{study.tagline}</p>
          <p className="mt-4 max-w-xl text-pretty leading-relaxed text-zinc-400">
            {study.summary}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {study.tags.map((t) => (
              <span key={t} className="chip">
                {t}
              </span>
            ))}
          </div>

          <span
            className={`mt-7 inline-flex items-center gap-2 text-sm font-semibold ${a.text}`}
          >
            Read the full case study
            <Icon
              name="ArrowRight"
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
            />
          </span>
        </div>

        {/* metrics */}
        <div className="grid grid-cols-2 gap-3 self-center">
          {study.metrics.map((m) => (
            <div
              key={m.label}
              className="rounded-xl border border-ink-700/70 bg-ink-900/50 p-4"
            >
              <p className={`text-2xl font-bold ${a.text}`}>{m.value}</p>
              <p className="mt-1 text-xs font-medium text-zinc-300">{m.label}</p>
              {m.sub && (
                <p className="mt-0.5 text-[11px] leading-snug text-zinc-500">
                  {m.sub}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
}

function CompactCard({ study }: { study: CaseStudy }) {
  const a = accentClasses(study.accent);
  return (
    <Link
      href={`/work/${study.slug}`}
      className={`card group flex h-full flex-col p-6 transition-all duration-300 hover:bg-ink-800/50 ${a.border}`}
    >
      <div className="flex items-start justify-between">
        <span
          className={`flex h-11 w-11 items-center justify-center rounded-xl border ${a.iconBg}`}
        >
          <Icon name={study.icon} className="h-5 w-5" />
        </span>
        <Icon
          name="ArrowUpRight"
          className="h-5 w-5 text-zinc-600 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-zinc-300"
        />
      </div>

      <p className="mt-5 font-mono text-[11px] uppercase tracking-wider text-zinc-500">
        {study.category}
      </p>
      <h3 className="mt-1.5 text-lg font-semibold text-white">{study.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-400">
        {study.summary}
      </p>

      {/* headline metric */}
      <div className="mt-5 flex items-end gap-4 border-t border-ink-700/60 pt-4">
        <div>
          <p className={`text-xl font-bold ${a.text}`}>{study.metrics[0].value}</p>
          <p className="text-[11px] text-zinc-500">{study.metrics[0].label}</p>
        </div>
        <div className="ml-auto flex flex-wrap justify-end gap-1.5">
          {study.tags.slice(0, 2).map((t) => (
            <span
              key={t}
              className="rounded-md border border-ink-700/70 bg-ink-900/50 px-2 py-0.5 text-[10px] text-zinc-500"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
