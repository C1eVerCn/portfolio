import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Locale } from "@/content";
import { CaseSection, CaseShell } from "@/components/case/CaseShell";
import { HermesDemo } from "@/features/hermes/HermesDemo";
import { HermesProductPlate } from "@/features/hermes/HermesProductPlate";
import { HermesSystemCutaway } from "@/features/hermes/HermesSystemCutaway";

const copy = {
  zh: {
    eyebrow: "01 / Hermes 飞书智能体 · 独立开发",
    title: "从概率性对话走向确定性行动",
    thesis: "LLM 负责理解；权限、参数和真实写入由确定性代码控制。",
    chapters: [
      { id: "product", label: "产品" }, { id: "execution", label: "执行" },
      { id: "system", label: "系统" }, { id: "decisions", label: "决策" },
      { id: "verification", label: "验证" }, { id: "limits", label: "边界" },
    ],
    sections: {
      product: ["01", "产品界面", "用户看到的，是一张可核验的执行凭证", "对话、预约草稿、执行守卫和确认卡共同呈现当前真实状态。下方为脱敏静态重建，不连接企业服务。"],
      execution: ["02", "执行总谱", "一次真实写入如何被逐步允许", "从时间硬门到 dry-run，再到相邻确认与 commit；每一步都能阻断副作用，也能解释为什么阻断。"],
      system: ["03", "系统剖面", "让概率层与确定层各自做擅长的事", "飞书事件经过去重、队列与分层路由；需要语义理解的部分进入 Agent，真实写入仍由 ACL、OCL 与 commit guard 控制。"],
      decisions: ["04", "工程决策", "可信不是一句提示词，而是一组可测试约束", "五项决策分别记录风险信号、失败模式、实现控制、验证方式与仍然存在的代价。"],
      verification: ["05", "验证账本", "498 项离线单元测试覆盖什么", "数字来自被检查的 Hermes 本地项目；外部依赖全部 mock，因此只证明离线控制边界，不代表线上 SLA。"],
      limits: ["06", "明确边界", "把尚未解决的工程条件写在结果旁边", "当前实现仍采用内存态与低并发消费者；部分异常路径保留显式 fallback 语义，尚未形成生产可用性承诺。"],
    },
  },
  en: {
    eyebrow: "01 / Hermes Feishu agent · Independent project",
    title: "From probabilistic conversation to deterministic action",
    thesis: "The LLM interprets; deterministic code controls permissions, parameters and real writes.",
    chapters: [
      { id: "product", label: "Product" }, { id: "execution", label: "Execution" },
      { id: "system", label: "System" }, { id: "decisions", label: "Decisions" },
      { id: "verification", label: "Verification" }, { id: "limits", label: "Limits" },
    ],
    sections: {
      product: ["01", "Product surface", "The user receives a verifiable execution receipt", "Conversation, booking draft, execution guard and confirmation card expose the actual state. This is an anonymised static reconstruction with no enterprise connection."],
      execution: ["02", "Execution score", "How a real write becomes progressively permissible", "A time hard gate, dry run, adjacent confirmation and commit can each stop side effects—and explain why they stopped."],
      system: ["03", "System cutaway", "Give probabilistic and deterministic layers different jobs", "Feishu events pass deduplication, queues and layered routing. Semantic work reaches the agent while ACL, OCL and a commit guard retain control of writes."],
      decisions: ["04", "Engineering decisions", "Trust is a testable constraint system, not a prompt", "Five decisions record the risk signal, failure mode, implementation control, verification route and remaining cost."],
      verification: ["05", "Verification ledger", "What the 498 offline unit tests cover", "The count belongs to the inspected local Hermes project. External dependencies are mocked, so it verifies offline control boundaries—not a production SLA."],
      limits: ["06", "Explicit limits", "Unresolved operating conditions belong beside the outcome", "The implementation still uses in-memory state and a low-concurrency consumer. Some exception paths retain explicit fallback semantics and make no production availability promise."],
    },
  },
} as const;

const decisions = {
  zh: [
    ["时间硬门", "时间缺失", "模型可能补全关键参数", "确定性校验在工具调用前停止", "缺时请求单测", "增加一次澄清轮次"],
    ["五角色 ACL", "越权工具调用", "提示词权限可被绕过", "角色白名单与工具层二次防御", "角色矩阵单测", "权限表需要同步维护"],
    ["服务端身份", "身份参数伪造", "客户端字段不可作为可信身份", "emailAddress 按已核验会话注入", "身份注入单测", "依赖上游身份链"],
    ["相邻确认", "旧确认误提交", "草稿变化后确认语义失效", "修订号、参数快照与邻接窗口", "commit guard / dry-run 单测", "修改后必须再次确认"],
    ["上下文与记忆", "线程串线或隐私泄露", "多用户状态可能相互污染", "ContextVar、按用户 Agent 与隐私过滤", "session / history 单测", "当前状态仍驻留内存"],
  ],
  en: [
    ["Time hard gate", "Missing time", "The model may invent a critical parameter", "Deterministic validation stops before tools", "Missing-time unit tests", "Adds one clarification turn"],
    ["Five-role ACL", "Unauthorised tools", "Prompt permissions can be bypassed", "Role allowlists plus tool-layer defence", "Role-matrix unit tests", "Permission tables require synchronisation"],
    ["Server identity", "Forged identity", "Client fields are not trusted identity", "Inject emailAddress from the verified session", "Identity-injection unit tests", "Relies on the upstream identity chain"],
    ["Adjacent confirmation", "Stale confirmation", "A changed draft invalidates consent", "Revision, parameter snapshot and adjacent window", "Commit-guard and dry-run tests", "Edits require reconfirmation"],
    ["Context and memory", "Cross-thread leakage", "Multi-user state can become entangled", "ContextVar, per-user agents and privacy filtering", "Session and history tests", "State currently remains in memory"],
  ],
} as const;

