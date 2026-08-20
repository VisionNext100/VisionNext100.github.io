<div align="center">
    <img src="https://cdn.jsdelivr.net/gh/VisionNext100/VisionNext100.github.io/public/images/readme/newbanner.jpg" width="800" alt="VisionNext100 个人主页">
    <br>
</div>

# 王业涵 — 个人主页

<div align="center">

[English](./README.md) | **中文**  
https://visionnext100.github.io

</div>

## I. 版权声明

**© 2026 王业涵（Yehan Wang）。保留所有权利。**

**本仓库仅用于个人作品展示与站点部署。**

允许出于了解与学习目的查看本仓库并在本地运行。
将设计、文案、照片、视频、数据或代码用于其他项目，仍须事先书面许可。

除上述了解或学习用途外，未经版权所有者事先书面许可，不得使用、复制、修改、分发本项目内容，也不得基于上述内容创作衍生作品。

## II. 技术架构

基于 Vite + React 的个人作品集站点：长页主站，以及包含 Sports、Travelling 和 Photography 的 Life 子页。

<div align="center">
    <img src="https://cdn.jsdelivr.net/gh/VisionNext100/VisionNext100.github.io/public/images/readme/architecture.jpg" width="800" alt="项目技术架构">
    <br>
</div>

| 层级                          | 作用                                   |
| ----------------------------- | -------------------------------------- |
| **Vite + React + TypeScript** | 应用骨架、组件、带类型的内容           |
| **React Router**              | `/` 锚点分区与 `/life/*` 子路由        |
| **Framer Motion**             | 首屏与区块动效                         |
| **Leaflet**                   | Travelling / Sports 地图               |
| **Formspree**                 | 联系表单                               |
| **`src/data/`**               | 站点文案、项目、技能、教育与 Life 数据 |
| **`public/`**                 | 图片、GeoJSON、简历等静态资源          |

样式为手写 CSS，无 UI 组件库。静态资源从 `/images/...`、`/data/...`、`/cv/...` 提供。

## III. 工作流

### I. 部署（推送 → 上线）

<div align="center">
    <img src="https://cdn.jsdelivr.net/gh/VisionNext100/VisionNext100.github.io/public/images/readme/deploy.jpg" width="800" alt="部署工作流">
    <br>
</div>

需要配置密钥：`VITE_FORMSPREE_ID`（Actions → Secrets）。

### II. 更新站点内容

日常改动（About、项目、技能、实习、教育、联系等）主要在 `src/data/*.ts`，以及 `public/images/` 下对应资源。

Life 媒体另有本机流水线：原件留在本机，仓库只提交处理后的成品。

<div align="center">
    <img src="https://cdn.jsdelivr.net/gh/VisionNext100/VisionNext100.github.io/public/images/readme/pipeline.jpg" width="800" alt="内容流水线">
    <br>
</div>

| 类型     | 步骤                                                                                                                                |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **运动** | `raw/sports/` → `node scripts/process-gpx.mjs` → 提交 `public/data/sports/` + `sports.generated.json`。泳池游泳：手改 `sports.ts`。 |
| **旅行** | `raw/travelling/` → 水印脚本 → 在 `travel.ts` 登记（如需省界，放 `public/data/travel/`）。                                          |
| **摄影** | `raw/photography/` → 水印 → `build-photo-meta.mjs` → 在 `photography.ts` 增加 `frame(...)`。                                        |

`raw/` 与 `scripts/` 已 gitignore；运行或部署站点不依赖它们。

## IV. GitHub 一次性配置

1. 仓库 → **Settings → Pages**
2. **Build and deployment → Source**：选择 **GitHub Actions**
3. 仓库 → **Settings → Secrets and variables → Actions**
4. 新建仓库密钥：
   - Name: `VITE_FORMSPREE_ID`
   - Value: 你的 Formspree 表单 id

然后推送到 `main`，或手动跑一遍工作流。稍后站点会出现在 https://visionnext100.github.io 。

## V. 本地运行

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

浏览器打开 http://localhost:5173 即可浏览完整主页。


```bash
npm run build
npm run preview
```

## VI. 站点结构

| 区域                | 内容                                                                                          |
| ------------------- | --------------------------------------------------------------------------------------------- |
| `/` 主页            | 长页作品集：Home、About、Skills、Projects、Publications、Internship、Education、Life、Contact |
| `/life/sports`      | 运动记录、GPS 轨迹、游泳看板                                                                  |
| `/life/travelling`  | 旅行交互地图                                                                                  |
| `/life/photography` | Coverflow 摄影展示                                                                            |

## VII. 内容目录

| 路径                         | 用途                 |
| ---------------------------- | -------------------- |
| `src/data/`                  | 可编辑站点内容       |
| `public/images/profile/`     | 头像                 |
| `public/images/projects/`    | 项目封面             |
| `public/images/brands/`      | 实习 / 学校 logo     |
| `public/images/contact/`     | 联系区插图           |
| `public/cv/`                 | 简历 PDF             |
| `public/images/life/`        | Life 三联入口图      |
| `public/images/travel/`      | 旅行照片（已加水印） |
| `public/images/photography/` | 摄影作品（已加水印） |
| `public/data/sports/`        | 脱敏轨迹 GeoJSON     |
| `public/data/travel/`        | 地区边界 GeoJSON     |
| `public/images/readme/`      | README 配图          |
| `raw/` · `scripts/`          | 本机原件与工具       |
