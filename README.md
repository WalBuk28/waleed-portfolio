# Waleed Bukhari — Portfolio

A world-class, cyber-inspired portfolio for **Syed Muhammad Waleed Bukhari**, Cybersecurity Engineer & Developer. Built to showcase threat-intelligence, network-forensics, SOC-automation and software-engineering work for top-tier job applications.

Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS** and **Framer Motion**.

## ✨ Features

- Dark, minimalist "cyber" aesthetic — deep charcoal canvas with neon emerald + electric-blue accents
- Animated hero with live terminal, rotating specialisms and a stat strip
- 7 in-depth, individually-routed case studies (`/work/[slug]`)
- Scroll-reveal animations, responsive mobile-first layout, accessible + `prefers-reduced-motion` aware
- Clear conversion paths ("Hire Me" / contact) in the nav, hero, contact section and footer
- SEO-ready metadata + Open Graph

## 🧩 Case studies included

1. **WalSec A-TIOC Hub** — privacy-first SIEM-Lite fusing network forensics with local LLMs (flagship FYP)
2. **Penetration Testing & Malware Investigations** — black-box pentest + malware reverse engineering
3. **Network Forensics & ICS Security** — Wireshark reconstruction of a SCADA attack + Cisco Packet Tracer
4. **AI-Driven Phishing Detection** — ML over 235k URLs, adversarially tested
5. **Cryptography & Encryption** — cipher design + RSA / protocol cryptanalysis
6. **ConTrust OS** — real-time construction-logistics platform
7. **Software Engineering** — C++ secure password manager + Python apps

> All content lives in [`lib/data.ts`](lib/data.ts) — edit that one file to update the entire site.

## 🚀 Local development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
```

## ☁️ Deploy

See [`DEPLOY.md`](DEPLOY.md) for the exact GitHub + Vercel commands.

## 🔧 Things to personalise

- `lib/data.ts` → `profile.github` (set your real GitHub handle) and `profile.email` if you prefer a different contact address
- Drop a real CV PDF into `/public` and link it from the hero/nav if you want a downloadable résumé
- Add an OG image at `/public/og.png` for richer link previews

---

© Syed Muhammad Waleed Bukhari
