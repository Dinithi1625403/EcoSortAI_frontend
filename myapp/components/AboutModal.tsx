"use client";

import React, { useState } from "react";
import Image from "next/image";
import { WASTE_KNOWLEDGE_BASE } from "@/data/wasteKnowledgeBase";
import { WasteCategory } from "@/types/waste";
import {
  Sparkles,
  Layers,
  CheckCircle2,
  Cpu,
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
          <div className="relative h-32 w-32 md:h-40 md:w-40 shrink-0 rounded-3xl overflow-hidden shadow-md border-2 border-emerald-200">
            <Image
              src="/images/cute_eco_mascot.jpg"
              alt="Eco Mascot"
              fill
              sizes="(max-width: 768px) 128px, 160px"
              className="object-cover"
            />
          </div>

          <div className="space-y-2 text-center md:text-left flex-1">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 px-3 py-0.5 text-xs font-extrabold text-emerald-800">
              <Sparkles className="h-3 w-3" /> Explainable Decision Support System
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
              Meet EcoSort<span className="text-emerald-600">AI</span> Assistant
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-2xl">
              EcoSortAI uses a Convolutional Neural Network (CNN) trained on thousands of waste items paired with <strong>Grad-CAM Explainable AI</strong> to demystify how predictions are formed and guide users on responsible disposal.
            </p>
          </div>
        </div>
      </div>

      {/* 3 Step Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="card-cute p-4 space-y-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 font-bold">
            <Cpu className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-gray-900">1. Visual Feature Extraction</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Deep convolutional filters examine shape, edge reflectivity, texture, and container contours across 10 classes.
          </p>
        </div>

        <div className="card-cute p-4 space-y-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 font-bold">
            <Eye className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-gray-900">2. Grad-CAM Attribution</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Gradients flow back to spatial activation layers to render glowing saliency heatmaps on the original image.
          </p>
        </div>

        <div className="card-cute p-4 space-y-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 font-bold">
            <Recycle className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-gray-900">3. Protocol Advisory</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Prescribes validated disposal streams, safety preparation, and links to verified nearby drop-offs.
          </p>
        </div>
      </div>

      {/* Interactive 10 Waste Categories Guide */}
      <div className="card-cute overflow-hidden">
        <div className="card-cute-header">
          <h3 className="text-sm font-bold text-gray-900">Interactive 10-Category Waste Encyclopedia</h3>
          <p className="text-xs text-gray-500">Click any category chip below to inspect disposal rules</p>
        </div>

        <div className="p-4 sm:p-5 space-y-4">
          {/* Category Chips */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => {
              const item = WASTE_KNOWLEDGE_BASE[cat];
              const isSel = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-3 py-1 text-xs font-bold transition-all duration-150 capitalize ${
                    isSel
                      ? "bg-emerald-600 text-white shadow-xs scale-105"
                      : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-100"
                  }`}
                >
                  {item.name.split(" ")[0]}
                </button>
              );
            })}
          </div>

          {/* Active Category Detail */}
          {activeKnowledge && (
            <div className="rounded-2xl bg-emerald-50/60 border border-emerald-200/70 p-4 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wide text-emerald-700">
                    {activeKnowledge.type}
                  </span>
                  <h4 className="text-base font-extrabold text-gray-900">
                    {activeKnowledge.name}
                  </h4>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-extrabold text-emerald-800 border border-emerald-200 shadow-2xs">
                  {activeKnowledge.colorClass.binName}
                </span>
              </div>

              <p className="text-xs text-gray-700 leading-relaxed">
                {activeKnowledge.summary}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                <div className="bg-white/80 rounded-xl p-2.5 border border-emerald-100">
                  <span className="font-bold text-emerald-800 flex items-center gap-1 mb-1">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Key Action:
                  </span>
                  <p className="text-gray-600 text-[11px] leading-relaxed">
                    {activeKnowledge.actions[0]}
                  </p>
                </div>
                <div className="bg-white/80 rounded-xl p-2.5 border border-emerald-100">
                  <span className="font-bold text-emerald-800 flex items-center gap-1 mb-1">
                    <HelpCircle className="h-3 w-3 text-emerald-600" /> Eco Impact:
                  </span>
                  <p className="text-gray-600 text-[11px] leading-relaxed">
                    Avoids {activeKnowledge.environmentalImpact.co2OffsetKg} kg CO₂ eq.
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
