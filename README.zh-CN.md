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

© 2026 王业涵（Yehan Wang）。保留所有权利。

本仓库仅用于个人作品展示与站点部署。
未经版权所有者事先书面许可，任何人不得使用、复制、修改、分发本项目中的
源代码、文字、图片、摄影作品、视频或数据，也不得基于上述内容创作衍生作品。

## II. 技术架构

Vite 单页应用：长页主站 + 三个 Life 子路由。内容以数据文件为主，页面尽量保持轻薄。

<div align="center">
    <img src="https://cdn.jsdelivr.net/gh/VisionNext100/VisionNext100.github.io/public/images/readme/architecture.jpg" width="800" alt="项目技术架构">
    <br>
</div>

| 层级                          | 作用                                        |
| ----------------------------- | ------------------------------------------- |
| **Vite + React + TypeScript** | 应用骨架、组件、带类型的内容                |
| **React Router**              | `/`（锚点分区）与 `/life/sports             | travelling | photography` |
| **Framer Motion**             | 首屏 / 区块动效                             |
| **Leaflet**                   | 旅行地图与运动 GPS 轨迹                     |
| **Formspree**                 | 联系表单后端（id 来自 `VITE_FORMSPREE_ID`） |
| **`src/data/`**               | 可编辑文案、项目、运动、旅行、摄影          |
| **`public/`**                 | 加水印媒体、GeoJSON、简历等静态资源         |

样式为手写 CSS（无 UI 组件库）。地图与 Life 页面从 `/images/...`、`/data/...` 加载资源。

## III. 工作流

### I. 部署（推送 → 上线）

<div align="center">
    <img src="https://cdn.jsdelivr.net/gh/VisionNext100/VisionNext100.github.io/public/images/readme/deploy.jpg" width="800" alt="部署工作流">
    <br>
</div>

需要配置密钥：`VITE_FORMSPREE_ID`（Actions → Secrets）。

### II. 本地内容流水线（Life）

原件留在本机；仓库只提交处理后的成品。

<div align="center">
    <img src="https://cdn.jsdelivr.net/gh/VisionNext100/VisionNext100.github.io/public/images/readme/pipeline.jpg" width="800" alt="Life 内容流水线">
    <br>
</div>

| 类型            | 步骤                                                                                                                                |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **运动（GPX）** | `raw/sports/` → `node scripts/process-gpx.mjs` → 提交 `public/data/sports/` + `sports.generated.json`。泳池游泳：手改 `sports.ts`。 |
| **旅行**        | `raw/travelling/` → 水印脚本 → 在 `travel.ts` 登记（如需省界，放 `public/data/travel/`）。                                          |
| **摄影**        | `raw/photography/` → 水印 → `build-photo-meta.mjs` → 在 `photography.ts` 增加 `frame(...)`。                                        |

## IV. GitHub 一次性配置

1. 仓库 → **Settings → Pages**
2. **Build and deployment → Source**：选择 **GitHub Actions**
3. 仓库 → **Settings → Secrets and variables → Actions**
4. 新建仓库密钥：
   - Name: `VITE_FORMSPREE_ID`
   - Value: 你的 Formspree 表单 id（例如 `xrenjeek`）

然后推送到 `main`（或手动跑一遍工作流）。大约 1–2 分钟后站点会出现在 https://visionnext100.github.io 。

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

浏览器打开 http://localhost:5173 — 滚动到 **Life**，或直接访问：

- http://localhost:5173/life/sports
- http://localhost:5173/life/travelling
- http://localhost:5173/life/photography

```bash
npm run build
npm run preview
```

## VI. 站点结构

| 区域                | 内容                                                                                       |
| ------------------- | ------------------------------------------------------------------------------------------ |
| 主页                | 长页分区：About、Skills、Projects、Publications、Internship、Education、Life 入口、Contact |
| `/life/sports`      | 运动列表 + GPS 轨迹图 / 游泳看板                                                           |
| `/life/travelling`  | 足迹交互地图                                                                               |
| `/life/photography` | Coverflow 摄影展示                                                                         |

## VII. 内容目录

| 路径                         | 用途                           |
| ---------------------------- | ------------------------------ |
| `public/images/profile/`     | 头像                           |
| `public/images/projects/`    | 项目封面                       |
| `public/images/life/`        | Life 三联入口图                |
| `public/images/travel/`      | 旅行照片（已加水印）           |
| `public/images/photography/` | 摄影作品（已加水印）           |
| `public/images/readme/`      | README 配图                    |
| `public/data/sports/`        | 脱敏轨迹 GeoJSON               |
| `public/data/travel/`        | 地区边界 GeoJSON               |
| `public/images/contact/`     | 联系区插图                     |
| `public/images/brands/`      | 实习 / 学校 logo               |
| `public/cv/`                 | 简历 PDF                       |
| `src/data/`                  | 可编辑内容                     |
| `raw/` · `scripts/`          | 本机原件与工具（已 gitignore） |
