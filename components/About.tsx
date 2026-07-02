"use client";

import { ShieldCheck, Cpu, Radar } from "lucide-react";
import { profile } from "@/lib/data";
import { SectionHeading } from "./ui/SectionHeading";
import { Reveal, RevealGroup, RevealItem } from "./ui/Reveal";

const pillars = [
  {
    icon: Radar,
    title: "Analyst instinct",
    body: "I read the wire and the logs first — packets, IOCs and behaviour mapped to MITRE ATT&CK before I touch a tool.",
  },
  {
    icon: Cpu,
    title: "Builder’s hands",
    body: "I ship the software behind the defence: a local LLM SIEM-Lite, ML detectors, C++ security tooling and full-stack products.",
  },
  {
    icon: ShieldCheck,
    title: "Defence that ships",
    body: "Every finding lands with a fix — detection logic, hardening steps and controls a team can act on Monday morning.",
  },
];

export function About() {
  return (
    <section id="about" className="section scroll-mt-24 py-24">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <SectionHeading
          eyebrow="Who I am"
          title={
            <>
              A SOC analyst who can also{" "}
              <span className="grad-text">write the tooling</span>
            </>
          }
          intro={profile.summary}
        />

        <RevealGroup className="grid content-center gap-4">
          {pillars.map((p) => (
            <RevealItem key={p.title}>
              <div className="panel flex gap-4 p-5 transition-colors hover:border-emerald-accent/30">
                <span className="grid h-11 w-11 flex-none place-items-center rounded-xl border border-edge bg-raised text-emerald-accent">
                  <p.icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-display text-base font-semibold text-ink">
                    {p.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-secondary">
                    {p.body}
                  </p>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
