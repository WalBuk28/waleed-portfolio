import type { CSSProperties } from "react";
import { BRAND_GREEN, PIECE_IDS, PIECES, VIEWBOX, pointsAttr, type PieceId } from "./wall";

// Optional entrance: pieces slide home along their lattice normals, floor
// first, roof last — the shield locking together (CSS in globals.css).
const LOCK_IN: Record<PieceId, [dx: number, dy: number, delayMs: number]> = {
  BL: [-30, 52, 0], BR: [30, 52, 0],
  ML: [-24, 42, 60], MR: [24, 42, 60],
  L: [-56, 0, 120], R: [56, 0, 120],
  NL: [-34, 0, 180], NR: [34, 0, 180],
  TL: [-30, -52, 240], TR: [30, -52, 240],
};

/**
 * The WalSec "Interlocking Wall" mark as inline SVG — crisp at any size.
 * Decorative by default; pass `title` when it stands alone as a label.
 */
export function WalSecMark({
  className,
  title,
  color = BRAND_GREEN,
  lockIn = false,
}: {
  className?: string;
  title?: string;
  color?: string;
  lockIn?: boolean;
}) {
  return (
    <svg
      viewBox={VIEWBOX}
      fill={color}
      className={lockIn ? `mark-lock ${className ?? ""}` : className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {PIECE_IDS.map((id) => (
        <polygon
          key={id}
          points={pointsAttr(PIECES[id])}
          style={
            lockIn
              ? ({
                  "--lx": `${LOCK_IN[id][0]}px`,
                  "--ly": `${LOCK_IN[id][1]}px`,
                  "--ld": `${LOCK_IN[id][2]}ms`,
                } as CSSProperties)
              : undefined
          }
        />
      ))}
    </svg>
  );
}
