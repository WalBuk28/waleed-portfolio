"use client";

import { Mail, Linkedin, Github, ArrowUpRight, Copy, Check } from "lucide-react";
import { useState } from "react";
import { profile } from "@/lib/data";
import { Reveal } from "./ui/Reveal";

export function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable — the mailto link still works */
    }
  };

  return (
    <section id="contact" className="section scroll-mt-24 py-24">
      <Reveal>
        <div className="panel relative overflow-hidden p-8 sm:p-12">
          {/* ambient glow */}
          <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-emerald-mark/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-electric-mark/15 blur-3xl" />

          <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <span className="eyebrow">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-accent/60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-accent" />
                </span>
                {profile.availability}
              </span>

              <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
                Let’s harden something{" "}
                <span className="grad-text">together.</span>
              </h2>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-ink-secondary">
                I’m looking for Security Engineering, SOC and Threat-Intelligence
                roles where I can analyse the threat and build the tooling that
                answers it. If that’s the kind of person your team needs, let’s
                talk.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a href={`mailto:${profile.email}`} className="btn-primary">
                  <Mail className="h-4 w-4" />
                  Hire me
                </a>
                <button
                  onClick={copyEmail}
                  className="btn-ghost"
                  aria-label="Copy email address"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-accent" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 text-electric-accent" />
                      Copy email
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* contact channels */}
            <div className="grid gap-3">
              <ContactRow
                icon={<Mail className="h-4.5 w-4.5" />}
                label="Email"
                value={profile.email}
                href={`mailto:${profile.email}`}
              />
              <ContactRow
                icon={<Linkedin className="h-4.5 w-4.5" />}
                label="LinkedIn"
                value="Syed Muhammad Waleed Bukhari"
                href={profile.linkedin}
              />
              <ContactRow
                icon={<Github className="h-4.5 w-4.5" />}
                label="GitHub"
                value={`@${profile.handle}`}
                href={profile.github}
              />
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function ContactRow({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
}) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      className="group flex items-center gap-4 rounded-xl border border-edge bg-void/40 p-4 transition-all hover:border-emerald-accent/40 hover:bg-raised"
    >
      <span className="grid h-10 w-10 flex-none place-items-center rounded-lg border border-edge bg-surface text-emerald-accent">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <div className="font-mono text-2xs uppercase tracking-wider2 text-ink-muted">
          {label}
        </div>
        <div className="truncate text-sm text-ink">{value}</div>
      </div>
      <ArrowUpRight className="h-4 w-4 flex-none text-ink-muted transition-colors group-hover:text-emerald-accent" />
    </a>
  );
}
