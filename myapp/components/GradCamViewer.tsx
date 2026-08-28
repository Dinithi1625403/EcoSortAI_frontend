"use client";

import React, { useState } from "react";
import { SureResult, UnsureResult } from "@/types/waste";
import {
  Layers,
  Columns2,
  Image as ImageIcon,
  Sparkles,
  Info,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

type ViewMode = "overlay" | "split" | "original";

interface Props {
  result: SureResult | UnsureResult;
  originalPreview: string | null;
}

export const GradCamViewer: React.FC<Props> = ({ result, originalPreview }) => {
  const [viewMode, setViewMode] = useState<ViewMode>("overlay");
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  const rawHeatmap = "heatmap" in result ? result.heatmap : undefined;
  const heatmapBase64 = rawHeatmap
    ? rawHeatmap.startsWith("data:") || rawHeatmap.startsWith("http") || rawHeatmap.startsWith("/")
      ? rawHeatmap
      : `data:image/png;base64,${rawHeatmap}`
    : null;

  const focusNote = "focus_note" in result ? (result as SureResult).focus_note : null;

  if (!heatmapBase64 && !originalPreview) return null;

  const viewButtons: { id: ViewMode; label: string; icon: React.ElementType }[] = [
    { id: "overlay", label: "Heatmap View", icon: Layers },
    { id: "split", label: "Side-by-Side", icon: Columns2 },
    { id: "original", label: "Original Photo", icon: ImageIcon },
  ];

  return (
    <div className="card-cute overflow-hidden">
      {/* Friendly Header */}
      <div className="card-cute-header flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <Sparkles className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-sm font-extrabold text-gray-900">Visual Verification</h3>
            <p className="text-[11px] text-gray-500 font-medium">See where the AI focused</p>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center rounded-full bg-emerald-100/70 p-0.5 border border-emerald-200">
          {viewButtons.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setViewMode(id)}
              className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold transition-all ${
                viewMode === id
                  ? "bg-white text-emerald-800 shadow-xs scale-100"
                  : "text-emerald-900/70 hover:text-emerald-950"
              }`}
            >
              <Icon className="h-3 w-3" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-3.5">
        {/* Visual Inspection Box */}
        <div className="relative rounded-2xl overflow-hidden bg-gray-950 border border-gray-800 p-2 shadow-inner">
          {viewMode === "split" ? (
            <div className="grid grid-cols-2 gap-2">
              <div className="relative overflow-hidden rounded-xl bg-gray-900 flex items-center justify-center min-h-[160px] sm:min-h-[180px]">
                {originalPreview && (
                  <img
                    src={originalPreview}
                    alt="Original Input"
                    className="max-h-[180px] w-full object-contain"
                  />
                )}
                <span className="absolute bottom-2 left-2 rounded-md bg-black/75 px-2 py-0.5 text-[10px] font-bold text-white">
                  Original Photo
                </span>
              </div>
              <div className="relative overflow-hidden rounded-xl bg-gray-900 flex items-center justify-center min-h-[160px] sm:min-h-[180px]">
                {heatmapBase64 ? (
                  <img
                    src={heatmapBase64}
                    alt="AI Focus Map"
                    className="max-h-[180px] w-full object-contain"
                  />
                ) : (
                  <div className="text-xs text-gray-500">No heatmap</div>
                )}
                <span className="absolute bottom-2 left-2 rounded-md bg-emerald-700/90 px-2 py-0.5 text-[10px] font-bold text-emerald-50">
                  AI Focus Area
                </span>
              </div>
            </div>
          ) : (
            <div className="relative flex min-h-[180px] max-h-[220px] w-full items-center justify-center overflow-hidden rounded-xl bg-gray-900">
              {viewMode === "overlay" && heatmapBase64 && (
                <img
                  src={heatmapBase64}
                  alt="AI Heatmap"
                  className="max-h-[210px] w-auto max-w-full rounded-lg object-contain"
                />
              )}
              {viewMode === "original" && originalPreview && (
                <img
                  src={originalPreview}
                  alt="Original Image"
                  className="max-h-[210px] w-auto max-w-full rounded-lg object-contain"
                />
              )}
              <span className="absolute bottom-2 left-2 rounded-md bg-black/75 px-2.5 py-0.5 text-[10px] font-bold text-white">
                {viewMode === "overlay" ? "AI Highlight Map" : "Original Photo"}
              </span>
            </div>
          )}
        </div>

        {/* Friendly Focus Color Bar */}
        <div className="flex items-center justify-between gap-3 rounded-xl bg-emerald-50/70 border border-emerald-100 px-3.5 py-2 text-xs font-semibold text-emerald-950">
          <span className="text-gray-500 font-medium">Background / Ignored</span>
          <div className="h-2.5 flex-1 max-w-[130px] rounded-full bg-gradient-to-r from-blue-500 via-yellow-400 to-red-500 shadow-inner" />
          <span className="font-extrabold text-emerald-800">Primary AI Focus</span>
        </div>

        {/* Plain Language Explanation */}
        <div className="rounded-xl bg-emerald-50/50 border border-emerald-200/60 p-3 space-y-1 text-xs text-gray-700 leading-relaxed">
          <p className="flex items-start gap-1.5 font-medium">
            <Info className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              The <strong>warm red &amp; yellow highlights</strong> show the exact shape, texture, or label the AI inspected to identify this item.
            </span>
          </p>
          {focusNote && (
            <p className="text-[11px] text-emerald-900 font-semibold bg-white/90 rounded-lg p-2 border border-emerald-100 mt-1">
              {focusNote}
            </p>
          )}
        </div>

        {/* Optional Hidden Technical Diagnostics */}
        <div className="pt-1 border-t border-emerald-100/60">
          <button
            onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
            className="flex items-center justify-between w-full text-[11px] font-bold text-emerald-700 hover:text-emerald-900 transition-colors py-1"
          >
            <span>Advanced AI Diagnostics</span>
            {showTechnicalDetails ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </button>

          {showTechnicalDetails && (
            <div className="mt-2 grid grid-cols-2 gap-2 rounded-xl bg-gray-50 border border-gray-100 p-2.5 text-[11px]">
              <div>
                <span className="text-gray-500">Method:</span>
                <p className="font-semibold text-gray-800">Grad-CAM (Conv2D)</p>
              </div>
              <div>
                <span className="text-gray-500">Photo Quality:</span>
                <p className="flex items-center gap-1 font-bold text-emerald-600">
                  <CheckCircle2 className="h-3 w-3" /> Clear Item Centering
                </p>
              </div>
              {result.debug && (
                <>
                  <div>
                    <span className="text-gray-500">Edge Ratio:</span>
                    <p className="font-mono text-gray-700">{result.debug.edge}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Spread:</span>
                    <p className="font-mono text-gray-700">{result.debug.spread}</p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
