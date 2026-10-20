"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "@/lib/gsap";
import { ease, prefersReducedMotion, scrollToTarget, startScroll, stopScroll } from "@/lib/engine";
import type { PaletteItem } from "@/lib/palette";

/**
 * ⌘K / Ctrl+K: jump to a section, a case study or a contact. A combobox over a listbox: focus
 * stays in the input, arrows move the active option, Enter opens it, Escape closes and focus
 * returns where it was. The panel opens downward from its top edge (a clip, no drift).
 */
export function CommandPalette({
  open,
  setOpen,
  items,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  items: PaletteItem[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const back = useRef<HTMLElement | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? items.filter((it) => it.label.toLowerCase().includes(q) || it.keywords.includes(q)) : items;
  }, [items, query]);

  // The shortcut, everywhere the palette is mounted.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!open);
      }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  // Open: mount, then play in. Close: play out, then unmount and give focus back.
  useEffect(() => {
    if (open) {
      back.current = document.activeElement as HTMLElement | null;
      setMounted(true);
      setQuery("");
      setActive(0);
      stopScroll();
      return;
    }
    if (!mounted) return;
    startScroll();
    const el = root.current;
    const done = () => {
      setMounted(false);
      back.current?.focus?.();
    };
    if (!el || prefersReducedMotion()) return done();
    const tl = gsap.timeline({ onComplete: done });
    tl.to(el.querySelector(".palette__panel"), { clipPath: "inset(0% 0% 100% 0%)", duration: 0.3, ease: ease.inOut });
    tl.to(el, { opacity: 0, duration: 0.2 }, "<0.1");
    return () => {
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    const el = root.current;
    if (!open || !mounted || !el) return;
    // Visible before focus (a hidden input can't take it); the fade is opacity only.
    if (!prefersReducedMotion()) gsap.set(el, { visibility: "visible", opacity: 0 });
    input.current?.focus();
    if (prefersReducedMotion()) return;
    const tl = gsap.timeline();
    tl.to(el, { opacity: 1, duration: 0.25, ease: ease.soft });
    tl.fromTo(
      el.querySelector(".palette__panel"),
      { clipPath: "inset(0% 0% 100% 0%)" },
      { clipPath: "inset(0% 0% 0% 0%)", duration: 0.55, ease: ease.out },
      0,
    );
    tl.fromTo(el.querySelectorAll(".palette__opt"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, stagger: 0.02, ease: ease.soft }, 0.12);
    return () => {
      tl.kill();
    };
  }, [open, mounted]);

  useEffect(() => setActive(0), [query]);
  useEffect(() => {
    root.current?.querySelector(`#palette-opt-${active}`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const run = (it: PaletteItem) => {
    setOpen(false);
    if (it.href.startsWith("#")) {
      if (location.pathname === "/") scrollToTarget(it.href);
      else router.push(`/${it.href}`);
    } else if (it.href.startsWith("/work/")) router.push(it.href);
    else if (it.href.startsWith("http")) window.open(it.href, "_blank", "noopener,noreferrer");
    else location.href = it.href;
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const it = filtered[active];
      if (it) run(it);
    } else if (e.key === "Tab") {
      e.preventDefault(); // the input is the dialog's only stop
    }
  };

  if (!mounted) return null;
  return (
    <div ref={root} className="palette" onClick={() => setOpen(false)} data-lenis-prevent>
      <div
        className="palette__panel"
        role="dialog"
        aria-modal="true"
        aria-label="Jump to"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKey}
      >
        <div className="palette__field">
          <input
            ref={input}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="A section, a case study or a contact"
            aria-label="Jump to"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-activedescendant={filtered.length ? `palette-opt-${active}` : undefined}
            autoComplete="off"
            spellCheck={false}
          />
          <kbd>Esc</kbd>
        </div>
        <ul id="palette-list" role="listbox" aria-label="Results" className="palette__list">
          {filtered.length === 0 && (
            <li className="palette__empty" role="presentation">
              Nothing matches “{query}”.
            </li>
          )}
          {filtered.map((it, i) => (
            <li
              key={it.id}
              id={`palette-opt-${i}`}
              role="option"
              aria-selected={active === i}
              className="palette__opt"
              onPointerMove={() => active !== i && setActive(i)}
              onClick={() => run(it)}
            >
              <span>{it.label}</span>
              <span className="palette__hint">{it.hint}</span>
            </li>
          ))}
        </ul>
        <p className="palette__foot" aria-hidden="true">
          <span>↑ ↓ to move</span>
          <span>Enter to open</span>
        </p>
      </div>
    </div>
  );
}
