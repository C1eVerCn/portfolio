# 神话书式沉浸工程作品集重设计规格

日期：2026-08-03  
状态：待用户最终审阅  
项目：谌一航双语软件工程作品集

## 1. 目标

将当前古典纸张式作品集升级为一册可被打开、阅读和演示的“神话工程书”。网站必须同时满足三类使用场景：

1. 招聘者快速浏览，在 30 秒内理解作者身份、两个核心项目和技术方向。
2. 技术面试官深入查看，在 5–10 分钟内理解产品形态、系统架构、关键决策和工程边界。
3. 作者现场演示，可以重播序章、逐步运行 Hermes 状态机，并演示 BHMS 从观测到决策依据的流程。

设计的内容主体始终是软件工程项目。古典音乐提供节奏，北欧神话提供结构隐喻，纸张和书籍提供空间载体；三者都不得压过技术内容。

## 2. 已确认的核心决策

- 主 slogan：`智绘万物`。
- 英文 slogan：`Intelligence Shapes Everything.`
- 辅助文案：`将不确定的智能，编织成可解释、可执行、可交付的系统。`
- 姓名仅作为页眉署名，不再成为首屏大标题。
- 使用纯北欧体系，不混入希腊三缪斯。
- 诺伦三女神不绘制成人物，转译成过去、现在、未来三条命运线。
- 音乐感来自布拉基式诗歌节奏和 GSAP 编排，不播放声音，不使用音符雨。
- 开场是一册神话工程书被打开，并无缝变成首屏。
- 每个浏览会话自动播放一次完整版序章；之后只通过显式入口重播。
- 项目展示采用“真实产品界面 + 技术图解”结合，不使用泛化 AI 概念图。
- Hermes 和 BHMS 的视觉事实来自本机真实项目代码、文档、数据与脱敏演示，不夸大公开指标。

## 3. 设计原则

### 3.1 内容优先

任何装饰都必须承担至少一种职责：解释时间、连接信息、表明状态、展示边界或引导视线。没有信息职责的五线谱、符文、粒子、神像和光效不得出现。

### 3.2 神话隐喻而非主题皮肤

北欧元素仅进入结构语言：世界树分支、诺伦命运线、年轮、石刻几何比例、书脊和页边批注。不使用维京头盔、武器、渡鸦群、神像、伪造符文句子或奇幻游戏 UI。

### 3.3 真实证据而非营销摘要

每个项目必须同时回答：

- 做出了什么产品。
- 用户如何操作。
- 系统如何运行。
- 为什么这样设计。
- 如何验证。
- 当前仍有什么限制。

### 3.4 动效是时间结构

动效以乐句和章节组织，不连续轰炸用户。每次运动必须有起点、发展、停顿和落点。重点章节允许达到 `f`，章节之间恢复到 `p`。

## 4. 信息架构

### 4.1 全站路由

```text
/{locale}
  Prelude / 神话书序章与智绘万物
  Three Threads / 诺伦三线
  Exposition / 六组工程能力
  Movement I / Hermes 首页视觉序曲
  Movement II / BHMS 首页视觉序曲
  Recapitulation / 工程原则
  Coda / 署名与联系

/{locale}/work/hermes
  项目开场
  产品实物
  执行总谱
  系统剖面
  安全决策
  优化与验证
  边界

/{locale}/work/bhms
  项目开场
  产品工作台
  数据链路
  生命周期预测
  Hybrid 模型
  GraphRAG 证据图
  实验与复现
  结果边界
```

### 4.2 三类阅读速度

- 快速浏览层：slogan、项目产品画面、一句话价值、技术关键词。
- 深度阅读层：交互流程、系统图、模型图、工程决策。
- 演示层：序章重播、Hermes 状态推进、BHMS 曲线与证据交互、Focus View。

## 5. 视觉系统

### 5.1 色彩

```text
冷象牙纸     #F0EEE7
高光纸       #F7F5EF
炭墨         #252725
次级墨       #72756F
普鲁士蓝     #263E63
浅霜蓝       #B9C3CE
旧金属灰     #99988F
```

