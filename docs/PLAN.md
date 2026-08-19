# VisionNext100 个人主页 — 行动方案（Plan）

> **目标域名**：https://visionnext100.github.io  
> **定位**：英文个人主页，面向海硕申请与求职；后续可扩展中英双语  
> **当前阶段**：主站已上线；Life 方案已敲定（待实现代码）  
> **文档版本**：v1.1 · 2026-07-29

---

## 1. 项目目标与成功标准

### 1.1 目标

做一个以长页主站为核心的个人介绍站（主页锚点 + Life 子路由），让访问者在 1–2 分钟内建立对你的第一印象（身份、方向、项目、经历），并方便招生官 / HR 快速定位联系方式与作品；Life 通过独立页面承载运动、旅行与摄影，避免主页过长。

### 1.2 成功标准（验收口径）

| 维度   | 标准                                                                                                                  |
| ------ | --------------------------------------------------------------------------------------------------------------------- |
| 首屏   | 满屏、有进入动画、有可感知交互；品牌名 / 姓名为视觉重心                                                               |
| 导航   | 主页锚点模块 + sticky；Life 进入后子页路由高亮；滚动时高亮当前 section                                                |
| 内容   | About / Skills / Projects / Internship / Education / Life / Contact 齐全；Publications 占位；Life 三联入口 + 三个子页 |
| 部署   | 推送到 `visionnext100.github.io` 仓库即可自动上线                                                                     |
| 体验   | 桌面优先，手机可用；加载动画克制（2–3 处主动画 + section 浮入），不堆特效                                             |
| 可维护 | 项目、技能、经历等尽量用配置文件（JSON/TS）维护，少改页面结构                                                         |

---

## 2. 参考站拆解与我们的取舍

