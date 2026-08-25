"use client";

import React, { useRef, useState } from "react";
import { UploadCloud, Camera, RefreshCw, Sparkles, Image as ImageIcon } from "lucide-react";

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

  // Helper to generate a sample canvas image for demo test presets
  const handleQuickDemo = (label: string, primaryColor: string, detail: string) => {
    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background
    ctx.fillStyle = "#f1f5f9";
    ctx.fillRect(0, 0, 400, 400);

    // Vignette / Shadow
    const grad = ctx.createRadialGradient(200, 200, 50, 200, 200, 200);
    grad.addColorStop(0, "rgba(255,255,255,0.8)");
    grad.addColorStop(1, "rgba(203,213,225,0.6)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 400, 400);

    // Object silhouette / shape
    ctx.fillStyle = primaryColor;
    ctx.beginPath();
    ctx.roundRect(100, 90, 200, 220, 24);
    ctx.fill();

    // Inner detail
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 22px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(label.toUpperCase(), 200, 180);

    ctx.font = "14px system-ui, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.fillText(detail, 200, 215);

    ctx.font = "12px system-ui, sans-serif";
    ctx.fillStyle = "#64748b";
    ctx.fillText("EcoSortAI Test Sample", 200, 360);

    canvas.toBlob((blob) => {
      if (blob) {
        const testFile = new File([blob], `sample_${label.toLowerCase()}.png`, {
          type: "image/png",
        });
        onFileSelected(testFile);
      }
    }, "image/png");
  };

  return (
    <div className="w-full">
      {/* Upload Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-300 ${
          isDragOver
            ? "border-emerald-500 bg-emerald-50/70 shadow-lg shadow-emerald-500/10 dark:bg-emerald-950/30"
            : "border-slate-300 bg-white/70 hover:border-emerald-400 hover:bg-slate-50/80 dark:border-slate-700 dark:bg-slate-800/60 dark:hover:border-emerald-500"
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

        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-inner transition-transform group-hover:scale-110 dark:bg-emerald-950 dark:text-emerald-400">
          <UploadCloud className="h-8 w-8" />
        </div>

        <h3 className="mt-4 text-base font-semibold text-slate-800 dark:text-slate-100">
          Upload Waste Item Photo
        </h3>
        <p className="mt-1 max-w-sm text-sm text-slate-700 dark:text-slate-300">
          Drag & drop an image here, or{" "}
          <span className="font-medium text-emerald-600 underline dark:text-emerald-400">
            browse from device / take camera photo
          </span>
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-700 dark:text-slate-300">
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 dark:bg-slate-700">
            <Camera className="h-3.5 w-3.5" /> Mobile Camera Supported
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 dark:bg-slate-700">
            <ImageIcon className="h-3.5 w-3.5" /> JPG, PNG, WEBP
          </span>
        </div>
      </div>

      {/* Quick Demo Test Presets */}
      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 dark:border-slate-800 dark:bg-slate-900/50">
        <div className="mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
            Quick Demo Presets (Instant Model & XAI Test)
          </span>
          {hasResult && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onReset();
              }}
              className="flex items-center gap-1 text-xs font-medium text-rose-600 hover:underline dark:text-rose-400"
            >
              <RefreshCw className="h-3 w-3" /> Clear / Reset
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => handleQuickDemo("Plastic", "#0284c7", "PET Beverage Bottle")}
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-xs hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            🧴 Plastic Bottle
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemo("Battery", "#dc2626", "Lithium Cell / AAA")}
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-xs hover:border-red-400 hover:bg-red-50 hover:text-red-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            🔋 Battery Cell
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemo("Biological", "#16a34a", "Fruit Peel / Food Scrap")}
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-xs hover:border-green-400 hover:bg-green-50 hover:text-green-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            🍎 Organic Apple
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemo("Cardboard", "#d97706", "Shipping Parcel Box")}
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-xs hover:border-amber-400 hover:bg-amber-50 hover:text-amber-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            📦 Cardboard Box
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemo("Glass", "#0891b2", "Glass Condiment Jar")}
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-xs hover:border-cyan-400 hover:bg-cyan-50 hover:text-cyan-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            🫙 Glass Jar
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemo("Metal", "#475569", "Aluminum Soda Can")}
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-xs hover:border-slate-400 hover:bg-slate-100 hover:text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            🥫 Metal Can
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemo("Clothes", "#4f46e5", "Cotton Apparel Shirt")}
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-xs hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            👕 Clothes
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemo("Shoes", "#7c3aed", "Athletic Sneaker Pair")}
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-xs hover:border-violet-400 hover:bg-violet-50 hover:text-violet-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            👟 Shoes
          </button>
        </div>
      </div>
    </div>
  );
};
