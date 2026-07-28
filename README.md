# Yehan Wang — Personal Homepage

English personal site for https://visionnext100.github.io

## Stack

- Vite + React + TypeScript
- Framer Motion
- Formspree (contact form)
- GitHub Actions → GitHub Pages

## Why the site was blank before

Pushing the **source code** to `VisionNext100.github.io` is not enough.  
GitHub Pages needs the **built** `dist/` output. This repo now uses Actions to build and deploy automatically.

## One-time GitHub setup

1. Repo → **Settings → Pages**
2. **Build and deployment → Source**: choose **GitHub Actions**
3. Repo → **Settings → Secrets and variables → Actions**
4. New repository secret:
   - Name: `VITE_FORMSPREE_ID`
   - Value: your Formspree form id (e.g. `xrenjeek`)

Then push to `main` (or run the workflow manually). The site should appear at https://visionnext100.github.io within 1–2 minutes.

## Local setup

```bash
npm install
cp .env.example .env
```

```env
VITE_FORMSPREE_ID=xxxxxxxx
```

```bash
npm run dev
npm run build
npm run preview
```

## Content layout

| Path | Purpose |
|------|---------|
| `public/images/profile/` | Profile photo |
| `public/images/projects/` | Project covers |
| `public/images/contact/` | Contact illustration |
| `public/images/brands/` | Internship / school logos |
| `public/cv/` | Resume PDF |
| `src/data/` | Editable content |
| `docs/PLAN.md` | Plan document |
