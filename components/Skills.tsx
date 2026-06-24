import { Icon } from "@/components/ui/Icon";
import { Reveal, RevealGroup } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { skillGroups } from "@/lib/data";

export function Skills() {
  return (
    <section id="skills" className="relative py-20 sm:py-28">
      <div className="container-x">
        <SectionHeading
          label="Capabilities"
          title="A full-spectrum security toolkit"
          description="From the offensive edge to defensive automation and the software that ties it together — the stack I use to find, understand and stop threats."
        />

        <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group) => (
            <Reveal as="div" key={group.title}>
              <div className="card group h-full p-6 transition-all duration-300 hover:border-emerald-glow/40 hover:bg-ink-800/60">
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-ink-700 bg-ink-900 text-emerald-glow transition-colors group-hover:border-emerald-glow/40">
                    <Icon name={group.icon} className="h-5 w-5" />
                  </span>
                  <h3 className="text-base font-semibold text-white">
                    {group.title}
                  </h3>
                </div>
                <ul className="flex flex-wrap gap-2">
                  {group.skills.map((s) => (
                    <li
                      key={s}
                      className="rounded-md border border-ink-700/70 bg-ink-900/50 px-2.5 py-1 text-xs text-zinc-400 transition-colors group-hover:text-zinc-300"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
