"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Global motion policy. `reducedMotion="user"` makes every framer-motion
 * component honour the OS "reduce motion" setting automatically — transforms
 * are disabled, so nothing slides; content still appears.
 */
export function Providers({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
