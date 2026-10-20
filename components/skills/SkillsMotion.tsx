"use client";

import { gsap, ScrollTrigger } from "@/lib/gsap";
import { ease, isTouch, prefersReducedMotion } from "@/lib/engine";
import { usePage } from "@/lib/engine/next";
import { setPool } from "@/lib/screen/driver";

/**
 * Skills' page code: each group's tile locks in and its text fades in as it arrives (opacity
 * only, in reading order); a hovered or focused group draws the jali pool onto itself.
 */
export function SkillsMotion() {
  usePage(() => {
    const groups = [...document.querySelectorAll<HTMLElement>("[data-group]")];
    if (!groups.length) return;
    const off: (() => void)[] = [];
    if (!prefersReducedMotion()) {
      groups.forEach((g, i) => {
        const body = g.querySelectorAll(":scope > :not(svg)");
        gsap.set(body, { autoAlpha: 0 });
        ScrollTrigger.create({
          trigger: g,
          start: "top 85%",
          once: true,
          onEnter: () => {
            g.classList.add("is-in");
            gsap.to(body, { autoAlpha: 1, duration: 0.6, ease: ease.soft, stagger: 0.06, delay: 0.25 + (i % 2) * 0.08 });
          },
        });
      });
    } else groups.forEach((g) => g.classList.add("is-in"));

    if (!isTouch()) {
      const at = (g: HTMLElement) => {
        const r = g.getBoundingClientRect();
        setPool([r.left + r.width / 2, r.top + window.scrollY + r.height / 2]);
      };
      groups.forEach((g) => {
        const on = () => {
          g.classList.add("is-lit");
          at(g);
        };
        const out = (e: Event) => {
          if (e.type === "focusout" && g.contains((e as FocusEvent).relatedTarget as Node | null)) return;
          g.classList.remove("is-lit");
          setPool(null);
        };
        g.addEventListener("pointerenter", on);
        g.addEventListener("focusin", on);
        g.addEventListener("pointerleave", out);
        g.addEventListener("focusout", out);
        off.push(() => {
          g.removeEventListener("pointerenter", on);
          g.removeEventListener("focusin", on);
          g.removeEventListener("pointerleave", out);
          g.removeEventListener("focusout", out);
        });
      });
    }
    return () => {
      off.forEach((f) => f());
      setPool(null);
    };
  });
  return null;
}
