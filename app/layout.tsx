import type { Metadata, Viewport } from "next";
import { Inter, Sora, JetBrains_Mono } from "next/font/google";
import { profile } from "@/lib/data";
import { Providers } from "@/components/Providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
const sora = Sora({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800"],
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const url = "https://walsec.com";
const description =
  "Cybersecurity Engineer & Developer specialising in threat intelligence, network forensics and SOC automation — building the software to back it up.";

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: {
    default: `${profile.fullName} — ${profile.role}`,
    template: `%s · ${profile.name}`,
  },
  description,
  keywords: [
    "Cybersecurity Engineer",
    "Threat Intelligence",
    "Network Forensics",
    "SOC Automation",
    "Penetration Testing",
    "Malware Analysis",
    "MITRE ATT&CK",
    "Waleed Bukhari",
  ],
  authors: [{ name: profile.fullName, url }],
  creator: profile.fullName,
  openGraph: {
    type: "website",
    url,
    title: `${profile.fullName} — ${profile.role}`,
    description,
    siteName: "WalSec",
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.fullName} — ${profile.role}`,
    description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#090d12",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${sora.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-base text-ink">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-emerald-accent focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-void"
        >
          Skip to content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
