"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { profile } from "@/lib/data";

export function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <section id="contact" className="relative py-20 sm:py-28">
      <div className="container-x">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="card relative overflow-hidden p-8 text-center sm:p-14"
        >
          {/* glow */}
          <div className="glow-emerald pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full" />

          <span className="section-label justify-center">
            <span className="h-px w-6 bg-emerald-glow/60" />
            Let&apos;s build a safer system
          </span>

          <h2 className="mx-auto mt-5 max-w-2xl text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Looking for a security engineer who can{" "}
            <span className="text-gradient-emerald">defend and build?</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty leading-relaxed text-zinc-400">
            I&apos;m open to Security Engineering, SOC and Threat-Intelligence roles.
            Let&apos;s talk about how I can strengthen your team.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <a href={`mailto:${profile.email}`} className="btn-primary">
              <Icon name="Mail" className="h-4 w-4" />
              Hire Me
            </a>
            <button onClick={copyEmail} className="btn-ghost">
              <Icon name={copied ? "Check" : "Copy"} className="h-4 w-4" />
              {copied ? "Copied!" : profile.email}
            </button>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-zinc-400">
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 transition-colors hover:text-white"
            >
              <Icon name="Linkedin" className="h-4 w-4" />
              LinkedIn
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 transition-colors hover:text-white"
            >
              <Icon name="Github" className="h-4 w-4" />
              GitHub
            </a>
            <a
              href={`tel:${profile.phone.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-2 transition-colors hover:text-white"
            >
              <Icon name="Phone" className="h-4 w-4" />
              {profile.phone}
            </a>
            <span className="inline-flex items-center gap-2">
              <Icon name="MapPin" className="h-4 w-4" />
              {profile.location}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
