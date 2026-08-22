# 沉浸式 AI 全栈工程师作品集设计规格

**日期：** 2026-07-31  
**所有者：** 谌一航（Chen Yihang）  
**状态：** 已确认，进入实现

## 1. 产品目标

这是一个以正常浏览为第一目标、同时能在技术面试中承担项目演示的个人作品集。它不模拟幻灯片，也不设置强制开场；访客进入后应立即看见姓名、定位和核心项目，同时逐步发现由 3D 系统图谱承载的工程叙事。

主要受众是招聘者与技术面试官。浏览者应在三分钟内获得三个结论：

1. 谌一航能够独立完成从产品交互、前端、后端到 AI/数据基础设施的端到端开发。
2. Hermes 飞书智能体体现了对 LLM 不确定性、权限和真实副作用边界的工程控制。
3. BHMS 体现了从时序预测到证据链、解释和交付闭环的系统能力。

## 2. 信息与公开身份

- 中文名：谌一航
- 英文名：Chen Yihang
- 职业定位：Full-stack AI Engineer / AI 全栈工程师
- 邮箱：19943221833@163.com
- GitHub：https://github.com/C1eVerCn
- 城市：不展示
- 简历：首版不提供，待用户补充文件后接入
- GitHub 展示名：首版保持现状，不要求修改

## 3. 创意方向

### 3.1 核心隐喻

作品集采用 **Agent Operations Atlas（智能系统运行图谱）**：页面不是装饰性的星空，而是一套有语义的系统宇宙。能力节点、数据流、权限边界和项目核心会随着滚动重组，帮助浏览者理解工程关系。

### 3.2 视觉语言

- 深墨色背景、低饱和灰白正文、冷青色 Hermes 强调、暖琥珀色 BHMS 强调。
- 字体建议：Geist（拉丁）、Noto Sans SC（中文）、IBM Plex Mono（元数据）。
- 光效克制，避免粒子墙、无意义漂浮和游戏式自由漫游。
- 3D 负责空间关系与氛围；正文、按钮、图表标签保持可访问的 HTML/SVG。
- 首屏内容服务器渲染，WebGL 延迟增强，不以加载动画阻挡内容。

### 3.3 动效原则

GSAP 负责绝大多数视觉编排：

- 页面级 ScrollTrigger 主时间线与语义 labels。
- GSAP 驱动相机、场景组、材质参数和 DOM 叙事层。
- Flip 用于布局状态切换；SplitText 用于有限的标题揭示；DrawSVG 用于系统链路。
- 鼠标视差使用 `quickTo`，不在每次指针事件中创建 tween。
- 桌面、移动和 `prefers-reduced-motion` 使用 `gsap.matchMedia()` 分级。
- 不使用 ScrollSmoother，保留原生滚动和可访问性。

## 4. 站点结构

采用静态双语路由：

- `/` 重定向到 `/zh`
- `/zh`、`/en`：首页
- `/zh/work/hermes`、`/en/work/hermes`：Hermes 案例
- `/zh/work/bhms`、`/en/work/bhms`：BHMS 案例

语言切换保持当前路径。所有核心内容来自类型化本地数据，无 CMS、无运行时项目后端依赖。

## 5. 首页体验

### 5.1 首屏

姓名、AI 全栈工程师定位和一句核心陈述立即可读。3D 系统核心在背景中组装，页面不要求点击进入。

### 5.2 能力图谱

展示六层能力：

- 产品与交互
- 前端工程
- 后端与 API
- Agent 与 MCP
- 机器学习与数据
- 基础设施与可靠性

该层只展示能力关系，不链接项目，避免只有两个项目时产生重复导航。

### 5.3 项目分化

能力图谱收缩并分裂成两个项目核心：冷青 Hermes 与暖琥珀 BHMS。随后进入两个独立项目预览卡，项目卡才提供案例入口。

### 5.4 工程原则

- Uncertainty stops at boundaries / 不确定性止于系统边界
- Results need evidence / 结果必须伴随证据
- End-to-end ownership / 端到端负责

### 5.5 关于与联系

简洁介绍独立开发与系统工程取向，提供邮箱与 GitHub。邮箱和外链拥有明确 focus 样式和可复制/可点击行为。

## 6. Hermes 案例页

### 6.1 叙事标题

**From probabilistic conversation to deterministic action / 从概率性对话走向确定性行动**

### 6.2 章节

