<div align="center">
    <img src="https://cdn.jsdelivr.net/gh/VisionNext100/VisionNext100.github.io@main/public/images/readme/newbanner.jpg" width="800" alt="VisionNext100 Personal Homepage">
    <br>
</div>

# Yehan Wang — Personal Homepage

<div align="center">

**English** | [中文](./README.zh-CN.md)  
https://visionnext100.github.io

</div>

## I. Copyright

**© 2026 Yehan Wang (王业涵). All rights reserved.**

**This repository is published for personal portfolio and deployment purposes only.**

Viewing this repository and running it locally for personal evaluation or learning is fine.
Reusing the design, copy, photos, videos, data, or code in another project still needs prior written permission from the copyright holder.

No license is granted to use, copy, modify, distribute, or create derivative works from this project beyond the evaluation use above without that permission.

## II. Architecture Overview

This site is a Vite + React + TypeScript SPA: a long-scroll home page (`/`) with section anchors, plus Life sub-routes under `/life/*` for sports, travel, and photography. Content lives mainly in `src/data/`; media and GeoJSON ship from `public/`. Contact goes through Formspree; maps use Leaflet; privacy-friendly page views go to GoatCounter. Built by GitHub Actions and hosted on GitHub Pages. Hand-written CSS only—no UI kit.

<div align="center">
    <img src="https://cdn.jsdelivr.net/gh/VisionNext100/VisionNext100.github.io@main/public/images/readme/architecture-detailed-v1.2.0.jpg" width="1000" alt="Detailed system architecture">
    <br>
    <em>End-to-end view: SPA routes and Life pages, content/assets, local tooling, Formspree + GoatCounter, and the GitHub Actions → Pages deploy path.</em>
</div>

## III. Architecture Breakdown

The three diagrams below zoom in on parts of the overview: the technology layers, the deploy pipeline, and the local content pipeline.

### I. Stack layers

<div align="center">
    <img src="https://cdn.jsdelivr.net/gh/VisionNext100/VisionNext100.github.io@main/public/images/readme/architecture-v1.2.0.jpg" width="600" alt="Stack layers">
    <br>
    <em>Layers from visitor to host: Browser, Libraries, Content, and GitHub Pages.</em>
</div>

| Layer                         | Role                                              |
| ----------------------------- | ------------------------------------------------- |
| **Vite + React + TypeScript** | App shell, components, typed content              |
| **React Router**              | `/` section anchors plus `/life/*` sub-routes     |
| **Framer Motion**             | Hero and section motion                           |
| **Leaflet**                   | Maps on Travelling and Sports                     |
| **Formspree**                 | Contact form                                      |
| **GoatCounter**               | Privacy-friendly page views                       |
| **`src/data/`**               | Site copy, projects, skills, education, Life data |
| **`public/`**                 | Images, GeoJSON, CV, and other static assets      |

### II. Deploy pipeline

<div align="center">
    <img src="https://cdn.jsdelivr.net/gh/VisionNext100/VisionNext100.github.io@main/public/images/readme/deploy-v1.2.0.jpg" width="700" alt="Deploy pipeline">
    <br>
    <em>Push to main triggers Actions: installation, build for Formspree and GoatCounter, SPA 404 fallback, then GitHub Pages.</em>
</div>

Build env (optional):

- **Secret** `VITE_FORMSPREE_ID` — contact form 
- **Variable** `VITE_GOATCOUNTER_ENDPOINT` — analytics

### III. Content pipeline

Day-to-day edits (About, projects, skills, internship, education, contact) live in `src/data/*.ts` and matching files under `public/images/`.

Life media has an extra local pipeline: originals stay on the machine; only processed outputs are committed.

<div align="center">
    <img src="https://cdn.jsdelivr.net/gh/VisionNext100/VisionNext100.github.io@main/public/images/readme/pipeline-v1.2.0.jpg" width="550" alt="Content pipeline">
    <br>
    <em>Local-only raw/ and scripts/ feed committed public/ and src/data/ outputs.</em>
</div>

| Kind            | Steps                                                                                                                                          |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| **Sports**      | `raw/sports/` → `node scripts/process-gpx.mjs` → commit `public/data/sports/` + `sports.generated.json`. Pool swims: edit `sports.ts` by hand. |
| **Travelling**  | `raw/travelling/` → watermark script → register in `travel.ts` (+ GeoJSON under `public/data/travel/` if needed).                              |
| **Photography** | `raw/photography/` → watermark → `build-photo-meta.mjs` → add `frame(...)` in `photography.ts`.                                                |

## IV. One-time GitHub setup

1. Repo → Settings → Pages
2. Build and deployment → Source: GitHub Actions
3. Repo → Settings → Secrets and variables → Actions
4. Secrets → New repository secret:
   - Name: `VITE_FORMSPREE_ID`
   - Value: your Formspree form id
5. Variables → New repository variable:
   - Name: `VITE_GOATCOUNTER_ENDPOINT`
   - Value: `https://YOURCODE.goatcounter.com/count`

Then push to `main`, or run the workflow manually. The site should appear at https://visionnext100.github.io later.

Neither Formspree nor GoatCounter is required to browse or build the site, omit them and those features simply stay inactive.

## V. Local setup

```bash
npm install
cp .env.example .env
```

```env
VITE_FORMSPREE_ID=xxxxxxxx
VITE_GOATCOUNTER_ENDPOINT=https://YOURCODE.goatcounter.com/count
```

```bash
npm run dev
```

Open http://localhost:5173 for the full home page.

```bash
npm run build
npm run preview
```

## VI. Site structure

| Area                | What it is                                                                                        |
| ------------------- | ------------------------------------------------------------------------------------------------- |
| `/` Home            | Long-scroll portfolio: Home, Skills, Projects, Publications, Internship, Education, Life, Contact |
| `/life/sports`      | Sports log, GPS tracks, swim board                                                                |
| `/life/travelling`  | Interactive travel map                                                                            |
| `/life/photography` | Coverflow photo gallery                                                                           |

## VII. Content layout

| Path                         | Purpose                                     |
| ---------------------------- | ------------------------------------------- |
| `src/data/`                  | Editable site content                       |
| `public/images/profile/`     | Profile photo                               |
| `public/images/projects/`    | Project covers                              |
| `public/images/brands/`      | Internship / school logos                   |
| `public/images/contact/`     | Contact illustration                        |
| `public/cv/`                 | Resume PDF (optional; soft-fail if missing) |
| `public/images/life/`        | Life hub covers                             |
| `public/images/travel/`      | Travel photos (watermarked)                 |
| `public/images/photography/` | Photography (watermarked)                   |
| `public/data/sports/`        | Desensitized track GeoJSON                  |
| `public/data/travel/`        | Region boundary GeoJSON                     |
| `public/images/readme/`      | README diagrams                             |
| `raw/` · `scripts/`          | Local originals & tooling                   |