| 参考站                                                  | 可借鉴                                                      | 不照搬                                                 |
| ------------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------ |
| [zibindong.github.io](https://zibindong.github.io/)     | 学术气质、信息密度克制、Publications / News 结构清晰        | 偏研究向；你目前以本科 + 项目为主，Publications 可后置 |
| [vaibhavpal.vercel.app](https://vaibhavpal.vercel.app/) | 打字标签、About 布局、Skills / Education / Contact 分区清晰 | 视觉偏模板化；我们要更有个人辨识度                     |
| [eic-lab.github.io](https://eic-lab.github.io/)         | 分区节奏、项目卡片、动效与排版质感                          | 实验室站而非个人站；避免「仪表盘」式堆砌               |

**我们的定位**：介于「学术主页」与「作品集」之间——干净、可信、有一点记忆点，但不花哨到像炫技 landing page。

---

## 3. 推荐技术架构

### 3.1 结论（推荐）

| 项       | 选择                                         | 理由                                                 |
| -------- | -------------------------------------------- | ---------------------------------------------------- |
| 形态     | **静态站点**（GitHub Pages）                 | 与目标域名天然匹配，零服务器成本                     |
| 脚手架   | **Vite + React + TypeScript**                | 组件化便于分 section；生态成熟；动画/地图/表单都好接 |
| 样式     | **CSS Modules 或普通 CSS + CSS 变量**        | 避免过度依赖重型 UI 库；便于自定义视觉               |
| 动画     | **Framer Motion**（主）+ 少量 CSS            | 进入浮入、导航过渡、卡片 hover 够用                  |
| 路由     | **主页锚点** + **`react-router-dom` 子页**   | 长页保留；Life 三子站独立 URL，避免主页过长          |
| 地图     | **Leaflet** + OSM / Carto 浅色瓦片           | 免费；城市级 lat/lng；轨迹与足迹共用                 |
| 部署     | GitHub Actions 构建 `dist/`；复制 `404.html` | SPA 子路径刷新不 404                                 |
| 内容配置 | `src/data/*.ts`（projects、skills、life…）   | 后续加项目/足迹/运动只改数据                         |

**备选（不推荐作为首选）**

- 纯 HTML/CSS/JS：实现快，但 Life（地图/运动）与维护成本会迅速变高  
- Next.js：对 GH Pages 需 `output: 'export'`，对你当前需求偏重  
- Astro：内容站很强，但强交互 Hero / Life 仍要大量 client JS，收益一般  

### 3.2 仓库与目录建议（含 Life）

仓库名需为 **`visionnext100.github.io`**（用户级 Pages）。本地开发目录 `Homepage/`。

```text
Homepage/
├── docs/PLAN.md
├── raw/                         ← gitignore：原 GPX、摄影原图（永不公开）
│   ├── sports/*.gpx
│   └── photography/*
├── scripts/
│   ├── process-gpx.mjs          ← GPX → GeoJSON + 摘要
│   └── watermark-photos.mjs     ← sharp 打水印 → public/
├── public/
│   ├── images/
│   │   ├── life/                ← 三联入口代表图
│   │   ├── travel/              ← 足迹弹层照片
│   │   └── photography/         ← 已加水印成品
│   └── data/sports/*.geojson    ← 脱敏轨迹
└── src/
    ├── pages/                   ← 路由页
    │   ├── HomePage.tsx         ← 现有长页
    │   ├── life/
    │   │   ├── SportsPage.tsx
    │   │   ├── TravellingPage.tsx
    │   │   └── PhotographyPage.tsx
    ├── components/sections/Life.tsx   ← 主页 #life 三联入口
    └── data/
        ├── sports.ts
        ├── travel.ts
        └── photography.ts
```

### 3.3 路由与部署

| URL                 | 内容                          |
| ------------------- | ----------------------------- |
| `/`                 | 长页主站；含 `#life` 三联入口 |
| `/life/sports`      | 运动记录 + 轨迹图             |
| `/life/travelling`  | 世界足迹地图                  |
| `/life/photography` | 摄影作品集                    |

1. 本地 `npm run build` → `dist/`  
2. GitHub Actions 发布 Pages；构建后将 `index.html` 复制为 `404.html`（SPA 回退）  
3. 域名：`https://visionnext100.github.io/`（用户级根路径）

---

## 4. 信息架构与页面结构

### 4.1 导航（始终悬浮）

横向 sticky 导航，模块顺序：

`Home · About · Skills · Projects · Publications · Internship · Education · Life` → CTA **Get in Touch**

- **Life** 位于 Education 与 Get in Touch 之间  
- 主页：点击 Life → 滚动到 `#life`；其余锚点平滑滚动并高亮  
- 子页（`/life/*`）：顶栏仍显示全站导航；**Life 高亮**；点 Home/About/… 回到 `/#…`；子页内可提供「Back to Life」链回 `/#life`  
- Get in Touch 仍为 CTA（主页 `#contact`），不进 `NAV_ITEMS` 列表项逻辑可保持现状  
- 移动端：汉堡菜单（已实现）

### 4.2 主页 Section 顺序（自上而下）

1. **Home**（100vh）  
2. **About**  
3. **Skills**  
4. **Projects**  
5. **Publications**（占位）  
6. **Internship**  
7. **Education**  
8. **Life**（仅三联导航入口，不内嵌三大子模块全文）  
9. **Get in Touch**  
10. **Footer**

每个 section：**一个主标题 + 一句短说明 + 主体内容**；载入时统一用「进入视口浮入」。

### 4.3 Life 信息流

```text
Navbar[Life] → /#life（三联入口）
                 ├→ /life/sports
                 ├→ /life/travelling
                 └→ /life/photography
```

---

## 5. 各模块实现方案

### 5.1 Home（首屏）— 交互方案（重点讨论）

#### 5.1.1 关于「小怪物眼神跟随鼠标」

创意可用，但辨识度一般（多见于创意 portfolio / CodePen）。更贴合「计算机本科 + 申请海硕」的替代方案如下，**建议你选一个作为主交互**：

| 方案                       | 效果                           | 技术           | 气质           | 推荐度                |
| -------------------------- | ------------------------------ | -------------- | -------------- | --------------------- |
| **A. 交互式粒子 / 星云场** | 鼠标推动粒子；松手缓慢回弹     | Canvas 2D      | 科技、干净     | ★★★★★                 |
| **B. 轻量 3D 几何体**      | 1–2 个浮动多面体随鼠标轻微倾斜 | Three.js / R3F | 现代、偏产品   | ★★★★                  |
| **C. 多层视差插画**        | 背景层、中景、前景随鼠标位移   | CSS / Motion   | 故事感、温暖   | ★★★★                  |
| **D. 神经网络 / 星座连线** | 节点随鼠标连线高亮             | Canvas         | 学术感强       | ★★★★                  |
| **E. 保留小怪物**          | 眼球跟随                       | DOM / SVG      | 俏皮、记忆点强 | ★★★（可用，但非首选） |

**推荐默认：A（粒子场）+ 轻微胶带照片**  
- 视觉记忆点放在「胶带生活照 + 打字标签」，交互背景用粒子衬托，不抢文字  
- 实现成本可控，性能好，手机可降级为静态渐变 + 少量粒子  

若你更想要「有角色感」，可选 **E**，但建议做成**极简矢量角色（1–2 只）**，并弱化存在感，避免盖过姓名。

#### 5.1.2 首屏内容布局（桌面）

```text
┌─────────────────────────────────────────────────────────┐
│  [sticky Navbar]                                        │
│                                                         │
│   Hi there, I am Michael Wong          ┌─────────────┐  │
│   "Science aims to discover..."        │ 胶带生活照   │  │
│   > CODING_  （打字循环）               │ （倾斜+阴影）│  │
│                                        └─────────────┘  │
│              （背景：粒子 / 轻交互）                      │
└─────────────────────────────────────────────────────────┘
```

- 左：问候 + 引言 + Typed 标签  
- 右：胶带照片  
- 背景：全屏交互层（`pointer-events` 不挡文字点击）  

#### 5.1.3 打字标签

循环序列建议：`CODING` → `MUSIC` → `TRAVELLING` → `SPORTS` → `PHOTOGRAPHY`

- 实现：自写 hook 或轻量库（如 typed.js 思路）  
- 行为：逐字打出 → 停顿 ~2s → 逐字删除 → 下一个  
- 光标：闪烁 `|` 或块状光标  
- 载入：姓名与引言先浮入，再启动打字（避免一进页全开）

#### 5.1.4 「胶带贴照片」——可以做，而且推荐做

纯 CSS 即可，不必真胶带素材（也可叠加半透明胶带 PNG）：

- 照片轻微旋转（如 `-3deg` / `4deg`）  
- 多层阴影模拟纸张厚度  
- 顶部 1–2 条半透明「胶带」色块（斜贴、可带噪点纹理）  
- hover：轻微回正或上浮（活泼但不夸张）  
- 进入动画：从上方「掉落贴上」+ 轻微弹性  

你需要提供一张横图或竖图生活照（建议 ≥ 1200px 宽，人物清晰）。

#### 5.1.5 首屏动画清单（克制）

1. 导航栏自上滑入  
2. 姓名 / 引言 stagger 浮入  
3. 照片「贴上」动效  
4. 背景粒子淡入后可交互  
5. 打字机延后启动  

---

### 5.2 About Me

- 1–2 段英文自我介绍（你后续提供文案；可先用 placeholder）  
- 展示：**Email**、**Phone**（电话是否公开展示需你确认；申请场景可用，公网可考虑仅邮件）  
- 可选：简历 PDF 下载按钮、GitHub / LinkedIn 图标  
- 布局：左文案右小图，或单栏居中——实现期按最终照片比例定  

**待你提供**：最终 About 英文文案、公开邮箱、是否公开手机号。

---

### 5.3 Skills

技能示例：C/C++、Python、PyTorch、CSS、HTML、JavaScript、Streamlit、MySQL、Docker、Dify、Qt Creator、AutoGluon 等。

#### 展示形式（三选一，推荐 B）

| 方案              | 描述                                                         | 优点                         | 缺点                     |
| ----------------- | ------------------------------------------------------------ | ---------------------------- | ------------------------ |
| A. Logo 网格      | 图标在上、文字在下，均匀网格                                 | 常见、清晰                   | 易显「技能墙」模板感     |
| **B. 分组芯片墙** | 按类别分组：Languages / AI & Data / Web / Tools；每项图标+名 | 信息结构好，适合申请材料气质 | 需你确认分组             |
| C. 轨道 / 环形    | 图标绕中心旋转或环形排布                                     | 视觉强                       | 可读性差，不适合严肃申请 |

**推荐 B**：例如

- **Languages**：C/C++、Python、JavaScript  
- **AI / Data**：PyTorch、AutoGluon、MySQL  
- **Web**：HTML、CSS、Streamlit  
- **Tools**：Docker、Dify、Qt Creator  

图标来源：优先 [Simple Icons](https://simpleicons.org/) / 官方 SVG；无官方图标则用统一几何标记 + 文字，避免侵权模糊 Logo。

进入视口时：图标错落入场（短 delay）。

---

### 5.4 Projects

- 数据驱动：`projects.ts` 中配置 `title / description / image / languages / repoUrl`  
- 卡片布局：**桌面一行两个**；窄屏一行一个  
- 左图右文（窄屏改为上图下文）  
- 点击整卡 → `target=_blank` 打开 GitHub 仓库  
- hover：轻微上浮 + 边框/阴影变化（**交互容器，允许「卡片」形态**）  

**待你提供**：仓库列表、一句话描述、封面图（可用 README 截图 / 架构示意图）。

---

### 5.5 Publications

- **本期**：不实现完整列表，仅预留 section + 文案如  
  `Coming soon — selected publications will appear here.`  
- 导航是否显示：建议**保留锚点**，避免以后改导航结构；或暂时隐藏导航项（二选一，默认保留占位）  

---

### 5.6 Internship

- 内容：上汽大众 · 2026/07–2026/09 ·「外购件流程与问题解决专家模型」  
- 布局：左 Logo / 右文字时间线式一段  

**Logo 版权说明（重要）**  

- 直接使用大众商标图形有品牌指南与商标风险；个人主页「说明曾在该处实习」通常属于**指称性使用（nominative fair use）语境**，但**不保证零风险**。  
- **更稳妥做法**（推荐）：  
  1. 使用公司**文字名称**「SAIC Volkswagen」+ 中性几何图标；或  
  2. 使用你**个人拍摄/获得授权**的工位/工牌虚化图；或  
  3. 若必须用 Logo，使用官方公开素材并遵守其商标使用规范，避免暗示官方背书。  

实现期默认采用：**文字品牌 + 简洁图形**，除非你明确要求上官方 Logo。

---

### 5.7 Education

- **纵向时间线**：下方更早、上方更新（或反过来：上早下晚——学术站两种都有；**默认「上：近期，下：早期」**，符合阅读习惯）  
- 本期仅一个节点：  
  - East China Normal University  
  - 2024/09 – 2028/07  
  - Shanghai, China  
  - Degree：B.Eng. / B.S. in Computer Science（请你确认正式学位英文名）  
- 节点旁放学校图片（校门/校徽照片——校徽使用同样注意官方规范，可用实景照片更稳妥）  
- 进入动画：时间线描线 + 节点依次出现  

---

### 5.8 Life（主页入口 + 三个子页）

复杂度最高；主页只做导航，详情拆到独立路由，避免长页膨胀。

#### 5.8.0 主页 Life Hub — 杂志三联入口（已敲定）

气质：活泼、有创意，但不花哨。呼应现有胶带照片：轻微拍立得倾斜，**不用**护照戳/票根堆砌，也**不用**纯色图标墙。

```text
Life
Three windows into how I spend time outside the IDE.

┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  SPORTS     │  │ TRAVELLING  │  │ PHOTOGRAPHY │
│  (代表图)    │  │  (代表图)    │  │  (代表图)    │
│  Walk·Run·  │  │  Footprints │  │  Through    │
│  Swim →     │  │  on a map → │  │  my lens →  │
└─────────────┘  └─────────────┘  └─────────────┘
```

| 项   | 方案                                                                 |
| ---- | -------------------------------------------------------------------- |
| 布局 | 桌面三列等高大图；移动端纵向三张全宽条                               |
| 文案 | 标题叠在图下半区 + 底部渐变遮罩保可读；每块一句短说明 + 箭头         |
| 动效 | 初始微旋转约 ±1.5°；hover 回正并上浮 4–6px；浮入 stagger 0.05s       |
| 跳转 | 整块可点 → `/life/sports` · `/life/travelling` · `/life/photography` |
| 素材 | 各 1 张代表图 → `public/images/life/`                                |

#### 5.8.1 Sports — `/life/sports`

**已有样例（仓库根目录，实现时迁入 `raw/sports/`）**

| 文件                   | 类型     | 约点数 | 约时长  | 备注     |
| ---------------------- | -------- | ------ | ------- | -------- |
| `20260531户外步行.gpx` | 户外步行 | ~1973  | ~43 min | 上海附近 |
| `20260605户外跑步.gpx` | 户外跑步 | ~1559  | ~45 min | 上海附近 |

游泳通常无可靠户外 GPS → **手工摘要卡片**（日期、距离、时长、泳池/公开水域），**不画轨迹**。

**数据处理流水线（构建期）**

1. 脚本读 GPX → 计算 `date`、`type`（walk/run）、`durationSec`、`distanceKm`（Haversine）  
2. 轨迹降采样至约 200–400 点；**裁切起终点**（去掉前后若干分钟或固定距离）降低住址暴露  
3. 输出：`public/data/sports/*.geojson`（仅折线）+ `src/data/sports.ts`（列表摘要；游泳手写）  
4. 原 GPX 仅存 `raw/sports/` 且 **gitignore**；公开仓库只提交脱敏 GeoJSON  

**页面展示**

- 顶部分类：`All | Walking | Running | Swimming`  
- 每条只展示：**日期、类型、距离、时长**  
- **不展示**：心率、配速、卡路里、步频  
- Walking / Running：左摘要 + 右 Leaflet 折线（浅色底图、单色轨迹）  
- Swimming：仅摘要卡（可选非敏感氛围图）  
- 精选制：现有 2 条 + 后续补充；不做「导入全部历史」

#### 5.8.2 Travelling — `/life/travelling`

**城市级足迹（已敲定）**：数据为每个城市写死坐标，地图上画**城市圆点**，而不是给整个国家填色。

- 例：美国只去过 LA、SF → 仅两个点，其余空白  
- 颜色按 **大洲/地区色板** 区分（如东亚青绿、北美橙、欧洲蓝），一眼看出分布，又不会把「去过洛杉矶」画成「染红整个美国」  
- **不采用**国家 choropleth 作主交互（粒度太粗）；可选极淡国家描边仅作地理参照  

**交互**

- Leaflet 可缩放/拖拽；初始 `fitBounds` 到全部足迹  
- 桌面 Hover / 移动端点击：Popup 显示 **城市名、到访日期、1–3 张照片**；点缩略图进简易 lightbox  
- 侧栏或底部城市列表，点击 `flyTo` 对应标记  

**数据形状（`src/data/travel.ts`）**

```ts
{
  city: 'Los Angeles',
  country: 'USA',
  region: 'northAmerica', // 用于色板
  lat: 34.05,
  lng: -118.24,
  visits: [{ date: '2025-08', photos: ['/images/travel/la-1.jpg'] }],
}
```

#### 5.8.3 Photography — `/life/photography`

**水印（现实预期）**

没有绝对防去水印的方法；目标是提高转载成本并声明版权，而非军事级防盗。

1. 原图只放本机 `raw/photography/`（`.gitignore`），**永不进 Git**  
2. 脚本 `scripts/watermark-photos.mjs`（`sharp`）：长边压到约 1800px；半透明斜向平铺 `© Yehan Wang · VisionNext100`；角落再放一小条可读版权  
3. 输出到 `public/images/photography/` 后提交开源仓库  
4. 二期可选：EXIF 版权字段；不做隐写术  

**展示：「故事条 + 错落网格」（避免堆砌）**

- 页顶 1 张全宽 Featured（大图 + 一行标题/地点）  
- 其下按主题分组（如 Campus / Street / Travel），每组一句短导语  
- 组内 2–3 列不规则高度网格，比例略有变化，留白呼吸  
- 点击 Lightbox 看大图（仍带水印）  
- 首批精选约 12–24 张；不做无限瀑布自动加载  

---

### 5.9 Get in Touch（导航栏无此项）

| 项                 | 方案                                                                                                                    |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| 布局               | 左图右表单：Name / Email / Message / Submit                                                                             |
| 「你要能看到留言」 | 静态站无后端。推荐 **[Formspree](https://formspree.io/)** 或 **Web3Forms**：Submit 后发到你的邮箱，免费额度通常够个人站 |
| 若不想接第三方     | 表单仅前端校验 + `mailto:` 兜底，或展示为装饰（按钮提示 “Coming soon”）                                                 |

**推荐**：Formspree（5 分钟可接通，真正能收到信）。

---

## 6. 视觉与动效原则（结合你的设计约束）

- **一屏一构图**：Home 不堆统计、日程、徽章  
- **品牌信号**：`Michael Wong` / `VisionNext100` 在首屏必须够大，引言与标签不能压过姓名  
- **字体**：避免 Inter / Roboto / Arial；拟选  
  - Display：如 **Fraunces** / **Newsreader** / **Syne**（实现时二选一敲定）  
  - Body：如 **Source Sans 3** / **DM Sans**  
- **背景**：禁止纯色一片；Home 用粒子/轻纹理；其它 section 用柔和渐变或极淡几何纹理  
- **色板方向（避免 AI 套路）**：不走紫白渐变、不走奶油衬线+陶土、不走报纸排版  
  - **建议方向**：冷灰蓝 + 纸感米白点缀 + 一抹青绿强调（理性、偏科研/工程）——实现前可用 3 个色板样张给你拍板  
- **卡片**：仅 Projects / 表单等**需要交互承载**处使用；Hero 禁止卡片  
- **动效预算**：全站 2–3 个「记忆点动效」（打字、胶带贴图、粒子）+ 统一 section 浮入即可  

---

## 7. 分阶段交付计划

### Phase 0 — 方案确认

- [x] 产出 `PLAN.md`  
- [x] Hero / Skills / Publications / Contact / Phone 等决策（见 §9）  
- [x] Life 多页方案敲定（2026-07-29，见 §5.8 / §9）  

### Phase 1 — 脚手架与骨架 — 已完成

- Vite + React + TS + sticky Navbar + section 锚点  
- 全局 tokens、字体、响应式  
- GitHub Pages 部署打通  

### Phase 2 — Home + About + Skills + Education — 已完成

### Phase 3 — Projects + Internship + Contact — 已完成

（含 Upcoming / AdenoGuard、Formspree、Footer 等后续微调）

### Phase 4 — Life（下一实现重点）

- **4.0 路由骨架**：接入 `react-router-dom`；主页 `#life` 占位 + Navbar Life；部署复制 `404.html`  
- **4.1 Life Hub**：杂志三联入口（代表图 + 文案 + 跳转子页）  
- **4.2 Sports**：GPX 处理脚本 + 脱敏 GeoJSON + 列表/分类 + Leaflet 轨迹；游泳摘要卡  
- **4.3 Travelling**：`travel.ts` 城市数据 + Leaflet 足迹 + Popup（日期/照片）+ 列表 flyTo  
- **4.4 Photography**：水印脚本 + Featured + 主题分组错落网格 + Lightbox  
- **4.5 打磨**：图片懒加载/压缩、移动端、`prefers-reduced-motion`、隐私复核  

### Phase 5 — 打磨与双语预留

- SEO（title/description/OG）、无障碍  
- 预留 i18n 结构（本期不做切换 UI）  
- Publications 真实数据接入（有论文时）  

---

## 8. 需要你提供的素材与信息清单

### 文案 / 信息

- [x] 英文姓名：Yehan WANG  
- [x] About 英文、公开 Email（无 Phone）  
- [x] 学位：B.Eng. in Computer Science, ECNU  
- [x] 项目列表与 Upcoming（AdenoGuard 等）  
- [x] 实习（SVW）  
- [ ] **旅行足迹清单**：城市、国家、大致日期、照片（Phase 4.3）  
- [ ] **游泳摘要**（若无 GPX）：日期、距离、时长、泳池/公开水域（Phase 4.2）  
- [ ] **更多步行/跑步 GPX**（可选，精选即可）  
- [ ] 水印文案确认：默认 `© Yehan Wang · VisionNext100`  

### 图片

- [x] 首屏生活照、Contact 配图、ECNU、项目封面、Favicon 等  
- [ ] **Life 三联入口代表图** ×3（Sports / Travelling / Photography）→ `public/images/life/`  
- [ ] **旅行城市照片**（每城 1–3 张）→ 处理后放 `public/images/travel/`  
- [ ] **摄影原图**（12–24 张精选）→ 仅本机 `raw/photography/`，经水印脚本输出  

### 运动数据（已有样例）

- [x] `20260531户外步行.gpx`、`20260605户外跑步.gpx`（实现时迁入 `raw/sports/` 并 gitignore）  

### 账号

- [x] Formspree（`VITE_FORMSPREE_ID`）  
- [x] 仓库 `visionnext100.github.io`  

---

## 9. 已确认决策

### 9.1 主站（2026-07-28）

1. **Hero 背景交互**：A 粒子  
2. **Skills 布局**：B 分组芯片墙  
3. **Projects**：一行两个；上图下文；含 Upcoming / AdenoGuard  
4. **Publications**：导航保留占位  
5. **Internship 视觉**：文字品牌 + SVW Logo  
6. **Contact**：Formspree → `3276924450@qq.com`  
7. **Phone**：不公开；邮箱 `yehanw133@gmail.com`  

### 9.2 Life（2026-07-29）— 撤销「本期不做」

1. **导航**：Education 与 Get in Touch 之间加入 Life；主页 `#life`  
2. **形态**：主页仅三联入口；详情为 `/life/sports` · `/life/travelling` · `/life/photography`  
3. **路由**：`react-router-dom` + GH Pages `404.html` SPA 回退  
4. **Hub 视觉**：杂志三联 + 微倾斜胶带/拍立得气质  
5. **Sports**：GPX 构建期脱敏；只展示距离与时长；游泳无轨迹用摘要卡；Leaflet 画折线  
6. **Travelling**：城市级圆点（非国家填色）；地区色板；Hover/点击显示城市、日期、照片  
7. **Photography**：`sharp` 构建期水印；故事条 + 错落网格 + Lightbox；原图不进 Git  
8. **地图库**：统一 Leaflet + 浅色瓦片  

---

## 10. 风险与约束

| 风险                     | 应对                                           |
| ------------------------ | ---------------------------------------------- |
| GitHub Pages 仅静态      | 表单用第三方；不做自建后端                     |
| SPA 子路径刷新 404       | 部署复制 `404.html`                            |
| 商标 / Logo              | 公司与学校优先文字或实景图                     |
| 隐私（电话、轨迹、人脸） | 轨迹裁切脱敏；原 GPX/原图不入库                |
| 水印可被去除             | 提高转载成本即可；斜向平铺 + 角标；原图不公开  |
| 性能（地图、大图、粒子） | 懒加载、图片压缩、移动端降级动效               |
| OSM 瓦片用量             | 个人站流量通常可接受；必要时换 Carto/自选 tile |

---

## 11. 下一步

1. **你提供** §8 中 Life 相关素材（三联图、旅行清单、游泳摘要、摄影原图）。  
2. **进入 Phase 4.0**：接入路由 + Navbar Life + 主页 Life 骨架（可先无真实图）。  
3. 按 4.1 → 4.2 → 4.3 → 4.4 → 4.5 实现。  

本期文档交付：`docs/PLAN.md` v1.1（Life 方案写入完成）。
