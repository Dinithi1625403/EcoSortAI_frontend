export interface TopGuess {
  label: string;
  confidence: number;
}

export interface DebugInfo {
  edge: number;
  spread: number;
}

export interface SureResult {
  sure: true;
  label: string;
  confidence: number;
  advice: string;
  top3: TopGuess[];
  close_call: boolean;
  runner_up: string;
  tip: string | null;
  focus_note: string;
  heatmap: string;
  debug?: DebugInfo;
}

export interface UnsureResult {
  sure: false;
  reason_code: "background" | "cluttered" | "unsure";
  message: string;
  top3: TopGuess[];
  tip?: string | null;
  runner_up?: string;
  heatmap?: string;
  debug?: DebugInfo;
}

export interface ErrorResult {
  error: string;
}

export type PredictResponse = SureResult | UnsureResult | ErrorResult;

export function isError(r: PredictResponse): r is ErrorResult {
  return "error" in r;
}