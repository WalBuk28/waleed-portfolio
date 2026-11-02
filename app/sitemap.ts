import type { MetadataRoute } from "next";
import { caseStudies, siteUpdated } from "@/lib/data";

const base = "https://walsec.com";

// Stable dates: each URL carries the date its content last changed, not the build time.
// /journey is noindex, so it stays out.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: base, lastModified: siteUpdated, changeFrequency: "monthly", priority: 1 },
    ...caseStudies.map((c) => ({
      url: `${base}/work/${c.slug}`,
      lastModified: c.updated ?? siteUpdated,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
