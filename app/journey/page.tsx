import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { JourneyGate } from "@/experience";
import { Frame } from "@/components/frame/Frame";
import { posterTile } from "@/components/screen/poster";

export const metadata: Metadata = {
  title: "3D version",
  description: "The opt-in 3D version of the WalSec portfolio: boot the terminal, ride the data stream and open the case files.",
  robots: { index: false, follow: true },
};

/**
 * The opt-in 3D version (React Three Fiber, its own renderer and native scroll). The gate mounts
 * it once WebGL is confirmed; underneath, server-rendered, is what shows without WebGL or
 * JavaScript: a short page that says so and leads back to the site.
 */
export default function JourneyPage() {
  return (
    <JourneyGate defaultMode="3d">
      <div className="screen-page missing-page" style={{ "--poster-tile": posterTile() } as CSSProperties}>
        <Frame page="missing" label="3D version" />
        <main id="main" tabIndex={-1} className="missing">
          <p className="missing__code mono">3D version</p>
          <h1 className="missing__h1">The 3D version needs WebGL.</h1>
          <p className="missing__line">
            It runs on JavaScript and WebGL, and this browser isn’t running them. Everything it shows is on the home
            page.
          </p>
          <Link className="btn btn--primary missing__cta" href="/" data-magnetic data-cursor="Open">
            <span className="btn__shape" aria-hidden="true" />
            Back to the home page
            <span className="btn__arrow" aria-hidden="true">
              →
            </span>
          </Link>
        </main>
      </div>
    </JourneyGate>
  );
}
