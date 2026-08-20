<div align="center">
    <img src="https://cdn.jsdelivr.net/gh/VisionNext100/VisionNext100.github.io/public/images/readme/newbanner.jpg" width="800" alt="VisionNext100 Personal Homepage">
    <br>
</div>

# Yehan Wang — Personal Homepage

<div align="center">

**English** | [中文](./README.zh-CN.md)  
https://visionnext100.github.io

</div>

## I. Copyright

© 2026 Yehan Wang (王业涵). All rights reserved.

This repository is published for personal portfolio and deployment purposes only.
No license is granted to use, copy, modify, distribute, or create derivative works
from the source code, text, images, photos, videos, or data in this project
without prior written permission from the copyright holder.

## II. Architecture

A Vite SPA: long-scroll home page plus three Life sub-routes. Content is mostly data files; pages stay thin.

<div align="center">
    <img src="https://cdn.jsdelivr.net/gh/VisionNext100/VisionNext100.github.io/public/images/readme/architecture.jpg" width="800" alt="Project architecture">
    <br>
</div>

| Layer                         | Role                                                    |
| ----------------------------- | ------------------------------------------------------- |
| **Vite + React + TypeScript** | App shell, components, typed content                    |
| **React Router**              | `/` (hash sections) and `/life/sports                   | travelling | photography` |
| **Framer Motion**             | Hero / section motion                                   |
| **Leaflet**                   | Travel map & sports GPS tracks                          |
| **Formspree**                 | Contact form backend (id via `VITE_FORMSPREE_ID`)       |
| **`src/data/`**               | Editable copy, projects, sports, travel, photography    |
| **`public/`**                 | Watermarked media, GeoJSON, CV — served as static files |

Hand-written CSS (no UI kit). Maps and Life pages load assets from `/images/...` and `/data/...`.

## III. Workflows

### I. Deploy (push → live)

<div align="center">
    <img src="https://cdn.jsdelivr.net/gh/VisionNext100/VisionNext100.github.io/public/images/readme/deploy.jpg" width="800" alt="Deploy workflow">
    <br>
</div>

Secret required: `VITE_FORMSPREE_ID` (Actions → Secrets).

### II. Local content pipeline (Life)

Originals stay on the machine; only processed outputs are committed.

<div align="center">
    <img src="https://cdn.jsdelivr.net/gh/VisionNext100/VisionNext100.github.io/public/images/readme/pipeline.jpg" width="800" alt="Life content pipeline">
    <br>
</div>

| Kind             | Steps                                                                                                                                          |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| **Sports (GPX)** | `raw/sports/` → `node scripts/process-gpx.mjs` → commit `public/data/sports/` + `sports.generated.json`. Pool swims: edit `sports.ts` by hand. |
| **Travelling**   | `raw/travelling/` → watermark script → register in `travel.ts` (+ GeoJSON under `public/data/travel/` if needed).                              |
| **Photography**  | `raw/photography/` → watermark → `build-photo-meta.mjs` → add `frame(...)` in `photography.ts`.                                                |

## IV. One-time GitHub setup

1. Repo → **Settings → Pages**
2. **Build and deployment → Source**: choose **GitHub Actions**
3. Repo → **Settings → Secrets and variables → Actions**
4. New repository secret:
   - Name: `VITE_FORMSPREE_ID`
   - Value: your Formspree form id (e.g. `xrenjeek`)

Then push to `main` (or run the workflow manually). The site should appear at https://visionnext100.github.io within 1–2 minutes.

## V. Local setup

```bash
npm install
cp .env.example .env
```

```env
VITE_FORMSPREE_ID=xxxxxxxx
```

```bash
npm run dev
```

Open http://localhost:5173 — then scroll to **Life**, or visit:

- http://localhost:5173/life/sports
- http://localhost:5173/life/travelling
- http://localhost:5173/life/photography

```bash
npm run build
npm run preview
```

## VI. Site structure

| Area                | What it is                                                                                            |
| ------------------- | ----------------------------------------------------------------------------------------------------- |
| Home page           | Long-scroll sections: About, Skills, Projects, Publications, Internship, Education, Life hub, Contact |
| `/life/sports`      | Activity list + GPS track map / swim board                                                            |
| `/life/travelling`  | Interactive map of places visited                                                                     |
| `/life/photography` | Coverflow photo gallery                                                                               |

## VII. Content layout

| Path                         | Purpose                                |
| ---------------------------- | -------------------------------------- |
| `public/images/profile/`     | Profile photo                          |
| `public/images/projects/`    | Project covers                         |
| `public/images/life/`        | Life hub cover images                  |
| `public/images/travel/`      | Travel photos (watermarked)            |
| `public/images/photography/` | Photography (watermarked)              |
| `public/images/readme/`      | README diagrams                        |
| `public/data/sports/`        | Desensitized track GeoJSON             |
| `public/data/travel/`        | Region boundary GeoJSON                |
| `public/images/contact/`     | Contact illustration                   |
| `public/images/brands/`      | Internship / school logos              |
| `public/cv/`                 | Resume PDF                             |
| `src/data/`                  | Editable content                       |
| `raw/` · `scripts/`          | Local originals & tooling (gitignored) |
