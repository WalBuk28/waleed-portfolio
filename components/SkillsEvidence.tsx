import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { caseStudies, skillGroups } from "@/lib/data";

const titleOf = (slug: string) =>
  caseStudies.find((c) => c.slug === slug)?.title ?? slug;

/**
 * Evidence map: each skill domain links to the case studies that show it,
 * so a reader checks the work instead of trusting a self-rating.
 */
export function SkillsEvidence() {
  return (
    <figure className="w-full">
      <figcaption className="font-mono text-2xs uppercase tracking-wider2 text-ink-muted">
        Where to check each domain
      </figcaption>
      <dl className="mt-4 space-y-4">
        {skillGroups.map((g) => (
          <div key={g.title}>
            <dt className="font-display text-sm font-semibold text-ink">
              {g.title}
            </dt>
            <dd className="mt-1.5">
              <ul className="space-y-1">
                {g.evidence.map((slug) => (
                  <li key={slug}>
                    <Link
                      href={`/work/${slug}`}
                      className="inline-flex items-center gap-1 text-sm text-ink-secondary transition-colors hover:text-emerald-accent"
                    >
                      {titleOf(slug)}
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        ))}
      </dl>
    </figure>
  );
}