1. 真实失败模式：虚构可用性、跳过时间条件、未调用工具却声称成功。
2. 系统总览：飞书长连接、事件去重/队列、分层路由、Agent、MCP 与真实业务系统。
3. 可交互预订演示：车型/平台 → 时间硬门 → 可用性 → 车辆 → 任务/地点 → dry-run → 相邻确认 → 确定性 commit → 状态清理。
4. 关键决策：混合路由、副作用守卫、五角色 ACL、服务端身份注入、预热与上下文传播、隐私记忆。
5. 验证与边界：展示已验证的 498 个离线单元测试，同时诚实说明内存态、低并发消费者、fail-open/fallback 语义。

案例内容以脱敏的概念重建呈现，不连接企业生产后端，不暴露真实人员或车辆数据。

## 7. BHMS 案例页

### 7.1 叙事标题

**A prediction is not yet a decision / 预测结果并不等于可信决策**

### 7.2 章节

1. 问题：多源电池数据、生命周期多输出预测与决策可解释性。
2. 系统链路：导入 → 归一化 → 生命周期模型 → 异常 → GraphRAG → 决策依据 → 导出。
3. 静态交互演示：观测曲线、预测区间、knee/EOL、异常选择、证据图和决策依据。
4. 模型深挖：DomainConditioning；xLSTM 与 Transformer 并行；DominanceSafeFusion；TemporalAttentionPooling；LifecycleDecoder。
5. GraphRAG：组合异常、生命周期和模型证据，重排候选，生成可追踪决策依据；支持 Neo4j 与内存回退。
6. 实验与交付工程：多随机种子、消融、迁移、release manifest 和完整产品链路。
7. 诚实边界：由于现存实验资料内部存在不一致，首版不宣称 Hybrid 全面优于 BiLSTM，也不展示未经统一复核的标题指标。

演示为明确标注的静态脱敏重建，不连接 BHMS 实时后端。

## 8. 导航与面试使用

- 顶部导航包含 Work、Principles、About、语言切换和联系入口。
- 案例页提供低调的侧边章节导航与阅读进度。
- 提供 Focus View，用于面试时减少外围导航干扰，但不改变内容结构、不进入独立演示模式。
- 所有章节可通过 URL hash 定位，键盘可达。

## 9. 技术架构

- Next.js App Router + React + TypeScript。
- Three.js + React Three Fiber + Drei 构建持久 WebGL 场景。
- GSAP、`@gsap/react`、ScrollTrigger、Flip、SplitText、DrawSVG 负责编排。
- Canvas 作为 client-only 渐进增强层；可索引内容由服务端 HTML 提供。
- 每页仅一个顶层滚动时间线，子时间线不单独创建 ScrollTrigger。
- 场景状态通过稳定 refs/proxy 对象驱动，不在每帧触发 React state。
- Vitest + Testing Library 覆盖内容、状态机和组件；Playwright 覆盖导航、语言、降级和关键演示流程。

## 10. 性能、无障碍与降级

- DPR 上限 1.5；限制节点和光源数量；优先 instancing、transform 和 opacity。
- 页面隐藏时暂停渲染；路由级重资源按需加载。
- 移动端减少几何体、后期效果与 pinned 距离。
- reduced-motion 模式移除 scrub、相机穿越和文字拆分，保留即时状态变化。
- WebGL 不可用时显示静态 CSS/SVG 系统图，不影响正文与导航。
- 所有语义、表单和链接在 Canvas 外部；颜色对比、键盘焦点和 skip link 必须可用。
- 首版目标：桌面 Lighthouse Accessibility/SEO ≥ 95，Performance ≥ 80；典型宽带下 LCP 目标 < 2.5s。目标需通过实测确认，不能在未测前声称达成。

## 11. 验收标准

1. 中英文四条核心路由均可直接访问、刷新和静态生成。
2. 首页能力图谱无项目链接，两个项目入口只出现在 Selected Work 区域。
3. Hermes 演示必须体现时间硬门、dry-run、相邻确认和确定性 commit。
4. BHMS 演示必须体现预测区间、knee/EOL、证据图和决策依据，并标注为静态重建。
5. 正常、移动、reduced-motion、无 WebGL 四种模式均能完整浏览。
6. GSAP 动画在组件卸载后无残留 trigger/listener。
7. 页面不存在未经证实的 BHMS 性能结论或真实企业敏感数据。