const verification = {
  zh: ["事件处理、去重与分层路由", "预约 FSM、dry-run 与 commit guard", "身份注入、五角色 ACL 与 OCL", "会话、上下文传播与隐私记忆", "车辆 schema、normalizer 与飞书卡片"],
  en: ["Event handling, deduplication and layered routing", "Booking FSM, dry run and commit guard", "Identity injection, five-role ACL and OCL", "Sessions, context propagation and privacy memory", "Vehicle schemas, normalisers and Feishu cards"],
} as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: value } = await params;
  const locale = parseLocale(value);
  const c = copy[locale];
  return { title: locale === "en" ? "Hermes Feishu Agent" : "Hermes 飞书智能体", description: c.thesis };
}

function parseLocale(value: string): Locale {
  if (value !== "zh" && value !== "en") notFound();
  return value;
}

export default async function HermesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: value } = await params;
  const locale = parseLocale(value);
  const c = copy[locale];
  const s = c.sections;
  return (
    <CaseShell locale={locale} accent="cyan" eyebrow={c.eyebrow} title={c.title} thesis={c.thesis} chapters={[...c.chapters]} heroVisual={<HermesProductPlate locale={locale} state="dry_run" headingLevel={2} />}>
      <CaseSection id="product" index={s.product[0]} label={s.product[1]} title={s.product[2]} intro={s.product[3]}>
        <div data-case-reveal><HermesProductPlate locale={locale} state="committed" headingLevel={3} /></div>
      </CaseSection>
      <CaseSection id="execution" index={s.execution[0]} label={s.execution[1]} title={s.execution[2]} intro={s.execution[3]}><HermesDemo locale={locale} /></CaseSection>
      <CaseSection id="system" index={s.system[0]} label={s.system[1]} title={s.system[2]} intro={s.system[3]}><div data-case-reveal><HermesSystemCutaway locale={locale} /></div></CaseSection>
      <CaseSection id="decisions" index={s.decisions[0]} label={s.decisions[1]} title={s.decisions[2]} intro={s.decisions[3]}>
        <div className="engineering-decision-ledger" data-case-reveal>
          {decisions[locale].map(([title, signal, failure, control, proof, cost], index) => <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><dl><div><dt>{locale === "zh" ? "信号" : "Signal"}</dt><dd>{signal}</dd></div><div><dt>{locale === "zh" ? "失败" : "Failure"}</dt><dd>{failure}</dd></div><div><dt>{locale === "zh" ? "控制" : "Control"}</dt><dd>{control}</dd></div><div><dt>{locale === "zh" ? "验证" : "Proof"}</dt><dd>{proof}</dd></div><div><dt>{locale === "zh" ? "代价" : "Cost"}</dt><dd>{cost}</dd></div></dl></article>)}
        </div>
      </CaseSection>
      <CaseSection id="verification" index={s.verification[0]} label={s.verification[1]} title={s.verification[2]} intro={s.verification[3]}>
        <div className="verification-ledger" data-case-reveal><header><strong>498</strong><span>{locale === "zh" ? "离线单元测试" : "offline unit tests"}</span></header><ol>{verification[locale].map((item) => <li key={item}>{item}</li>)}</ol><p>{locale === "zh" ? "范围：被检查的本地项目；mock 外部依赖；非生产 SLA。" : "Scope: inspected local project; external dependencies mocked; not a production SLA."}</p></div>
      </CaseSection>
      <CaseSection id="limits" index={s.limits[0]} label={s.limits[1]} title={s.limits[2]} intro={s.limits[3]}>
        <dl className="limit-ledger" data-case-reveal><div><dt>{locale === "zh" ? "状态" : "State"}</dt><dd>{locale === "zh" ? "进程内内存态" : "In-process memory"}</dd></div><div><dt>{locale === "zh" ? "消费" : "Consumer"}</dt><dd>{locale === "zh" ? "低并发串行模型" : "Low-concurrency serial model"}</dd></div><div><dt>Fallback</dt><dd>{locale === "zh" ? "异常路径显式保留" : "Explicit on exception paths"}</dd></div><div><dt>SLA</dt><dd>{locale === "zh" ? "未作生产承诺" : "No production claim"}</dd></div></dl>
      </CaseSection>
    </CaseShell>
  );
}
