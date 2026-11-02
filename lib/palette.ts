// The command palette's entries, built on the server and passed down as props, so the
// palette's client code never imports the case-study bodies.
import { caseStudies, navLinks, profile } from "@/lib/data";

export type PaletteItem = { id: string; label: string; hint: string; href: string; keywords: string };

export function paletteItems(): PaletteItem[] {
  return [
    ...navLinks.map((l) => ({ id: `nav-${l.href}`, label: l.label, hint: "Section", href: l.href, keywords: l.label.toLowerCase() })),
    ...caseStudies.map((c) => ({
      id: `work-${c.slug}`,
      label: c.title,
      hint: "Case study",
      href: `/work/${c.slug}`,
      keywords: `${c.title} ${c.slug} ${c.tags.join(" ")}`.toLowerCase(),
    })),
    { id: "email", label: "Email Waleed", hint: "Contact", href: `mailto:${profile.email}`, keywords: "email contact mail" },
    { id: "cv", label: "Download CV", hint: "File", href: profile.cv, keywords: "cv resume download pdf" },
    { id: "github", label: `GitHub: @${profile.handle}`, hint: "External", href: profile.github, keywords: "github code repo source" },
    { id: "linkedin", label: "LinkedIn", hint: "External", href: profile.linkedin, keywords: "linkedin connect" },
  ];
}
