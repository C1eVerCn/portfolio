# 沉浸式 AI 全栈工程师作品集实施计划

> **执行说明：** 按任务顺序实施。每项先写失败测试，再写最小实现，随后运行针对性验证。当前目录尚未初始化 Git，因此计划中的提交点仅在初始化仓库后执行。

**目标：** 构建一个双语、可静态部署到 Vercel、由 GSAP 主导视觉编排并以语义 3D 系统图谱讲述 Hermes 与 BHMS 的个人作品集。

**架构：** Next.js App Router 输出可索引 HTML；固定 R3F Canvas 作为渐进增强背景；每个路由由单一 GSAP ScrollTrigger 主时间线协调场景与 DOM；项目演示使用纯 TypeScript 状态机和脱敏静态数据，完全不依赖原项目运行时。

**技术栈基线（2026-07-31 核对）：** Next.js 16.2.12、React 19.2.8、GSAP 3.15.0、Three 0.185.1、`@react-three/fiber` 9.6.1、`@react-three/drei` 10.7.7、Vitest 4.1.10、Playwright 1.62.1、TypeScript、CSS Modules/PostCSS。

---

## Task 1：初始化应用与质量基线

**文件：**

- 创建：`package.json`
- 创建：`next.config.ts`
- 创建：`tsconfig.json`
- 创建：`eslint.config.mjs`
- 创建：`vitest.config.ts`
- 创建：`playwright.config.ts`
- 创建：`src/test/setup.ts`
- 创建：`.gitignore`

**步骤：**

1. 使用 Next.js App Router 初始化 TypeScript 应用，并安装 GSAP、R3F、Drei、测试依赖。
2. 添加脚本：`dev`、`build`、`lint`、`typecheck`、`test`、`test:watch`、`test:e2e`。
3. 写一个导入根布局的 smoke test，先确认测试因文件缺失失败。
4. 创建最小根布局后运行 `npm test -- --run`、`npm run typecheck`。
5. 若用户希望版本控制，再执行 `git init` 和首次提交；不要自动发布远端。

## Task 2：建立双语内容模型与路由

**文件：**

- 创建：`src/content/types.ts`
- 创建：`src/content/portfolio.zh.ts`
- 创建：`src/content/portfolio.en.ts`
- 创建：`src/content/index.ts`
- 创建：`src/i18n/config.ts`
- 创建：`src/i18n/routing.ts`
- 创建：`src/app/page.tsx`
- 创建：`src/app/[locale]/layout.tsx`
- 创建：`src/app/[locale]/page.tsx`
- 测试：`src/content/content.test.ts`
- 测试：`src/i18n/routing.test.ts`

**公开类型：**

```ts
export type Locale = "zh" | "en";
export type ProjectSlug = "hermes" | "bhms";
export interface ProfileContent { name: string; englishName: string; role: string; email: string; github: string }
export interface CapabilityGroup { id: string; label: string; items: string[] }
export interface ProjectSummary { slug: ProjectSlug; eyebrow: string; title: string; thesis: string; summary: string; accent: "cyan" | "amber" }
export interface ChapterContent { id: string; index: string; title: string; summary: string }
export interface PortfolioContent { profile: ProfileContent; nav: object; hero: object; capabilities: CapabilityGroup[]; projects: ProjectSummary[]; principles: object[] }
```

**步骤：**

1. 测试所有 locale 拥有相同 capability/project/chapter IDs，邮箱与 GitHub 合法。
2. 实现类型化内容数据。
3. `/` 使用 Next redirect 到 `/zh`；`[locale]` 使用 `generateStaticParams` 生成 `zh/en`。
4. 无效 locale 返回 404；语言切换保持剩余 pathname 与 hash。
5. 运行内容与路由测试、typecheck。

## Task 3：设计系统与全局壳层

**文件：**

- 创建：`src/app/globals.css`
- 创建：`src/styles/tokens.css`
- 创建：`src/components/layout/SiteHeader.tsx`
- 创建：`src/components/layout/SiteFooter.tsx`
- 创建：`src/components/layout/LanguageSwitch.tsx`
- 创建：`src/components/layout/SkipLink.tsx`
- 创建：`src/components/ui/SectionLabel.tsx`
- 创建：`src/components/ui/ProjectLink.tsx`
- 测试：`src/components/layout/SiteHeader.test.tsx`

**步骤：**

1. 测试导航语义、语言链接、邮箱与键盘访问。
2. 定义颜色、排版、间距、边框、z-index 与 motion tokens。
3. 使用 `next/font` 引入 Geist；中文和等宽字体采用性能可控的系统/本地 fallback，避免阻塞首屏。
4. 实现透明到实体的固定导航、focus 样式、skip link 和 footer。
5. 在 320px、768px、1440px 三个宽度检查布局。

## Task 4：建立 GSAP 与 3D 运行时

**文件：**

