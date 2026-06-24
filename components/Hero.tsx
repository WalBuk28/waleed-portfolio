"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { profile } from "@/lib/data";

const terminalLines = [
  { p: "$", cmd: "whoami", out: profile.fullName },
  { p: "$", cmd: "cat role.txt", out: profile.role },
  { p: "$", cmd: "ls ~/focus", out: "threat-intel  forensics  soc-automation  secure-dev" },
  { p: "$", cmd: "status --availability", out: profile.availability },
];

export function Hero() {
  const [roleIdx, setRoleIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setRoleIdx((i) => (i + 1) % profile.rotatingRoles.length),
      2600
    );
    return () => clearInterval(id);
  }, []);

  return (
    <section id="top" className="relative pt-32 sm:pt-40">
      <div className="container-x grid items-center gap-12 pb-16 lg:grid-cols-[1.05fr_0.95fr] lg:pb-24">
        {/* Left */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-glow/30 bg-emerald-glow/5 px-3.5 py-1.5"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-glow opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-glow" />
            </span>
            <span className="font-mono text-xs text-emerald-glow">
              {profile.availability}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-balance text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            I secure systems
            <br className="hidden sm:block" /> & build the{" "}
            <span className="text-gradient-emerald">tools</span> that defend them.
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mt-5 flex items-center gap-2 font-mono text-base text-zinc-400 sm:text-lg"
          >
            <span className="text-emerald-glow">&gt;</span>
            <span>specialising in</span>
            <span className="relative inline-flex h-7 min-w-[12ch] items-center overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span
                  key={roleIdx}
                  initial={{ y: 18, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -18, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="font-semibold text-white"
                >
                  {profile.rotatingRoles[roleIdx]}
                </motion.span>
              </AnimatePresence>
            </span>
            <span className="inline-block h-5 w-2 animate-blink bg-emerald-glow" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.19 }}
            className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-zinc-400"
          >
            {profile.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.26 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <a href="#contact" className="btn-primary">
              Hire Me
              <Icon name="ArrowRight" className="h-4 w-4" />
            </a>
            <a href="#work" className="btn-ghost">
              View Case Studies
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.34 }}
            className="mt-8 flex items-center gap-4 text-zinc-500"
          >
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-white"
              aria-label="GitHub"
            >
              <Icon name="Github" className="h-5 w-5" />
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-white"
              aria-label="LinkedIn"
            >
              <Icon name="Linkedin" className="h-5 w-5" />
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="transition-colors hover:text-white"
              aria-label="Email"
            >
              <Icon name="Mail" className="h-5 w-5" />
            </a>
            <span className="h-px w-8 bg-ink-700" />
            <span className="inline-flex items-center gap-1.5 text-sm">
              <Icon name="MapPin" className="h-4 w-4" />
              {profile.location}
            </span>
          </motion.div>
        </div>

        {/* Right — terminal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute -inset-4 -z-10 animate-pulse-glow rounded-3xl bg-emerald-glow/10 blur-2xl" />
          <div className="card overflow-hidden shadow-2xl">
            {/* title bar */}
            <div className="flex items-center gap-2 border-b border-ink-700/70 bg-ink-900/80 px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
              <span className="ml-3 flex items-center gap-2 font-mono text-xs text-zinc-500">
                <Icon name="Terminal" className="h-3.5 w-3.5" />
                waleed@soc: ~
              </span>
            </div>
            {/* body */}
            <div className="space-y-3 p-5 font-mono text-[13px] leading-relaxed">
              {terminalLines.map((line, i) => (
                <TermLine key={i} line={line} delay={0.5 + i * 0.5} />
              ))}
              <div className="flex items-center gap-2 pt-1 text-zinc-500">
                <span className="text-emerald-glow">$</span>
                <span className="inline-block h-4 w-2 animate-blink bg-zinc-400" />
              </div>
            </div>
          </div>

          {/* floating stat badges */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1, duration: 0.5 }}
            className="absolute -right-3 -top-4 hidden rounded-xl border border-electric-glow/30 bg-ink-900/90 px-3 py-2 shadow-glow-blue backdrop-blur sm:block"
          >
            <p className="font-mono text-lg font-bold text-electric-glow">100%</p>
            <p className="text-[10px] uppercase tracking-wider text-zinc-500">
              local AI · 0 cloud
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Stat strip */}
      <div className="border-y border-ink-700/60 bg-ink-900/30">
        <div className="container-x grid grid-cols-2 divide-x divide-ink-700/40 sm:grid-cols-4">
          {profile.stats.map((s) => (
            <div key={s.label} className="px-4 py-6 text-center sm:py-8">
              <p className="text-3xl font-bold text-white sm:text-4xl">
                {s.value}
              </p>
              <p className="mt-1 text-xs text-zinc-500 sm:text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TermLine({
  line,
  delay,
}: {
  line: { p: string; cmd: string; out: string };
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.3 }}
    >
      <div className="flex items-center gap-2">
        <span className="text-emerald-glow">{line.p}</span>
        <span className="text-zinc-200">{line.cmd}</span>
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.2, duration: 0.3 }}
        className="pl-4 text-electric-glow/90"
      >
        {line.out}
      </motion.p>
    </motion.div>
  );
}
