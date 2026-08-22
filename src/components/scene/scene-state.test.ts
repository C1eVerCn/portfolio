import { describe, expect, it } from "vitest";
import {
  createMythicMotionState,
  createScoreMotionState,
  mythicMotionState,
  scoreMotionState,
} from "./scene-state";

describe("score motion state", () => {
  it("starts in a quiet prelude", () => {
    expect(createScoreMotionState()).toEqual({
      movement: "prelude",
      progress: 0,
      dynamic: "p",
      focus: false,
      lightX: -1.8,
      lightY: 1.2,
      emboss: 0.16,
      fold: 0,
    });
  });

  it("exports a stable mutable proxy for GSAP", () => {
    expect(scoreMotionState.movement).toBe("prelude");
    expect(scoreMotionState.dynamic).toBe("p");
  });

  it("creates mythic thread and book motion channels", () => {
    const state = createMythicMotionState();

    expect(state.threads).toEqual({
      past: 0,
      present: 0,
      future: 0,
      tension: 0,
      focus: false,
    });
    expect(state.book).toEqual({
      open: 1,
      pageTurn: 1,
      depth: 0,
    });
  });

  it("keeps the score state export as an alias of the mythic state", () => {
    expect(scoreMotionState).toBe(mythicMotionState);
  });
});
