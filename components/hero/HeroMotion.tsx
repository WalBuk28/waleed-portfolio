"use client";

import { ScrollTrigger, gsap } from "@/lib/gsap";
import { ease, prefersReducedMotion } from "@/lib/engine";
import { usePage } from "@/lib/engine/next";
import { heroCellFor, placeBand } from "@/lib/screen/hero";

const fmt = (n: number) => Math.round(n).toLocaleString("en-GB");

/** The hero's page code: places the h1's band of light and counts the real numbers once. */
export function HeroMotion() {
  usePage(({ intro }) => {
    const hero = document.querySelector<HTMLElement>("[data-hero]");
    const h1 = hero?.querySelector<HTMLElement>("[data-band]");
    if (!hero || !h1) return;

    // The band sits where the shaft from the hero cell crosses the headline, GL or not.
    const place = () => {
      const top = hero.getBoundingClientRect().top + window.scrollY;
      placeBand(h1, heroCellFor(window.innerWidth, window.innerHeight, top));
    };
    place();
    ScrollTrigger.addEventListener("refresh", place);

    // Counters: real numbers only, counted once as the facts appear.
    if (!prefersReducedMotion()) {
      hero.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
        const to = +el.dataset.count!;
        const suffix = el.dataset.suffix ?? "";
        const o = { v: 0 };
        el.textContent = `0${suffix}`;
        intro.add(
          gsap.to(o, {
            v: to,
            duration: 1.4,
            ease: ease.out,
            onUpdate: () => (el.textContent = `${fmt(o.v)}${suffix}`),
          }),
          0.45,
        );
      });
    }
    return () => ScrollTrigger.removeEventListener("refresh", place);
  });
  return null;
}
