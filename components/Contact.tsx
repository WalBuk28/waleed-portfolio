import { profile } from "@/lib/data";
import { CopyEmail } from "./contact/CopyEmail";

/**
 * Contact (DESIGN.md §11, the finale): night again, and the brightest open cluster of the page
 * (the lantern) gathers around one action. The heading is the action: "Email me", set at the
 * display size, magnetic under the hand, with light flooding it along 30°. Under it the
 * address with a copy button, and the other ways to reach him.
 */
export function Contact() {
  return (
    <section id="contact" data-chapter="6" className="contact" aria-labelledby="contact-title">
      <p className="contact__line" data-reveal="fade" data-quiet>
        Looking for SOC Analyst and <span className="whitespace-nowrap">blue-team</span> roles, mainly in the UAE.
      </p>
      <h2 id="contact-title" className="contact__h2">
        <a
          className="contact__cta"
          href={`mailto:${profile.email}`}
          data-sun
          data-magnetic
          data-cursor-fill
          data-quiet="box"
        >
          <span className="contact__flood" aria-hidden="true" />
          <span className="contact__word">Email me</span>
          <span className="contact__arrow" aria-hidden="true">
            →
          </span>
        </a>
      </h2>
      <div className="contact__foot">
        <div className="contact__address" data-reveal="fade" data-quiet="box">
          <span className="contact__email mono">{profile.email}</span>
          <CopyEmail email={profile.email} />
        </div>
        <ul className="contact__links" data-reveal="fade" data-quiet="box">
          <li>
            <a className="ulink" href={profile.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn
              <span className="ulink__arrow ulink__arrow--out" aria-hidden="true">
                ↗
              </span>
            </a>
          </li>
          <li>
            <a className="ulink" href={profile.github} target="_blank" rel="noopener noreferrer">
              GitHub
              <span className="ulink__arrow ulink__arrow--out" aria-hidden="true">
                ↗
              </span>
            </a>
          </li>
          <li>
            <a className="ulink" href={profile.cv} download="Muhammad_Waleed_CV.pdf" data-cursor="Download">
              Download CV
              <span className="ulink__arrow ulink__arrow--down" aria-hidden="true">
                ↓
              </span>
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
