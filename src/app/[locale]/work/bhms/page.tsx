import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Locale } from "@/content";
import { CaseSection, CaseShell } from "@/components/case/CaseShell";
import { BhmsEvidenceGraph } from "@/features/bhms/BhmsEvidenceGraph";
import { BhmsLifecyclePlate } from "@/features/bhms/BhmsLifecyclePlate";
import { BhmsWorkspacePlate } from "@/features/bhms/BhmsWorkspacePlate";
import { ModelArchitecture } from "@/features/bhms/ModelArchitecture";
import { bhmsDataSources, bhmsDisplayDataNotice, bhmsReleaseClaim } from "@/features/bhms/portfolio-data";

const copy = {
  zh: {
    eyebrow: "02 / BHMS 电池健康管理系统 · 独立开发",
    title: "预测结果并不等于可信决策",
    thesis: "把生命周期预测连接到不确定性、证据图和可交付的决策依据。",
    chapters: [
      { id: "product", label: "产品" }, { id: "data", label: "数据" },
      { id: "lifecycle", label: "生命周期" }, { id: "model", label: "模型" },
      { id: "evidence", label: "证据" }, { id: "experiments", label: "实验" },
      { id: "limits", label: "边界" },
    ],
    sections: {
      product: ["01", "产品工作台", "先让工程师看见对象、轨迹和依据", "工作台把电池列表、生命周期预测与 GraphRAG 机理入口放在同一任务上下文中。界面为基于真实产品结构的静态重建。"],
      data: ["02", "数据语义", "不同来源不能只靠拼接变成同一种数据", "生命周期主数据、轨迹辅助数据与增强专用数据承担不同角色；来源角色在进入模型前保持显式。"],
      lifecycle: ["03", "生命周期图版", "同时呈现观测、预测与不确定性", "曲线展示 trajectory、RUL、EOL 与 knee 的协同界面形态。所有点位均为可复现展示数据，不作为项目实测性能结论。"],
      model: ["04", "模型剖面", "两个时序视角并行，再进行安全融合", "DomainConditioning 后，xLSTM 与 Transformer 读取同一 token；DominanceSafeFusion 可融合，也可保留单分支结果。"],
      evidence: ["05", "GraphRAG 证据层", "让结论保留它来自哪里", "异常、生命周期与模型候选被组合和重排，形成 decision basis 与 graph trace；图数据库不可用时保留内存回退。"],
      experiments: ["06", "实验材料", "先说明数据角色，再谈模型比较", "现有实验材料仍存在内部不一致，当前封版保留来源角色与可复核状态，不发布未经统一复核的标题指标。"],
      limits: ["07", "发布边界", "研究原型必须通过论文与实验材料的共同门槛", "首版不宣称 Hybrid 全面优于 BiLSTM。展示层只重建产品交互和证据结构，性能结论仍需统一复跑与论文口径核验。"],
    },
  },
  en: {
    eyebrow: "02 / BHMS battery health system · Independent project",
    title: "A prediction is not yet a decision",
    thesis: "Connect lifecycle forecasts to uncertainty, evidence graphs and a deliverable decision basis.",
    chapters: [
      { id: "product", label: "Product" }, { id: "data", label: "Data" },
      { id: "lifecycle", label: "Lifecycle" }, { id: "model", label: "Model" },
      { id: "evidence", label: "Evidence" }, { id: "experiments", label: "Experiments" },
      { id: "limits", label: "Limits" },
    ],
    sections: {
      product: ["01", "Product workspace", "Put the object, trajectory and evidence in view", "The workspace keeps battery selection, lifecycle prediction and the GraphRAG mechanism in one task context. It is a static reconstruction of the real product structure."],
      data: ["02", "Data semantics", "Different sources do not become equivalent by concatenation", "Lifecycle core data, trajectory auxiliaries and enhancement-only data retain explicit roles before entering the model."],
      lifecycle: ["03", "Lifecycle plate", "Show observations, forecasts and uncertainty together", "The plate reconstructs the interface for trajectory, RUL, EOL and knee. Every plotted point is reproducible display data, not a measured performance claim."],
      model: ["04", "Model cutaway", "Two temporal views run in parallel before safe fusion", "After DomainConditioning, xLSTM and Transformer read the same tokens. DominanceSafeFusion may combine them or preserve a single branch."],
      evidence: ["05", "GraphRAG evidence layer", "Preserve where the conclusion came from", "Anomaly, lifecycle and model candidates are combined and reranked into a decision basis and graph trace, with an in-memory fallback when the graph database is unavailable."],
      experiments: ["06", "Experiment material", "Define source roles before comparing models", "Existing experiment artefacts still disagree internally. This release preserves source roles and review status without publishing unreconciled headline metrics."],
      limits: ["07", "Release boundary", "A research prototype must pass both paper and experiment gates", "This version does not claim universal Hybrid superiority over BiLSTM. The portfolio reconstructs the product and evidence flow; performance claims require a unified rerun and paper-aligned review."],
    },
  },
} as const;

