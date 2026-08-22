import type { HermesDemoState, HermesEvent } from "./types";

export const hermesLogMessages = {
  missingTimeRange: "缺少时间范围：确定性路由阻止查询继续执行。",
  timeRangeComplete: "时间参数完整，查询脱敏可用车辆。",
  incompleteDryRun: "参数不完整，dry-run 被拒绝。",
  dryRunPassed: "dry-run 通过；等待紧邻确认。",
  invalidConfirmation: "确认上下文无效，未执行真实写入。",
  deterministicCommit: "参数再次比对后执行确定性 commit。",
  draftEdited: "草稿已修改，旧确认窗口失效。",
} as const;

export type HermesLogMessage =
  (typeof hermesLogMessages)[keyof typeof hermesLogMessages];

export const hermesInitialState: HermesDemoState = {
  step: "platform",
  draft: {},
  revision: 0,
  confirmationWindow: false,
  dryRunRevision: null,
  log: [],
};

const withLog = (
  state: HermesDemoState,
  kind: HermesDemoState["log"][number]["kind"],
  message: HermesLogMessage,
): HermesDemoState => ({ ...state, log: [...state.log, { kind, message }] });

export function reduceHermesDemo(
  state: HermesDemoState,
  event: HermesEvent,
): HermesDemoState {
  switch (event.type) {
    case "SELECT_PLATFORM":
      return withLog(
        {
          ...state,
          step: "time_gate",
          draft: { platform: event.value },
          revision: state.revision + 1,
          confirmationWindow: false,
          dryRunRevision: null,
        },
        "guard",
        hermesLogMessages.missingTimeRange,
      );
    case "SET_TIME":
      return withLog(
        {
          ...state,
          step: "vehicle",
          draft: { ...state.draft, start: event.start, end: event.end },
          revision: state.revision + 1,
          confirmationWindow: false,
          dryRunRevision: null,
        },
        "tool",
        hermesLogMessages.timeRangeComplete,
      );
    case "SELECT_VEHICLE":
      return {
        ...state,
        step: "task",
        draft: { ...state.draft, vehicle: event.value },
        revision: state.revision + 1,
        confirmationWindow: false,
        dryRunRevision: null,
      };
    case "SET_TASK":
      return {
        ...state,
        step: "dry_run",
        draft: { ...state.draft, task: event.task, location: event.location },
        revision: state.revision + 1,
        confirmationWindow: false,
        dryRunRevision: null,
      };
    case "DRY_RUN": {
      const complete =
        state.draft.platform &&
        state.draft.start &&
        state.draft.end &&
        state.draft.vehicle &&
        state.draft.task &&
        state.draft.location;
      if (!complete) return withLog(state, "guard", hermesLogMessages.incompleteDryRun);
      return withLog(
        {
          ...state,
          step: "awaiting_confirmation",
          confirmationWindow: true,
          dryRunRevision: state.revision,
        },
        "dry-run",
        hermesLogMessages.dryRunPassed,
      );
    }
    case "CONFIRM":
      if (!state.confirmationWindow || state.dryRunRevision !== state.revision) {
        return withLog(state, "guard", hermesLogMessages.invalidConfirmation);
      }
      return withLog(
        { ...state, step: "committed", confirmationWindow: false },
        "commit",
        hermesLogMessages.deterministicCommit,
      );
    case "EDIT":
      return withLog(
        {
          ...state,
          step: "task",
          revision: state.revision + 1,
          confirmationWindow: false,
          dryRunRevision: null,
        },
        "guard",
        hermesLogMessages.draftEdited,
      );
    case "RESET":
      return hermesInitialState;
  }
}
