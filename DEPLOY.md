# Deployment

This repo already deploys to **Vercel** from GitHub
(`WalBuk28/waleed-portfolio` → walsec.com). Because the Vercel project watches
the `main` branch, **pushing to GitHub is all you need** — Vercel rebuilds and
promotes to production automatically.

## Option A — push to GitHub (triggers the existing Vercel deploy)

```bash
# from the project root
git add -A
git commit -m "v2: redesigned portfolio"
git push origin main
```

Vercel picks up the push, runs `npm run build`, and promotes to production on
success. Watch it at: https://vercel.com/walbuk28s-projects

## Option B — deploy straight from the CLI with Vercel

Use this to preview or promote without going through GitHub.

```bash
# 1. Install the CLI (once)
npm i -g vercel

# 2. Authenticate (opens the browser)
vercel login

# 3. Link this folder to the existing Vercel project (once)
vercel link          # choose scope: walbuk28's projects → waleed-portfolio

# 4a. Deploy a PREVIEW build (unique URL, not production)
vercel

# 4b. Deploy straight to PRODUCTION (walsec.com)
vercel --prod
```

## First-time project (only if the Vercel project does NOT exist yet)

```bash
npm i -g vercel
vercel login
vercel                # answer the prompts; framework auto-detected as Next.js
vercel --prod         # promote to production
# then, in the Vercel dashboard, add the custom domain walsec.com
```

## Notes

- **Framework preset:** Next.js (auto-detected). No custom build settings needed.
- **Build command:** `next build` · **Output:** `.next` (managed by Vercel).
- **Node:** 18+ (Vercel defaults are fine).
- No environment variables are required — the site is fully static/SSG.
