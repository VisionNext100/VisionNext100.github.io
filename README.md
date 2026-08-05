# Yehan Wang — Personal Homepage

**English** | [中文](./README.zh-CN.md)

## Stack

- Vite + React + TypeScript
- Framer Motion
- Leaflet (travel map & sports tracks)
- Formspree (contact form)
- GitHub Actions → GitHub Pages

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
```

Open http://localhost:5173 — then scroll to **Life**, or visit:

- http://localhost:5173/life/sports
- http://localhost:5173/life/travelling
- http://localhost:5173/life/photography

```bash
npm run build
npm run preview
```

## Site structure

| Area | What it is |
|------|------------|
| Home page | Long-scroll sections: About, Skills, Projects, Publications, Internship, Education, Life hub, Contact |
| `/life/sports` | Activity list + GPS track map / swim board |
| `/life/travelling` | Interactive map of places visited |
| `/life/photography` | Coverflow photo gallery |

Most copy and lists live under `src/data/` so you can edit content without rewriting page layout.

## Adding Life content later

`raw/` (originals) and `scripts/` (GPX / watermark tools) are **gitignored** and must not be pushed.

### Sports (GPX)

1. Drop new `.gpx` files into `raw/sports/`
2. Run `node scripts/process-gpx.mjs`
3. Commit generated files under `public/data/sports/` and `src/data/sports.generated.json`
4. Pool swims without GPS are edited by hand in `src/data/sports.ts`

### Travelling

1. Put originals in `raw/travelling/`
2. Run `node scripts/watermark-photos.mjs`
3. Register the place / photo in `src/data/travel.ts` (and province GeoJSON under `public/data/travel/` if needed)

### Photography

1. Put originals in `raw/photography/`
2. Run `node scripts/watermark-photos.mjs`
3. Run `node scripts/build-photo-meta.mjs`
4. Append one `frame(...)` line in `src/data/photography.ts`

## Content layout

| Path | Purpose |
|------|---------|
| `public/images/profile/` | Profile photo |
| `public/images/projects/` | Project covers |
| `public/images/life/` | Life hub cover images |
| `public/images/travel/` | Travel photos (watermarked) |
| `public/images/photography/` | Photography (watermarked) |
| `public/data/sports/` | Desensitized track GeoJSON |
| `public/data/travel/` | Region boundary GeoJSON |
| `public/images/contact/` | Contact illustration |
| `public/images/brands/` | Internship / school logos |
| `public/cv/` | Resume PDF |
| `src/data/` | Editable content |
| `docs/PLAN.md` | Plan document (Chinese) |
