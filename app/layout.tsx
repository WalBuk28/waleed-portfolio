import type { Metadata, Viewport } from "next";
import { Archivo, Martian_Mono } from "next/font/google";
import { profile } from "@/lib/data";
import { Analytics } from "@vercel/analytics/next";
import { Engine } from "@/lib/engine/next";
import { posterTile } from "@/components/screen/poster";
import "./globals.css";

// Two OFL families, self-hosted by next/font (DESIGN.md §5). Archivo carries display and text
// through its width axis; Martian Mono sets data only (IDs, CVEs, dates), so it isn't preloaded.
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-sans",
  display: "swap",
});
const martian = Martian_Mono({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-mono",
  display: "swap",
  preload: false,
});

const url = "https://walsec.com";
// His name appears in full and only in full (docs/FACTS.md), in the title, metadata and JSON-LD.
const title = `${profile.name}, ${profile.role} in Dubai`;
// At most 160 characters.
const description = `${profile.name}, SOC Analyst in Dubai. BSc Cyber Security, First Class Honours. Ten case studies, with the evidence and repos behind them.`;

// Structured data (schema.org) so search engines tie the name to the role, the degree and the
// profiles he links. Only facts from docs/FACTS.md.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${url}/#person`,
      name: profile.name,
      // Search alias only, never displayed: a search for the short name still finds him
      // (Waleed, 25 Nov 2026; docs/FACTS.md).
      alternateName: profile.searchAlias,
      url,
      image: `${url}/opengraph-image`,
      jobTitle: profile.role,
      email: `mailto:${profile.email}`,
      address: { "@type": "PostalAddress", addressLocality: "Dubai", addressCountry: "AE" },
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "De Montfort University",
        sameAs: "https://www.dmu.ac.uk/",
      },
      hasCredential: {
        "@type": "EducationalOccupationalCredential",
        credentialCategory: "degree",
        name: "BSc (Hons) Cyber Security, First Class Honours",
      },
      knowsAbout: [
        "Security operations",
        "Threat intelligence",
        "Network forensics",
        "Malware analysis",
        "MITRE ATT&CK",
        "SIEM",
      ],
      sameAs: [profile.github, profile.linkedin],
    },
    {
      "@type": "WebSite",
      "@id": `${url}/#website`,
      url,
      name: "WalSec",
      author: { "@id": `${url}/#person` },
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: {
    default: title,
    template: `%s · ${profile.name}`,
  },
  description,
  keywords: [
    "SOC Analyst",
    "Blue team",
    "Threat Intelligence",
    "Network Forensics",
    "SOC Automation",
    "Malware Analysis",
    "MITRE ATT&CK",
    "Dubai",
    profile.name,
    profile.searchAlias,
  ],
  authors: [{ name: profile.fullName, url }],
  creator: profile.fullName,
  openGraph: {
    type: "website",
    url,
    title,
    description,
    siteName: "WalSec",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0a0f24",
  colorScheme: "dark",
};

// Runs before first paint. `motion` gates hidden-before-reveal styles (content stays visible
// without JS and under reduced motion); `gl-pending` hides the poster while the WebGL screen
// may still arrive; `intro-pending` marks the first visit of the session (the intro plays).
const flags = `(function(){var c=document.documentElement.classList;c.add('js');var m=!matchMedia('(prefers-reduced-motion: reduce)').matches;if(!m)return;c.add('motion');var n=navigator.connection;if(!(n&&n.saveData)&&'WebGLRenderingContext' in window)c.add('gl-pending');try{if(!sessionStorage.getItem('walsec-intro'))c.add('intro-pending')}catch(e){}})()`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${martian.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: flags }} />
      </head>
      <body className="text-ink">
        <script
          type="application/ld+json"
          // Escape "<" so no string in the data can close the script tag.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        <a
          href="#main"
          className="skip-link"
        >
          Skip to content
        </a>
        {/* Persistent layers: the WebGL screen's host and the cursor follower. */}
        <div id="gl" aria-hidden="true" />
        <div id="cursor" aria-hidden="true" data-ground>
          <svg viewBox="-14 -18 28 36" width="26" height="34">
            <polygon points="0,-17 13,-9.5 13,9.5 0,17 -13,9.5 -13,-9.5" />
          </svg>
          <span data-cursor-label />
        </div>
        {children}
        {/* The page transition's curtain: the screen, closed (lib/engine/transition.ts). */}
        <div id="curtain" aria-hidden="true" style={{ "--poster-tile": posterTile() } as React.CSSProperties}>
          <div className="curtain__rim" />
          <div className="curtain__panel" />
        </div>
        {/* Vercel serves the analytics script; elsewhere (local review) it would 404. */}
        {process.env.VERCEL === "1" && <Analytics />}
        <Engine />
      </body>
    </html>
  );
}
