"use client";

import { ScrollTrigger, gsap } from "@/lib/gsap";
import { ease, prefersReducedMotion } from "@/lib/engine";
import { usePage } from "@/lib/engine/next";
import { heroCellFor, placeBand } from "@/lib/screen/hero";

/** The hero's page code: places the h1's band of light and locks the real numbers in once. */
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

    // The real numbers lock in: each rises from behind its own baseline, staggered, in the
    // lattice's vertical. They are never counted up: a counter shows numbers that aren't true
    // ("0 case studies") in any frame caught mid-count.
    if (!prefersReducedMotion()) {
      const nums = hero.querySelectorAll<HTMLElement>("[data-count]");
      if (nums.length) {
        gsap.set(nums, { yPercent: 105 });
        intro.add(gsap.to(nums, { yPercent: 0, duration: 0.9, ease: ease.out, stagger: 0.08, clearProps: "transform" }), 0.45);
      }
    }
    return () => ScrollTrigger.removeEventListener("refresh", place);
  });
  return null;
}
