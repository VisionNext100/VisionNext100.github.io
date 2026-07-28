# Yehan Wang — Personal Homepage

English personal site for https://visionnext100.github.io

## Stack

- Vite + React + TypeScript
- Framer Motion
- Formspree (contact form)

## Setup

```bash
npm install
cp .env.example .env
```

Create a Formspree form linked to `3276924450@qq.com`, then set:

```env
VITE_FORMSPREE_ID=xxxxxxxx
```

## Develop

```bash
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

Deploy the `dist/` folder to the `visionnext100.github.io` repository (GitHub Pages).

## Content layout

| Path | Purpose |
|------|---------|
| `public/images/profile/` | Profile photo |
| `public/images/projects/` | Project covers |
| `public/images/contact/` | Contact illustration |
| `public/cv/` | Resume PDF |
| `src/data/` | Editable content (projects, skills, …) |
| `docs/PLAN.md` | Original plan document |
