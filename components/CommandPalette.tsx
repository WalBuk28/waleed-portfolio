"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  CornerDownLeft,
  ArrowRight,
  Mail,
  Github,
  Linkedin,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { caseStudies, navLinks, profile } from "@/lib/data";
import { Icon } from "@/lib/icons";

type Item = {
  id: string;
  label: string;
  hint: string;
  icon?: string;
  action: () => void;
  keywords: string;
};

export function CommandPalette({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const go = (fn: () => void) => {
    setOpen(false);
    setQuery("");
    fn();
  };

  const items: Item[] = useMemo(() => {
    const jump = (href: string) => () => {
      if (window.location.pathname !== "/") {
        router.push(`/${href}`);
      } else {
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
      }
    };
    return [
      ...navLinks.map((l) => ({
        id: `nav-${l.href}`,
        label: l.label,
        hint: "Section",
        action: jump(l.href),
        keywords: l.label.toLowerCase(),
      })),
      ...caseStudies.map((c) => ({
        id: `work-${c.slug}`,
        label: c.title,
        hint: "Case study",
        icon: c.icon,
        action: () => router.push(`/work/${c.slug}`),
        keywords: (c.title + " " + c.tags.join(" ")).toLowerCase(),
      })),
      {
        id: "email",
        label: "Email Waleed",
        hint: "Contact",
        action: () => {
          window.location.href = `mailto:${profile.email}`;
        },
        keywords: "email contact hire mail",
      },
      {
        id: "github",
        label: "GitHub — @WalBuk28",
        hint: "External",
        action: () => window.open(profile.github, "_blank"),
        keywords: "github code repo source",
      },
      {
        id: "linkedin",
        label: "LinkedIn",
        hint: "External",
        action: () => window.open(profile.linkedin, "_blank"),
        keywords: "linkedin connect",
      },
    ];
  }, [router]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (it) => it.label.toLowerCase().includes(q) || it.keywords.includes(q)
    );
  }, [items, query]);

  // Global shortcut + focus management
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!open);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  useEffect(() => {
    if (open) {
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 20);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => setActive(0), [query]);

  const onListKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const it = filtered[active];
      if (it) go(it.action);
    }
  };

  const iconFor = {
    Contact: <Mail className="h-4 w-4" />,
    External: <Github className="h-4 w-4" />,
  } as Record<string, React.ReactNode>;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[12vh]"
          onClick={() => setOpen(false)}
        >
          <div className="absolute inset-0 bg-void/70 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={onListKey}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-edge bg-surface shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
          >
            {/* input */}
            <div className="flex items-center gap-3 border-b border-edge px-4">
              <Search className="h-4 w-4 flex-none text-ink-muted" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Jump to a section, project or contact…"
                className="w-full bg-transparent py-4 text-sm text-ink outline-none placeholder:text-ink-muted"
                aria-label="Search"
              />
              <kbd className="hidden flex-none rounded border border-edge bg-raised px-1.5 py-0.5 font-mono text-2xs text-ink-muted sm:block">
                ESC
              </kbd>
            </div>

            {/* results */}
            <ul className="max-h-[52vh] overflow-y-auto p-2">
              {filtered.length === 0 && (
                <li className="px-3 py-8 text-center font-mono text-xs text-ink-muted">
                  No matches for “{query}”
                </li>
              )}
              {filtered.map((it, i) => (
                <li key={it.id}>
                  <button
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(it.action)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                      active === i ? "bg-raised" : "hover:bg-raised/60"
                    }`}
                  >
                    <span
                      className={`grid h-8 w-8 flex-none place-items-center rounded-lg border border-edge ${
                        active === i
                          ? "bg-emerald-accent/10 text-emerald-accent"
                          : "bg-void/40 text-ink-muted"
                      }`}
                    >
                      {it.icon ? (
                        <Icon name={it.icon} className="h-4 w-4" />
                      ) : (
                        iconFor[it.hint] ?? <ArrowRight className="h-4 w-4" />
                      )}
                    </span>
                    <span className="flex-1 text-sm text-ink">{it.label}</span>
                    <span className="font-mono text-2xs text-ink-muted">
                      {it.hint}
                    </span>
                    {active === i && (
                      <CornerDownLeft className="h-3.5 w-3.5 text-emerald-accent" />
                    )}
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between border-t border-edge px-4 py-2.5 font-mono text-2xs text-ink-muted">
              <span className="flex items-center gap-1.5">
                <Linkedin className="h-3 w-3" /> {profile.fullName}
              </span>
              <span className="hidden gap-3 sm:flex">
                <span>↑↓ navigate</span>
                <span>↵ select</span>
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
