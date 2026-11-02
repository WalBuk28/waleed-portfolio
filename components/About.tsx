import { profile } from "@/lib/data";
import { AboutMotion } from "./about/AboutMotion";

/**
 * About (DESIGN.md §11, statement in daylight): the screen retracts and the room floods, so the
 * one section with a light ground carries the one first-person statement. The ink comes from
 * the global set, which the driver flips with the ground; without GL the section paints its own
 * daylight. As the reading line passes, each word turns from muted to ink.
 */
export function About() {
  return (
    <section id="about" data-chapter="5" className="about" aria-labelledby="about-title">
      <h2 id="about-title" className="about__h2" data-split data-quiet>
        About
      </h2>
      <p className="about__statement" data-words data-quiet>
        {profile.statement}
      </p>
      <p className="about__where mono" data-reveal="fade" data-quiet>
        {profile.location}
      </p>
      <AboutMotion />
    </section>
  );
}
