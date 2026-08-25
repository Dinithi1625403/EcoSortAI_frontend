"use client";

import React, { useState } from "react";
import { SureResult, UnsureResult } from "@/types/waste";
import {
  Layers,
  Columns2,
  Image as ImageIcon,
  HelpCircle,
  Sliders,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

type ViewMode = "overlay" | "split" | "original";

interface Props {
  result: SureResult | UnsureResult;
  originalPreview: string | null;
}

export const GradCamViewer: React.FC<Props> = ({ result, originalPreview }) => {
  const [viewMode, setViewMode] = useState<ViewMode>("overlay");
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  // Extract heatmap base64 from result
  const rawHeatmap = "heatmap" in result ? result.heatmap : undefined;
  const heatmapBase64 = rawHeatmap
    ? rawHeatmap.startsWith("data:") || rawHeatmap.startsWith("http") || rawHeatmap.startsWith("/")
      ? rawHeatmap
      : `data:image/png;base64,${rawHeatmap}`
    : null;

  const focusNote = "focus_note" in result ? (result as SureResult).focus_note : null;

  if (!heatmapBase64 && !originalPreview) return null;

  const viewButtons: { id: ViewMode; label: string; icon: React.ElementType }[] = [
    { id: "overlay", label: "Heatmap", icon: Layers },
    { id: "split", label: "Side-by-Side", icon: Columns2 },
    { id: "original", label: "Original", icon: ImageIcon },
  ];

  return (
    <div className="card-cute overflow-hidden">
      {/* Header */}
      <div className="card-cute-header flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-gray-800">Explainable AI (Grad-CAM)</h3>
          </div>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center rounded-full bg-emerald-100/60 p-0.5 border border-emerald-200/60">
          {viewButtons.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setViewMode(id)}
              className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition-all ${
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
        <div className="relative rounded-2xl overflow-hidden bg-gray-900 border border-gray-800 p-2 shadow-inner">
          {viewMode === "split" ? (
            <div className="grid grid-cols-2 gap-2">
              <div className="relative overflow-hidden rounded-xl bg-gray-950 flex items-center justify-center min-h-[160px] sm:min-h-[190px]">
                {originalPreview && (
                  <img
                    src={originalPreview}
                    alt="Original Input"
                    className="max-h-[190px] w-full object-contain"
                  />
                )}
                <span className="absolute bottom-1.5 left-1.5 rounded-md bg-black/75 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  Original
                </span>
              </div>
              <div className="relative overflow-hidden rounded-xl bg-gray-950 flex items-center justify-center min-h-[160px] sm:min-h-[190px]">
                {heatmapBase64 ? (
                  <img
                    src={heatmapBase64}
                    alt="Grad-CAM Saliency Overlay"
                    className="max-h-[190px] w-full object-contain"
                  />
                ) : (
                  <div className="text-xs text-gray-500">No heatmap</div>
                )}
                <span className="absolute bottom-1.5 left-1.5 rounded-md bg-emerald-800/90 px-1.5 py-0.5 text-[10px] font-bold text-emerald-100">
                  Heatmap
                </span>
              </div>
            </div>
          ) : (
            <div className="relative flex min-h-[190px] max-h-[240px] w-full items-center justify-center overflow-hidden rounded-xl bg-gray-950">
              {viewMode === "overlay" && heatmapBase64 && (
                <img
                  src={heatmapBase64}
                  alt="Grad-CAM Overlay"
                  className="max-h-[230px] w-auto max-w-full rounded-lg object-contain"
                />
              )}
              {viewMode === "original" && originalPreview && (
                <img
                  src={originalPreview}
                  alt="Original Image"
                  className="max-h-[230px] w-auto max-w-full rounded-lg object-contain"
                />
              )}
              <span className="absolute bottom-2 left-2 rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs">
                {viewMode === "overlay"
                  ? "Grad-CAM Activation Heatmap"
                  : "Original Image"}
              </span>
            </div>
          )}
        </div>

        {/* Heatmap Spectrum Bar */}
        <div className="flex items-center justify-between gap-2 rounded-xl bg-emerald-50/70 border border-emerald-100 px-3 py-2 text-[11px] font-medium text-emerald-900">
          <span className="text-gray-500">Low Focus</span>
          <div className="h-2.5 flex-1 max-w-[140px] rounded-full bg-gradient-to-r from-blue-500 via-yellow-400 to-red-500 shadow-inner" />
          <span className="font-bold text-emerald-700">Peak Attention</span>
        </div>

        {/* Layman Explainable Box */}
        <div className="rounded-xl bg-emerald-50/60 border border-emerald-200/60 p-3 space-y-1.5">
          <h4 className="flex items-center gap-1 text-xs font-bold text-emerald-900">
            <HelpCircle className="h-3.5 w-3.5 text-emerald-600" />
            Visual Evidence Breakdown
          </h4>
          <p className="text-xs leading-relaxed text-emerald-950/80">
            The <span className="font-bold text-red-600">warm red &amp; yellow highlights</span> represent the exact visual features (edges, textures, caps, or materials) that convinced the AI model of its prediction.
          </p>
          {focusNote && (
            <p className="text-[11px] font-medium text-emerald-800 bg-white/80 rounded-lg p-2 border border-emerald-100 mt-1">
              <span className="font-bold text-emerald-900">Attention:</span> {focusNote}
            </p>
          )}
        </div>

        {/* Diagnostics Toggle */}
        <div className="pt-0.5">
          <button
            onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
            className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-900 transition-colors"
          >
            <Sliders className="h-3 w-3" />
            {showTechnicalDetails ? "Hide CNN Diagnostics" : "View CNN Saliency Details"}
          </button>

          {showTechnicalDetails && (
            <div className="mt-2 grid grid-cols-2 gap-2 rounded-xl bg-gray-50 border border-gray-100 p-2.5 text-[11px]">
              <div>
                <span className="text-gray-500 font-medium">Layer:</span>
                <p className="font-mono font-bold text-gray-700">Conv2D (Last Feature Map)</p>
              </div>
              <div>
                <span className="text-gray-500 font-medium">Focus Check:</span>
                <p className="flex items-center gap-1 font-bold text-emerald-600">
                  <CheckCircle2 className="h-3 w-3" /> Centricity OK
                </p>
              </div>
              {result.debug && (
                <>
                  <div>
                    <span className="text-gray-500 font-medium">Edge Share:</span>
                    <p className="font-mono font-bold text-gray-700">{result.debug.edge}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 font-medium">Attention Spread:</span>
                    <p className="font-mono font-bold text-gray-700">{result.debug.spread}</p>
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
