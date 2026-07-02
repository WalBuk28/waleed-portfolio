"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useScroll, useSpring } from "framer-motion";
import { Command, Menu, X, ArrowUpRight } from "lucide-react";
import { navLinks } from "@/lib/data";

export function Nav({ onOpenPalette }: { onOpenPalette: () => void }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  // Hash links only scroll on the homepage; elsewhere route home first.
  const linkHref = (href: string) => (isHome ? href : `/${href}`);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`transition-colors duration-300 ${
          scrolled
            ? "border-b border-edge bg-base/80 backdrop-blur-xl"
            : "border-b border-transparent"
        }`}
      >
        <nav className="section flex h-16 items-center justify-between">
          {/* logo */}
          <a
            href="#top"
            className="group inline-flex items-center gap-2 font-display text-base font-bold"
          >
            <span className="grid h-8 w-8 place-items-center rounded-md bg-emerald-accent font-mono text-sm text-void transition-transform group-hover:scale-105">
              W
            </span>
            <span className="hidden sm:inline">WalSec</span>
          </a>

          {/* desktop links */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={linkHref(l.href)}
                className="rounded-lg px-3 py-2 text-sm text-ink-secondary transition-colors hover:bg-raised hover:text-ink"
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenPalette}
              className="hidden items-center gap-2 rounded-lg border border-edge bg-surface/60 px-3 py-1.5 font-mono text-2xs text-ink-muted transition-colors hover:border-emerald-accent/40 hover:text-ink sm:flex"
              aria-label="Open command palette"
            >
              <Command className="h-3 w-3" />
              <span>⌘K</span>
            </button>
            <a
              href={linkHref("#contact")}
              className="hidden items-center gap-1.5 rounded-lg bg-emerald-accent px-4 py-1.5 text-sm font-semibold text-void transition-all hover:shadow-glow-emerald hover:brightness-110 sm:inline-flex"
            >
              Hire me
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>

            {/* mobile toggle */}
            <button
              onClick={() => setOpen((o) => !o)}
              className="grid h-9 w-9 place-items-center rounded-lg border border-edge bg-surface/60 text-ink md:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
            </button>
          </div>
        </nav>

        {/* scroll progress */}
        <motion.div
          className="h-px origin-left bg-gradient-to-r from-emerald-accent to-electric-accent"
          style={{ scaleX: progress }}
        />
      </div>

      {/* mobile menu */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-b border-edge bg-base/95 backdrop-blur-xl md:hidden"
        >
          <div className="section flex flex-col gap-1 py-4">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={linkHref(l.href)}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm text-ink-secondary transition-colors hover:bg-raised hover:text-ink"
              >
                {l.label}
              </a>
            ))}
            <a
              href={linkHref("#contact")}
              onClick={() => setOpen(false)}
              className="btn-primary mt-2 justify-center"
            >
              Hire me
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </motion.div>
      )}
    </header>
  );
}
