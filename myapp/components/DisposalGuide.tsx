"use client";

import React, { useState } from "react";
import { WasteCategory } from "@/types/waste";
import { WASTE_KNOWLEDGE_BASE } from "@/data/wasteKnowledgeBase";
import {
  Recycle,
  CheckSquare,
  Square,
  AlertOctagon,
  TreePine,
  Check,
  X,
  Clock,
  Sparkles,
  ShieldAlert,
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
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-xl shadow-slate-200/40 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-none">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-100 bg-slate-50/70 px-6 py-4 dark:border-slate-800/80 dark:bg-slate-800/50">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-xs">
            <Recycle className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
              ♻️ Step 3: Decision Support — Recommended Disposal Action
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Prescribed handling guidelines, bin allocation, and contamination prevention
            </p>
          </div>
        </div>

        {/* Bin Badge */}
        <div
          className={`rounded-full px-3.5 py-1 text-xs font-bold shadow-xs ${knowledge.colorClass.binColor}`}
        >
          {knowledge.colorClass.binName}
        </div>
      </div>

      <div className="space-y-6 p-6">
        {/* Step-by-Step Interactive Action Checklist */}
        <div>
          <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            <CheckSquare className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            Step-by-Step Preparation Checklist
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Follow and check off these preparation steps before disposing of this item:
          </p>

          <div className="mt-3 space-y-2">
            {knowledge.actions.map((action, idx) => {
              const isChecked = !!completedSteps[idx];
              return (
                <div
                  key={idx}
                  onClick={() => toggleStep(idx)}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-all ${
                    isChecked
                      ? "border-emerald-300 bg-emerald-50/60 text-emerald-950 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200"
                      : "border-slate-200 bg-slate-50/50 text-slate-800 hover:border-emerald-300 hover:bg-white dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-200 dark:hover:bg-slate-800"
                  }`}
                >
                  <button
                    type="button"
                    className="mt-0.5 text-emerald-600 transition-transform active:scale-90 dark:text-emerald-400"
                  >
                    {isChecked ? (
                      <CheckSquare className="h-5 w-5 fill-emerald-600 text-white dark:fill-emerald-500" />
                    ) : (
                      <Square className="h-5 w-5 text-slate-400" />
                    )}
                  </button>
                  <span
                    className={`text-sm leading-snug ${
                      isChecked ? "line-through opacity-80" : "font-medium"
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
          <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/40 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20">
            <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
              <Check className="h-4 w-4 rounded-full bg-emerald-600 p-0.5 text-white" />
              Do's (Best Practices)
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-slate-700 dark:text-slate-300">
              {knowledge.dos.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Don'ts */}
          <div className="rounded-xl border border-rose-200/80 bg-rose-50/40 p-4 dark:border-rose-900/40 dark:bg-rose-950/20">
            <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-800 dark:text-rose-300">
              <X className="h-4 w-4 rounded-full bg-rose-600 p-0.5 text-white" />
              Don'ts (Avoid Mistakes)
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-slate-700 dark:text-slate-300">
              {knowledge.donts.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-600 dark:bg-rose-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contamination Hazard Alert */}
        <div className="flex items-start gap-3 rounded-xl border border-amber-300/80 bg-amber-50/70 p-4 text-amber-950 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300">
              Contamination & Environmental Hazards
            </h4>
            <p className="text-xs leading-relaxed text-amber-800 dark:text-amber-200">
              {knowledge.hazards}
            </p>
          </div>
        </div>

        {/* Environmental Impact & Facts Card */}
        <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-emerald-50/30 p-4 dark:border-slate-800 dark:from-slate-800/40 dark:to-emerald-950/20">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              <TreePine className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              Environmental Impact Metrics
            </span>
            <span className="flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
              <Clock className="h-3 w-3" /> Decomp: {knowledge.environmentalImpact.decompositionYears}
            </span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-200/80 bg-white p-3 text-center dark:border-slate-700 dark:bg-slate-800">
              <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                ~{knowledge.environmentalImpact.co2OffsetKg} kg
              </span>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                CO₂ Emissions Avoided
              </p>
            </div>

            <div className="rounded-lg border border-slate-200/80 bg-white p-3 text-center dark:border-slate-700 dark:bg-slate-800">
              <span className="text-lg font-extrabold text-teal-600 dark:text-teal-400">
                {knowledge.environmentalImpact.landfillSpaceLiters} L
              </span>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Landfill Volume Diverted
              </p>
            </div>

            <div className="col-span-2 rounded-lg border border-slate-200/80 bg-white p-3 text-center sm:col-span-1 dark:border-slate-700 dark:bg-slate-800">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                Circular Path
              </span>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                {knowledge.type.split("/")[0]}
              </p>
            </div>
          </div>

          {/* Eco Fact */}
          <div className="mt-3 rounded-lg bg-emerald-100/50 p-3 text-xs text-emerald-950 dark:bg-emerald-950/40 dark:text-emerald-200">
            <span className="font-bold">Did you know?</span> {knowledge.environmentalImpact.fact}
          </div>
        </div>
      </div>
    </div>
  );
};
