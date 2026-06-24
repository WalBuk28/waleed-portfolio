import { Icon } from "@/components/ui/Icon";
import { Reveal, RevealGroup } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { certifications, education, profile } from "@/lib/data";

export function About() {
  return (
    <section id="about" className="relative py-20 sm:py-28">
      <div className="container-x grid gap-12 lg:grid-cols-[1fr_1fr]">
        {/* Left: bio + education */}
        <div>
          <SectionHeading label="About" title="Engineer first, defender always" />
          <Reveal delay={2}>
            <p className="mt-6 text-pretty text-base leading-relaxed text-zinc-400">
              {profile.summary}
            </p>
          </Reveal>

          <Reveal delay={3}>
            <div className="mt-8 card flex items-start gap-4 p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-glow/40 bg-emerald-glow/10 text-emerald-glow">
                <Icon name="GraduationCap" className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-semibold text-white">{education.degree}</h3>
                <p className="text-sm text-zinc-400">{education.school}</p>
                <p className="mt-1 font-mono text-xs text-emerald-glow">
                  {education.result} · {education.period}
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Right: certifications */}
        <div>
          <SectionHeading label="Certifications" title="Credentials & continuous learning" />
          <RevealGroup className="mt-6 grid gap-3 sm:grid-cols-2">
            {certifications.map((c) => (
              <Reveal as="div" key={c.name}>
                <div className="card group flex h-full items-start gap-3 p-4 transition-colors hover:border-electric-glow/30">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-ink-700 bg-ink-900 text-electric-glow">
                    <Icon name="Award" className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold leading-snug text-zinc-100">
                      {c.name}
                    </h3>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      {c.issuer} ·{" "}
                      <span
                        className={
                          c.date === "In Progress"
                            ? "text-electric-glow/80"
                            : "text-zinc-400"
                        }
                      >
                        {c.date}
                      </span>
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
