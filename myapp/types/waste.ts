export interface TopGuess {
  label: string;
  confidence: number;
}

export interface SureResult {
  sure: true;
  label: string;
  confidence: number;
  advice: string;
  top3: TopGuess[];
  heatmap: string;
}

export interface UnsureResult {
  sure: false;
  message: string;
  top3: TopGuess[];
}

export interface ErrorResult {
  error: string;
}

export type PredictResponse = SureResult | UnsureResult | ErrorResult;

// Type guard, lets TypeScript know which shape it is dealing with
export function isError(r: PredictResponse): r is ErrorResult {
  return "error" in r;
}