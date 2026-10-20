// Media queries and the one easing family (DESIGN.md §7). Use these names everywhere.
export const prefersReducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
export const isTouch = () => matchMedia("(hover: none), (pointer: coarse)").matches;
export const isMobile = () => matchMedia("(max-width: 767px)").matches;

export const ease = {
  out: "expo.out", // reveals
  inOut: "expo.inOut", // transitions
  soft: "power3.out", // hovers
  lock: "power4.out", // pieces settling
  hand: "back.out(1.4)", // overshoot, only under the hand: the magnetic CTA and the follower
} as const;
