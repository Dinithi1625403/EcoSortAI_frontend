"use client";

import React, { useRef, useState } from "react";
import {
  Upload,
  Camera,
  RotateCcw,
  Sparkles,
  FileImage,
  Battery,
  Leaf,
  Package,
  Shirt,
  Wine,
  Footprints,
  Trash2,
  CircleDot,
  FileText,
} from "lucide-react";

interface ImageUploaderProps {
  onFileSelected: (file: File) => void;
  loading: boolean;
  onReset: () => void;
  hasResult: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onFileSelected,
  loading,
  onReset,
  hasResult,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      onFileSelected(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelected(file);
    }
  };

  // Helper to generate benchmark canvas images for quick evaluator testing
  const handleQuickDemo = (label: string, primaryColor: string, detail: string) => {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 400;
      canvas.height = 400;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Background
      ctx.fillStyle = "#f8fafc";
      ctx.fillRect(0, 0, 400, 400);

      // Gradient
      const grad = ctx.createRadialGradient(200, 200, 40, 200, 200, 220);
      grad.addColorStop(0, "#ffffff");
      grad.addColorStop(1, "#cbd5e1");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 400, 400);

      // Object box
      ctx.fillStyle = primaryColor;
      ctx.fillRect(80, 80, 240, 240);

      // Inner box
      ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
      ctx.fillRect(90, 90, 220, 220);

      // Typography
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 24px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label.toUpperCase(), 200, 180);

      ctx.font = "14px sans-serif";
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.fillText(detail, 200, 220);

      ctx.font = "12px sans-serif";
      ctx.fillStyle = "#475569";
      ctx.fillText("EcoSortAI Test Benchmark Sample", 200, 360);

      canvas.toBlob((blob) => {
        if (blob) {
          const testFile = new File([blob], `sample_${label.toLowerCase()}.jpg`, {
            type: "image/jpeg",
          });
          onFileSelected(testFile);
        }
      }, "image/jpeg", 0.9);
    } catch (e) {
      console.error("Demo generation failed", e);
    }
  };

  const demoPresets = [
    { label: "Plastic", name: "Plastic Bottle", color: "#0284c7", detail: "PET Container", icon: CircleDot },
    { label: "Battery", name: "Battery Cell", color: "#dc2626", detail: "Lithium / AAA", icon: Battery },
    { label: "Biological", name: "Organic Waste", color: "#16a34a", detail: "Food Scrap / Fruit", icon: Leaf },
    { label: "Cardboard", name: "Cardboard Box", color: "#d97706", detail: "Corrugated Carton", icon: Package },
    { label: "Glass", name: "Glass Jar", color: "#0891b2", detail: "Glass Container", icon: Wine },
    { label: "Metal", name: "Metal Can", color: "#475569", detail: "Aluminum / Steel", icon: CircleDot },
    { label: "Clothes", name: "Textiles", color: "#4f46e5", detail: "Cotton Apparel", icon: Shirt },
    { label: "Shoes", name: "Footwear", color: "#7c3aed", detail: "Athletic Shoes", icon: Footprints },
  ];

  return (
    <div className="w-full space-y-4">
      {/* Upload Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-all ${
          isDragOver
            ? "border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20"
            : "border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50/50 dark:border-slate-700 dark:bg-slate-900/80 dark:hover:border-slate-600"
        } ${loading ? "pointer-events-none opacity-60" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          <Upload className="h-6 w-6" />
        </div>

        <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
          Upload Waste Item for Inference
        </h3>
        <p className="mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
          Drag and drop an image file here, or{" "}
          <span className="font-semibold text-emerald-700 dark:text-emerald-400">
            browse from local files or capture via device camera
          </span>
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1 rounded border border-slate-200 bg-slate-50 px-2 py-0.5 dark:border-slate-800 dark:bg-slate-800">
            <Camera className="h-3 w-3" /> Camera Enabled
          </span>
          <span className="inline-flex items-center gap-1 rounded border border-slate-200 bg-slate-50 px-2 py-0.5 dark:border-slate-800 dark:bg-slate-800">
            <FileImage className="h-3 w-3" /> JPEG, PNG, WEBP
          </span>
        </div>
      </div>

      {/* Benchmark Presets Toolbar */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/80">
        <div className="mb-2.5 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            <Sparkles className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400" />
            Evaluation Test Presets (Instant Model &amp; XAI Benchmark)
          </span>
          {hasResult && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onReset();
              }}
              className="flex items-center gap-1 text-xs font-semibold text-rose-700 hover:underline dark:text-rose-400"
            >
              <RotateCcw className="h-3 w-3" /> Clear Image
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {demoPresets.map((preset) => {
            const Icon = preset.icon;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => handleQuickDemo(preset.label, preset.color, preset.detail)}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-left text-xs font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <Icon className="h-4 w-4 shrink-0 text-slate-600 dark:text-slate-400" />
                <span className="truncate">{preset.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
