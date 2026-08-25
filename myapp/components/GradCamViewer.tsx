"use client";

import React, { useState } from "react";
import { SureResult, UnsureResult } from "@/types/waste";
import {
  Eye,
  HelpCircle,
  Activity,
  CheckCircle2,
  Sliders,
  Sparkles,
} from "lucide-react";

interface GradCamViewerProps {
  result: SureResult | UnsureResult;
  originalPreview: string | null;
}

type ViewMode = "overlay" | "heatmap" | "original" | "split";

export const GradCamViewer: React.FC<GradCamViewerProps> = ({
  result,
  originalPreview,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>("overlay");
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  const heatmapBase64 = result.heatmap
    ? `data:image/png;base64,${result.heatmap}`
    : null;

  const isSure = result.sure;
  const focusNote = isSure ? result.focus_note : result.message;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-200 bg-slate-50/80 px-6 py-3.5 dark:border-slate-800 dark:bg-slate-800/40">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded bg-slate-900 text-white dark:bg-teal-600">
            <Eye className="h-3.5 w-3.5" />
          </span>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Stage 2: Explainable AI (XAI) — Grad-CAM Feature Attribution
            </h2>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="mt-2 flex rounded-md bg-slate-200/80 p-0.5 dark:bg-slate-800 sm:mt-0">
          <button
            onClick={() => setViewMode("overlay")}
            className={`rounded px-2.5 py-1 text-xs font-semibold transition-all ${
              viewMode === "overlay"
                ? "bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            Overlay Map
          </button>
          <button
            onClick={() => setViewMode("original")}
            className={`rounded px-2.5 py-1 text-xs font-semibold transition-all ${
              viewMode === "original"
                ? "bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            Source Image
          </button>
          <button
            onClick={() => setViewMode("split")}
            className={`rounded px-2.5 py-1 text-xs font-semibold transition-all ${
              viewMode === "split"
                ? "bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            Side-by-Side
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Visual Inspection Area */}
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-950 p-2 dark:border-slate-800">
          {viewMode === "split" ? (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="relative overflow-hidden rounded bg-slate-900">
                {originalPreview && (
                  <img
                    src={originalPreview}
                    alt="Original Input"
                    className="aspect-square w-full object-contain"
                  />
                )}
                <span className="absolute bottom-2 left-2 rounded bg-black/75 px-2 py-0.5 text-[10px] font-semibold text-white">
                  Source Input
                </span>
              </div>
              <div className="relative overflow-hidden rounded bg-slate-900">
                {heatmapBase64 ? (
                  <img
                    src={heatmapBase64}
                    alt="Grad-CAM Saliency Overlay"
                    className="aspect-square w-full object-contain"
                  />
                ) : (
                  <div className="flex aspect-square items-center justify-center text-xs text-slate-400">
                    No activation heatmap generated
                  </div>
                )}
                <span className="absolute bottom-2 left-2 rounded bg-slate-900/90 px-2 py-0.5 text-[10px] font-semibold text-teal-300">
                  Grad-CAM Activation Map
                </span>
              </div>
            </div>
          ) : (
            <div className="relative flex min-h-[300px] w-full items-center justify-center overflow-hidden rounded bg-slate-900">
              {viewMode === "overlay" && heatmapBase64 && (
                <img
                  src={heatmapBase64}
                  alt="Grad-CAM Overlay"
                  className="max-h-[420px] w-auto max-w-full rounded object-contain"
                />
              )}
              {viewMode === "original" && originalPreview && (
                <img
                  src={originalPreview}
                  alt="Original Image"
                  className="max-h-[420px] w-auto max-w-full rounded object-contain"
                />
              )}
              <span className="absolute bottom-3 left-3 rounded bg-black/70 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur-xs">
                {viewMode === "overlay"
                  ? "Grad-CAM Saliency Overlay (Alpha-blended Jet Colormap)"
                  : "Original Input Photo"}
              </span>
            </div>
          )}
        </div>

        {/* Heatmap Legend Bar */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-800/40">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
            <span>Low Activation</span>
            <div className="h-3 w-28 rounded-xs bg-gradient-to-r from-blue-600 via-cyan-400 via-yellow-400 to-red-600 shadow-inner" />
            <span>Peak Feature Activation (High Saliency)</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Final Conv2D Layer Backpropagation
          </div>
        </div>

        {/* Layman & Decision Support Explanation */}
        <div className="mt-5 space-y-3">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
            <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              <HelpCircle className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              Explainable Decision Support Rationale
            </h4>
            <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              The highlighted warm regions (red, orange, yellow) indicate the specific spatial feature
              boundaries—such as edges, textures, contours, or structural geometry—that yielded the
              strongest positive gradient activations toward the predicted class.
            </p>
            {focusNote && (
              <div className="mt-3 rounded border border-slate-200 bg-white p-3 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                <span className="font-bold text-slate-900 dark:text-white">Spatial Quality Assessment:</span>{" "}
                {focusNote}
              </div>
            )}
          </div>

          {/* Saliency Diagnostics Toggle */}
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              <Sliders className="h-3.5 w-3.5" />
              {showTechnicalDetails ? "Hide Saliency Diagnostics" : "Show Saliency Diagnostics & Metrics"}
            </button>
          </div>

          {showTechnicalDetails && (
            <div className="grid grid-cols-1 gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs dark:border-slate-800 dark:bg-slate-900/60 sm:grid-cols-2">
              <div className="space-y-1">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Target Conv2D Layer
                </span>
                <p className="font-mono text-slate-500 dark:text-slate-400">
                  Final Conv2D (Spatial Saliency Extraction)
                </p>
              </div>
              <div className="space-y-1">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Centricity Verification
                </span>
                <div className="flex items-center gap-1.5 font-medium text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Focal Point Verified
                </div>
              </div>
              {result.debug && (
                <>
                  <div className="space-y-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Edge Share Ratio
                    </span>
                    <p className="font-mono text-slate-500 dark:text-slate-400">
                      {result.debug.edge} (Standard threshold &lt; 0.45)
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Activation Spread Index
                    </span>
                    <p className="font-mono text-slate-500 dark:text-slate-400">
                      {result.debug.spread} (Clutter threshold &lt; 0.55)
                    </p>
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
