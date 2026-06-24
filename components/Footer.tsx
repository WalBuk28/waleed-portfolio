import { Icon } from "@/components/ui/Icon";
import { navLinks, profile } from "@/lib/data";

export function Footer() {
  return (
    <footer className="border-t border-ink-700/60 bg-ink-950">
      <div className="container-x flex flex-col items-center justify-between gap-6 py-10 sm:flex-row">
        <div className="text-center sm:text-left">
          <p className="font-mono text-sm font-semibold text-zinc-200">
            {profile.name}
            <span className="text-emerald-glow">.</span>
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            {profile.fullName} — {profile.role}
          </p>
        </div>

        <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-zinc-500 transition-colors hover:text-zinc-200"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="text-zinc-500 transition-colors hover:text-white"
            aria-label="GitHub"
          >
            <Icon name="Github" className="h-5 w-5" />
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            className="text-zinc-500 transition-colors hover:text-white"
            aria-label="LinkedIn"
          >
            <Icon name="Linkedin" className="h-5 w-5" />
          </a>
          <a
            href={`mailto:${profile.email}`}
            className="text-zinc-500 transition-colors hover:text-white"
            aria-label="Email"
          >
            <Icon name="Mail" className="h-5 w-5" />
          </a>
        </div>
      </div>
      <div className="border-t border-ink-700/40 py-5">
        <p className="container-x text-center text-xs text-zinc-600">
          © {new Date().getFullYear()} {profile.fullName}. Built with Next.js,
          Tailwind CSS &amp; Framer Motion.
        </p>
      </div>
    </footer>
  );
}
