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

**© 2026 Yehan Wang (王业涵). All rights reserved.**

**This repository is published for personal portfolio and deployment purposes only.**

Viewing this repository and running it locally for personal evaluation or learning is fine.
Reusing the design, copy, photos, videos, data, or code in another project still needs prior written permission from the copyright holder.

No license is granted to use, copy, modify, distribute, or create derivative works from this project beyond the evaluation use above without that permission.

## II. Architecture

A Vite + React SPA for a personal portfolio site: a long-scroll home page with Life sub-pages for sports, travel, and photography.

<div align="center">
    <img src="https://cdn.jsdelivr.net/gh/VisionNext100/VisionNext100.github.io/public/images/readme/architecture.jpg" width="800" alt="Project architecture">
    <br>
</div>

| Layer                         | Role                                              |
| ----------------------------- | ------------------------------------------------- |
| **Vite + React + TypeScript** | App shell, components, typed content              |
| **React Router**              | `/` section anchors plus `/life/*` sub-routes     |
| **Framer Motion**             | Hero and section motion                           |
| **Leaflet**                   | Maps on Travelling and Sports                     |
| **Formspree**                 | Contact form                                      |
| **`src/data/`**               | Site copy, projects, skills, education, Life data |
| **`public/`**                 | Images, GeoJSON, CV, and other static assets      |

Hand-written CSS without UI kit. Static files are served from `/images/...`, `/data/...`, and `/cv/...`.

## III. Workflows

### I. Deploy (push → live)

<div align="center">
    <img src="https://cdn.jsdelivr.net/gh/VisionNext100/VisionNext100.github.io/public/images/readme/deploy.jpg" width="800" alt="Deploy workflow">
    <br>
</div>

Secret required: `VITE_FORMSPREE_ID` (Actions → Secrets).

### II. Updating site content

Day-to-day edits (About text, projects, skills, internship, education, contact) are in `src/data/*.ts` and matching assets under `public/images/`.

Life media has an extra local pipeline: originals stay on the machine; only processed outputs are committed.

<div align="center">
    <img src="https://cdn.jsdelivr.net/gh/VisionNext100/VisionNext100.github.io/public/images/readme/pipeline.jpg" width="800" alt="Content pipeline">
    <br>
</div>

| Kind            | Steps                                                                                                                                          |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| **Sports**      | `raw/sports/` → `node scripts/process-gpx.mjs` → commit `public/data/sports/` + `sports.generated.json`. Pool swims: edit `sports.ts` by hand. |
| **Travelling**  | `raw/travelling/` → watermark script → register in `travel.ts` (+ GeoJSON under `public/data/travel/` if needed).                              |
| **Photography** | `raw/photography/` → watermark → `build-photo-meta.mjs` → add `frame(...)` in `photography.ts`.                                                |

`raw/` and `scripts/` are gitignored and are not required to run or deploy the site.

## IV. One-time GitHub setup

1. Repo → **Settings → Pages**
2. **Build and deployment → Source**: choose **GitHub Actions**
3. Repo → **Settings → Secrets and variables → Actions**
4. New repository secret:
   - Name: `VITE_FORMSPREE_ID`
   - Value: your Formspree form id

Then push to `main`, or run the workflow manually. The site should appear at https://visionnext100.github.io later.

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

Open http://localhost:5173 for the full home page.

```bash
npm run build
npm run preview
```

## VI. Site structure

| Area                | What it is                                                                                               |
| ------------------- | -------------------------------------------------------------------------------------------------------- |
| `/` Home            | Long-scroll portfolio: Home, About, Skills, Projects, Publications, Internship, Education, Life, Contact |
| `/life/sports`      | Sports log, GPS tracks, swim board                                                                       |
| `/life/travelling`  | Interactive travel map                                                                                   |
| `/life/photography` | Coverflow photo gallery                                                                                  |

## VII. Content layout

| Path                         | Purpose                     |
| ---------------------------- | --------------------------- |
| `src/data/`                  | Editable site content       |
| `public/images/profile/`     | Profile photo               |
| `public/images/projects/`    | Project covers              |
| `public/images/brands/`      | Internship / school logos   |
| `public/images/contact/`     | Contact illustration        |
| `public/cv/`                 | Resume PDF                  |
| `public/images/life/`        | Life hub covers             |
| `public/images/travel/`      | Travel photos (watermarked) |
| `public/images/photography/` | Photography (watermarked)   |
| `public/data/sports/`        | Desensitized track GeoJSON  |
| `public/data/travel/`        | Region boundary GeoJSON     |
| `public/images/readme/`      | README diagrams             |
| `raw/` · `scripts/`          | Local originals & tooling   |
