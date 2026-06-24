# 🚀 Deploy Guide — GitHub + Vercel (free)

Two ways to ship this site for free. **Option A (Vercel CLI)** is the fastest; **Option B (GitHub → Vercel dashboard)** gives you automatic deploys on every push.

> The local git repository has already been initialised and committed for you.
> Replace `YOUR_GITHUB_USERNAME` with your real handle before running the GitHub steps.

---

## Option A — Vercel CLI (fastest, ~2 minutes)

```bash
# 1. Install the Vercel CLI globally
npm i -g vercel

# 2. Log in (opens the browser; choose GitHub/email)
vercel login

# 3. From the project root, create a preview deployment
#    Accept the defaults — framework auto-detects as "Next.js"
vercel

# 4. Promote to your production URL
vercel --prod
```

That's it — Vercel prints your live `https://<project>.vercel.app` URL.

---

## Option B — Push to GitHub, then import in Vercel (auto-deploys)

### 1. Create the GitHub repo and push

Using the GitHub CLI (recommended):

```bash
# Install once: https://cli.github.com/  then:
gh auth login
gh repo create waleed-portfolio --public --source=. --remote=origin --push
```

Or manually (after creating an empty repo on github.com):

```bash
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/waleed-portfolio.git
git branch -M main
git push -u origin main
```

### 2. Import into Vercel

1. Go to **https://vercel.com/new**
2. Click **Import** next to your `waleed-portfolio` repo
3. Framework preset auto-detects **Next.js** — leave all settings default
4. Click **Deploy**

Every future `git push` to `main` now auto-deploys. ✅

---

## Optional — custom domain

In the Vercel dashboard: **Project → Settings → Domains → Add**, then point your
domain's DNS at Vercel (it gives you the exact records). Free SSL is automatic.

## Build settings (already correct by default)

| Setting          | Value           |
| ---------------- | --------------- |
| Framework        | Next.js         |
| Build command    | `next build`    |
| Output directory | `.next`         |
| Install command  | `npm install`   |
| Node version     | 18.x or 20.x    |
