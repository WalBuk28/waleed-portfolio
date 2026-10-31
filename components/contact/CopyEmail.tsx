"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Copies the address. "Copied" lights the button's cell for 1.8 s (timed on the GSAP ticker)
 * and is announced. Without JavaScript the button is hidden; the mailto link still works.
 */
export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const reset = useRef<gsap.core.Tween | null>(null);
  useEffect(() => () => void reset.current?.kill(), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      return; // clipboard unavailable: the mailto link still works
    }
    setCopied(true);
    reset.current?.kill();
    reset.current = gsap.delayedCall(1.8, () => setCopied(false));
  };

  return (
    <button type="button" className={`btn btn--ghost btn--copy${copied ? " is-copied" : ""}`} onClick={copy}>
      <span className="btn__shape" aria-hidden="true" />
      <span aria-live="polite">{copied ? "Copied" : "Copy address"}</span>
    </button>
  );
}
