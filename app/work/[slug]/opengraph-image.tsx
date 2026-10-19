import { caseStudies, profile } from "@/lib/data";
import { ogCard, ogContentType, ogSize } from "@/lib/og";

export const alt = "WalSec case study: title, category and summary";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = caseStudies.find((c) => c.slug === slug);
  return ogCard({
    kicker: study ? [study.category, study.year].filter(Boolean).join(" · ") : "Case study",
    title: study?.title ?? "Case study",
    sub: study?.tagline ?? "",
    foot: `${profile.name} · ${profile.role}`,
  });
}
