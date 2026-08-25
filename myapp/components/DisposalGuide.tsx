"use client";

import React, { useState } from "react";
import { WasteCategory } from "@/types/waste";
import { WASTE_KNOWLEDGE_BASE } from "@/data/wasteKnowledgeBase";
import {
  Recycle,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Leaf,
  AlertOctagon,
  Sparkles,
} from "lucide-react";

interface Props {
  category: WasteCategory;
}

type GuideTab = "steps" | "dos_donts" | "impact";

export const DisposalGuide: React.FC<Props> = ({ category }) => {
  const [activeTab, setActiveTab] = useState<GuideTab>("steps");
  const knowledge = WASTE_KNOWLEDGE_BASE[category] || WASTE_KNOWLEDGE_BASE.trash;

  return (
    <div className="card-cute overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="card-cute-header flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
            <Recycle className="h-3.5 w-3.5" />
          </span>
          <h3 className="text-sm font-bold text-gray-800">Smart Disposal Protocol</h3>
        </div>

        {/* Mini Pill Tabs */}
        <div className="flex items-center rounded-full bg-emerald-100/60 p-0.5 border border-emerald-200/60">
          <button
            onClick={() => setActiveTab("steps")}
            className={`rounded-full px-2.5 py-1 text-xs font-bold transition-all ${
              activeTab === "steps"
                ? "bg-white text-emerald-800 shadow-xs"
                : "text-emerald-900/70 hover:text-emerald-950"
            }`}
          >
            How to Dispose
          </button>
          <button
            onClick={() => setActiveTab("dos_donts")}
            className={`rounded-full px-2.5 py-1 text-xs font-bold transition-all ${
              activeTab === "dos_donts"
                ? "bg-white text-emerald-800 shadow-xs"
                : "text-emerald-900/70 hover:text-emerald-950"
            }`}
          >
            Do &amp; Don't
          </button>
          <button
            onClick={() => setActiveTab("impact")}
            className={`rounded-full px-2.5 py-1 text-xs font-bold transition-all ${
              activeTab === "impact"
                ? "bg-white text-emerald-800 shadow-xs"
                : "text-emerald-900/70 hover:text-emerald-950"
            }`}
          >
            Eco Impact
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-5 flex-1 space-y-4">
        {/* Recommended Bin Banner */}
        <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-emerald-50 to-green-50/80 border border-emerald-200/70 p-3.5">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${knowledge.colorClass.binColor} shadow-xs font-bold text-sm`}>
              <Recycle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-emerald-800 font-semibold">Recommended Stream</p>
              <h4 className="text-sm font-extrabold text-emerald-950">
                {knowledge.colorClass.binName}
              </h4>
            </div>
          </div>
          <span className="rounded-full bg-white/90 border border-emerald-200 px-2.5 py-1 text-[10px] font-extrabold text-emerald-800 shadow-2xs">
            {knowledge.type}
          </span>
        </div>

        {/* TAB 1: STEPS & PREP */}
        {activeTab === "steps" && (
          <div className="space-y-3.5 animate-fade-in">
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                Step-by-Step Instructions
              </h5>
              <div className="space-y-2">
                {knowledge.actions.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 rounded-xl bg-white border border-emerald-100 p-2.5 text-xs text-gray-700 shadow-2xs"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-800 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {knowledge.preparationSteps.length > 0 && (
              <div className="rounded-xl bg-amber-50/70 border border-amber-200/70 p-3">
                <div className="flex items-center gap-1.5 mb-1 text-xs font-bold text-amber-900">
                  <Lightbulb className="h-3.5 w-3.5 text-amber-600" />
                  Preparation Note
                </div>
                <ul className="space-y-1">
                  {knowledge.preparationSteps.map((prep, idx) => (
                    <li key={idx} className="text-xs text-amber-900/90 pl-1 leading-relaxed">
                      • {prep}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: DO'S & DON'TS */}
        {activeTab === "dos_donts" && (
          <div className="space-y-3 animate-fade-in">
            {/* Dos */}
            <div className="rounded-xl bg-emerald-50/80 border border-emerald-200/80 p-3">
              <div className="flex items-center gap-1.5 mb-2 text-xs font-bold text-emerald-900">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                Best Practices (Do)
              </div>
              <ul className="space-y-1.5">
                {knowledge.dos.map((item, idx) => (
                  <li key={idx} className="text-xs text-emerald-900 leading-relaxed flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Don'ts */}
            <div className="rounded-xl bg-rose-50/80 border border-rose-200/80 p-3">
              <div className="flex items-center gap-1.5 mb-2 text-xs font-bold text-rose-900">
                <XCircle className="h-3.5 w-3.5 text-rose-600" />
                Common Mistakes (Don't)
              </div>
              <ul className="space-y-1.5">
                {knowledge.donts.map((item, idx) => (
                  <li key={idx} className="text-xs text-rose-900 leading-relaxed flex items-start gap-1.5">
                    <span className="text-rose-600 font-bold">✗</span> {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Hazard Warning if any */}
            {knowledge.hazards && (
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-2.5 flex items-start gap-2">
                <AlertOctagon className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                <p className="text-[11px] text-amber-900 leading-relaxed font-medium">
                  <span className="font-bold">Safety:</span> {knowledge.hazards}
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ENVIRONMENTAL IMPACT */}
        {activeTab === "impact" && (
          <div className="space-y-3 animate-fade-in">
            <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-4 shadow-sm space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-100">
                <Leaf className="h-4 w-4" />
                Why Proper Sorting Matters
              </div>
              <p className="text-xs leading-relaxed text-emerald-50 font-medium">
                {knowledge.environmentalImpact.fact}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-2.5">
                <p className="text-sm font-extrabold text-emerald-800">
                  {knowledge.environmentalImpact.co2OffsetKg} kg
                </p>
                <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                  CO₂ Saved / Unit
                </p>
              </div>

              <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-2.5">
                <p className="text-sm font-extrabold text-emerald-800">
                  {knowledge.environmentalImpact.landfillSpaceLiters} L
                </p>
                <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                  Landfill Saved
                </p>
              </div>

              <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-2.5">
                <p className="text-xs font-extrabold text-emerald-800 truncate">
                  {knowledge.environmentalImpact.decompositionYears}
                </p>
                <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                  Decomposition
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