const sourceRoleCopy = {
  zh: { lifecycle: "生命周期主数据", "trajectory-auxiliary": "轨迹辅助", "enhancement-only": "仅用于增强" },
  en: { lifecycle: "Lifecycle core", "trajectory-auxiliary": "Trajectory auxiliary", "enhancement-only": "Enhancement only" },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: value } = await params;
  const locale = parseLocale(value);
  const c = copy[locale];
  return { title: locale === "en" ? "BHMS Battery Health System" : "BHMS 电池健康管理系统", description: c.thesis };
}

function parseLocale(value: string): Locale {
  if (value !== "zh" && value !== "en") notFound();
  return value;
}

export default async function BhmsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: value } = await params;
  const locale = parseLocale(value);
  const c = copy[locale];
  const s = c.sections;
  return (
    <CaseShell locale={locale} accent="amber" eyebrow={c.eyebrow} title={c.title} thesis={c.thesis} chapters={[...c.chapters]} heroVisual={<BhmsWorkspacePlate locale={locale} selectedBattery="CALCE-CS2-35" headingLevel={2} />}>
      <CaseSection id="product" index={s.product[0]} label={s.product[1]} title={s.product[2]} intro={s.product[3]}>
        <div data-case-reveal><BhmsWorkspacePlate locale={locale} selectedBattery="CALCE-CS2-35" headingLevel={3} /></div>
      </CaseSection>
      <CaseSection id="data" index={s.data[0]} label={s.data[1]} title={s.data[2]} intro={s.data[3]}>
        <div className="data-source-ledger" data-case-reveal>{bhmsDataSources.map((source, index) => <article key={source.id}><span>{String(index + 1).padStart(2, "0")}</span><h3>{source.label}</h3><p>{sourceRoleCopy[locale][source.role]}</p></article>)}</div>
      </CaseSection>
      <CaseSection id="lifecycle" index={s.lifecycle[0]} label={s.lifecycle[1]} title={s.lifecycle[2]} intro={s.lifecycle[3]}>
        <div data-case-reveal><BhmsLifecyclePlate locale={locale} activeModel="hybrid" /></div>
      </CaseSection>
      <CaseSection id="model" index={s.model[0]} label={s.model[1]} title={s.model[2]} intro={s.model[3]}><ModelArchitecture locale={locale} /></CaseSection>
      <CaseSection id="evidence" index={s.evidence[0]} label={s.evidence[1]} title={s.evidence[2]} intro={s.evidence[3]}>
        <div data-case-reveal><BhmsEvidenceGraph locale={locale} /></div>
      </CaseSection>
      <CaseSection id="experiments" index={s.experiments[0]} label={s.experiments[1]} title={s.experiments[2]} intro={s.experiments[3]}>
        <div className="experiment-status" data-case-reveal><div><span>{locale === "zh" ? "来源角色" : "Source roles"}</span><strong>{locale === "zh" ? "显式保留" : "Explicitly preserved"}</strong></div><div><span>{locale === "zh" ? "模型比较" : "Model comparison"}</span><strong>{locale === "zh" ? "待统一复跑" : "Unified rerun pending"}</strong></div><div><span>{locale === "zh" ? "发布指标" : "Published metrics"}</span><strong>{locale === "zh" ? "当前不发布" : "Not published"}</strong></div><p>{locale === "zh" ? bhmsReleaseClaim : "The current engineering release preserves experiment boundaries and does not claim universal Hybrid superiority over BiLSTM."}</p></div>
      </CaseSection>
      <CaseSection id="limits" index={s.limits[0]} label={s.limits[1]} title={s.limits[2]} intro={s.limits[3]}>
        <div className="research-gate" data-case-reveal><span>Research prototype</span><ol><li>{locale === "zh" ? "统一数据切分与训练配置" : "Unify data splits and training configuration"}</li><li>{locale === "zh" ? "复跑模型比较并保存原始产物" : "Rerun comparisons and retain raw artefacts"}</li><li>{locale === "zh" ? "与论文表格、图和文字口径交叉核验" : "Cross-check paper tables, figures and prose"}</li></ol><p>{locale === "zh" ? bhmsDisplayDataNotice : "Reconstructed portfolio display data reproduces the interaction form and is not a measured performance result."}</p></div>
      </CaseSection>
    </CaseShell>
  );
}
