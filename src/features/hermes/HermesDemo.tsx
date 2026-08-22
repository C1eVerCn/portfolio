"use client";

import { useReducer } from "react";
import type { Locale } from "@/content";
import { HermesProductPlate } from "./HermesProductPlate";
import type { HermesPlateState } from "./HermesProductPlate";
import {
  hermesInitialState,
  hermesLogMessages,
  reduceHermesDemo,
} from "./machine";
import type { HermesLogMessage } from "./machine";
import { hermesProductScenario } from "./portfolio-data";
import type { HermesStep } from "./types";

const actions = {
  zh: {
    platform: `选择 ${hermesProductScenario.platform} 平台`, time_gate: "补充时间范围", vehicle: `选择脱敏车辆 ${hermesProductScenario.vehicle}`,
    task: "填写任务与地点", dry_run: "执行 dry-run", awaiting_confirmation: "确认预订",
    committed: "重新演示",
  },
  en: {
    platform: `Select ${hermesProductScenario.platform} platform`, time_gate: "Add time range", vehicle: `Select anonymised vehicle ${hermesProductScenario.vehicle}`,
    task: "Add task and location", dry_run: "Run dry-run", awaiting_confirmation: "Confirm booking",
    committed: "Run again",
  },
} as const;

const englishLogs: Record<HermesLogMessage, string> = {
  [hermesLogMessages.missingTimeRange]: "Missing time range: deterministic routing stops the query.",
  [hermesLogMessages.timeRangeComplete]: "Time parameters complete; querying anonymised availability.",
  [hermesLogMessages.incompleteDryRun]: "Parameters incomplete; dry-run rejected.",
  [hermesLogMessages.dryRunPassed]: "Dry-run passed; waiting for adjacent confirmation.",
  [hermesLogMessages.invalidConfirmation]: "Confirmation context invalid; no real write executed.",
  [hermesLogMessages.deterministicCommit]: "Parameters matched again before deterministic commit.",
  [hermesLogMessages.draftEdited]: "Draft changed; the previous confirmation window is invalid.",
};

const plateStates: Record<HermesStep, HermesPlateState> = {
  platform: "intent",
  time_gate: "time_gate",
  vehicle: "vehicle",
  task: "vehicle",
  dry_run: "vehicle",
  awaiting_confirmation: "confirmation",
  committed: "committed",
};

export function HermesDemo({ locale }: { locale: Locale }) {
  const [state, dispatch] = useReducer(reduceHermesDemo, hermesInitialState);
  const advance = () => {
    switch (state.step) {
      case "platform": dispatch({ type: "SELECT_PLATFORM", value: hermesProductScenario.platform }); break;
      case "time_gate": dispatch({ type: "SET_TIME", start: hermesProductScenario.start, end: hermesProductScenario.end }); break;
      case "vehicle": dispatch({ type: "SELECT_VEHICLE", value: hermesProductScenario.vehicle }); break;
      case "task": dispatch({ type: "SET_TASK", task: hermesProductScenario.task, location: hermesProductScenario.location }); break;
      case "dry_run": dispatch({ type: "DRY_RUN" }); break;
      case "awaiting_confirmation": dispatch({ type: "CONFIRM" }); break;
      case "committed": dispatch({ type: "RESET" }); break;
    }
  };
  const flowLabels = locale === "zh"
    ? ["意图", "时间", "车辆", "dry-run", "确认", "commit"]
    : ["Intent", "Time", "Vehicle", "Dry-run", "Confirm", "Commit"];
  const activeMeasure = Math.max(0, ["platform", "time_gate", "vehicle", "dry_run", "awaiting_confirmation", "committed"].indexOf(state.step));

  return (
    <div className="execution-score hermes-demo" data-case-reveal>
      <div className="score-plate-heading">
        <span>{locale === "zh" ? "执行总谱 · 静态概念重建" : "Execution score · Static conceptual reconstruction"}</span>
        <span>Hermes / {state.step.replaceAll("_", " ")}</span>
      </div>
      <HermesProductPlate
        locale={locale}
        state={plateStates[state.step]}
        draft={state.draft}
        revision={state.revision}
      />
      <div className="hermes-demo-evidence">
        <div className="execution-measures" aria-label={locale === "zh" ? "预订状态" : "Booking state"}>
          {flowLabels.map((label, index) => (
            <div key={label} className={`score-measure ${index <= activeMeasure ? "active" : ""}`}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <i aria-hidden="true" />
              <b>{label}</b>
            </div>
          ))}
        </div>
        <div className="execution-ledger" aria-live="polite">
          <div className="ledger-label">{locale === "zh" ? "系统声部" : "System voice"}</div>
          <div className="ledger-log">
            {state.log.length === 0 ? (
              <p>{locale === "zh" ? "选择平台后，系统会先检查执行所需的确定性参数。" : "After platform selection, deterministic parameters are checked before execution."}</p>
            ) : state.log.map((entry, index) => (
              <p key={`${entry.kind}-${index}`}><span>{entry.kind}</span>{locale === "zh" ? entry.message : englishLogs[entry.message]}</p>
            ))}
          </div>
        </div>
        <div className="score-draft">
          <span>platform <b>{state.draft.platform ?? "—"}</b></span>
          <span>time <b>{state.draft.start ? "09:00—11:00" : "—"}</b></span>
          <span>vehicle <b>{state.draft.vehicle ?? "—"}</b></span>
          <span>revision <b>{state.revision}</b></span>
        </div>
        <button className="score-action" type="button" onClick={advance}>
          <span aria-hidden="true">{locale === "zh" ? "下一小节" : "Next measure"}</span>
          <b>{actions[locale][state.step]}</b>
        </button>
      </div>
    </div>
  );
}
