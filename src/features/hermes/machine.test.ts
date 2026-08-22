import { describe, expect, it } from "vitest";
import {
  hermesInitialState,
  hermesLogMessages,
  reduceHermesDemo,
} from "./machine";

describe("Hermes booking guard", () => {
  it("stops at the time hard gate until a schedule exists", () => {
    const state = reduceHermesDemo(hermesInitialState, {
      type: "SELECT_PLATFORM",
      value: "MaaS",
    });

    expect(state.step).toBe("time_gate");
    expect(state.log.at(-1)?.kind).toBe("guard");
    expect(state.log.at(-1)?.message).toBe(hermesLogMessages.missingTimeRange);
  });

  it("names every localisable log message in one exhaustive source", () => {
    expect(Object.values(hermesLogMessages)).toHaveLength(7);
  });

  it("invalidates an adjacent confirmation after editing the draft", () => {
    let state = hermesInitialState;
    state = reduceHermesDemo(state, { type: "SELECT_PLATFORM", value: "MaaS" });
    state = reduceHermesDemo(state, {
      type: "SET_TIME",
      start: "2026-08-04 09:00",
      end: "2026-08-04 11:00",
    });
    state = reduceHermesDemo(state, { type: "SELECT_VEHICLE", value: "E-17" });
    state = reduceHermesDemo(state, {
      type: "SET_TASK",
      task: "园区演示",
      location: "测试场",
    });
    state = reduceHermesDemo(state, { type: "DRY_RUN" });
    expect(state.confirmationWindow).toBe(true);

    state = reduceHermesDemo(state, { type: "EDIT" });
    expect(state.confirmationWindow).toBe(false);
    expect(state.step).toBe("task");
  });

  it("commits only after a valid dry-run and adjacent confirmation", () => {
    expect(reduceHermesDemo(hermesInitialState, { type: "CONFIRM" }).step).not.toBe(
      "committed",
    );

    let state = hermesInitialState;
    state = reduceHermesDemo(state, { type: "SELECT_PLATFORM", value: "MaaS" });
    state = reduceHermesDemo(state, {
      type: "SET_TIME",
      start: "2026-08-04 09:00",
      end: "2026-08-04 11:00",
    });
    state = reduceHermesDemo(state, { type: "SELECT_VEHICLE", value: "E-17" });
    state = reduceHermesDemo(state, {
      type: "SET_TASK",
      task: "园区演示",
      location: "测试场",
    });
    state = reduceHermesDemo(state, { type: "DRY_RUN" });
    state = reduceHermesDemo(state, { type: "CONFIRM" });

    expect(state.step).toBe("committed");
    expect(state.confirmationWindow).toBe(false);
    expect(state.log.at(-1)?.kind).toBe("commit");
  });
});
