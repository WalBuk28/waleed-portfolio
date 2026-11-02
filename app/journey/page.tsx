import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { JourneyGate, JourneyStart, JourneyStatus } from "@/experience";
import { Frame } from "@/components/frame/Frame";
import { posterTile } from "@/components/screen/poster";

export const metadata: Metadata = {
  title: "3D version",
  description: "The opt-in 3D version of the WalSec portfolio: boot the terminal, ride the data stream and open the case files.",
  alternates: { canonical: "/journey" },
  robots: { index: false, follow: true },
};

/**
 * The opt-in 3D version (React Three Fiber, its own renderer and native scroll). The card below
 * is server-rendered and paints at once: it is what shows while the scene loads, under reduced
 * motion (where the scene waits for a click), and without WebGL or JavaScript. The gate mounts
 * the scene over it once WebGL is confirmed, then lets the card go.
 */
export default function JourneyPage() {
  return (
    <JourneyGate>
      <div className="screen-page missing-page" style={{ "--poster-tile": posterTile() } as CSSProperties}>
        <Frame page="missing" label="3D version" />
        <main id="main" tabIndex={-1} className="missing">
          <p className="missing__code mono">Opt-in</p>
          <h1 className="missing__h1">The 3D version</h1>
          <JourneyStatus className="missing__line" />
          <div className="missing__ctas">
            <Link className="btn btn--primary" href="/" data-magnetic data-cursor="Open">
              <span className="btn__shape" aria-hidden="true" />
              Back to the home page
              <span className="btn__arrow" aria-hidden="true">
                →
              </span>
            </Link>
            <JourneyStart className="btn btn--ghost jstart" label="Start the 3D version" />
          </div>
        </main>
      </div>
    </JourneyGate>
  );
}
