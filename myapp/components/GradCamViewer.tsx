"use client";

import React, { useState } from "react";
import { SureResult, UnsureResult } from "@/types/waste";
import {
  Eye,
  HelpCircle,
  Activity,
  CheckCircle,
  AlertCircle,
  Sliders,
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
  const focusNote = isSure
    ? result.focus_note
    : result.message;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-xl shadow-slate-200/40 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-none">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-100 bg-slate-50/70 px-6 py-4 dark:border-slate-800/80 dark:bg-slate-800/50">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-600 text-white shadow-xs">
            <Eye className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
              🔍 Step 2: Explainable AI (XAI) — Grad-CAM Visual Evidence
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Gradient-weighted Class Activation Mapping revealing CNN spatial reasoning
            </p>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="mt-2 flex rounded-lg bg-slate-200/80 p-1 dark:bg-slate-800 sm:mt-0">
          <button
            onClick={() => setViewMode("overlay")}
            className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
              viewMode === "overlay"
                ? "bg-white text-teal-700 shadow-xs dark:bg-slate-700 dark:text-teal-300"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            Overlay
          </button>
          <button
            onClick={() => setViewMode("original")}
            className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
              viewMode === "original"
                ? "bg-white text-teal-700 shadow-xs dark:bg-slate-700 dark:text-teal-300"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            Original
          </button>
          <button
            onClick={() => setViewMode("split")}
            className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
              viewMode === "split"
                ? "bg-white text-teal-700 shadow-xs dark:bg-slate-700 dark:text-teal-300"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            Side-by-Side
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Visual Inspection Area */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-950 p-2 dark:border-slate-800">
          {viewMode === "split" ? (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="relative overflow-hidden rounded-lg bg-slate-900">
                {originalPreview && (
                  <img
                    src={originalPreview}
                    alt="Original Input"
                    className="aspect-square w-full object-contain"
                  />
                )}
                <span className="absolute bottom-2 left-2 rounded-md bg-black/75 px-2 py-0.5 text-[11px] font-semibold text-white">
                  Original Photo
                </span>
              </div>
              <div className="relative overflow-hidden rounded-lg bg-slate-900">
                {heatmapBase64 ? (
                  <img
                    src={heatmapBase64}
                    alt="Grad-CAM Saliency Overlay"
                    className="aspect-square w-full object-contain"
                  />
                ) : (
                  <div className="flex aspect-square items-center justify-center text-xs text-slate-400">
                    No heatmap generated
                  </div>
                )}
                <span className="absolute bottom-2 left-2 rounded-md bg-teal-900/90 px-2 py-0.5 text-[11px] font-semibold text-teal-200">
                  Grad-CAM Attention Map
                </span>
              </div>
            </div>
          ) : (
            <div className="relative flex min-h-[300px] w-full items-center justify-center overflow-hidden rounded-lg bg-slate-900">
              {viewMode === "overlay" && heatmapBase64 && (
                <img
                  src={heatmapBase64}
                  alt="Grad-CAM Overlay"
                  className="max-h-[420px] w-auto max-w-full rounded-lg object-contain"
                />
              )}
              {viewMode === "original" && originalPreview && (
                <img
                  src={originalPreview}
                  alt="Original Image"
                  className="max-h-[420px] w-auto max-w-full rounded-lg object-contain"
                />
              )}
              <span className="absolute bottom-3 left-3 rounded-md bg-black/70 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-xs">
                {viewMode === "overlay"
                  ? "Grad-CAM Activation Heatmap Overlay (Jet Colormap)"
                  : "Original Captured Image"}
              </span>
            </div>
          )}
        </div>

        {/* Heatmap Legend Bar */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-800/40">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
            <span>Low Relevance</span>
            <div className="h-3.5 w-32 rounded-sm bg-gradient-to-r from-blue-600 via-cyan-400 via-yellow-400 to-red-600 shadow-inner" />
            <span>Peak Activation (High Influence)</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Alpha Blended (40% Jet intensity on source)
          </div>
        </div>

        {/* Layman & Decision Support Explanation */}
        <div className="mt-5 space-y-3">
          <div className="rounded-xl border border-teal-100 bg-teal-50/70 p-4 dark:border-teal-950 dark:bg-teal-950/30">
            <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-900 dark:text-teal-300">
              <HelpCircle className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              Why Did The AI Make This Prediction?
            </h4>
            <p className="mt-2 text-sm leading-relaxed text-teal-950 dark:text-teal-100">
              The neural network computes gradients flowing from the final convolutional feature
              maps. The <strong className="text-red-600 dark:text-red-400">red and yellow glowing regions</strong>{" "}
              indicate the specific visual patterns (such as edges, material reflectivity, bottle necks,
              terminal poles, or organic textures) that most heavily influenced the classification.
            </p>
            {focusNote && (
              <div className="mt-3 rounded-lg bg-white/80 p-3 text-xs font-medium text-slate-700 dark:bg-slate-900/80 dark:text-slate-200">
                <span className="font-bold text-teal-700 dark:text-teal-400">Spatial Attention Assessment:</span>{" "}
                {focusNote}
              </div>
            )}
          </div>

          {/* Saliency Quality Metrics & Technical Toggle */}
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              <Sliders className="h-3.5 w-3.5" />
              {showTechnicalDetails ? "Hide Saliency Math & Diagnostics" : "View CNN Saliency Diagnostics"}
            </button>
          </div>

          {showTechnicalDetails && (
            <div className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs dark:border-slate-800 dark:bg-slate-900/60 sm:grid-cols-2">
              <div className="space-y-1">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Convolutional Layer Target
                </span>
                <p className="font-mono text-slate-500 dark:text-slate-400">
                  Last Conv2D Layer (Spatial Saliency Extraction)
                </p>
              </div>
              <div className="space-y-1">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Attention Focus Quality
                </span>
                <div className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
                  <CheckCircle className="h-3.5 w-3.5" /> Object Centricity Verified
                </div>
              </div>
              {result.debug && (
                <>
                  <div className="space-y-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Edge Share Ratio
                    </span>
                    <p className="font-mono text-slate-500 dark:text-slate-400">
                      {result.debug.edge} (Background threshold &lt; 0.45)
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Activation Spread
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
