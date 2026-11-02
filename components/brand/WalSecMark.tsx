import type { CSSProperties } from "react";
import { BRAND_GREEN, LOCK_IN, PIECE_IDS, PIECES, VIEWBOX, pointsAttr } from "./wall";

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
          // Each piece's lattice normal (the lock-in vector): the lock-in animation and the
          // frame's open-on-hover both read it.
          style={
            {
              "--lx": `${LOCK_IN[id][0]}px`,
              "--ly": `${LOCK_IN[id][1]}px`,
              ...(lockIn ? { "--ld": `${LOCK_IN[id][2]}ms` } : {}),
            } as CSSProperties
          }
        />
      ))}
    </svg>
  );
}
