"use client";

import React from "react";
import {
  Sparkles,
  Layers,
  BrainCircuit,
  Eye,
  CheckCircle2,
  BookOpen,
} from "lucide-react";

export const AboutModal: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Hero Overview */}
      <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-r from-emerald-900 to-slate-900 p-8 text-white shadow-xl dark:border-slate-800">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300 backdrop-blur-xs">
          <Sparkles className="h-3.5 w-3.5" /> University Capstone Project Architecture
        </div>
        <h2 className="mt-4 text-3xl font-extrabold tracking-tight">
          Smart Waste Management Decision Support System
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300">
          An integrated intelligent system combining Convolutional Neural Networks (CNN),
          Explainable AI (Grad-CAM), Structured Knowledge Engineering, and Geographic Decision Support
          to address urban waste sorting, cross-contamination, and circular recycling.
        </p>

        {/* Workflow Diagram */}
        <div className="mt-6 flex flex-wrap items-center gap-2 text-xs font-bold">
          <span className="rounded-lg bg-emerald-600 px-3 py-1.5 shadow-sm">1. Identify (CNN)</span>
          <span className="text-slate-400">→</span>
          <span className="rounded-lg bg-teal-600 px-3 py-1.5 shadow-sm">2. Explain (Grad-CAM)</span>
          <span className="text-slate-400">→</span>
          <span className="rounded-lg bg-indigo-600 px-3 py-1.5 shadow-sm">3. Recommend (Action Guide)</span>
          <span className="text-slate-400">→</span>
          <span className="rounded-lg bg-purple-600 px-3 py-1.5 shadow-sm">4. Locate (Facilities)</span>
          <span className="text-slate-400">→</span>
          <span className="rounded-lg bg-amber-600 px-3 py-1.5 shadow-sm">5. Track (Impact Audit)</span>
        </div>
      </div>

      {/* 3 Pillars Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Pillar 1: AI Model */}
        <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
            <BrainCircuit className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
            CNN Waste Classification
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
            Trained on the comprehensive Garbage Classification V2 dataset spanning 10 distinct
            material classes: Battery, Biological, Cardboard, Clothes, Glass, Metal, Paper, Plastic,
            Shoes, and Residual Trash.
          </p>
          <ul className="mt-4 space-y-1 text-xs text-slate-700 dark:text-slate-300">
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Multi-class Softmax Probability
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Multi-tier Confidence Thresholding
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Close-call Runner-up Disambiguation
            </li>
          </ul>
        </div>

        {/* Pillar 2: Explainable AI (XAI) */}
        <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-600 dark:bg-teal-950 dark:text-teal-400">
            <Eye className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
            Explainable AI (Grad-CAM)
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
            Gradient-weighted Class Activation Mapping computes the gradient of the winning class score
            with respect to feature activation maps of the final convolutional layer.
          </p>
          <ul className="mt-4 space-y-1 text-xs text-slate-700 dark:text-slate-300">
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-teal-500" /> Visual Saliency Jet Heatmaps
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-teal-500" /> Edge & Background Spread Auditing
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-teal-500" /> Trustworthy Decision Verification
            </li>
          </ul>
        </div>

        {/* Pillar 3: Decision Engine */}
        <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
            <BookOpen className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
            Actionable Decision Engine
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
            Transforms raw ML logits into concrete civic actions: color-coded bin assignments, step-by-step
            preparation procedures, hazardous material handling warnings, and local drop-off routing.
          </p>
          <ul className="mt-4 space-y-1 text-xs text-slate-700 dark:text-slate-300">
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-indigo-500" /> 10 Structured Knowledge Item Models
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-indigo-500" /> Verified Geolocation Directory
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-indigo-500" /> Carbon Avoidance & Audit Tracker
            </li>
          </ul>
        </div>
      </div>

      {/* 10 Supported Categories Reference Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm dark:border-slate-800 dark:bg-slate-900/90">
        <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-4 dark:border-slate-800/80 dark:bg-slate-800/50">
          <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-100">
            <Layers className="h-4 w-4 text-emerald-600" />
            10 Supported Waste Classification Categories
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-3 p-6 sm:grid-cols-5 text-xs">
          {[
            { name: "Battery", type: "Hazardous", icon: "🔋", color: "text-red-600" },
            { name: "Biological", type: "Organic", icon: "🍎", color: "text-green-600" },
            { name: "Cardboard", type: "Recyclable", icon: "📦", color: "text-amber-700" },
            { name: "Clothes", type: "Textiles", icon: "👕", color: "text-indigo-600" },
            { name: "Glass", type: "Recyclable", icon: "🫙", color: "text-cyan-600" },
            { name: "Metal", type: "Recyclable", icon: "🥫", color: "text-slate-600" },
            { name: "Paper", type: "Recyclable", icon: "📄", color: "text-blue-600" },
            { name: "Plastic", type: "Recyclable", icon: "🧴", color: "text-yellow-600" },
            { name: "Shoes", type: "Donation", icon: "👟", color: "text-purple-600" },
            { name: "Trash", type: "Landfill", icon: "🗑️", color: "text-neutral-700" },
          ].map((cat) => (
            <div
              key={cat.name}
              className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 text-center dark:border-slate-800 dark:bg-slate-800/40"
            >
              <div className="text-2xl">{cat.icon}</div>
              <div className="mt-1 font-bold text-slate-800 dark:text-slate-200">{cat.name}</div>
              <div className={`text-[10px] font-semibold uppercase ${cat.color}`}>{cat.type}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
