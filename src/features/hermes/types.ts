import type { HermesLogMessage } from "./machine";

export type HermesStep =
  | "platform"
  | "time_gate"
  | "vehicle"
  | "task"
  | "dry_run"
  | "awaiting_confirmation"
  | "committed";

export interface HermesDraft {
  platform?: string;
  start?: string;
  end?: string;
  vehicle?: string;
  task?: string;
  location?: string;
}

export interface DemoLogEntry {
  kind: "input" | "guard" | "tool" | "dry-run" | "commit";
  message: HermesLogMessage;
}

export interface HermesDemoState {
  step: HermesStep;
  draft: HermesDraft;
  revision: number;
  confirmationWindow: boolean;
  dryRunRevision: number | null;
  log: DemoLogEntry[];
}

export type HermesEvent =
  | { type: "SELECT_PLATFORM"; value: string }
  | { type: "SET_TIME"; start: string; end: string }
  | { type: "SELECT_VEHICLE"; value: string }
  | { type: "SET_TASK"; task: string; location: string }
  | { type: "DRY_RUN" }
  | { type: "CONFIRM" }
  | { type: "EDIT" }
  | { type: "RESET" };
