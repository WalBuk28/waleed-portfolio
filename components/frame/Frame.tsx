"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { navLinks, profile } from "@/lib/data";
import { WalSecMark } from "@/components/brand/WalSecMark";
import { ease, onScroll, prefersReducedMotion, scrollToTarget, startScroll, stopScroll, transitioning } from "@/lib/engine";
import { usePage } from "@/lib/engine/next";
import { gsap } from "@/lib/gsap";
import { currentLabel, onChapter } from "@/lib/screen/driver";

export type FramePage = "home" | "case" | "missing";

/**
 * The frame on every page: four corners (DESIGN.md §7). Top left the mark and name, top right
 * the sections and "Download CV", bottom left the part of the page you're in, bottom right the
 * availability line. It steps aside on scroll down and returns on scroll up.
 * - home: the links scroll to their sections, and the marker rests on the one you're reading
 * - case: the links go home (through the page transition); "Work" is the current page
 * - missing (the 404): the links go home; nothing is current
 * On phones the sections live behind "Menu", a full-screen sheet that opens from its corner
 * along the lattice's 30°.
 */
export function Frame({ page = "home", label }: { page?: FramePage; label?: string }) {
  const home = page === "home";
  const list = useRef<HTMLUListElement>(null);
  const marker = useRef<HTMLSpanElement>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false); // the sheet is in the page (open, or closing)
  const href = (h: string) => (home ? h : `/${h}`);
  const isCurrent = (l: string) => page === "case" && l === "Work";

  usePage(() => {
    const html = document.documentElement;
    let last = 0;
    const offScroll = onScroll(({ y }) => {
      html.classList.toggle("frame-scrolled", y > 24);
      if (Math.abs(y - last) < 4) return;
      html.classList.toggle("frame-away", y > 160 && y > last);
      last = y;
    });

    // The nav marker: a lit tile that slides to the hovered or focused link, and rests on the
    // section you're reading (home) or the current page (a case: Work).
    const ul = list.current;
    const mk = marker.current;
    if (!ul || !mk) return offScroll;
    const wrap = ul.parentElement!;
    const links = [...ul.querySelectorAll<HTMLAnchorElement>("a")];
    const quick = prefersReducedMotion() ? 0 : 0.4;
    const current = () => {
      if (!home) return links.find((a) => a.dataset.current !== undefined) ?? null;
      const label = currentLabel();
      links.forEach((a) => (a.textContent === label ? a.setAttribute("aria-current", "location") : a.removeAttribute("aria-current")));
      return links.find((a) => a.textContent === label) ?? null;
    };
    const place = (a: HTMLAnchorElement | null) => {
      if (!a) return gsap.to(mk, { autoAlpha: 0, duration: quick * 0.6, overwrite: true });
      const x = a.offsetLeft + a.offsetWidth / 2 - mk.offsetWidth / 2;
      const seen = gsap.getProperty(mk, "autoAlpha") as number;
      if (seen < 0.05) gsap.set(mk, { x });
      gsap.to(mk, { x, autoAlpha: 1, duration: quick, ease: ease.soft, overwrite: true });
    };
    const enter = (e: Event) => place(e.currentTarget as HTMLAnchorElement);
    const rest = () => place(current());
    links.forEach((a) => {
      a.addEventListener("pointerenter", enter);
      a.addEventListener("focus", enter);
      a.addEventListener("blur", rest);
    });
    wrap.addEventListener("pointerleave", rest);
    const offChapter = onChapter(rest);
    rest();
    return () => {
      offScroll();
      offChapter();
      links.forEach((a) => {
        a.removeEventListener("pointerenter", enter);
        a.removeEventListener("focus", enter);
        a.removeEventListener("blur", rest);
      });
      wrap.removeEventListener("pointerleave", rest);
      html.classList.remove("frame-away", "frame-scrolled");
    };
  });

  const close = useCallback((refocus = true) => {
    setOpen(false);
    if (refocus) menuBtn.current?.focus();
  }, []);

  // The sheet opens from the Menu corner: its edge is a line at the lattice's 30°, sweeping
  // from the top right to the bottom left; the links rise from behind a lattice edge.
  useEffect(() => {
    const root = menu.current;
    if (!root) return;
    const reduce = prefersReducedMotion();
    const words = root.querySelectorAll(".menu__word");
    const full = () => `${Math.ceil(innerWidth + innerHeight * 1.7321 + 40)}px`;
    if (open) {
      setShown(true);
      stopScroll();
      if (reduce) gsap.set(root, { "--a": full() });
      else {
        gsap.fromTo(root, { "--a": "0px" }, { "--a": full(), duration: 0.6, ease: ease.inOut, overwrite: true });
        gsap.fromTo(words, { yPercent: 110 }, { yPercent: 0, duration: 0.8, ease: ease.out, stagger: 0.05, delay: 0.18, overwrite: true });
      }
      return;
    }
    if (!shown) return;
    if (!transitioning()) startScroll(); // a page transition holds the scroll until it lands
    const hide = () => setShown(false);
    if (reduce) return hide();
    gsap.to(root, { "--a": "0px", duration: 0.4, ease: ease.inOut, overwrite: true, onComplete: hide });
  }, [open, shown]);

  // Focus moves in, Tab stays inside, Escape closes, focus returns to "Menu".
  useEffect(() => {
    if (!open) return;
    const root = menu.current!;
    const items = () => [...root.querySelectorAll<HTMLElement>("a, button")];
    items()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return close();
      if (e.key !== "Tab") return;
      const els = items();
      const i = els.indexOf(document.activeElement as HTMLElement);
      if (e.shiftKey && i <= 0) {
        e.preventDefault();
        els[els.length - 1].focus();
      } else if (!e.shiftKey && i === els.length - 1) {
        e.preventDefault();
        els[0].focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  // On the home page a menu link scrolls there; elsewhere the page transition takes it home
  // (the sheet just closes, behind the curtain).
  const go = (h: string) => (e: React.MouseEvent) => {
    if (!home) return close(false);
    e.preventDefault();
    close(false);
    history.replaceState(null, "", h);
    scrollToTarget(h);
  };

  return (
    <>
      <header className="frame" data-ground>
        <a className="frame__tl frame__brand" href={home ? "#top" : "/"} data-quiet="fixed">
          <WalSecMark className="frame__mark" color="currentColor" />
          <span>{profile.name}</span>
        </a>
        <nav className="frame__tr" aria-label="Sections">
          <div className="frame__navwrap" data-quiet="fixed">
            <ul ref={list} className="frame__nav">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a
                    className="frame__link"
                    href={href(l.href)}
                    aria-current={isCurrent(l.label) ? "page" : undefined}
                    data-current={isCurrent(l.label) ? "" : undefined}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <span ref={marker} className="frame__marker" aria-hidden="true" />
          </div>
          <a className="btn btn--cv" href={profile.cv} download="Muhammad_Waleed_CV.pdf" data-cursor="Download">
            <span className="btn__shape" aria-hidden="true" />
            Download CV
          </a>
          <button
            ref={menuBtn}
            data-quiet="fixed"
            type="button"
            className="frame__menu"
            aria-expanded={open}
            aria-controls="menu"
            onClick={() => setOpen(true)}
          >
            Menu
          </button>
        </nav>
        <p className="frame__bl" aria-hidden="true" data-quiet="fixed">
          <span data-screen-label>{label ?? "Home"}</span>
        </p>
        <p className="frame__br" data-quiet="fixed">
          <svg className="frame__tile" viewBox="-14 -18 28 36" aria-hidden="true">
            <polygon points="0,-17 13,-9.5 13,9.5 0,17 -13,9.5 -13,-9.5" />
          </svg>
          {profile.availability}
        </p>
      </header>

      <div
        ref={menu}
        id="menu"
        className="menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        hidden={!open && !shown}
        data-lenis-prevent
        data-ground
      >
        <ul className="menu__list">
          {navLinks.map((l) => (
            <li key={l.href}>
              <a href={href(l.href)} onClick={go(l.href)} aria-current={isCurrent(l.label) ? "page" : undefined}>
                <span className="menu__mask">
                  <span className="menu__word">{l.label}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
        <a className="btn btn--cv menu__cv" href={profile.cv} download="Muhammad_Waleed_CV.pdf">
          <span className="btn__shape" aria-hidden="true" />
          Download CV
        </a>
        <p className="menu__foot">
          <svg className="frame__tile" viewBox="-14 -18 28 36" aria-hidden="true">
            <polygon points="0,-17 13,-9.5 13,9.5 0,17 -13,9.5 -13,-9.5" />
          </svg>
          {profile.availability}
        </p>
        <button type="button" className="menu__close" onClick={() => close()}>
          Close
        </button>
      </div>
    </>
  );
}
