// Declarative reveals, one per role (DESIGN.md §7), authored in markup:
//   data-split            lines rise from behind a lattice edge: a mask and a vertical move only
//   data-reveal="fade"    body text: opacity only, 0.6 s
//   data-intro            play with the page intro instead of on scroll
//   data-delay="0.2"      extra delay in seconds
// Everything is skipped under reduced motion, and CSS keeps content visible without JS.
import { gsap, SplitText } from "@/lib/gsap";
import { ease, prefersReducedMotion } from "./env";

// autoSplit re-splits after a font load or resize; a text that already revealed stays revealed.
function splitTween(el: HTMLElement, isIntro: boolean) {
  const delay = parseFloat(el.dataset.delay || "0");
  const s = { tween: undefined as gsap.core.Tween | undefined, done: false, requested: false };
  SplitText.create(el, {
    type: "lines",
    mask: "lines",
    autoSplit: true,
    linesClass: "split-line",
    onSplit(self) {
      gsap.set(el, { visibility: "visible" });
      if (s.done) return;
      s.tween = gsap.from(self.lines, {
        yPercent: 110,
        duration: 1.1,
        stagger: 0.07,
        ease: ease.out,
        delay,
        paused: isIntro && !s.requested,
        onComplete: () => {
          s.done = true;
        },
        scrollTrigger: isIntro ? undefined : { trigger: el, start: "top 88%", once: true },
      });
      return s.tween;
    },
  });
  return () => {
    s.requested = true;
    s.tween?.play();
  };
}

function fadeTween(el: HTMLElement, paused: boolean) {
  const delay = parseFloat(el.dataset.delay || "0");
  gsap.set(el, { visibility: "visible" });
  return gsap.fromTo(
    el,
    { autoAlpha: 0 },
    {
      autoAlpha: 1,
      duration: 0.6,
      ease: ease.soft,
      delay,
      paused,
      scrollTrigger: paused ? undefined : { trigger: el, start: "top 90%", once: true },
    },
  );
}

/** Wire every reveal inside `root`. Returns the page's intro timeline (paused). */
export function initReveals(root: ParentNode = document) {
  const intro = gsap.timeline({ paused: true });
  if (prefersReducedMotion()) return intro;
  root.querySelectorAll<HTMLElement>("[data-split]").forEach((el) => {
    const isIntro = el.hasAttribute("data-intro");
    const play = splitTween(el, isIntro);
    if (isIntro) intro.add(play, 0);
  });
  root.querySelectorAll<HTMLElement>("[data-reveal='fade']").forEach((el) => {
    const isIntro = el.hasAttribute("data-intro");
    const t = fadeTween(el, isIntro);
    if (isIntro) intro.add(() => t.play(), 0);
  });
  return intro;
}
