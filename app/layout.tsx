import type { Metadata, Viewport } from "next";
import { Archivo, Martian_Mono } from "next/font/google";
import { profile } from "@/lib/data";
import { Analytics } from "@vercel/analytics/next";
import { Engine } from "@/lib/engine/next";
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
const title = `${profile.name} (${profile.cvName}), ${profile.role} in Dubai`;
const description = `${profile.fullName} (${profile.cvName}): SOC Analyst in Dubai. BSc (Hons) Cyber Security, First Class Honours. Case studies in threat intelligence, network forensics and SOC automation, with the evidence and repos behind them.`;

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
    "Waleed Bukhari",
    "Muhammad Waleed",
    "Syed Muhammad Waleed Bukhari",
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
  themeColor: "#0a0e0d",
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
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-[var(--light-hi)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[var(--on-light)]"
        >
          Skip to content
        </a>
        {/* Persistent layers: the WebGL screen's host and the cursor follower. */}
        <div id="gl" aria-hidden="true" />
        <div id="cursor" aria-hidden="true">
          <svg viewBox="-14 -18 28 36" width="26" height="34">
            <polygon points="0,-17 13,-9.5 13,9.5 0,17 -13,9.5 -13,-9.5" />
          </svg>
          <span data-cursor-label />
        </div>
        {children}
        {/* Vercel serves the analytics script; elsewhere (local review) it would 404. */}
        {process.env.VERCEL === "1" && <Analytics />}
        <Engine />
      </body>
    </html>
  );
}
