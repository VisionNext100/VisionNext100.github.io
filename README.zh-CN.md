# 王业涵 — 个人主页

[English](./README.md) | **中文**

## 版权声明

© 2026 王业涵（Yehan Wang）。保留所有权利。

本仓库仅用于个人作品展示与站点部署。
未经版权所有者事先书面许可，任何人不得使用、复制、修改、分发本项目中的
源代码、文字、图片、摄影作品、视频或数据，也不得基于上述内容创作衍生作品。

## 技术栈

- Vite + React + TypeScript
- Framer Motion
- Leaflet（旅行地图与运动轨迹）
- Formspree（联系表单）
- GitHub Actions → GitHub Pages

## GitHub 一次性配置

1. 仓库 → **Settings → Pages**
2. **Build and deployment → Source**：选择 **GitHub Actions**
3. 仓库 → **Settings → Secrets and variables → Actions**
4. 新建仓库密钥：
   - Name: `VITE_FORMSPREE_ID`
   - Value: 你的 Formspree 表单 id（例如 `xrenjeek`）

然后推送到 `main`（或手动跑一遍工作流）。大约 1–2 分钟后站点会出现在 https://visionnext100.github.io 。

## 本地运行

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

浏览器打开 http://localhost:5173 — 滚动到 **Life**，或直接访问：

- http://localhost:5173/life/sports
- http://localhost:5173/life/travelling
- http://localhost:5173/life/photography

```bash
npm run build
npm run preview
```

## 站点结构

| 区域 | 内容 |
|------|------|
| 主页 | 长页分区：About、Skills、Projects、Publications、Internship、Education、Life 入口、Contact |
| `/life/sports` | 运动列表 + GPS 轨迹图 / 游泳看板 |
| `/life/travelling` | 足迹交互地图 |
| `/life/photography` | Coverflow 摄影展示 |

文案与列表大多在 `src/data/`，改内容一般不用动页面结构。

## 后续如何追加 Life 内容

`raw/`（原件）和 `scripts/`（GPX / 水印脚本）已在 **gitignore** 中，不要推送。

### 运动（GPX）

1. 把新的 `.gpx` 放进 `raw/sports/`
2. 运行 `node scripts/process-gpx.mjs`
3. 提交 `public/data/sports/` 与 `src/data/sports.generated.json` 中的生成文件
4. 无 GPS 的泳池游泳记录在 `src/data/sports.ts` 里手改

### 旅行

1. 原图放入 `raw/travelling/`
2. 运行 `node scripts/watermark-photos.mjs`
3. 在 `src/data/travel.ts` 登记地点 / 照片（如需省界，放进 `public/data/travel/`）

### 摄影

1. 原图放入 `raw/photography/`
2. 运行 `node scripts/watermark-photos.mjs`
3. 运行 `node scripts/build-photo-meta.mjs`
4. 在 `src/data/photography.ts` 的 `photos` 数组末尾加一行 `frame(...)`

## 内容目录

| 路径 | 用途 |
|------|------|
| `public/images/profile/` | 头像 |
| `public/images/projects/` | 项目封面 |
| `public/images/life/` | Life 三联入口图 |
| `public/images/travel/` | 旅行照片（已加水印） |
| `public/images/photography/` | 摄影作品（已加水印） |
| `public/data/sports/` | 脱敏轨迹 GeoJSON |
| `public/data/travel/` | 地区边界 GeoJSON |
| `public/images/contact/` | 联系区插图 |
| `public/images/brands/` | 实习 / 学校 logo |
| `public/cv/` | 简历 PDF |
| `src/data/` | 可编辑内容 |
| `docs/PLAN.md` | 计划文档 |
