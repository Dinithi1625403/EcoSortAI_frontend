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
  Cpu,
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
      description: "Strong feature match identified by convolutional neural network.",
      badgeStyle:
        "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-900",
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />,
    };
  } else if (isSure && topConfidence >= 0.5) {
    confidenceTier = {
      label: "Moderate Confidence Prediction",
      description: "Plausible classification. Manual verification recommended.",
      badgeStyle:
        "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-900",
      icon: <AlertTriangle className="h-4 w-4 text-amber-700 dark:text-amber-400" />,
    };
  } else {
    confidenceTier = {
      label: "Uncertain / Low Confidence Prediction",
      description:
        "Neural network is uncertain. Please manually inspect item characteristics.",
      badgeStyle:
        "bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-900",
      icon: <HelpCircle className="h-4 w-4 text-rose-700 dark:text-rose-400" />,
    };
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-200 bg-slate-50/80 px-6 py-3.5 dark:border-slate-800 dark:bg-slate-800/40">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded bg-slate-900 text-white dark:bg-emerald-600">
            <Cpu className="h-3.5 w-3.5" />
          </span>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Stage 1: AI Identification &amp; Confidence Assessment
          </h2>
        </div>

        {/* Action button */}
        {isSure && (
          <button
            onClick={onSaveToDashboard}
            disabled={isSaved}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
              isSaved
                ? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                : "bg-slate-900 text-white hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-700"
            }`}
          >
            <BookmarkCheck className="h-3.5 w-3.5" />
            {isSaved ? "Logged in Audit" : "Log in Audit Tracker"}
          </button>
        )}
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          {/* Left Column: Photo Preview */}
          <div className="md:col-span-4">
            <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Uploaded waste item"
                  className="aspect-square w-full object-cover"
                />
              ) : (
                <div className="flex aspect-square w-full items-center justify-center text-xs text-slate-400">
                  No preview available
                </div>
              )}
              <span className="absolute bottom-2 left-2 rounded bg-slate-900/80 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-xs">
                Source Input
              </span>
            </div>
          </div>

          {/* Right Column: AI Output */}
          <div className="flex flex-col justify-between md:col-span-8">
            <div>
              {/* Confidence Badge */}
              <div
                className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold ${confidenceTier.badgeStyle}`}
              >
                {confidenceTier.icon}
                <span>{confidenceTier.label}</span>
              </div>

              {/* Main Classification Title */}
              <div className="mt-3 flex flex-wrap items-baseline gap-3">
                <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {knowledge.name}
                </h3>
                <span
                  className={`rounded border px-2 py-0.5 text-xs font-semibold ${knowledge.colorClass.badge}`}
                >
                  {knowledge.type}
                </span>
              </div>

              {/* System summary note */}
              <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                {isSure ? knowledge.summary : result.message}
              </p>

              {/* Close call alert if applicable */}
              {isSure && result.close_call && (
                <div className="mt-3 flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50/60 p-3 text-xs text-amber-950 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-200">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700 dark:text-amber-400" />
                  <div>
                    <span className="font-bold">Close Decision Margin:</span> Saliency features also correlate with{" "}
                    <strong>{result.runner_up.toUpperCase()}</strong>.
                    {result.tip && (
                      <p className="mt-1 font-normal text-amber-900 dark:text-amber-300">
                        <strong>Disambiguation Rule:</strong> {result.tip}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Confidence Metrics Bar */}
            <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-800">
              <div className="mb-1.5 flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" /> Model Confidence Score
                </span>
                <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                  {confidencePercent}%
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    topConfidence >= 0.75
                      ? "bg-emerald-600"
                      : topConfidence >= 0.5
                      ? "bg-amber-600"
                      : "bg-rose-600"
                  }`}
                  style={{ width: `${Math.min(100, Math.max(5, topConfidence * 100))}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Top 3 Probabilities Accordion / Bar List */}
        <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/30">
          <div className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            <Layers className="h-3.5 w-3.5" />
            Softmax Class Probability Distribution (Top 3 Candidates)
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
                    <span className="font-mono font-medium text-slate-700 dark:text-slate-300">
                      {pct}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    <div
                      className={`h-full rounded-full ${
                        isBest ? "bg-slate-900 dark:bg-emerald-500" : "bg-slate-400 dark:bg-slate-500"
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
