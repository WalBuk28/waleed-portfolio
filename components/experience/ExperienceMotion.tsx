"use client";

import { gsap, ScrollTrigger } from "@/lib/gsap";
import { ease, prefersReducedMotion } from "@/lib/engine";
import { usePage } from "@/lib/engine/next";

/**
 * Experience's page code: as each chapter crosses the reading line, the sticky stage's period
 * changes (the old one leaves upward behind the lattice edge, the new one rises from below)
 * and the index lights its step. The chapters themselves fade in through the engine's
 * data-reveal. Under reduced motion the stage still follows the reader, without movement.
 */
export function ExperienceMotion() {
  usePage(() => {
    const chapters = [...document.querySelectorAll<HTMLElement>("[data-xp]")];
    const periods = [...document.querySelectorAll<HTMLElement>("[data-period]")];
    const steps = [...document.querySelectorAll<HTMLElement>(".xp__index [data-step]")];
    if (!chapters.length || !periods.length) return;
    const reduce = prefersReducedMotion();
    let current = -1;
    const show = (i: number) => {
      if (i === current) return;
      const prev = current;
      current = i;
      steps.forEach((s, k) => s.classList.toggle("is-on", k === i));
      steps.forEach((s, k) => s.classList.toggle("is-past", k < i));
      periods.forEach((p, k) => {
        const lines = p.children;
        if (k === i) {
          gsap.set(p, { autoAlpha: 1 });
          if (!reduce) gsap.fromTo(lines, { yPercent: k > prev ? 110 : -110 }, { yPercent: 0, duration: 0.9, ease: ease.out, stagger: 0.07, overwrite: true });
        } else if (k === prev && !reduce) {
          gsap.to(lines, { yPercent: k < i ? -110 : 110, duration: 0.6, ease: ease.inOut, overwrite: true, onComplete: () => void gsap.set(p, { autoAlpha: 0 }) });
        } else gsap.set(p, { autoAlpha: 0 });
      });
    };
    show(0);
    // The current chapter is the last one whose top has passed the reading line (55%), so a
    // jump (a nav link, the palette) lands on the right one too.
    let tops: number[] = [];
    const pick = () => {
      const line = window.scrollY + window.innerHeight * 0.55;
      let i = 0;
      tops.forEach((t, k) => t <= line && (i = k));
      show(i);
    };
    ScrollTrigger.create({
      trigger: chapters[0].parentElement,
      start: "top bottom",
      end: "bottom top",
      onRefresh: () => {
        tops = chapters.map((c) => c.getBoundingClientRect().top + window.scrollY);
        pick();
      },
      onUpdate: pick,
    });
  });
  return null;
}
