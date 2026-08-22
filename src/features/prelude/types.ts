export type PreludeState =
  | 'idle'
  | 'summoning'
  | 'opening'
  | 'inscribing'
  | 'entering'
  | 'complete'
  | 'skipped';

export interface PreludePlayback {
  state: PreludeState;
  shouldPlay: boolean;
  replayToken: number;
}
