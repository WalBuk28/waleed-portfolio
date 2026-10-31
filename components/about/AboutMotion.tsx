"use client";

import { ScrollTrigger, SplitText } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/engine";
import { usePage } from "@/lib/engine/next";

/**
 * About's page code: the statement is read in. Its words start muted and turn to ink as the
 * reading line passes them (a class per word, so the colour always comes from the current ink
 * set and stays AA at every step, by night or in daylight). Without JS or under reduced motion
 * every word is ink.
 */
export function AboutMotion() {
  usePage(() => {
    const el = document.querySelector<HTMLElement>("[data-words]");
    if (!el || prefersReducedMotion()) return;
    const split = SplitText.create(el, { type: "words", wordsClass: "about__w" });
    const words = split.words as HTMLElement[];
    el.classList.add("is-reading");
    let read = 0;
    ScrollTrigger.create({
      trigger: el,
      start: "top 70%",
      end: "bottom 45%",
      onUpdate: (self) => {
        const n = Math.round(self.progress * words.length);
        if (n === read) return;
        const [a, b] = n > read ? [read, n] : [n, read];
        for (let i = a; i < b; i++) words[i].classList.toggle("is-read", i < n);
        read = n;
      },
    });
  });
  return null;
}
