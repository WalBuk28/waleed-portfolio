"use client";

import { Briefcase, GraduationCap, Award } from "lucide-react";
import {
  experience,
  certifications,
  education,
} from "@/lib/data";
import { SectionHeading } from "./ui/SectionHeading";
import { Reveal, RevealGroup, RevealItem } from "./ui/Reveal";

export function Experience() {
  return (
    <section id="experience" className="section scroll-mt-24 py-24">
      <SectionHeading
        eyebrow="Track record"
        title="Experience & credentials"
        intro="Hands-on security work across industry programs, backed by a cybersecurity degree and professional certifications."
      />

      <div className="mt-12 grid gap-12 lg:grid-cols-[1.3fr_0.7fr] lg:gap-14">
        {/* Timeline */}
        <div>
          <div className="mb-6 flex items-center gap-2 font-mono text-2xs uppercase tracking-wider2 text-ink-muted">
            <Briefcase className="h-3.5 w-3.5 text-emerald-accent" />
            Professional experience
          </div>

          <RevealGroup className="relative space-y-6 border-l border-edge pl-6">
            {experience.map((job) => (
              <RevealItem key={job.company + job.role}>
                <div className="relative">
                  {/* node */}
                  <span className="absolute -left-[31px] top-1.5 grid h-4 w-4 place-items-center rounded-full border border-emerald-accent/40 bg-base">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-accent" />
                  </span>

                  <div className="panel p-5">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                      <h3 className="font-display text-base font-semibold text-ink">
                        {job.role}
                      </h3>
                      <span className="font-mono text-2xs text-ink-muted">
                        {job.period}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-ink-secondary">
                      <span className="text-emerald-accent">{job.company}</span>
                      <span className="text-ink-muted">·</span>
                      <span className="text-ink-muted">{job.location}</span>
                      <span className="chip ml-1">{job.kind}</span>
                    </div>
                    <ul className="mt-3 space-y-1.5">
                      {job.points.map((p) => (
                        <li
                          key={p}
                          className="flex gap-2 text-sm leading-relaxed text-ink-secondary"
                        >
                          <span className="mt-2 h-1 w-1 flex-none rounded-full bg-electric-accent" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        {/* Education + certs */}
        <div className="space-y-8">
          <Reveal>
            <div className="mb-6 flex items-center gap-2 font-mono text-2xs uppercase tracking-wider2 text-ink-muted">
              <GraduationCap className="h-3.5 w-3.5 text-electric-accent" />
              Education
            </div>
            <div className="panel p-5">
              <h3 className="font-display text-base font-semibold text-ink">
                {education.degree}
              </h3>
              <p className="mt-1 text-sm text-electric-accent">
                {education.school}
              </p>
              <p className="mt-2 text-sm text-ink-secondary">
                {education.result}
              </p>
              <p className="mt-1 font-mono text-2xs text-ink-muted">
                {education.period}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="mb-6 flex items-center gap-2 font-mono text-2xs uppercase tracking-wider2 text-ink-muted">
              <Award className="h-3.5 w-3.5 text-emerald-accent" />
              Certifications
            </div>
            <div className="space-y-2.5">
              {certifications.map((c) => (
                <div
                  key={c.name}
                  className="panel p-4 transition-colors hover:border-emerald-accent/30"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <h4 className="text-sm font-semibold text-ink">{c.name}</h4>
                    <span className="whitespace-nowrap font-mono text-2xs text-ink-muted">
                      {c.date}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-emerald-accent">
                    {c.issuer}
                  </p>
                  {c.detail && (
                    <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">
                      {c.detail}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
