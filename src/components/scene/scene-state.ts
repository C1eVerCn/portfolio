export type MovementId =
  | "prelude"
  | "exposition"
  | "hermes"
  | "bhms"
  | "recapitulation"
  | "coda";

export type DynamicLevel = "p" | "mf" | "f";

export interface ScoreMotionState {
  movement: MovementId;
  progress: number;
  dynamic: DynamicLevel;
  focus: boolean;
  lightX: number;
  lightY: number;
  emboss: number;
  fold: number;
}

export function createScoreMotionState(): ScoreMotionState {
  return {
    movement: "prelude",
    progress: 0,
    dynamic: "p",
    focus: false,
    lightX: -1.8,
    lightY: 1.2,
    emboss: 0.16,
    fold: 0,
  };
}

export interface MythicMotionState extends ScoreMotionState {
  threads: {
    past: number;
    present: number;
    future: number;
    tension: number;
    focus: boolean;
  };
  book: {
    open: number;
    pageTurn: number;
    depth: number;
  };
}

export function createMythicMotionState(): MythicMotionState {
  return {
    ...createScoreMotionState(),
    threads: {
      past: 0,
      present: 0,
      future: 0,
      tension: 0,
      focus: false,
    },
    book: {
      open: 1,
      pageTurn: 1,
      depth: 0,
    },
  };
}

export const mythicMotionState = createMythicMotionState();
export const scoreMotionState = mythicMotionState;