不得重新引入黑底霓虹章节。三条命运线通过线型、透明度和运动区分，不使用三种高饱和颜色。

### 5.2 字体

- 中文标题：Noto Serif SC。
- 英文编辑标题：Newsreader。
- 正文与界面：Geist。
- 数据与代码标记：Geist Mono。
- 少量乐谱停顿字形：Bravura。

所有字体继续自托管。`智绘万物` 使用中文书卷字体并单独调整字距；英文 slogan 作为副标题，不与中文重叠。

### 5.3 纸张

纸面包含程序化细纤维、轻微压痕、局部侧光、低幅纸张翘曲和少量描图纸。删除完整五线谱、重复横线、显眼背景网格和大面积模糊阴影。

### 5.4 诺伦三线

| 线 | 神话时间 | 工程语义 | 视觉行为 |
| --- | --- | --- | --- |
| Urðr | 过去 | 日志、数据、上下文、证据 | 炭墨实线，落定后不漂移 |
| Verðandi | 现在 | 状态机、工具调用、当前交互 | 普鲁士蓝主线，响应滚动与操作 |
| Skuld | 未来 | 预测、风险、待确认副作用 | 半透明细线，允许区间和分叉 |

首页首次解释三线，后续只通过行为体现，不重复神话说明。可在页边使用小号 `URÐR / VERÐANDI / SKULD` 标记，不使用具体符文。

## 6. 神话书序章

### 6.1 初始画面

一册闭合的冷灰象牙色书籍位于纸面空间中央。封面文字为：

```text
智绘万物
INTELLIGENCE SHAPES EVERYTHING
OPUS I
```

封面中央压印抽象世界树，其根部由三条诺伦命运线组成。封面不出现姓名。

### 6.2 动画乐句

完整版序章约 2.6 秒：

1. `Summon`：纸面由暗到明，书脊出现细微普鲁士蓝侧光。
2. `Awaken`：三条线沿世界树压痕流向书脊。
3. `Open`：封面通过透视旋转打开，纸页产生适度弯曲、厚度和接触阴影。
4. `Inscribe`：右页上的三条线依次揭示“智绘万物”和英文 slogan。
5. `Enter`：书页放大，页边越过视口，打开的书页无缝成为首页纸面。
6. `Arrival`：署名、辅助文案、导航和滚动提示出现。

### 6.3 播放规则

- 使用 `sessionStorage` 记录当前浏览会话是否播放过完整版。
- 同一会话再次进入首页不自动播放。
- 页眉或 Coda 提供 `重播序章 / Replay Prelude`。
- 动画过程中始终显示 `跳过序章 / Skip Prelude`。
- 跳过后直接将所有状态设置为完成值，不保留半开书页。
- reduced-motion 下不播放翻书动画，直接显示已打开的首屏。
- 移动端使用封面向上掀开和纵向展开，降低 3D 透视和纸张层数。
- DOM 中始终存在可读 slogan，JavaScript 或 GSAP 失败时不得黑屏。

## 7. 首页布局

### 7.1 页眉

左侧为小号署名：

```text
CHEN YIHANG
SOFTWARE ENGINEER
```

中间为 `WORK · PRINCIPLES · ABOUT`，右侧为语言切换和联系。无胶囊、无实心导航背景，只保留一条细基准线。滚动后高度收紧；Focus View 时淡出。

### 7.2 Prelude

首屏主体为 `智绘万物`。桌面偏左构图，辅助文案位于右下；姓名不进入主构图。背景只有纸张和三条尚未完全成形的命运线。

桌面优先单行；中小屏允许 `智绘 / 万物` 两行。中文标题不得出现孤立单字。

### 7.3 Three Threads

用极少文字解释：过去保存证据、现在执行决策、未来表达不确定性。三条线分别表现为落定、响应和区间。该章节建立全站视觉语法。

### 7.4 Exposition

六组能力以逐渐加入的工程声部展示：

