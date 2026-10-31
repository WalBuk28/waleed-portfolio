import { certifications, education, experience } from "@/lib/data";
import { ExperienceMotion } from "./experience/ExperienceMotion";

const [internship, simulations] = experience;

// The four chapters, in reading order. `period` is echoed large on the sticky stage (desktop).
const chapters = [
  { key: "internship", period: internship.period, kind: internship.kind },
  { key: "simulations", period: simulations.period, kind: simulations.kind },
  { key: "degree", period: education.period, kind: "Degree" },
  { key: "certifications", period: "ISC2 CC, May 2026", kind: "Certifications" },
];

/**
 * Experience (DESIGN.md §11, sticky narrative): four chapters scroll on the left while, on
 * desktop, a sticky stage on the right sets the current chapter's period large and lights its
 * place in a four-tile index. Behind them the screen turns on its hinge. The stage only echoes
 * what the chapters say (aria-hidden), so every fact is in the chapters' own text.
 */
export function Experience() {
  return (
    <section id="experience" data-chapter="4" className="xp" aria-labelledby="xp-title">
      <h2 id="xp-title" className="h2 xp__h2" data-split data-quiet>
        Experience
      </h2>
      <div className="xp__body">
        <div className="xp__chapters">
          <article className="xp__ch" data-reveal="fade" data-xp="0" data-quiet="box">
            <p className="xp__when mono">
              {internship.period} · {internship.kind}
            </p>
            <h3 className="xp__h3">{internship.role}</h3>
            <p className="xp__where">
              {internship.company} · {internship.location}
            </p>
            <ul className="xp__points">
              {internship.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </article>

          <article className="xp__ch" data-reveal="fade" data-xp="1" data-quiet="box">
            <p className="xp__when mono">
              {simulations.period} · {simulations.location}
            </p>
            <h3 className="xp__h3">{simulations.role}</h3>
            <p className="xp__where">{simulations.company}</p>
            <p className="xp__flag">{simulations.kind}</p>
            <ul className="xp__points">
              {simulations.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </article>

          <article className="xp__ch" data-reveal="fade" data-xp="2" data-quiet="box">
            <p className="xp__when mono">{education.period}</p>
            <h3 className="xp__h3">{education.degree}</h3>
            <p className="xp__where">{education.school}</p>
            <p className="xp__result">{education.result}</p>
          </article>

          <article className="xp__ch" data-reveal="fade" data-xp="3" data-quiet="box">
            <p className="xp__when mono">Held, and SC-900 in progress</p>
            <h3 className="xp__h3">Certifications</h3>
            <ul className="xp__certs">
              {certifications.map((c) => (
                <li key={c.name}>
                  <span className="xp__cert">{c.name}</span>
                  <span className="xp__issuer">
                    {c.issuer}
                    {c.date ? ` · ${c.date}` : ""}
                  </span>
                  {c.detail && <span className="xp__detail">{c.detail}</span>}
                </li>
              ))}
            </ul>
          </article>
        </div>

        <div className="xp__aside" aria-hidden="true">
          <div className="xp__stage" data-quiet="sticky">
            <div className="xp__periods">
              {chapters.map((c, i) => (
                <p key={c.key} className="xp__period" data-period={i}>
                  <span className="xp__big">{c.period}</span>
                  <span className="xp__kind">{c.kind}</span>
                </p>
              ))}
            </div>
            <ol className="xp__index">
              {chapters.map((c, i) => (
                <li key={c.key} data-step={i}>
                  <svg viewBox="-14 -18 28 36" width="14" height="18">
                    <polygon points="0,-17 13,-9.5 13,9.5 0,17 -13,9.5 -13,-9.5" />
                  </svg>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
      <ExperienceMotion />
    </section>
  );
}
