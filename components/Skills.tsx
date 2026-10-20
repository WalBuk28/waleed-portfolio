import Link from "next/link";
import { caseStudies, skillGroups } from "@/lib/data";
import { WalSecMark } from "./brand/WalSecMark";
import { SkillsMotion } from "./skills/SkillsMotion";

const titleOf = (slug: string) => caseStudies.find((c) => c.slug === slug)?.title ?? slug;

/**
 * Skills (DESIGN.md §11, gallery wall): six groups hung on the column 1, 5 and 9 lines, the
 * middle column hung lower, so the wall reads like the lattice's offset rows. Each group hangs
 * from a mark tile that locks in as it arrives. No self-ratings: each names the case studies
 * where the work can be checked. The jali's patterned light slides across with the scroll, and
 * falls on a group while it's hovered or focused.
 */
export function Skills() {
  const columns = [skillGroups.slice(0, 2), skillGroups.slice(2, 4), skillGroups.slice(4, 6)];
  return (
    <section id="skills" data-chapter="3" className="skills" aria-labelledby="skills-title">
      <div className="skills__head">
        <h2 id="skills-title" className="h2 skills__h2" data-split data-quiet>
          Skills, with the evidence
        </h2>
        <p className="skills__lede" data-reveal="fade" data-quiet>
          No self-ratings. Each group names the case studies where you can check the work.
        </p>
      </div>
      <div className="skills__wall">
        {columns.map((col, i) => (
          <div key={i} className="skills__col">
            {col.map((g) => (
              <article key={g.title} className="skills__group" data-group data-quiet="box">
                <WalSecMark className="skills__tile" color="currentColor" lockIn />
                <h3 className="skills__h3">{g.title}</h3>
                <ul className="skills__tools">
                  {g.skills.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
                <p className="skills__shown">Shown in</p>
                <ul className="skills__evidence">
                  {g.evidence.map((slug) => (
                    <li key={slug}>
                      <Link href={`/work/${slug}`} className="ilink">
                        {titleOf(slug)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        ))}
      </div>
      <SkillsMotion />
    </section>
  );
}