1. AI Agent 与工具调用。
2. 后端系统与 API。
3. 前端产品与交互。
4. 数据、模型与推理。
5. 安全、权限与执行边界。
6. 测试、部署与可观测性。

每条包含编号、能力名称、具体技术和一条抽象波形。Hover 或键盘聚焦显示一条工程解释。此层不链接项目。

### 7.5 Hermes 首页视觉序曲

占据约 120–150vh，初始显示重绘后的飞书对话、结构化预约草稿和确认卡片。滚动按以下状态推进：

```text
用户意图
→ 时间硬门拒绝
→ 补齐参数
→ 查询脱敏车辆
→ 生成 dry-run
→ 相邻确认
→ 参数复核
→ deterministic commit
```

每一步同时展示当前输入、状态机、工具权限、系统日志和外部副作用。后半段界面拆解为：

```text
Feishu WebSocket
→ Deduplication
→ Queue
→ Layered Routing
→ Agent / MCP
→ ACL Guard
→ OCL Pipeline
→ Deterministic Commit
```

节点支持 Hover、键盘聚焦或点击查看模块职责。

### 7.6 BHMS 首页视觉序曲

占据约 120–150vh，初始显示基于真实 Dashboard 和 BatteryWorkspace 重构的工作台：电池列表、健康度、容量趋势、告警、数据来源与预测入口。

滚动后聚焦一块脱敏电池：

1. 绘制历史观测曲线。
2. 标记观测边界。
3. 显示 BiLSTM 预测。
4. 显示 Hybrid 预测。
5. 展开不确定区间。
6. 标记 knee、EOL、RUL。
7. 显示风险窗口和特征贡献。
8. 图表描图纸抬起，露出 GraphRAG 证据层。
9. 生成 decision basis 和维护摘要。

### 7.7 Recapitulation 与 Coda

工程原则作为页边批注再现，重点强调确定性边界、可解释性、诚实指标与可验证交付。Coda 使用未闭合年轮，包含邮箱、GitHub、署名和重播序章入口；不使用营销式 CTA。

## 8. Hermes 详情页

### 8.1 项目开场

标题为 `从概率性对话走向确定性行动`。首屏右侧直接显示可交互的脱敏飞书预约界面。辅助元信息包括独立开发、技术方向和作者署名。

### 8.2 产品实物

绘制完整产品界面：用户消息、Agent 回复、预约卡片、可用车辆、时间范围、任务地点、确认、取消和结果。提供 `重新演示`。

### 8.3 执行总谱

逐步交互维持四列语义：

```text
User Intent
Parsed Draft
System Guard
External Effect
```

缺参数时必须明确显示 `NOT EXECUTED`。确认时展示 revision、身份注入、参数复核和 commit 许可。

### 8.4 系统剖面

分层展示飞书事件层、消息调度层、Agent 推理层、权限层、工具层、输出控制层和业务后端。可展开的技术事实包括：

- WebSocket 无公网入口。
- 回调立即返回、去重与队列。
- Layer 0 / 0.5 / 0.6 快路径。
- 每用户 Agent 与上下文传播。
- 五角色非线性 ACL。
- pre-tool-call 与 guarded 双层防御。
- 服务端身份注入。
- OCL 格式、内容、长度控制。
- 文本 fallback、相邻确认与确定性 commit。

### 8.5 决策、优化、验证与边界

每个关键决策按 `Problem / Rejected Approach / Final Decision / Trade-off / Verification` 展开。验证结果必须与测试类别对应，不孤立放大测试数字。明确内存态、低并发消费者、fallback 和非生产 SLA 边界。

## 9. BHMS 详情页

### 9.1 项目开场

标题为 `预测结果并不等于可信决策`。首屏直接显示真实产品工作台重构，包括数据源、电池列表、生命周期趋势、健康状态、模型选择和诊断入口。

### 9.2 数据链路

```text
NASA / CALCE / Kaggle / HUST / MATR
→ Normalisation
→ Lifecycle Dataset
→ Model Input
→ Prediction
→ Diagnosis
→ Report Export
```

