"use client";

import React from "react";
import { SureResult, UnsureResult, WasteCategory } from "@/types/waste";
import { WASTE_KNOWLEDGE_BASE } from "@/data/wasteKnowledgeBase";
import {
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  TrendingUp,
  Layers,
  Sparkles,
  BookmarkCheck,
} from "lucide-react";

interface ClassificationResultProps {
  result: SureResult | UnsureResult;
  previewUrl: string | null;
  onSaveToDashboard: () => void;
  isSaved: boolean;
}

export const ClassificationResult: React.FC<ClassificationResultProps> = ({
  result,
  previewUrl,
  onSaveToDashboard,
  isSaved,
}) => {
  const isSure = result.sure;
  const categoryId = (isSure ? result.label : result.top3[0]?.label) as WasteCategory;
  const knowledge = WASTE_KNOWLEDGE_BASE[categoryId] || WASTE_KNOWLEDGE_BASE.trash;

  // Multi-tier Confidence Evaluation
  const topConfidence = isSure
    ? result.confidence
    : result.top3[0]?.confidence || 0;
  const confidencePercent = (topConfidence * 100).toFixed(1);

  let confidenceTier: {
    label: string;
    description: string;
    badgeStyle: string;
    icon: React.ReactNode;
  };

  if (isSure && topConfidence >= 0.75) {
    confidenceTier = {
      label: "High Confidence Prediction",
      description: "Strong feature match identified by the neural network.",
      badgeStyle:
        "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />,
    };
  } else if (isSure && topConfidence >= 0.5) {
    confidenceTier = {
      label: "Moderate Confidence Prediction",
      description: "Plausible classification. Please verify visual characteristics.",
      badgeStyle:
        "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
      icon: <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />,
    };
  } else {
    confidenceTier = {
      label: "Low Confidence / Uncertain Prediction",
      description:
        "The AI is uncertain about this classification. Please manually inspect the item.",
      badgeStyle:
        "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800",
      icon: <HelpCircle className="h-4 w-4 text-rose-600 dark:text-rose-400" />,
    };
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-xl shadow-slate-200/40 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-none">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-100 bg-slate-50/70 px-6 py-4 dark:border-slate-800/80 dark:bg-slate-800/50">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs">
            <Sparkles className="h-4 w-4" />
          </span>
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
            🤖 Step 1: AI Identification Result
          </h2>
        </div>

        {/* Action button */}
        {isSure && (
          <button
            onClick={onSaveToDashboard}
            disabled={isSaved}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              isSaved
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                : "bg-emerald-600 text-white shadow-xs hover:bg-emerald-700 active:scale-95"
            }`}
          >
            <BookmarkCheck className="h-3.5 w-3.5" />
            {isSaved ? "Saved to Tracker" : "Log in Tracker"}
          </button>
        )}
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          {/* Left Column: Photo Preview */}
          <div className="md:col-span-4">
            <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Uploaded waste item"
                  className="aspect-square w-full object-cover"
                />
              ) : (
                <div className="flex aspect-square w-full items-center justify-center text-slate-400">
                  No preview
                </div>
              )}
              <span className="absolute bottom-2 left-2 rounded-md bg-slate-900/80 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-xs">
                Source Image
              </span>
            </div>
          </div>

          {/* Right Column: AI Output */}
          <div className="flex flex-col justify-between md:col-span-8">
            <div>
              {/* Confidence Badge */}
              <div
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${confidenceTier.badgeStyle}`}
              >
                {confidenceTier.icon}
                <span>{confidenceTier.label}</span>
              </div>

              {/* Main Classification Title */}
              <div className="mt-3 flex flex-wrap items-baseline gap-3">
                <h3 className="text-3xl font-extrabold uppercase tracking-tight text-slate-900 dark:text-white">
                  {knowledge.name.split("&")[0]}
                </h3>
                <span
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold ${knowledge.colorClass.badge}`}
                >
                  {knowledge.type}
                </span>
              </div>

              {/* System summary note */}
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {isSure
                  ? knowledge.summary
                  : result.message}
              </p>

              {/* Close call alert if applicable */}
              {isSure && result.close_call && (
                <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50/80 p-3 text-xs text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-200">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                  <div>
                    <span className="font-semibold">Close Decision:</span> Model noticed similarities with{" "}
                    <strong>{result.runner_up.toUpperCase()}</strong>.
                    {result.tip && (
                      <p className="mt-1 font-normal text-amber-800 dark:text-amber-300">
                        💡 <strong>Tactile rule:</strong> {result.tip}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Confidence Metrics Bar */}
            <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-800">
              <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-500" /> Model Confidence
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {confidencePercent}%
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    topConfidence >= 0.75
                      ? "bg-emerald-500"
                      : topConfidence >= 0.5
                      ? "bg-amber-500"
                      : "bg-rose-500"
                  }`}
                  style={{ width: `${Math.min(100, Math.max(5, topConfidence * 100))}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Top 3 Probabilities Accordion / Bar List */}
        <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-800/40">
          <div className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <Layers className="h-3.5 w-3.5" />
            Probabilistic Distribution (Top 3 Candidates)
          </div>
          <div className="space-y-2.5">
            {result.top3.map((guess, idx) => {
              const pct = (guess.confidence * 100).toFixed(1);
              const isBest = idx === 0;
              return (
                <div key={guess.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span
                      className={`font-semibold capitalize ${
                        isBest
                          ? "text-slate-900 dark:text-white"
                          : "text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {idx + 1}. {guess.label}
                    </span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">{pct}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    <div
                      className={`h-full rounded-full ${
                        isBest ? "bg-emerald-500" : "bg-slate-400 dark:bg-slate-500"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
