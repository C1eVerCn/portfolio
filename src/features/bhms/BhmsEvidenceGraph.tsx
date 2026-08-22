"use client";

import { useState } from "react";

import type { Locale } from "@/content";

import { bhmsMarkers } from "./portfolio-data";

interface BhmsEvidenceGraphProps {
  locale: Locale;
  compact?: boolean;
}

const evidenceNodeIds = [
  "voltage-deviation",
  "knee-window",
  "bilstm-forecast",
  "hybrid-forecast",
  "graphrag",
] as const;

type EvidenceNodeId = (typeof evidenceNodeIds)[number];

export function BhmsEvidenceGraph({ locale, compact }: BhmsEvidenceGraphProps) {
  const [graphBuilt, setGraphBuilt] = useState(false);
  const [decisionVisible, setDecisionVisible] = useState(false);
  const isZh = locale === "zh";
  const labels: Record<EvidenceNodeId, string> = isZh
    ? {
        "voltage-deviation": "分析电压偏差",
        "knee-window": "膝点窗口",
        "bilstm-forecast": "BiLSTM 预测",
        "hybrid-forecast": "Hybrid 预测",
        graphrag: "GraphRAG 证据汇总",
      }
    : {
        "voltage-deviation": "Analyse voltage deviation",
        "knee-window": "Knee window",
        "bilstm-forecast": "BiLSTM forecast",
        "hybrid-forecast": "Hybrid forecast",
        graphrag: "GraphRAG evidence synthesis",
      };

  const handleAnalysis = () => {
    setGraphBuilt(true);
    setDecisionVisible(false);
  };

  return (
    <section
      className="bhms-evidence-graph"
      data-compact={compact ? "true" : undefined}
      aria-label={isZh ? "GraphRAG 机理证据图" : "GraphRAG mechanism evidence graph"}
    >
      <div className="bhms-evidence-nodes">
        <button
          type="button"
          data-evidence-node="voltage-deviation"
          data-evidence-active={graphBuilt ? "true" : "false"}
          aria-pressed={graphBuilt}
          onClick={handleAnalysis}
        >
          {labels["voltage-deviation"]}
        </button>
        {evidenceNodeIds.slice(1).map((nodeId) => (
          <span
            key={nodeId}
            data-evidence-node={nodeId}
            data-evidence-active={graphBuilt ? "true" : "false"}
          >
            {labels[nodeId]}
          </span>
        ))}
      </div>

      <svg viewBox="0 0 760 180" aria-hidden="true">
        <line x1="80" y1="90" x2="235" y2="45" />
        <line x1="80" y1="90" x2="235" y2="135" />
        <line x1="235" y1="45" x2="440" y2="45" />
        <line x1="235" y1="135" x2="440" y2="135" />
        <line x1="440" y1="45" x2="660" y2="90" />
        <line x1="440" y1="135" x2="660" y2="90" />
      </svg>

      {!compact && (
        <p className="bhms-evidence-relations">
          {isZh
            ? "异常信号关联膝点窗口，并由两个预测分支交叉支持。"
            : "The anomaly links to the knee window and receives cross-support from both forecast branches."}
        </p>
      )}

      {graphBuilt && (
        <div role="status">
          <strong>{isZh ? "证据链已生成" : "Evidence chain built"}</strong>
          <p>
            {isZh
              ? `生命周期证据 · KNEE ${bhmsMarkers.knee}`
              : `Lifecycle evidence · KNEE ${bhmsMarkers.knee}`}
          </p>
          <button type="button" onClick={() => setDecisionVisible(true)}>
            {isZh ? "查看决策依据" : "View decision basis"}
          </button>
        </div>
      )}

      {decisionVisible && (
        <article className="bhms-decision-card">
          <span>{isZh ? "决策依据" : "Decision basis"}</span>
          <strong>{isZh ? "优先安排检测" : "Prioritise inspection"}</strong>
          <p>
            {isZh
              ? "电压偏差与膝点窗口重叠，BiLSTM 与 Hybrid 两个模型均支持退化趋势判断。"
              : "The voltage deviation overlaps the knee window, while both BiLSTM and Hybrid support the degradation assessment."}
          </p>
        </article>
      )}
    </section>
  );
}
