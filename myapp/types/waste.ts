export type WasteCategory =
  | "battery"
  | "biological"
  | "cardboard"
  | "clothes"
  | "glass"
  | "metal"
  | "paper"
  | "plastic"
  | "shoes"
  | "trash";

export interface TopGuess {
  label: WasteCategory | string;
  confidence: number;
}

export interface DebugInfo {
  edge: number;
  spread: number;
}

export interface SureResult {
  sure: true;
  label: WasteCategory;
  confidence: number;
  advice: string;
  top3: TopGuess[];
  close_call: boolean;
  runner_up: WasteCategory | string;
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
  runner_up?: WasteCategory | string;
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

export interface WasteKnowledgeItem {
  id: WasteCategory;
  name: string;
  type: "Hazardous Waste" | "Organic Waste" | "Recyclable Waste" | "Reusable / Donation" | "General Landfill";
  colorClass: {
    bg: string;
    text: string;
    border: string;
    badge: string;
    binColor: string;
    binName: string;
  };
  summary: string;
  actions: string[];
  dos: string[];
  donts: string[];
  hazards: string;
  environmentalImpact: {
    co2OffsetKg: number; // estimated kg CO2 avoided per item recycled/diverted
    landfillSpaceLiters: number;
    decompositionYears: string;
    fact: string;
  };
  preparationSteps: string[];
}

export interface DisposalLocation {
  id: string;
  name: string;
  type: "E-Waste / Hazardous" | "Recycling Hub" | "Donation Center" | "Organic / Composting" | "Municipal Drop-off";
  address: string;
  city: string;
  acceptedCategories: WasteCategory[];
  distanceKm: number;
  operatingHours: string;
  phone: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  notes: string;
}

export interface WasteLogEntry {
  id: string;
  timestamp: string;
  category: WasteCategory;
  confidence: number;
  imagePreview?: string;
  status: "sorted" | "dropped_off" | "reused";
  co2SavedKg: number;
}