# Chen Yihang — Immersive Portfolio

谌一航的双语 AI 全栈工程师作品集。它以 GSAP 编排滚动叙事，以 React Three Fiber 渲染系统图谱，并通过两个脱敏的静态演示讲述 Hermes 飞书智能体与 BHMS 电池健康管理系统。

## 本地运行

```bash
npm install
npm run dev
```

打开 [http://localhost:3000/zh](http://localhost:3000/zh)。英文版位于 `/en`。

## 验证

```bash
npm run typecheck
npm run lint
npm run test:run
npm run build
```

首次运行浏览器测试需安装 Chromium：

```bash
npx playwright install chromium
npm run test:e2e
```

## 内容与事实边界

- 公开身份和首页文案位于 `src/content/`。
- Hermes 与 BHMS 演示仅使用脱敏、静态、可复现的数据，不连接原项目后端。
- Hermes 的 498 项离线单元测试结论来自本地项目检查，不代表生产 SLA。
- BHMS 现存实验材料仍待统一复核，本站不展示相互冲突的性能指标。

## 部署到 Vercel

1. 将仓库导入 Vercel。
2. 把 `NEXT_PUBLIC_SITE_URL` 设置为最终 HTTPS 域名。
3. 使用默认 Next.js 构建配置部署。
4. 在 Vercel 中绑定独立域名后重新部署，使 sitemap 和 canonical URL 使用正式地址。

项目没有私密运行时依赖。除非以后接入分析服务，否则不需要服务端环境变量。