- 创建：`src/lib/gsap/client.ts`
- 创建：`src/lib/gsap/useReducedMotion.ts`
- 创建：`src/components/scene/SceneCanvas.tsx`
- 创建：`src/components/scene/SceneFallback.tsx`
- 创建：`src/components/scene/SystemUniverse.tsx`
- 创建：`src/components/scene/CameraRig.tsx`
- 创建：`src/components/scene/SceneLights.tsx`
- 创建：`src/components/scene/scene-types.ts`
- 创建：`src/components/scene/SceneProvider.tsx`
- 测试：`src/components/scene/SceneFallback.test.tsx`

**公开类型：**

```ts
export type SceneChapter = "hero" | "capabilities" | "split" | "hermes" | "bhms" | "principles" | "contact";
export interface SceneProgress { chapter: SceneChapter; progress: number; focus: "all" | "hermes" | "bhms" }
export interface QualityTier { dpr: [number, number]; nodeCount: number; bloom: boolean; pointerParallax: boolean }
```

**步骤：**

1. 先测试 fallback 文案与 `aria-hidden` 边界。
2. 在单一 client 模块注册 `useGSAP`、ScrollTrigger、Flip、SplitText、DrawSVGPlugin。
3. Canvas 用 `dynamic(..., { ssr: false })` 加载，DOM 内容不依赖它。
4. 使用 instanced 节点、少量线段和无阴影灯光创建语义系统核心；DPR 封顶 1.5。
5. CameraRig 暴露稳定 refs，GSAP 只修改 ref/proxy，不在帧循环 setState。
6. `visibilitychange` 暂停渲染；WebGL/context 失败时显示 CSS/SVG fallback。
7. reduced-motion 时禁用持续漂移和相机穿越。

## Task 5：实现首页 DOM 与 GSAP 主时间线

**文件：**

- 创建：`src/components/home/HomeExperience.tsx`
- 创建：`src/components/home/HeroSection.tsx`
- 创建：`src/components/home/CapabilityAtlas.tsx`
- 创建：`src/components/home/ProjectSplit.tsx`
- 创建：`src/components/home/SelectedWork.tsx`
- 创建：`src/components/home/Principles.tsx`
- 创建：`src/components/home/AboutContact.tsx`
- 创建：`src/components/home/useHomeTimeline.ts`
- 测试：`src/components/home/CapabilityAtlas.test.tsx`
- 测试：`src/components/home/SelectedWork.test.tsx`

**步骤：**

1. 测试 CapabilityAtlas 不含链接；SelectedWork 只含两个案例链接且 Hermes 在前。
2. 实现可在无 JS 情况下阅读的首页 DOM。
3. 创建一个顶层 GSAP timeline，labels 为 `hero`、`capabilities`、`split`、`hermes`、`bhms`、`principles`、`contact`。
4. ScrollTrigger 只挂在顶层 timeline；子时间线只插入父时间线。
5. `useGSAP({ scope })` 管理清理；交互回调使用 `contextSafe`。
6. 使用 `matchMedia` 提供 desktop/mobile/reduced 三套距离和 pin 策略。
7. 标题 SplitText 完成后及时 revert；SVG 路径按可见章节 DrawSVG。
8. 指针视差使用 `quickTo`，离开区域回归中心。

## Task 6：Hermes 脱敏演示状态机与案例页

**文件：**

- 创建：`src/features/hermes/types.ts`
- 创建：`src/features/hermes/machine.ts`
- 创建：`src/features/hermes/demo-data.ts`
- 创建：`src/features/hermes/HermesDemo.tsx`
- 创建：`src/features/hermes/HermesArchitecture.tsx`
- 创建：`src/features/hermes/HermesGuardRail.tsx`
- 创建：`src/app/[locale]/work/hermes/page.tsx`
- 创建：`src/components/case/CaseShell.tsx`
- 创建：`src/components/case/ChapterNav.tsx`
- 创建：`src/components/case/FocusToggle.tsx`
- 创建：`src/components/case/useCaseTimeline.ts`
- 测试：`src/features/hermes/machine.test.ts`
- 测试：`src/features/hermes/HermesDemo.test.tsx`

**公开类型：**

```ts
export type HermesStep = "platform" | "time_gate" | "availability" | "vehicle" | "task" | "dry_run" | "awaiting_confirmation" | "committed";
export interface HermesDraft { platform?: string; start?: string; end?: string; vehicle?: string; task?: string; location?: string }
export interface HermesDemoState { step: HermesStep; draft: HermesDraft; revision: number; confirmationWindow: boolean; log: DemoLogEntry[] }
export type HermesEvent = { type: "SELECT_PLATFORM"; value: string } | { type: "SET_TIME"; start: string; end: string } | { type: "SELECT_VEHICLE"; value: string } | { type: "SET_TASK"; task: string; location: string } | { type: "DRY_RUN" } | { type: "CONFIRM" } | { type: "EDIT" } | { type: "RESET" };
```

**步骤：**

1. 单元测试时间缺失无法越过 hard gate、dry-run 参数修改使确认失效、非确认消息关闭相邻确认窗口、只有合法确认能 commit。
2. 实现纯 reducer/state machine，不调用真实服务。
3. 用脱敏车辆和时间数据实现交互 UI，并显著标注“静态概念重建”。
4. 架构图展示 WS → 去重/队列 → 分层路由 → Agent/MCP → dry-run/commit guard。
5. 章节时间线用 cyan 强调边界和数据包流动；Focus View 仅隐藏外围 UI。
6. 显示“498 offline unit tests passed”时明确归属被检查的 Hermes 本地项目，不扩展为生产可靠性声明。

