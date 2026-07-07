# Waleed Bukhari — Portfolio (v3 · Dark Spatial Journey)

A world-class, cyber-inspired portfolio for **Syed Muhammad Waleed Bukhari**,
Cybersecurity Engineer & Developer. Built to showcase threat-intelligence,
network-forensics, SOC-automation and software-engineering work for top-tier job
applications.

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS · Framer Motion ·
React Three Fiber · drei · @react-three/postprocessing · WebAudio.

## 🛰 The 3D Journey (v3 · opt-in at `/journey`)

The **2D site is the default** — recruiters get instant, scannable content.
The cinematic mode lives at [`/journey`](https://walsec.com/journey): a
hacker's terminal boots, the lid hinges open, and a fiber-optic data stream
pulls the camera down through every section — projects as interactive 3D
artifacts, a skills "stargate", internship access-badges, the operator dossier
and an uplink gate. It's advertised by the hero's **“Enter the 3D journey”**
CTA and a floating corner button.

- **Everything lives in [`experience/`](experience/)** — one persistent
  `<Canvas>` + `<ScrollControls>`; the camera spline in
  [`experience/journey.ts`](experience/journey.ts) is the single source of
  truth (move a point there and the stream, artifacts and panels re-flow).
- **Zero downloaded assets** — the laptop is procedural, all text is
  canvas-baked from the site's own mono font, and the dark-synth soundtrack +
  server-rack hum are synthesized in WebAudio
  ([`experience/audio/engine.ts`](experience/audio/engine.ts)).
- **Progressive enhancement** — the same server-rendered 2D content sits under
  the gate on both routes (crawlers, no-JS, no-WebGL all get it), the journey
  HUD has `▸ Contact` (warp to the uplink gate) and `▢ 2D` escape hatches, and
  `?view=3d` / `?view=flat` still force a mode on any route. `/journey` is
  `noindex` so search engines only rank the canonical site.
- **Share the right link per channel** — CV / applications → `walsec.com`;
  LinkedIn featured section, GitHub profile, posts → `walsec.com/journey`.
- Content still flows from `lib/data.ts` — the 3D world reads the exact same
  case studies, skills, experience and profile.

## ✨ 2D-mode highlights

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