Oxford 标记为 trajectory 辅助源，PulseBat 标记为 enhancement-only，不误写为主训练源。

### 9.3 生命周期预测

使用真实项目字段重绘 LifecycleChart，允许调整观测比例、模型和数据来源。展示 observed trajectory、predicted trajectory、uncertainty、RUL、knee、EOL、confidence、risk windows 和 feature contributions。

### 9.4 Hybrid 模型

可拆解模型图：

```text
Domain Conditioning
├── xLSTM Branch
└── Transformer Branch
        ↓
Dominance Safe Fusion
        ↓
Temporal Attention Pooling
        ↓
Lifecycle Decoder
```

通过滚动表现双分支、融合权重、单分支回退和多输出解码。

### 9.5 GraphRAG 证据图

中心为维护决策，周围连接异常证据、生命周期证据、模型证据、知识库、候选故障、根因和维护建议。节点交互展示其如何参与 decision basis，并标明 Neo4j 与内存回退。

### 9.6 实验与结果边界

使用真实 multi-seed、within-source、transfer、ablation、training curves、error distribution 和 dataset split 资产。不得宣称 Hybrid 全面优于 BiLSTM；明确未通过的论文门槛、弱 transfer 和研究原型定位。

## 10. 动效系统

### 10.1 动态力度

```text
Book Prelude      f → p
Three Threads     p
Capabilities      mf
Hermes             f
Interlude          p
BHMS               f
Principles        mf
Coda                p
```

### 10.2 页面转场

进入项目时，当前项目的命运线延伸至视口边缘，项目名称保持视觉连续，新页面从同一条线展开。返回首页时反向收束并恢复合理滚动位置。转场控制在 500–700ms，不设置长时间阻塞。

### 10.3 交互细节

- 指针仅改变纸面侧光和命运线张力，不替换系统光标。
- Hover 包含墨线延长、纸边轻抬、局部信息显影。
- Hermes 状态机允许重置和重播。
- BHMS 曲线允许观察周期和切换证据。
- Focus View 进入 fermata，其他信息降对比度，退出入口常驻。
- 不自动播放声音。

### 10.4 性能约束

- 高频动画只修改 transform、opacity、SVG stroke 和 shader uniforms。
- 每页只有一条顶层 GSAP/ScrollTrigger 主时间线。
- 子组件暴露 sequence，不创建独立 ScrollTrigger。
- 指针响应使用 quickTo 或等价阻尼方式。
- WebGL 只负责纸面、书本空间层次和低成本光照；产品界面由 HTML/SVG 完成。
- 移动端降低纸面细分、透明层和路径数量。

## 11. 组件与状态边界

建议新增或重构以下独立组件：

- `MythicBookPrelude`：序章状态、跳过、完成和重播。
- `NornThreads`：三条命运线 SVG/Canvas 表达，不包含业务文案。
- `MythicPaperScene`：纸面、书本几何和 WebGL 回退。
- `SloganPrelude`：slogan、辅助文案和署名。
- `HermesProductPlate`：飞书产品实物重构。
- `HermesExecutionScore`：状态机演示和四列执行证据。
- `HermesSystemCutaway`：分层系统剖面。
- `BhmsWorkspacePlate`：Dashboard/Workspace 产品重构。
- `BhmsLifecyclePlate`：曲线、模型对比和生命周期标记。
- `BhmsEvidenceGraph`：GraphRAG 证据交互。
- `ReplayPreludeControl`：显式重播入口。

公共状态至少包括：

```text
PreludeState = idle | summoning | opening | inscribing | entering | complete | skipped
NornThreadState = { past, present, future, tension, focus }
MovementId = prelude | threads | exposition | hermes | bhms | recapitulation | coda
DynamicLevel = p | mf | f
```

序章播放记录仅使用 sessionStorage，不进入长期 localStorage。

## 12. 响应式布局

### 12.1 1440px 桌面

