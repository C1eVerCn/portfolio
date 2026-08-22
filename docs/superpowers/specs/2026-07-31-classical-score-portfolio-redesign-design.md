# 古典乐谱式工程作品集重设计规格

**日期：** 2026-07-31  
**所有者：** 谌一航（Chen Yihang）  
**状态：** 已批准，进入实现

## 设计命题

作品集应像一首被精确排演、又被精心装帧的工程作品：安静、克制、有节奏。古典音乐不作为表面主题，而作为组织信息的隐喻；纸张不作为复古滤镜，而作为承担工程内容的物理材料。

保留既有双语内容、Hermes 与 BHMS 的事实边界和交互演示逻辑，完整重构视觉系统、首页编排、案例阅读体验与 3D 场景。

## 视觉系统

- 冷象牙纸 `#F0EEE7`、高光纸 `#F7F5EF`、炭墨 `#252725`、次级墨 `#72756F`、普鲁士蓝 `#263E63`。
- Newsreader 负责英文编辑标题，Noto Serif SC 负责中文标题，Geist 负责正文，Bravura 负责 SMuFL 音乐字形。
- 纸面包含低对比纤维、磨砂颗粒、压痕与描图纸叠层；不使用黑色霓虹、粒子、扫光、玻璃球或 AI 渐变。
- 不使用胶囊导航、巨型圆角卡、等宽三列网格和技能标签墙。
- 音乐符号只承担结构语义：breath/caesura 表示停顿，fermata 表示关键决策与专注阅读，repeat 表示回到前一主题，coda 表示联系尾声，p/mf/f 表示动效力度。

## 奏鸣曲式信息架构

1. **Prelude：** 姓名、职业定位与主题句构成乐谱封面；压痕主视觉占据留白，不阻挡立即阅读。
2. **Exposition：** 六组能力表现为六条逐渐加入的工程声部，仅展示、不链接项目。
3. **Movement I / II：** Hermes 与 BHMS 形成两张不对称乐章跨页；Hermes 使用小节线与边界切分，BHMS 使用曲线、连音线与描图纸证据层。
4. **Recapitulation：** 三条工程原则以页边批注回收前面的音乐语义。
5. **Coda：** 大量留白，只保留联系信息和 coda 字形。

案例页使用纸张外侧的小节目录，不再使用悬浮胶囊。Hermes 演示重排为执行总谱；BHMS 图表重排为印刷图版与描图纸证据层。Focus View 使用 fermata 语义，但保持明确的退出入口。

## 3D 与动效

- `PaperScoreScene` 以高细分纸面、自定义纸张 shader、压痕线和少量半透明层替换旧球体网络。
- 材质纹理由程序噪声生成，不引入 AI 生成图片资产。
- 每页一个 GSAP/ScrollTrigger 主时间线，通过 `prelude`、`exposition`、`hermes`、`bhms`、`recapitulation`、`coda` labels 驱动纸面、侧光、裁切与排版。
- 动效力度按 `p → mf → f → p` 变化；fermata 只形成轻微阻尼与视觉停留，不锁死滚动。
- Hover 只允许纸边轻抬、墨线延长和局部侧光。
- 移动端降低纸面细分和透明层数；reduced-motion/WebGL 不可用时使用静态 SVG 压痕构图。

## 公开接口

```ts
export type MusicGlyphName =
  | "fermata"
  | "breath"
  | "caesura"
  | "repeat"
  | "coda"
  | "piano"
  | "mezzoForte"
  | "forte";

export type MovementId =
  | "prelude"
  | "exposition"
  | "hermes"
  | "bhms"
  | "recapitulation"
  | "coda";

export type DynamicLevel = "p" | "mf" | "f";

export interface ScoreMotionState {
  movement: MovementId;
  progress: number;
  dynamic: DynamicLevel;
  focus: boolean;
}
```

## 验收标准

1. 中英文首页和两个案例页均使用纸张设计系统，首屏正文立即可见。
2. 旧球体、cyan/amber 霓虹、胶囊导航、圆角项目卡与三列能力卡完全移除。
3. Hermes 与 BHMS 现有状态机、图表、证据链和事实边界不回归。
4. 中文标题在 390、768、1440 三档视口无孤立单字或横向溢出。
5. reduced-motion、无 WebGL、键盘导航与直接 hash 访问均可完整浏览。
6. lint、TypeScript、Vitest、Playwright 和生产构建全部通过。
