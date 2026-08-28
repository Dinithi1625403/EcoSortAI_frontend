"use client";

import React from "react";
import { SureResult, UnsureResult, WasteCategory } from "@/types/waste";
import { WASTE_KNOWLEDGE_BASE } from "@/data/wasteKnowledgeBase";
import { CheckCircle2, AlertTriangle, HelpCircle, ArrowUpRight, Sparkles } from "lucide-react";

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

  const tier = topConf >= 0.75 ? "high" : topConf >= 0.5 ? "mid" : "low";
  const tierConfig = {
    high: { label: "High Confidence", icon: CheckCircle2, color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
    mid:  { label: "Moderate Confidence", icon: AlertTriangle, color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
    low:  { label: "Low Confidence (Double Check)", icon: HelpCircle, color: "text-rose-700", bg: "bg-rose-50 border-rose-200" },
  }[tier];
  const TierIcon = tierConfig.icon;

  return (
    <div className="card-cute overflow-hidden">
      <div className="card-cute-header flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
          <h3 className="text-sm font-bold text-gray-800">AI Detection Summary</h3>
        </div>
        <div className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${tierConfig.bg} ${tierConfig.color}`}>
          <TierIcon className="h-3 w-3" />
          {tierConfig.label}
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* Main Category Row */}
        <div className="flex items-start gap-4">
          {previewUrl && (
            <div className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 rounded-2xl overflow-hidden border border-emerald-100 bg-emerald-50/50 shadow-inner">
              <img
                src={previewUrl}
                alt="Uploaded item"
                className="h-full w-full object-cover"
              />
              <span className="absolute bottom-1 right-1 rounded-md bg-black/60 px-1 py-0.5 text-[9px] font-bold text-white">
                Input
              </span>
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 mb-1">
              <span className="inline-block rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide">
                {knowledge.type}
              </span>
              <span className="inline-block rounded-full bg-gray-100 text-gray-700 px-2 py-0.5 text-[10px] font-bold">
                {knowledge.colorClass.binName}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 capitalize tracking-tight">
              {knowledge.name}
            </h2>

            <p className="text-xs text-gray-600 line-clamp-2 mt-1 leading-relaxed">
              {isSure ? knowledge.summary : result.message}
            </p>
          </div>
        </div>

        {/* Confidence Meter */}
        <div className="rounded-2xl bg-emerald-50/60 border border-emerald-100/80 p-3">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-emerald-900">Model Confidence</span>
            <span className="font-extrabold text-emerald-700 text-sm">{pct}%</span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-emerald-200/50 overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-700 shadow-xs"
              style={{ width: `${Math.max(8, pct)}%` }}
            />
          </div>
        </div>

        {/* Top 3 Predictions Bar */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Alternative Predictions
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {result.top3.map((g, i) => {
              const itemKnowledge = WASTE_KNOWLEDGE_BASE[g.label as WasteCategory];
              const displayLabel = g.label === "shoes" 
                ? "Accessories" 
                : itemKnowledge 
                ? itemKnowledge.name.split(" ")[0] 
                : g.label;

              return (
                <div
                  key={g.label}
                  className={`rounded-xl p-2 text-center transition-all ${
                    i === 0
                      ? "bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold"
                      : "bg-gray-50 border border-gray-100 text-gray-700"
                  }`}
                >
                  <p className="text-xs font-semibold capitalize truncate">{displayLabel}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5 font-semibold">
                    {(g.confidence * 100).toFixed(0)}%
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Close Call Tip if any */}
        {isSure && result.close_call && result.tip && (
          <div className="rounded-xl bg-amber-50/90 border border-amber-200/80 p-2.5 text-xs text-amber-900 leading-relaxed">
            <span className="font-bold text-amber-800">Close match with {result.runner_up}: </span>
            {result.tip}
          </div>
        )}
      </div>
    </div>
  );
};
