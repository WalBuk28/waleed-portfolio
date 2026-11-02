// Pointer craft, fine pointers only. The native cursor always stays visible.
//   data-magnetic          the target leans toward the pointer, 6 px at most (the sun draws it)
//   data-cursor="Open"     the follower fills with light and shows this word over the target
//   data-cursor-fill       it fills with light but shows no word (a target that names itself, like
//                          the giant "Email me": a chip there would sit on its letters)
import { gsap } from "@/lib/gsap";
import { pointer, startPointer } from "@/lib/screen/pointer";
import { ease, isTouch, prefersReducedMotion } from "./env";

const MAX_PULL = 6;

export function initMagnetic(root: ParentNode = document) {
  if (isTouch() || prefersReducedMotion()) return () => {};
  const off: (() => void)[] = [];
  root.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
    const x = gsap.quickTo(el, "x", { duration: 0.5, ease: ease.hand });
    const y = gsap.quickTo(el, "y", { duration: 0.5, ease: ease.hand });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      x(gsap.utils.clamp(-1, 1, dx) * MAX_PULL);
      y(gsap.utils.clamp(-1, 1, dy) * MAX_PULL * 0.6);
    };
    const leave = () => {
      x(0);
      y(0);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    off.push(() => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    });
  });
  return () => off.forEach((f) => f());
}

// The follower: the mark's outline trailing the native cursor on the shared lagged pointer.
// Over the background it is the sun; over a [data-cursor] target it fills and names the action.
let follower: HTMLElement | null = null;
export function initCursor() {
  if (follower || isTouch() || prefersReducedMotion()) return;
  follower = document.getElementById("cursor");
  if (!follower) return;
  const el = follower;
  const label = el.querySelector<HTMLElement>("[data-cursor-label]");
  startPointer();
  let word = "";
  addEventListener(
    "pointermove",
    (e) => {
      if (e.pointerType === "touch") return;
      const target = (e.target as Element | null)?.closest?.<HTMLElement>("[data-cursor], [data-cursor-fill]");
      const said = target?.dataset.cursor || "";
      const next = target ? said || "\u00b7fill" : "";
      if (next !== word) {
        word = next;
        el.classList.toggle("is-active", !!target);
        el.classList.toggle("is-quiet", !!target && !said);
        if (label && said) label.textContent = said;
      }
    },
    { passive: true },
  );
  let on = false;
  gsap.ticker.add(() => {
    if (pointer.active !== on) el.classList.toggle("is-on", (on = pointer.active));
    if (on) el.style.translate = `${pointer.x.toFixed(1)}px ${pointer.y.toFixed(1)}px`;
  });
}

/** Clear a stale label after a route change. */
export function resetCursor() {
  follower?.classList.remove("is-active", "is-quiet");
}
