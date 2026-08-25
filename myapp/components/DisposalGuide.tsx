"use client";

import React, { useState } from "react";
import { WasteCategory } from "@/types/waste";
import { WASTE_KNOWLEDGE_BASE } from "@/data/wasteKnowledgeBase";
import {
  Recycle,
  CheckSquare,
  Square,
  ShieldAlert,
  Clock,
  Check,
  X,
  TrendingDown,
  Info,
} from "lucide-react";

interface DisposalGuideProps {
  category: WasteCategory;
}

export const DisposalGuide: React.FC<DisposalGuideProps> = ({ category }) => {
  const knowledge = WASTE_KNOWLEDGE_BASE[category] || WASTE_KNOWLEDGE_BASE.trash;
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  const toggleStep = (idx: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-200 bg-slate-50/80 px-6 py-3.5 dark:border-slate-800 dark:bg-slate-800/40">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded bg-slate-900 text-white dark:bg-emerald-600">
            <Recycle className="h-3.5 w-3.5" />
          </span>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Stage 3: Decision Support — Prescribed Disposal Guidelines
            </h2>
          </div>
        </div>

        {/* Bin Designation Badge */}
        <div
          className={`rounded border px-3 py-1 text-xs font-bold ${knowledge.colorClass.binColor}`}
        >
          {knowledge.colorClass.binName}
        </div>
      </div>

      <div className="space-y-6 p-6">
        {/* Step-by-Step Interactive Action Checklist */}
        <div>
          <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            <CheckSquare className="h-4 w-4 text-slate-700 dark:text-slate-300" />
            Standard Preparation Protocol
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Complete the following verification and handling steps prior to final deposit:
          </p>

          <div className="mt-3 space-y-2">
            {knowledge.actions.map((action, idx) => {
              const isChecked = !!completedSteps[idx];
              return (
                <div
                  key={idx}
                  onClick={() => toggleStep(idx)}
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
                    isChecked
                      ? "border-emerald-300 bg-emerald-50/40 text-emerald-950 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-300"
                      : "border-slate-200 bg-slate-50/50 text-slate-800 hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-200 dark:hover:bg-slate-800"
                  }`}
                >
                  <button
                    type="button"
                    className="mt-0.5 text-slate-700 transition-transform dark:text-slate-300"
                  >
                    {isChecked ? (
                      <CheckSquare className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
                    ) : (
                      <Square className="h-4 w-4 text-slate-400" />
                    )}
                  </button>
                  <span
                    className={`text-xs leading-relaxed ${
                      isChecked ? "line-through opacity-70" : "font-medium"
                    }`}
                  >
                    {action}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Do's and Don'ts Comparison Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Do's */}
          <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-800/40">
            <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              <Check className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
              Approved Practices
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-300">
              {knowledge.dos.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Don'ts */}
          <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-800/40">
            <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              <X className="h-4 w-4 text-rose-700 dark:text-rose-400" />
              Prohibited Practices
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-300">
              {knowledge.donts.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contamination Hazard Alert */}
        <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50/60 p-4 text-xs text-amber-950 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-200">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-700 dark:text-amber-400" />
          <div className="space-y-1">
            <h4 className="font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300">
              Contamination &amp; Hazard Advisory
            </h4>
            <p className="leading-relaxed text-amber-900/80 dark:text-amber-200/90">
              {knowledge.hazards}
            </p>
          </div>
        </div>

        {/* Environmental Impact & Metrics Card */}
        <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/30">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              <TrendingDown className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              Environmental Metrics &amp; Circular Impact
            </span>
            <span className="flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
              <Clock className="h-3 w-3" /> Decomposition: {knowledge.environmentalImpact.decompositionYears}
            </span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded border border-slate-200 bg-white p-3 text-center dark:border-slate-700 dark:bg-slate-800">
              <span className="font-mono text-base font-bold text-slate-900 dark:text-white">
                ~{knowledge.environmentalImpact.co2OffsetKg} kg
              </span>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                CO₂ Emissions Avoided
              </p>
            </div>

            <div className="rounded border border-slate-200 bg-white p-3 text-center dark:border-slate-700 dark:bg-slate-800">
              <span className="font-mono text-base font-bold text-slate-900 dark:text-white">
                {knowledge.environmentalImpact.landfillSpaceLiters} L
              </span>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Landfill Volume Diverted
              </p>
            </div>

            <div className="col-span-2 rounded border border-slate-200 bg-white p-3 text-center sm:col-span-1 dark:border-slate-700 dark:bg-slate-800">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                {knowledge.type.split("/")[0]}
              </span>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Lifecycle Pathway
              </p>
            </div>
          </div>

          {/* Fact note */}
          <div className="mt-3 flex items-start gap-2 rounded border border-slate-200 bg-white p-3 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-500 dark:text-slate-400" />
            <span>{knowledge.environmentalImpact.fact}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
