"use client";

import { useId } from "react";

import type { Locale } from "@/content";

import {
  bhmsDisplayDataNotice,
  bhmsLifecycleSeries,
  bhmsMarkers,
} from "./portfolio-data";

export type BhmsLifecycleModel = "bilstm" | "hybrid";

interface BhmsLifecyclePlateProps {
  locale: Locale;
  activeModel: BhmsLifecycleModel;
  compact?: boolean;
  onModelChange?: (model: BhmsLifecycleModel) => void;
}

const plotX = (cycle: number) => 48 + (cycle / 800) * (712 - 48);
const plotY = (soh: number) =>
  330 - ((soh - 0.5) / (1.05 - 0.5)) * (330 - 40);

const observedPoints = bhmsLifecycleSeries.filter(
  (point): point is (typeof bhmsLifecycleSeries)[number] & {
    observed: number;
  } => "observed" in point,
);
const forecastPoints = bhmsLifecycleSeries.filter(
  (point): point is (typeof bhmsLifecycleSeries)[number] & {
    bilstm: number;
    hybrid: number;
    lower: number;
    upper: number;
  } => "bilstm" in point,
);
const lastObserved = observedPoints.at(-1)!;

function linePath(points: ReadonlyArray<{ cycle: number; soh: number }>) {
  return points
    .map(
      (point, index) =>
        `${index === 0 ? "M" : "L"} ${plotX(point.cycle)} ${plotY(point.soh)}`,
    )
    .join(" ");
}

const observedPath = linePath(
  observedPoints.map((point) => ({ cycle: point.cycle, soh: point.observed })),
);

function forecastPath(model: BhmsLifecycleModel) {
  return linePath([
    { cycle: lastObserved.cycle, soh: lastObserved.observed },
    ...forecastPoints.map((point) => ({
      cycle: point.cycle,
      soh: point[model],
    })),
  ]);
}

const uncertaintyPath = [
  `M ${plotX(lastObserved.cycle)} ${plotY(lastObserved.observed)}`,
  ...forecastPoints.map(
    (point) => `L ${plotX(point.cycle)} ${plotY(point.upper)}`,
  ),
  ...forecastPoints
    .toReversed()
    .map((point) => `L ${plotX(point.cycle)} ${plotY(point.lower)}`),
  "Z",
].join(" ");

export function BhmsLifecyclePlate({
  locale,
  activeModel,
  compact,
  onModelChange,
}: BhmsLifecyclePlateProps) {
  const titleId = useId();
  const descriptionId = useId();
  const isZh = locale === "zh";

  const legendItem = (model: BhmsLifecycleModel, label: string) => {
    const attributes = {
      "data-active": activeModel === model ? "true" : "false",
      "data-model": model,
    };

    return onModelChange ? (
      <button
        {...attributes}
        type="button"
        aria-pressed={activeModel === model}
        onClick={() => onModelChange(model)}
      >
        {label}
      </button>
    ) : (
      <span {...attributes}>{label}</span>
    );
  };

  return (
    <figure
      className="bhms-lifecycle-plate"
      data-compact={compact ? "true" : undefined}
    >
      <svg
        viewBox="0 0 760 380"
        role="img"
        aria-labelledby={`${titleId} ${descriptionId}`}
      >
        <title id={titleId}>
          {isZh ? "电池生命周期预测" : "Battery lifecycle prediction"}
        </title>
        <desc id={descriptionId}>
          {isZh
            ? "本图使用重建展示数据，呈现观测轨迹、BiLSTM 与 Hybrid 预测及不确定性区间。"
            : "This chart uses reconstructed display data to show observations, BiLSTM and Hybrid forecasts, and uncertainty."}
        </desc>

        <path d={uncertaintyPath} data-series="uncertainty" />
        <path d={observedPath} data-series="observed" />
        <path
          d={forecastPath("bilstm")}
          data-series="bilstm"
          data-active={activeModel === "bilstm" ? "true" : "false"}
        />
        <path
          d={forecastPath("hybrid")}
          data-series="hybrid"
          data-active={activeModel === "hybrid" ? "true" : "false"}
        />

        <line
          x1={plotX(bhmsMarkers.knee)}
          x2={plotX(bhmsMarkers.knee)}
          y1="40"
          y2="330"
          data-marker="knee"
        />
        <line
          x1={plotX(bhmsMarkers.eol)}
          x2={plotX(bhmsMarkers.eol)}
          y1="40"
          y2="330"
          data-marker="eol"
        />
        <text x={plotX(bhmsMarkers.knee)} y="28">
          KNEE · {bhmsMarkers.knee}
        </text>
        <text x={plotX(bhmsMarkers.eol)} y="358">
          EOL · {bhmsMarkers.eol}
        </text>
        <text x="48" y="358">
          RUL · {bhmsMarkers.rul}
        </text>
      </svg>

      <figcaption>
        <span data-series-label="observed">Observed</span>
        {legendItem("bilstm", "BiLSTM")}
        {legendItem("hybrid", "Hybrid")}
        <small>{isZh ? bhmsDisplayDataNotice : "Reconstructed portfolio display data; not a measured performance claim."}</small>
      </figcaption>
    </figure>
  );
}
