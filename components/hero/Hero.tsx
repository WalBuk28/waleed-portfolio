import Link from "next/link";
import { profile } from "@/lib/data";
import { HeroMotion } from "./HeroMotion";

const fmt = (n: number) => n.toLocaleString("en-GB");

/**
 * The first screen (DESIGN.md §11): the headline in the light of one shaft, the role, one line
 * of what he does, the way into the work (and, quieter, into the 3D version), and four facts
 * with their methods. Server-rendered
 * and complete without JavaScript; the h1 never changes opacity or position (it is the LCP).
 */
export function Hero() {
  return (
    <section id="top" className="hero" data-chapter="1" data-hero aria-labelledby="hero-title">
      <h1 id="hero-title" className="hero__h1" data-band data-quiet>
        Signal through{" "}
        <span className="hero__key" data-key>
          the noise
        </span>
      </h1>
      <p className="hero__role" data-split data-intro data-quiet>
        {profile.role}
      </p>
      <div className="hero__row">
        <p className="hero__lede" data-reveal="fade" data-intro data-delay="0.2" data-quiet>
          {profile.tagline}
        </p>
        <div className="hero__ctas">
          <Link
            className="btn btn--primary hero__cta"
            href="/work/walsec-atioc-hub"
            data-magnetic
            data-cursor="Open"
          >
            <span className="btn__shape" aria-hidden="true" />
            Read the A-TIOC case study
            <span className="btn__arrow" aria-hidden="true">
              →
            </span>
          </Link>
          {/* The 3D version's way in: an outline beside the one solid violet. No prefetch, so
              the home page never fetches /journey's code; its 3D chunk loads only there. */}
          <Link className="btn btn--line hero__cta" href="/journey" prefetch={false} data-magnetic data-cursor="Open">
            <span className="btn__shape" aria-hidden="true" />
            Enter the 3D journey
            <span className="btn__arrow" aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </div>
      <ul className="hero__facts" data-reveal="fade" data-intro data-delay="0.35" data-quiet>
        {profile.stats.map((s) => (
          <li key={s.label}>
            <span className="hero__fact">
              {typeof s.value === "number" ? (
                <span data-count={s.value} data-suffix={s.suffix ?? ""}>
                  {fmt(s.value)}
                  {s.suffix}
                </span>
              ) : (
                s.value
              )}
            </span>
            <span className="hero__note">{s.label}</span>
          </li>
        ))}
      </ul>
      <HeroMotion />
    </section>
  );
}
