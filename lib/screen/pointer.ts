// One lagged pointer for the whole site. The sun and the cursor follower both
// read `pointer.x / pointer.y`, so the light and the follower always agree.
// While the pointer is away, the driver parks it on the resting sun, so on the
// first move the follower travels from the light to the hand. Fine pointers only.
import { gsap } from "@/lib/gsap";

export const pointer = {
  x: 0, // lagged, viewport px
  y: 0,
  tx: 0, // latest raw position
  ty: 0,
  /** The pointer is over the page. */
  active: false,
  /** The driver is parking the pointer on the sun while it's away. */
  anchored: false,
  /** gsap.ticker.time of the last move (seconds). */
  movedAt: 0,
};

const LAG = 0.16; // share of the distance covered per 60 Hz frame

let started = false;
export function startPointer() {
  if (started) return;
  started = true;
  addEventListener(
    "pointermove",
    (e) => {
      if (e.pointerType === "touch") return;
      pointer.tx = e.clientX;
      pointer.ty = e.clientY;
      if (!pointer.active && !pointer.anchored) {
        pointer.x = e.clientX;
        pointer.y = e.clientY;
      }
      pointer.active = true;
      pointer.movedAt = gsap.ticker.time;
    },
    { passive: true },
  );
  document.documentElement.addEventListener("pointerleave", () => {
    pointer.active = false;
  });
  gsap.ticker.add(() => {
    if (!pointer.active) return;
    const k = 1 - Math.pow(1 - LAG, gsap.ticker.deltaRatio(60));
    pointer.x += (pointer.tx - pointer.x) * k;
    pointer.y += (pointer.ty - pointer.y) * k;
  });
}