## Task 7：BHMS 静态演示与案例页

**文件：**

- 创建：`src/features/bhms/types.ts`
- 创建：`src/features/bhms/demo-data.ts`
- 创建：`src/features/bhms/BatteryTrajectory.tsx`
- 创建：`src/features/bhms/EvidenceGraph.tsx`
- 创建：`src/features/bhms/DecisionBasis.tsx`
- 创建：`src/features/bhms/ModelArchitecture.tsx`
- 创建：`src/features/bhms/BhmsDemo.tsx`
- 创建：`src/app/[locale]/work/bhms/page.tsx`
- 测试：`src/features/bhms/demo-data.test.ts`
- 测试：`src/features/bhms/BhmsDemo.test.tsx`

**公开类型：**

```ts
export interface BatteryPoint { cycle: number; observed?: number; predicted?: number; lower?: number; upper?: number }
export interface LifecycleMarker { kind: "knee" | "eol"; cycle: number; confidence: number }
export interface EvidenceNode { id: string; type: "anomaly" | "lifecycle" | "model" | "action"; label: string; score: number }
export interface EvidenceEdge { source: string; target: string; relation: string }
export interface BhmsDemoState { selectedAnomaly: string | null; graphBuilt: boolean; decisionVisible: boolean }
```

**步骤：**

1. 测试预测区间上下界、knee < EOL、证据边引用有效节点，以及 UI 不出现被禁用的性能宣称。
2. 使用 SVG 绘制轨迹与不确定性区域，保证屏幕阅读器获得文字摘要。
3. 点击异常后用 Flip/DrawSVG 构建证据图，随后显示决策依据；数据保持静态、脱敏、可复现。
4. 模型图严格反映实际并行 xLSTM/Transformer 结构和 DominanceSafeFusion。
5. 页面明确说明原始实验资料尚待统一复核，不展示冲突指标。
6. 使用 amber 页面时间线推动曲线、证据节点与模型层级的视觉聚焦。

## Task 8：SEO、元数据、错误页与资源策略

**文件：**

- 创建：`src/app/[locale]/not-found.tsx`
- 创建：`src/app/not-found.tsx`
- 创建：`src/app/robots.ts`
- 创建：`src/app/sitemap.ts`
- 创建：`src/app/opengraph-image.tsx`
- 创建：`src/lib/metadata.ts`
- 创建：`public/manifest.webmanifest`
- 测试：`src/lib/metadata.test.ts`

**步骤：**

1. 测试 canonical、alternate locale、title 和 description。
2. 为首页与案例页生成双语 metadata。
3. 创建程序化 OG 图，延续系统图谱而不依赖外部图片。
4. sitemap 包含全部六个公开路由；robots 允许索引。
5. 添加结构化 Person/CreativeWork JSON-LD。

## Task 9：端到端、性能与无障碍验证

**文件：**

- 创建：`e2e/navigation.spec.ts`
- 创建：`e2e/hermes-demo.spec.ts`
- 创建：`e2e/bhms-demo.spec.ts`
- 创建：`e2e/reduced-motion.spec.ts`
- 创建：`scripts/check-sensitive-content.mjs`
- 修改：`package.json`

**步骤：**

1. E2E 验证语言切换保留案例路径、章节 hash 可导航、Focus View 可退出。
2. E2E 完成 Hermes 合法流程，并验证跳过时间与过期确认失败。
3. E2E 完成 BHMS 异常 → 证据图 → 决策依据流程。
4. reduced-motion 环境验证正文立即可见且无 pinned scroll trap。
5. 敏感内容脚本扫描真实姓名、企业接口、token 和禁用 BHMS 指标措辞。
6. 运行：`npm run lint`、`npm run typecheck`、`npm test -- --run`、`npm run build`、`npm run test:e2e`。
7. 用 Lighthouse 实测首页与两个案例页；记录而非虚构 Performance、Accessibility、SEO 和 LCP 结果。

## Task 10：Vercel 交付准备

**文件：**

- 创建：`README.md`
- 创建：`.env.example`
- 可选创建：`vercel.json`（仅在需要自定义 header 时）

**步骤：**

1. README 记录本地启动、测试、内容编辑、部署和自定义域名步骤。
2. 确认项目不依赖私密环境变量；`.env.example` 只保留未来 analytics/site URL 占位。
3. 运行干净安装与生产构建验证。
4. 不在未获得用户明确授权时创建 GitHub 仓库、推送代码、连接 Vercel 或购买域名。

---

## 全局完成定义

- 设计规格中的 11 条验收要求全部满足。
- 所有自动化验证通过，已知限制在 README 和案例页中一致表达。
- 3D 关闭、JS 降级或 reduced-motion 情况下仍可完整阅读和联系。
- 所有项目事实可追溯到本地代码检查；静态重建与已验证事实有明确标签。
- 用户可在本地一条命令启动，并可在获得授权后直接部署到 Vercel。
