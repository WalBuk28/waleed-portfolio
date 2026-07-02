"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { caseStudies, type CaseStudy } from "@/lib/data";
import { Icon } from "@/lib/icons";
import { SectionHeading } from "./ui/SectionHeading";
import { Reveal } from "./ui/Reveal";

const accentRing: Record<string, string> = {
  emerald: "hover:border-emerald-accent/50 hover:shadow-glow-emerald",
  electric: "hover:border-electric-accent/50 hover:shadow-glow-electric",
};
const accentText: Record<string, string> = {
  emerald: "text-emerald-accent",
  electric: "text-electric-accent",
};
const accentGrad: Record<string, string> = {
  emerald: "from-emerald-mark/20",
  electric: "from-electric-mark/20",
};

function CaseCard({ study, wide }: { study: CaseStudy; wide?: boolean }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      whileHover={reduce ? undefined : { y: -4 }}
      transition={{ duration: 0.25 }}
      className={wide ? "md:col-span-2" : ""}
    >
      <Link
        href={`/work/${study.slug}`}
        className={`panel group relative flex h-full flex-col overflow-hidden p-6 transition-all duration-300 ${accentRing[study.accent]}`}
      >
        {/* corner glow */}
        <div
          className={`pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br ${accentGrad[study.accent]} to-transparent opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100`}
        />

        <div className="flex items-start justify-between gap-4">
          <span
            className={`grid h-11 w-11 place-items-center rounded-xl border border-edge bg-raised ${accentText[study.accent]}`}
          >
            <Icon name={study.icon} className="h-5 w-5" />
          </span>
          <div className="flex items-center gap-2">
            {study.featured && (
              <span className="chip border-emerald-accent/30 text-emerald-accent">
                Featured
              </span>
            )}
            <span className="font-mono text-2xs text-ink-muted">
              {study.year}
            </span>
          </div>
        </div>

        <div className="mt-5 flex-1">
          <span className="font-mono text-2xs uppercase tracking-wider2 text-ink-muted">
            {study.category}
          </span>
          <h3 className="mt-2 font-display text-xl font-semibold text-ink transition-colors group-hover:text-white">
            {study.title}
          </h3>
          <p
            className={`mt-2 text-sm leading-relaxed text-ink-secondary ${wide ? "max-w-2xl" : ""}`}
          >
            {wide ? study.summary : study.tagline}
          </p>
        </div>

        {/* metrics preview on wide card */}
        {wide && (
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {study.metrics.slice(0, 4).map((m) => (
              <div
                key={m.label}
                className="rounded-lg border border-edge bg-void/40 px-3 py-2.5"
              >
                <div
                  className={`font-display text-lg font-bold ${accentText[study.accent]}`}
                >
                  {m.value}
                </div>
                <div className="mt-0.5 text-2xs leading-snug text-ink-muted">
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-5 flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {study.tags.slice(0, wide ? 4 : 3).map((t) => (
              <span key={t} className="chip">
                {t}
              </span>
            ))}
          </div>
          <span
            className={`flex items-center gap-1 whitespace-nowrap text-xs font-semibold ${accentText[study.accent]} opacity-0 transition-opacity group-hover:opacity-100`}
          >
            Case study
            <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

export function CaseStudies() {
  const [flagship, ...rest] = caseStudies;
  return (
    <section id="work" className="section scroll-mt-24 py-24">
      <SectionHeading
        eyebrow="Selected work"
        title={
          <>
            Six deep case studies,{" "}
            <span className="grad-text">not a wall of logos</span>
          </>
        }
        intro="Each project is written up like an engagement report — the problem, the approach, the architecture and the measured result. Click any card for the full breakdown."
      />

      <div className="mt-12 grid gap-5 md:grid-cols-2">
        <CaseCard study={flagship} wide />
        {rest.map((s) => (
          <CaseCard key={s.slug} study={s} />
        ))}
      </div>

      <Reveal className="mt-10 text-center">
        <p className="font-mono text-2xs text-ink-muted">
          All work grounded in real coursework, the WalSec final-year project and
          internship reports.
        </p>
      </Reveal>
    </section>
  );
}
