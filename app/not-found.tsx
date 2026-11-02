import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Frame } from "@/components/frame/Frame";
import { Palette } from "@/components/frame/Palette";
import { posterTile } from "@/components/screen/poster";
import { paletteItems } from "@/lib/palette";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

/**
 * The 404 (DESIGN.md §8 and §11): the screen shut. No light comes through anywhere except the
 * one cell under the pointer (or a tap's ripple on a phone); one action leads home.
 */
export default function NotFound() {
  return (
    <div className="screen-page missing-page" data-screen="shut" style={{ "--poster-tile": posterTile() } as CSSProperties}>
      <Frame page="missing" label="Not found" />
      <Palette items={paletteItems()} />
      <main id="main" tabIndex={-1} className="missing" data-label="Not found">
        <p className="missing__code mono" data-quiet>
          404 · page not found
        </p>
        <h1 className="missing__h1" data-quiet>
          Nothing comes through here.
        </h1>
        <p className="missing__line" data-reveal="fade" data-intro data-quiet>
          This address isn’t a page on the site.
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
  );
}
