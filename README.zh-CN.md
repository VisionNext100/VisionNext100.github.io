<div align="center">
    <img src="https://cdn.jsdelivr.net/gh/VisionNext100/VisionNext100.github.io@main/public/images/readme/newbanner.jpg" width="800" alt="VisionNext100 个人主页">
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

## II. 架构总览

本站是 Vite + React + TypeScript 单页应用：长页主站（`/`，锚点分区），以及 `/life/*` 下的 Sports / Travelling / Photography 子页。文案多在 `src/data/`，媒体与 GeoJSON 由 `public/` 提供。联系表单走 Formspree，地图用 Leaflet；页面浏览量通过 GoatCounter 静默上报。经 GitHub Actions 构建后部署到 GitHub Pages。样式为手写 CSS，无 UI 组件库。

<div align="center">
    <img src="https://cdn.jsdelivr.net/gh/VisionNext100/VisionNext100.github.io@main/public/images/readme/architecture-detailed-v1.2.0.jpg" width="1000" alt="详细系统架构">
    <br>
    <em>端到端总览：SPA 路由与 Life 子页、内容与静态资源、本机工具链、Formspree + GoatCounter，以及 GitHub Actions → Pages 部署路径。</em>
</div>

## III. 架构分项说明

下面三张图分别放大总览中的技术分层、部署流水线与内容流水线。

### I. 技术分层

<div align="center">
    <img src="https://cdn.jsdelivr.net/gh/VisionNext100/VisionNext100.github.io@main/public/images/readme/architecture-v1.2.0.jpg" width="700" alt="技术分层">
    <br>
    <em>从访客到托管的分层：Browser、Libraries、Content、GitHub Pages。</em>
</div>

| 层级                          | 作用                                   |
| ----------------------------- | -------------------------------------- |
| **Vite + React + TypeScript** | 应用骨架、组件、带类型的内容           |
| **React Router**              | `/` 锚点分区与 `/life/*` 子路由        |
| **Framer Motion**             | 首屏与区块动效                         |
| **Leaflet**                   | Travelling / Sports 地图               |
| **Formspree**                 | 联系表单                               |
| **GoatCounter**               | 隐私友好的页面浏览统计                 |
| **`src/data/`**               | 站点文案、项目、技能、教育与 Life 数据 |
| **`public/`**                 | 图片、GeoJSON、简历等静态资源          |

### II. 部署流水线

<div align="center">
    <img src="https://cdn.jsdelivr.net/gh/VisionNext100/VisionNext100.github.io@main/public/images/readme/deploy-v1.2.0.jpg" width="700" alt="部署流水线">
    <br>
    <em>推送到 main 后由 Actions 安装、构建 Formspree 和 GoatCounter、写入 SPA 用 404.html，再发布到 GitHub Pages。</em>
</div>

构建环境变量（可选）：

- **Secret** `VITE_FORMSPREE_ID` — 联系表单
- **Variable** `VITE_GOATCOUNTER_ENDPOINT` — 统计浏览量

### III. 内容流水线

日常改动（About、项目、技能、实习、教育、联系等）主要在 `src/data/*.ts`，以及 `public/images/` 下对应资源。

Life 媒体另有本机流水线：原件留在本机，仓库只提交处理后的成品。

<div align="center">
    <img src="https://cdn.jsdelivr.net/gh/VisionNext100/VisionNext100.github.io@main/public/images/readme/pipeline-v1.2.0.jpg" width="550" alt="内容流水线">
    <br>
    <em>仅本机的 raw/ 与 scripts/，产出并提交 public/ 与 src/data/ 中的成品。</em>
</div>

| 类型     | 步骤                                                                                                                                |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **运动** | `raw/sports/` → `node scripts/process-gpx.mjs` → 提交 `public/data/sports/` + `sports.generated.json`。泳池游泳：手改 `sports.ts`。 |
| **旅行** | `raw/travelling/` → 水印脚本 → 在 `travel.ts` 登记（如需省界，放 `public/data/travel/`）。                                          |
| **摄影** | `raw/photography/` → 水印 → `build-photo-meta.mjs` → 在 `photography.ts` 增加 `frame(...)`。                                        |


## IV. GitHub 一次性配置

1. 仓库 → Settings → Pages
2. Build and deployment → Source：GitHub Actions
3. 仓库 → Settings → Secrets and variables → Actions
4. Secrets → 新建：
   - Name: `VITE_FORMSPREE_ID`
   - Value: 你的 Formspree 表单 id
5. Variables → 新建：
   - Name: `VITE_GOATCOUNTER_ENDPOINT`
   - Value: `https://YOURCODE.goatcounter.com/count`

然后推送到 `main`，或手动跑一遍工作流。稍后站点会出现在 https://visionnext100.github.io 。

Formspree 与 GoatCounter 都不是运行站点的必需项，不配则对应功能关闭。

## V. 本地运行

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

| 路径                         | 用途                             |
| ---------------------------- | -------------------------------- |
| `src/data/`                  | 可编辑站点内容                   |
| `public/images/profile/`     | 头像                             |
| `public/images/projects/`    | 项目封面                         |
| `public/images/brands/`      | 实习 / 学校 logo                 |
| `public/images/contact/`     | 联系区插图                       |
| `public/cv/`                 | 简历 PDF（可选；缺失时友好提示） |
| `public/images/life/`        | Life 三联入口图                  |
| `public/images/travel/`      | 旅行照片（已加水印）             |
| `public/images/photography/` | 摄影作品（已加水印）             |
| `public/data/sports/`        | 脱敏轨迹 GeoJSON                 |
| `public/data/travel/`        | 地区边界 GeoJSON                 |
| `public/images/readme/`      | README 配图                      |
| `raw/` · `scripts/`          | 本机原件与工具                   |
