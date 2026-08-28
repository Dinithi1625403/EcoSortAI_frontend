"use client";

import React, { useState } from "react";
import Image from "next/image";
import { WASTE_KNOWLEDGE_BASE } from "@/data/wasteKnowledgeBase";
import { WasteCategory } from "@/types/waste";
import {
  Sparkles,
  CheckCircle2,
  Camera,
  Eye,
  Recycle,
  HelpCircle,
} from "lucide-react";

export const AboutModal: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<WasteCategory>("plastic");

  const categories = Object.keys(WASTE_KNOWLEDGE_BASE) as WasteCategory[];
  const activeKnowledge = WASTE_KNOWLEDGE_BASE[selectedCategory];

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Cute Hero Section */}
      <div className="card-cute p-6 bg-gradient-to-r from-emerald-50 via-teal-50/40 to-white overflow-hidden relative">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative h-28 w-28 md:h-36 md:w-36 shrink-0 rounded-3xl overflow-hidden shadow-md border-2 border-emerald-200 bg-white">
            <Image
              src="/images/cute_eco_mascot.jpg"
              alt="Eco Mascot"
              fill
              sizes="(max-width: 768px) 128px, 160px"
              className="object-cover"
            />
          </div>

          <div className="space-y-2 text-center md:text-left flex-1">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100/90 border border-emerald-200 px-3 py-0.5 text-xs font-extrabold text-emerald-800">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              Smart Recycling Assistant
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              How EcoSort<span className="text-emerald-600">AI</span> Works
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-2xl font-medium">
              EcoSortAI identifies waste items from your photos, shows you visual proof of what it detected, and provides verified disposal guidelines to keep recycling streams clean.
            </p>
          </div>
        </div>
      </div>

      {/* 3 Step Simple Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="card-cute p-4 space-y-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 font-bold">
            <Camera className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-extrabold text-gray-900">1. Instant Recognition</h3>
          <p className="text-xs text-gray-600 leading-relaxed font-medium">
            Examines object shapes, textures, materials, and container types across 10 streams.
          </p>
        </div>

        <div className="card-cute p-4 space-y-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 font-bold">
            <Eye className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-extrabold text-gray-900">2. Visual Verification</h3>
          <p className="text-xs text-gray-600 leading-relaxed font-medium">
            Highlights the exact parts of the item the AI checked so you can trust the result.
          </p>
        </div>

        <div className="card-cute p-4 space-y-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 font-bold">
            <Recycle className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-extrabold text-gray-900">3. Clear Action Plan</h3>
          <p className="text-xs text-gray-600 leading-relaxed font-medium">
            Provides the right bin, simple prep instructions, and nearby drop-off centers.
          </p>
        </div>
      </div>

      {/* Interactive 10 Waste Categories Guide */}
      <div className="card-cute overflow-hidden">
        <div className="card-cute-header">
          <h3 className="text-sm font-extrabold text-gray-900">
            10-Category Waste &amp; Recycling Guide
          </h3>
          <p className="text-xs text-gray-500 font-medium">
            Select any category below to view preparation rules &amp; target bins
          </p>
        </div>

        <div className="p-4 sm:p-5 space-y-4">
          {/* Category Chips */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => {
              const item = WASTE_KNOWLEDGE_BASE[cat];
              const isSel = selectedCategory === cat;
              const chipLabel =
                cat === "shoes"
                  ? "Accessories"
                  : item.name.split(" ")[0];

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all duration-150 capitalize cursor-pointer ${
                    isSel
                      ? "bg-emerald-600 text-white shadow-xs scale-105"
                      : "bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-200/80"
                  }`}
                >
                  {chipLabel}
                </button>
              );
            })}
          </div>

          {/* Active Category Detail */}
          {activeKnowledge && (
            <div className="rounded-2xl bg-emerald-50/60 border border-emerald-200/80 p-4 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wide text-emerald-800">
                    {activeKnowledge.type}
                  </span>
                  <h4 className="text-base font-black text-gray-900">
                    {activeKnowledge.name}
                  </h4>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-extrabold text-emerald-900 border border-emerald-200 shadow-2xs">
                  {activeKnowledge.colorClass.binName}
                </span>
              </div>

              <p className="text-xs text-gray-700 leading-relaxed font-medium">
                {activeKnowledge.summary}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                <div className="bg-white/90 rounded-2xl p-3 border border-emerald-100/90 shadow-2xs">
                  <span className="font-bold text-emerald-900 flex items-center gap-1.5 mb-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Key Prep Step:
                  </span>
                  <p className="text-gray-600 text-xs leading-relaxed font-medium">
                    {activeKnowledge.actions[0]}
                  </p>
                </div>
                <div className="bg-white/90 rounded-2xl p-3 border border-emerald-100/90 shadow-2xs">
                  <span className="font-bold text-emerald-900 flex items-center gap-1.5 mb-1">
                    <HelpCircle className="h-3.5 w-3.5 text-emerald-600" /> Environmental Impact:
                  </span>
                  <p className="text-gray-600 text-xs leading-relaxed font-medium">
                    Prevents {activeKnowledge.environmentalImpact.co2OffsetKg} kg CO₂ eq. emissions
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
