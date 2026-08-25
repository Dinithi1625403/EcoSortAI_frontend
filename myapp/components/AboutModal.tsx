"use client";

import React from "react";
import {
  Sparkles,
  Layers,
  BrainCircuit,
  Eye,
  CheckCircle2,
  BookOpen,
  Battery,
  Leaf,
  Package,
  Shirt,
  Wine,
  CircleDot,
  FileText,
  Footprints,
  Trash2,
} from "lucide-react";

export const AboutModal: React.FC = () => {
  const categoryList = [
    { name: "Battery", type: "Hazardous Stream", icon: Battery },
    { name: "Biological", type: "Organic Compost", icon: Leaf },
    { name: "Cardboard", type: "Pulp Recyclable", icon: Package },
    { name: "Clothes", type: "Textile Reusable", icon: Shirt },
    { name: "Glass", type: "Inorganic Recyclable", icon: Wine },
    { name: "Metal", type: "Ferrous / Non-Ferrous", icon: CircleDot },
    { name: "Paper", type: "Cellulose Recyclable", icon: FileText },
    { name: "Plastic", type: "Polymer Recyclable", icon: CircleDot },
    { name: "Shoes", type: "Footwear Reusable", icon: Footprints },
    { name: "Trash", type: "Residual Landfill", icon: Trash2 },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Overview */}
      <div className="rounded-xl border border-slate-200 bg-slate-900 p-8 text-white shadow-xs dark:border-slate-800">
        <div className="inline-flex items-center gap-2 rounded border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-200">
          <Sparkles className="h-3.5 w-3.5" /> University Capstone Architecture
        </div>
        <h2 className="mt-4 text-2xl font-bold tracking-tight">
          Smart Waste Management Decision Support System
        </h2>
        <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-300">
          An integrated computational framework combining Convolutional Neural Networks (CNN),
          Explainable AI (Grad-CAM), Structured Knowledge Engineering, and Geographic Information
          Systems (GIS) to resolve urban waste sorting, cross-contamination, and circular disposal.
        </p>

        {/* Workflow Diagram */}
        <div className="mt-6 flex flex-wrap items-center gap-2 font-mono text-xs">
          <span className="rounded border border-slate-700 bg-slate-800 px-2.5 py-1 text-slate-200">1. Identify (CNN)</span>
          <span className="text-slate-500">&rarr;</span>
          <span className="rounded border border-slate-700 bg-slate-800 px-2.5 py-1 text-slate-200">2. Explain (Grad-CAM)</span>
          <span className="text-slate-500">&rarr;</span>
          <span className="rounded border border-slate-700 bg-slate-800 px-2.5 py-1 text-slate-200">3. Recommend (Protocol)</span>
          <span className="text-slate-500">&rarr;</span>
          <span className="rounded border border-slate-700 bg-slate-800 px-2.5 py-1 text-slate-200">4. Locate (GIS Points)</span>
          <span className="text-slate-500">&rarr;</span>
          <span className="rounded border border-slate-700 bg-slate-800 px-2.5 py-1 text-slate-200">5. Track (Audit)</span>
        </div>
      </div>

      {/* 3 Pillars Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Pillar 1: AI Model */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-9 w-9 items-center justify-center rounded bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200">
            <BrainCircuit className="h-5 w-5" />
          </div>
          <h3 className="mt-4 text-sm font-bold text-slate-900 dark:text-white">
            Convolutional Classification
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            Trained on the Garbage Classification V2 dataset across 10 material classes:
            Battery, Biological, Cardboard, Clothes, Glass, Metal, Paper, Plastic, Shoes, and Trash.
          </p>
          <ul className="mt-4 space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-slate-500" /> Multi-class Softmax Probability
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-slate-500" /> Multi-tier Confidence Thresholding
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-slate-500" /> Runner-up Margin Disambiguation
            </li>
          </ul>
        </div>

        {/* Pillar 2: Explainable AI (XAI) */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-9 w-9 items-center justify-center rounded bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200">
            <Eye className="h-5 w-5" />
          </div>
          <h3 className="mt-4 text-sm font-bold text-slate-900 dark:text-white">
            Explainable AI (Grad-CAM)
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            Gradient-weighted Class Activation Mapping calculates gradients flowing from final
            convolutional feature maps to illuminate spatial decision boundaries.
          </p>
          <ul className="mt-4 space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-slate-500" /> Visual Saliency Feature Heatmaps
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-slate-500" /> Edge &amp; Spread Quality Indexing
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-slate-500" /> Transparent Model Auditing
            </li>
          </ul>
        </div>

        {/* Pillar 3: Decision Engine */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-9 w-9 items-center justify-center rounded bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200">
            <BookOpen className="h-5 w-5" />
          </div>
          <h3 className="mt-4 text-sm font-bold text-slate-900 dark:text-white">
            Decision Support System
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            Translates probabilistic predictions into civic actions: color-coded bin assignments,
            step-by-step preparation protocols, contamination prevention, and GIS locator.
          </p>
          <ul className="mt-4 space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-slate-500" /> 10 Structured Knowledge Models
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-slate-500" /> OpenStreetMap GIS Facility Query
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-slate-500" /> Carbon Offset &amp; Audit Logger
            </li>
          </ul>
        </div>
      </div>

      {/* 10 Supported Categories Reference Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-200 bg-slate-50/80 px-6 py-3.5 dark:border-slate-800 dark:bg-slate-800/40">
          <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
            <Layers className="h-4 w-4 text-slate-600" />
            10 Supported Waste Classification Categories
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-3 p-6 sm:grid-cols-5 text-xs">
          {categoryList.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.name}
                className="rounded-lg border border-slate-200 bg-slate-50/60 p-3.5 text-center dark:border-slate-800 dark:bg-slate-800/40"
              >
                <div className="mx-auto flex h-8 w-8 items-center justify-center rounded bg-white text-slate-700 shadow-xs dark:bg-slate-700 dark:text-slate-200">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="mt-2 font-bold text-slate-900 dark:text-white">{cat.name}</div>
                <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400">{cat.type}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
