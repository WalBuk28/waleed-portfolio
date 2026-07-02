import { Mail, Linkedin, Github, Command } from "lucide-react";
import { profile, navLinks } from "@/lib/data";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t border-edge bg-void/60">
      <div className="section py-12">
        <div className="grid gap-10 sm:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <a
              href="#top"
              className="inline-flex items-center gap-2 font-display text-lg font-bold"
            >
              <span className="grid h-7 w-7 place-items-center rounded-md bg-emerald-accent font-mono text-sm text-void">
                W
              </span>
              WalSec
            </a>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-secondary">
              {profile.fullName} — {profile.role}. Threat intelligence, network
              forensics and the software that backs it up.
            </p>
            <p className="mt-4 flex items-center gap-1.5 font-mono text-2xs text-ink-muted">
              <Command className="h-3 w-3" />
              Press ⌘K / Ctrl-K to jump anywhere
            </p>
          </div>

          <nav aria-label="Footer">
            <h3 className="font-mono text-2xs uppercase tracking-wider2 text-ink-muted">
              Navigate
            </h3>
            <ul className="mt-4 space-y-2.5">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-sm text-ink-secondary transition-colors hover:text-emerald-accent"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="font-mono text-2xs uppercase tracking-wider2 text-ink-muted">
              Connect
            </h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-2 text-sm text-ink-secondary transition-colors hover:text-emerald-accent"
                >
                  <Mail className="h-3.5 w-3.5" /> Email
                </a>
              </li>
              <li>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-ink-secondary transition-colors hover:text-emerald-accent"
                >
                  <Linkedin className="h-3.5 w-3.5" /> LinkedIn
                </a>
              </li>
              <li>
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-ink-secondary transition-colors hover:text-emerald-accent"
                >
                  <Github className="h-3.5 w-3.5" /> GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-edge pt-6 sm:flex-row">
          <p className="font-mono text-2xs text-ink-muted">
            © {year} {profile.fullName}. Built with Next.js, Tailwind & Framer
            Motion.
          </p>
          <p className="flex items-center gap-1.5 font-mono text-2xs text-ink-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-accent animate-pulse-dot" />
            Systems nominal
          </p>
        </div>
      </div>
    </footer>
  );
}
