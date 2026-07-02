"use client";

import { skillGroups } from "@/lib/data";
import { Icon } from "@/lib/icons";
import { SectionHeading } from "./ui/SectionHeading";
import { Reveal, RevealGroup, RevealItem } from "./ui/Reveal";
import { SkillsRadar } from "./SkillsRadar";

export function Skills() {
  return (
    <section id="skills" className="section scroll-mt-24 py-24">
      <SectionHeading
        eyebrow="Capability map"
        title={<>The stack behind the defence</>}
        intro="A T-shaped skill set: deep in threat intelligence and network forensics, broad across offensive testing, secure software, applied AI and cloud. The radar is a self-assessment; the columns are the tools I actually reach for."
      />

      <div className="mt-12 grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
        {/* radar */}
        <Reveal className="panel flex items-center justify-center p-6 lg:sticky lg:top-24 lg:self-start">
          <SkillsRadar />
        </Reveal>

        {/* grouped skills */}
        <RevealGroup className="grid gap-4 sm:grid-cols-2">
          {skillGroups.map((g) => (
            <RevealItem key={g.title}>
              <div className="panel group h-full p-5 transition-colors hover:border-emerald-accent/30">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-lg border border-edge bg-raised text-emerald-accent transition-colors group-hover:text-emerald-glow">
                    <Icon name={g.icon} className="h-4.5 w-4.5" />
                  </span>
                  <h3 className="font-display text-sm font-semibold text-ink">
                    {g.title}
                  </h3>
                </div>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {g.skills.map((s) => (
                    <li key={s} className="chip">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