12 列网格，左右边距约 6–7vw。slogan 优先宽幅单行；项目产品画面可与技术说明并列；系统图显示完整节点；页边小节目录可见。

### 12.2 768px 平板

8 列网格，slogan 两行；产品界面与技术说明上下排列；三条命运线保留但减少透明纸层；目录简化为页边编号。

### 12.3 390px 手机

4 列网格，`智绘 / 万物` 两行。序章采用封面向上掀开。Hermes 一次显示一个状态；BHMS 图表允许内部拖动但页面无横向溢出；Hover 信息改为点击；不运行高细分书本或纸面。

## 13. 可访问性与回退

- reduced-motion 直接进入完成态，不等待序章。
- WebGL 不可用时使用静态书页和 SVG 命运线。
- 字体失败时使用系统 Serif/Sans 回退。
- 图表包含 title、description 和文本摘要。
- 所有交互支持键盘。
- 技术状态不只依赖颜色。
- Focus View 常驻可见退出入口。
- 直接访问章节 hash 时内容立即可见。
- 初始 HTML 包含 slogan 和主要正文，动画失败不隐藏内容。

## 14. 真实素材来源

Hermes 依据：

- `/Users/chris/IM-Test/hermes-feishu-agent_副本/README.md`
- `/Users/chris/IM-Test/hermes-feishu-agent_副本/docs/architecture.md`
- 本项目中的卡片构建、状态机、安全规范与测试资料。

BHMS 依据：

- `/Users/chris/Documents/trae_projects/BHMS/README.md`
- `/Users/chris/Documents/trae_projects/BHMS/frontend/src/pages/`
- `/Users/chris/Documents/trae_projects/BHMS/frontend/src/components/workspace/`
- `/Users/chris/Documents/trae_projects/BHMS/Doc/论文/`
- `/Users/chris/Documents/trae_projects/BHMS/data/models/` 下的正式图表与汇总资产。

产品画面使用 HTML/SVG/Canvas 重绘并脱敏；实验曲线可基于正式资产转绘。不得使用与项目无关的 AI 概念插画冒充产品截图。

## 15. 测试与验收

### 15.1 功能测试

- 首次会话自动播放完整版序章。
- 同一会话返回首页不自动重播。
- 重播入口可重新开始序章。
- 跳过序章直接进入完整可交互状态。
- reduced-motion 不播放翻书。
- Hermes 守卫状态机和 commit 逻辑不回归。
- BHMS 证据生成与 decision basis 不回归。
- 双语内容和语言切换一致。
- 章节 hash、Focus View 和键盘导航可用。

### 15.2 视觉测试

新增或更新以下视觉基线：

- 1440×1000：闭合封面、打开中、完成首屏。
- 768×1024：完成首屏、Hermes 产品画面、BHMS 工作台。
- 390×844：手机序章、完成首屏、两个项目核心交互。

检查标题断行、纸张层次、书本透视、三线连续性、项目信息密度和无横向溢出。

### 15.3 性能与质量门槛

- 首屏 DOM 内容立即可读。
- 序章完整版约 2.6 秒，并始终可跳过。
- 页面不出现旧姓名主视觉、完整五线谱、霓虹、粒子宇宙或圆角项目卡。
- 中文标题无孤立单字，正文宽度约不超过 65 个字符。
- WCAG AA。
- Lighthouse Accessibility 与 SEO 均不低于 95。
- 生产构建、lint、TypeScript、Vitest 与 Playwright 全部通过。

## 16. 非目标

- 不添加背景音乐或交互音效。
- 不制作神祇人物插画或完整神话故事站。
- 不把两个真实项目改造成虚构产品。
- 不修改项目事实、姓名、邮箱、GitHub 或公开指标边界。
- 不在本轮部署 Vercel、创建远端仓库或发布外部链接。

## 17. 实施顺序约束

实施必须先为序章状态、session 播放规则、slogan 结构、Hermes/BHMS 新视觉组件写失败测试，再进行实现。先完成静态内容与产品图版，再接入 GSAP 和 WebGL，最后更新视觉基线和全量验收。
