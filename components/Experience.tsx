import { Icon } from "@/components/ui/Icon";
import { Reveal, RevealGroup } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { experience } from "@/lib/data";

export function Experience() {
  return (
    <section id="experience" className="relative py-20 sm:py-28">
      <div className="container-x">
        <SectionHeading
          label="Experience"
          title="Where I've defended"
          description="Hands-on internships across global enterprises — containing attacks, hardening endpoints and cutting response times."
        />

        <RevealGroup className="mt-12">
          <ol className="relative border-l border-ink-700/70 pl-6 sm:pl-8">
            {experience.map((job) => (
              <Reveal as="li" key={job.company} className="mb-9 last:mb-0">
                <span className="absolute -left-[7px] mt-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-emerald-glow bg-ink-950" />
                <div className="card p-5 transition-colors hover:border-emerald-glow/30 sm:p-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-lg font-semibold text-white">
                      {job.role}{" "}
                      <span className="text-emerald-glow">@ {job.company}</span>
                    </h3>
                    <span className="font-mono text-xs text-zinc-500">
                      {job.period}
                    </span>
                  </div>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-zinc-500">
                    <Icon name="MapPin" className="h-3.5 w-3.5" />
                    {job.location}
                  </p>
                  <ul className="mt-4 space-y-2">
                    {job.points.map((p) => (
                      <li
                        key={p}
                        className="flex gap-2.5 text-sm leading-relaxed text-zinc-400"
                      >
                        <Icon
                          name="CheckCircle2"
                          className="mt-0.5 h-4 w-4 shrink-0 text-emerald-glow/70"
                        />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </ol>
        </RevealGroup>
      </div>
    </section>
  );
}
