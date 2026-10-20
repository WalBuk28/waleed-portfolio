// One lagged pointer for the whole site. The sun and the cursor follower both
// read `pointer.x / pointer.y`, so the light and the follower always agree.
// Stepped on gsap.ticker by the driver; fine pointers only.

export const pointer = {
  x: 0, // lagged, viewport px
  y: 0,
  tx: 0, // latest raw position
  ty: 0,
  /** The pointer has moved over the page and hasn't left it. */
  active: false,
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
      if (!pointer.active) {
        pointer.active = true;
        pointer.x = e.clientX;
        pointer.y = e.clientY;
      }
    },
    { passive: true },
  );
  document.documentElement.addEventListener("pointerleave", () => {
    pointer.active = false;
  });
}

/** Ease the lagged position toward the raw one. `ratio` is gsap.ticker.deltaRatio(). */
export function stepPointer(ratio: number) {
  const k = 1 - Math.pow(1 - LAG, ratio);
  pointer.x += (pointer.tx - pointer.x) * k;
  pointer.y += (pointer.ty - pointer.y) * k;
}
