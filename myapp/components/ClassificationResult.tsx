"use client";

import React from "react";
import { SureResult, UnsureResult, WasteCategory } from "@/types/waste";
import { WASTE_KNOWLEDGE_BASE } from "@/data/wasteKnowledgeBase";
import {
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Sparkles,
  Trash2,
  Lightbulb,
} from "lucide-react";

interface Props {
  result: SureResult | UnsureResult;
  previewUrl: string | null;
}

export const ClassificationResult: React.FC<Props> = ({ result, previewUrl }) => {
  const isSure = result.sure;
  const categoryId = (isSure ? result.label : result.top3[0]?.label) as WasteCategory;
  const knowledge = WASTE_KNOWLEDGE_BASE[categoryId] || WASTE_KNOWLEDGE_BASE.trash;
  const topConf = isSure ? result.confidence : result.top3[0]?.confidence || 0;
  const pct = Math.round(topConf * 100);

  const confidenceRating =
    topConf >= 0.8
      ? { label: "High Match", color: "text-emerald-700 bg-emerald-100/80 border-emerald-300", icon: CheckCircle2 }
      : topConf >= 0.5
      ? { label: "Likely Match", color: "text-amber-800 bg-amber-100/80 border-amber-300", icon: AlertTriangle }
      : { label: "Needs Double Check", color: "text-rose-800 bg-rose-100/80 border-rose-300", icon: HelpCircle };

  const RatingIcon = confidenceRating.icon;
  const primaryAction = knowledge.actions[0] || "Dispose responsibly in the designated bin.";

  return (
    <div className="card-cute overflow-hidden space-y-0">
      {/* Friendly Header */}
      <div className="card-cute-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <Sparkles className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-sm font-extrabold text-gray-900">Item Identified</h3>
            <p className="text-[11px] text-gray-500 font-medium">Automatic recognition result</p>
          </div>
        </div>
        <div
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${confidenceRating.color}`}
        >
          <RatingIcon className="h-3.5 w-3.5" />
          {pct}% Match
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* Identified Item Card */}
        <div className="flex items-center gap-4 bg-emerald-50/50 rounded-2xl p-3 border border-emerald-100">
          {previewUrl && (
            <div className="relative h-18 w-18 sm:h-20 sm:w-20 shrink-0 rounded-2xl overflow-hidden border-2 border-emerald-200 bg-white shadow-sm">
              <img
                src={previewUrl}
                alt="Uploaded item"
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <span className="inline-block rounded-full bg-white px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-emerald-800 border border-emerald-200 mb-1">
              {knowledge.type}
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 truncate">
              {knowledge.name}
            </h2>
            <p className="text-xs text-gray-600 line-clamp-1 mt-0.5 font-medium">
              {isSure ? knowledge.summary : result.message}
            </p>
          </div>
        </div>

        {/* Big Action Box: Where to Put It */}
        <div className="rounded-2xl border-2 border-emerald-300/80 bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-100">
              👉 What You Should Do:
            </span>
            <span className="rounded-full bg-white/20 backdrop-blur-xs px-2.5 py-0.5 text-[10px] font-bold text-white">
              Primary Step
            </span>
          </div>

          <div className="flex items-start gap-3 pt-1">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-md">
              <Trash2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-emerald-100 font-semibold">Drop Into:</p>
              <h3 className="text-base sm:text-lg font-black tracking-tight leading-snug text-white">
                {knowledge.colorClass.binName}
              </h3>
            </div>
          </div>

          {/* 1-Line Quick Action */}
          <div className="mt-2 flex items-center gap-2 rounded-xl bg-black/15 p-2.5 text-xs text-emerald-50">
            <Lightbulb className="h-4 w-4 shrink-0 text-amber-300" />
            <p className="line-clamp-2 font-medium">
              <span className="font-bold text-white">Quick Prep:</span> {primaryAction}
            </p>
          </div>
        </div>

        {/* Top 3 Alternative Possibilities (Simplified) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">
              Other Possibilities
            </span>
            <span className="text-[11px] text-gray-400 font-medium">
              Ranked by similarity
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {result.top3.map((g, i) => {
              const itemKnowledge = WASTE_KNOWLEDGE_BASE[g.label as WasteCategory];
              const displayLabel =
                g.label === "shoes"
                  ? "Accessories"
                  : itemKnowledge
                  ? itemKnowledge.name.split(" ")[0]
                  : g.label;

              return (
                <div
                  key={g.label}
                  className={`rounded-xl p-2.5 text-center transition-all ${
                    i === 0
                      ? "bg-emerald-50 border-2 border-emerald-300 text-emerald-950 font-bold shadow-2xs"
                      : "bg-gray-50/90 border border-gray-200/80 text-gray-600"
                  }`}
                >
                  <p className="text-xs font-bold capitalize truncate">{displayLabel}</p>
                  <p className="text-[11px] text-emerald-700 font-extrabold mt-0.5">
                    {(g.confidence * 100).toFixed(0)}%
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Close Call Tip if any */}
        {isSure && result.close_call && result.tip && (
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-950 leading-relaxed flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-900">
                Looks similar to {result.runner_up}:
              </span>{" "}
              {result.tip}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
