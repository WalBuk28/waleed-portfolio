# Waleed Bukhari — Portfolio (v2)

A world-class, cyber-inspired portfolio for **Syed Muhammad Waleed Bukhari**,
Cybersecurity Engineer & Developer. Built to showcase threat-intelligence,
network-forensics, SOC-automation and software-engineering work for top-tier job
applications.

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS · Framer Motion.

## ✨ Highlights

- **Signature hero** — live typing boot-terminal, rotating specialisms, an
  infinite IOC threat-feed ticker, cursor spotlight and animated stat counters.
- **⌘K command palette** — jump to any section, project or contact channel.
- **Skills radar** — a hand-built SVG proficiency profile, backed by honest
  grouped skill lists (colour palette validated against the dark surface).
- **7 in-depth case studies**, each individually routed (`/work/[slug]`) and
  written like an engagement report — problem → approach → architecture →
  measured result, with custom **architecture-flow** and **MITRE kill-chain**
  visualisations.
- **Robust by construction** — content is server-rendered visible (never gated
  behind JS), scroll-reveals degrade gracefully, and everything honours
  `prefers-reduced-motion`.
- **SEO-ready** — metadata, Open Graph, sitemap, semantic landmarks, skip-link.

## 🧩 Case studies

1. **WalSec A-TIOC Hub** — privacy-first SIEM-Lite fusing network forensics with local LLMs (flagship FYP)
2. **Penetration Testing & Malware Investigations** — black-box pentest + malware reverse engineering
3. **Network Forensics & ICS Security** — Wireshark reconstruction of a SCADA attack + Cisco Packet Tracer
4. **AI-Driven Phishing Detection** — ML over 235k URLs, adversarially tested
5. **Cryptography & Encryption** — cipher design + RSA / protocol cryptanalysis
6. **ConTrust OS** — data-first construction ERP (Supabase + Next.js)
7. **Software Engineering** — C++ secure password manager + Python apps

> All content lives in [`lib/data.ts`](lib/data.ts) — edit that one file to
> update the entire site.

## 🚀 Local development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
```

## ☁️ Deploy

See [`DEPLOY.md`](DEPLOY.md) for the exact GitHub + Vercel commands.

## 🔧 Personalise

- `lib/data.ts` → contact email, links, stats, skills, case studies.
- Drop a real CV PDF into `/public` and link it from the hero if you want a
  downloadable résumé.
- Add an OG image at `/public/og.png` for richer link previews.

---

© Syed Muhammad Waleed Bukhari
