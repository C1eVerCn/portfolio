"use client";

import type { Locale } from "@/content";
import { hermesProductScenario } from "./portfolio-data";
import type { HermesDraft } from "./types";

export type HermesPlateState =
  | "intent"
  | "time_gate"
  | "vehicle"
  | "dry_run"
  | "confirmation"
  | "committed";

interface HermesProductPlateProps {
  locale: Locale;
  state: HermesPlateState;
  draft?: HermesDraft;
  revision?: number;
  headingLevel?: 2 | 3 | 4;
}

const agentMessages: Record<HermesPlateState, Record<Locale, string>> = {
  intent: {
    zh: "我会先核对执行所需参数。",
    en: "I will verify the required execution parameters first.",
  },
  time_gate: {
    zh: "缺少明确时间范围，查询已停止。",
    en: "The query stopped because an exact time range is missing.",
  },
  vehicle: {
    zh: "已找到脱敏可用车辆 E-17。",
    en: "An anonymised available vehicle, E-17, was found.",
  },
  dry_run: {
    zh: "草稿校验通过，尚未发生真实写入。",
    en: "The draft passed validation; no real write has occurred.",
  },
  confirmation: {
    zh: "请确认本次预约；修改草稿会使确认失效。",
    en: "Confirm this booking; editing the draft invalidates confirmation.",
  },
  committed: {
    zh: "参数再次比对后完成写入。",
    en: "The write completed after the parameters were compared again.",
  },
};

const guardMessages: Record<HermesPlateState, Record<Locale, string>> = {
  intent: {
    zh: "意图已识别 · 等待必填参数",
    en: "Intent recognised · required fields pending",
  },
  time_gate: {
    zh: "时间硬门已阻断工具调用",
    en: "Time hard gate blocked the tool call",
  },
  vehicle: {
    zh: "候选资源已脱敏",
    en: "Candidate resource anonymised",
  },
  dry_run: {
    zh: "dry-run 已通过 · 外部副作用为 0",
    en: "Dry run passed · zero external side effects",
  },
  confirmation: {
    zh: "相邻确认有效 · 等待用户动作",
    en: "Adjacent confirmation valid · awaiting user action",
  },
  committed: {
    zh: "身份由服务端注入 · 参数复核一致",
    en: "Identity injected by server · parameters matched",
  },
};

const cardContent: Record<
  HermesPlateState,
  Record<Locale, { title: string; status: string }>
> = {
  intent: {
    zh: { title: "预约草稿", status: "解析中" },
    en: { title: "Booking draft", status: "Parsing" },
  },
  time_gate: {
    zh: { title: "需要补充时间", status: "已阻断" },
    en: { title: "Time required", status: "Blocked" },
  },
  vehicle: {
    zh: { title: "候选车辆", status: "待校验" },
    en: { title: "Vehicle candidate", status: "Validation pending" },
  },
  dry_run: {
    zh: { title: "dry-run 通过", status: "等待确认" },
    en: { title: "Dry run passed", status: "Awaiting confirmation" },
  },
  confirmation: {
    zh: { title: "确认预约", status: "确认窗口开启" },
    en: { title: "Confirm booking", status: "Confirmation window open" },
  },
  committed: {
    zh: { title: "预约已提交", status: "External Effect: COMMITTED" },
    en: { title: "Booking committed", status: "External Effect: COMMITTED" },
  },
};

const fieldLabels: Record<Locale, Record<"platform" | "time" | "vehicle" | "revision", string>> = {
  zh: { platform: "平台", time: "时间", vehicle: "车辆", revision: "修订" },
  en: { platform: "Platform", time: "Time", vehicle: "Vehicle", revision: "Revision" },
};

export function HermesProductPlate({
  locale,
  state,
  draft,
  revision,
  headingLevel = 3,
}: HermesProductPlateProps) {
  const ProductHeading = headingLevel === 2 ? "h2" : headingLevel === 3 ? "h3" : "h4";
  const CardHeading = headingLevel === 2 ? "h3" : headingLevel === 3 ? "h4" : "h5";
  const hasTime = state !== "intent" && state !== "time_gate";
  const hasVehicle = ["vehicle", "dry_run", "confirmation", "committed"].includes(state);
  const card = cardContent[state][locale];
  const requestHasTime = state !== "intent" && state !== "time_gate";
  const request = requestHasTime
    ? locale === "zh"
      ? hermesProductScenario.request
      : "Book a campus demo vehicle for August 4, 09:00–11:00."
    : locale === "zh"
      ? "帮我预约园区演示车辆"
      : "Book a campus demo vehicle.";
  const draftTime = draft?.start && draft.end
    ? `${draft.start.slice(-5)}–${draft.end.slice(-5)}`
    : "—";
  const platform = draft === undefined
    ? hermesProductScenario.platform
    : draft.platform ?? "—";
  const time = draft === undefined
    ? hasTime ? hermesProductScenario.time : "—"
    : draftTime;
  const vehicle = draft === undefined
    ? hasVehicle ? hermesProductScenario.vehicle : "—"
    : draft.vehicle ?? "—";
  const displayedRevision = revision ?? (state === "committed" ? 2 : 1);

  return (
    <article className="feishu-product-plate" data-plate-state={state}>
      <header>
        <ProductHeading>Hermes · Feishu Agent</ProductHeading>
        <p>WebSocket connected</p>
      </header>

      <section className="product-conversation" aria-label={locale === "zh" ? "对话" : "Conversation"}>
        <p><strong>{locale === "zh" ? "用户" : "User"}</strong> {request}</p>
        <p><strong>Hermes</strong> {agentMessages[state][locale]}</p>
      </section>

      <dl className="booking-draft">
        <div><dt>{fieldLabels[locale].platform}</dt><dd>{platform}</dd></div>
        <div><dt>{fieldLabels[locale].time}</dt><dd>{time}</dd></div>
        <div><dt>{fieldLabels[locale].vehicle}</dt><dd>{vehicle}</dd></div>
        <div><dt>{fieldLabels[locale].revision}</dt><dd>{displayedRevision}</dd></div>
      </dl>

      <p
        className="execution-guard"
        data-guard={state === "time_gate" ? "blocked" : "open"}
      >
        {guardMessages[state][locale]}
      </p>

      <section className="confirmation-card" aria-live="polite">
        <CardHeading>{card.title}</CardHeading>
        <p>{card.status}</p>
      </section>
    </article>
  );
}
