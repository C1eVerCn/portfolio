export const hermesProductScenario = {
  user: "飞书用户 A",
  request: "帮我预约 8 月 4 日 09:00–11:00 的园区演示车辆",
  platform: "MaaS",
  vehicle: "E-17",
  time: "09:00–11:00",
  start: "2026-08-04 09:00",
  end: "2026-08-04 11:00",
  task: "园区演示",
  location: "测试场",
  securityBoundary: "emailAddress 由服务端按已核验身份注入",
} as const;

export const hermesArchitectureLayers = [
  {
    id: "websocket",
    label: "Feishu WebSocket",
    detail: "主动推送，无需公网回调入口",
  },
  {
    id: "dedup-queue",
    label: "Dedup & Queue",
    detail: "回调立即返回，事件去重后串行消费",
  },
  {
    id: "routing",
    label: "Layered Routing",
    detail: "Layer 0 / 0.5 / 0.6 与语义 Agent 分流",
  },
  {
    id: "agent-mcp",
    label: "Agent & MCP",
    detail: "每用户 Agent、上下文传播与工具调度",
  },
  {
    id: "acl",
    label: "ACL Guard",
    detail: "五角色显式权限与双层工具防御",
  },
  {
    id: "ocl",
    label: "OCL Pipeline",
    detail: "格式、内容、长度与卡片输出控制",
  },
  {
    id: "commit",
    label: "Deterministic Commit",
    detail: "dry-run、相邻确认、参数复核后写入",
  },
] as const;
