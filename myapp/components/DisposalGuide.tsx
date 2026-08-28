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
  ListOrdered,
  ThumbsUp,
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
          <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <Recycle className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-sm font-extrabold text-gray-900">How to Dispose</h3>
            <p className="text-[11px] text-gray-500 font-medium">Recommended prep &amp; guidelines</p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center rounded-full bg-emerald-100/70 p-0.5 border border-emerald-200">
          <button
            onClick={() => setActiveTab("steps")}
            className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold transition-all ${
              activeTab === "steps"
                ? "bg-white text-emerald-800 shadow-xs"
                : "text-emerald-900/70 hover:text-emerald-950"
            }`}
          >
            <ListOrdered className="h-3 w-3" />
            <span>Steps</span>
          </button>
          <button
            onClick={() => setActiveTab("dos_donts")}
            className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold transition-all ${
              activeTab === "dos_donts"
                ? "bg-white text-emerald-800 shadow-xs"
                : "text-emerald-900/70 hover:text-emerald-950"
            }`}
          >
            <ThumbsUp className="h-3 w-3" />
            <span>Do &amp; Don&apos;t</span>
          </button>
          <button
            onClick={() => setActiveTab("impact")}
            className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold transition-all ${
              activeTab === "impact"
                ? "bg-white text-emerald-800 shadow-xs"
                : "text-emerald-900/70 hover:text-emerald-950"
            }`}
          >
            <Leaf className="h-3 w-3" />
            <span>Eco Impact</span>
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-5 flex-1 space-y-4">
        {/* Recommended Bin Banner */}
        <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-emerald-50 to-green-50/80 border border-emerald-200 p-3.5 shadow-2xs">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${knowledge.colorClass.binColor} shadow-md text-white font-bold`}
            >
              <Recycle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[11px] text-emerald-800 font-bold uppercase tracking-wide">
                Target Bin:
              </p>
              <h4 className="text-sm sm:text-base font-black text-gray-900">
                {knowledge.colorClass.binName}
              </h4>
            </div>
          </div>
          <span className="rounded-full bg-white border border-emerald-200 px-3 py-1 text-[11px] font-extrabold text-emerald-800 shadow-2xs">
            {knowledge.type}
          </span>
        </div>

        {/* TAB 1: STEPS */}
        {activeTab === "steps" && (
          <div className="space-y-3.5 animate-fade-in">
            <div className="space-y-2">
              {knowledge.actions.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 rounded-2xl bg-white border border-emerald-100/90 p-3 text-xs text-gray-800 shadow-2xs hover:border-emerald-200 transition-colors"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-black text-emerald-800 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed font-medium">{step}</span>
                </div>
              ))}
            </div>

            {knowledge.preparationSteps.length > 0 && (
              <div className="rounded-2xl bg-amber-50/80 border border-amber-200 p-3.5 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-900">
                  <Lightbulb className="h-4 w-4 text-amber-600" />
                  Helpful Prep Tip
                </div>
                <ul className="space-y-1">
                  {knowledge.preparationSteps.map((prep, idx) => (
                    <li key={idx} className="text-xs text-amber-900 pl-1 leading-relaxed font-medium">
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
            <div className="rounded-2xl bg-emerald-50/80 border border-emerald-200 p-3.5 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-950">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Good Practices (Do)
              </div>
              <ul className="space-y-1.5">
                {knowledge.dos.map((item, idx) => (
                  <li
                    key={idx}
                    className="text-xs text-emerald-950 leading-relaxed flex items-start gap-2 font-medium"
                  >
                    <span className="text-emerald-600 font-black">✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Don'ts */}
            <div className="rounded-2xl bg-rose-50/80 border border-rose-200 p-3.5 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-rose-950">
                <XCircle className="h-4 w-4 text-rose-600" />
                Things to Avoid (Don&apos;t)
              </div>
              <ul className="space-y-1.5">
                {knowledge.donts.map((item, idx) => (
                  <li
                    key={idx}
                    className="text-xs text-rose-950 leading-relaxed flex items-start gap-2 font-medium"
                  >
                    <span className="text-rose-600 font-black">✗</span> {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Hazard Warning if any */}
            {knowledge.hazards && (
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-2.5 flex items-start gap-2">
                <AlertOctagon className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                <p className="text-[11px] text-amber-900 leading-relaxed font-medium">
                  <span className="font-bold">Caution:</span> {knowledge.hazards}
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ECO IMPACT */}
        {activeTab === "impact" && (
          <div className="space-y-3 animate-fade-in">
            <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-4 shadow-sm space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-100">
                <Leaf className="h-4 w-4" />
                Environmental Benefit
              </div>
              <p className="text-xs leading-relaxed text-emerald-50 font-medium">
                {knowledge.environmentalImpact.fact}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-2xl bg-white border border-emerald-100 p-3 shadow-2xs">
                <p className="text-base font-black text-emerald-800">
                  {knowledge.environmentalImpact.co2OffsetKg} kg
                </p>
                <p className="text-[10px] text-gray-500 font-bold mt-0.5">CO₂ Saved</p>
              </div>

              <div className="rounded-2xl bg-white border border-emerald-100 p-3 shadow-2xs">
                <p className="text-base font-black text-emerald-800">
                  {knowledge.environmentalImpact.landfillSpaceLiters} L
                </p>
                <p className="text-[10px] text-gray-500 font-bold mt-0.5">Space Saved</p>
              </div>

              <div className="rounded-2xl bg-white border border-emerald-100 p-3 shadow-2xs">
                <p className="text-xs font-black text-emerald-800 truncate">
                  {knowledge.environmentalImpact.decompositionYears}
                </p>
                <p className="text-[10px] text-gray-500 font-bold mt-0.5">Natural Life</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
