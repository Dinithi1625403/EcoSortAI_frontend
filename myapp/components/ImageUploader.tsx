"use client";

import React, { useRef, useState } from "react";
import { Upload, Camera, Image as ImageIcon, Sparkles, RefreshCw } from "lucide-react";

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
  const handleDragLeave = () => setIsDragOver(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) onFileSelected(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelected(file);
  };

  // Quick sample generator for user testing without needing files on their disk
  const handleSampleSelect = async (sampleName: string, label: string) => {
    // Generate a simple colored canvas image as a test sample
    const canvas = document.createElement("canvas");
    canvas.width = 300;
    canvas.height = 300;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Draw background
      ctx.fillStyle = sampleName === "bottle" ? "#e0f2fe" : sampleName === "apple" ? "#fef2f2" : "#fefce8";
      ctx.fillRect(0, 0, 300, 300);
      
      // Draw subtle item representation
      ctx.fillStyle = sampleName === "bottle" ? "#0284c7" : sampleName === "apple" ? "#dc2626" : "#ca8a04";
      ctx.beginPath();
      ctx.arc(150, 150, 80, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 24px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(label, 150, 155);

      canvas.toBlob((blob) => {
        if (blob) {
          const sampleFile = new File([blob], `${sampleName}_sample.png`, { type: "image/png" });
          onFileSelected(sampleFile);
        }
      });
    }
  };

  return (
    <div className="w-full space-y-3">
      {/* Upload Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed p-6 sm:p-8 text-center transition-all duration-200 ${
          isDragOver
            ? "border-emerald-500 bg-emerald-50/80 scale-[1.01]"
            : "border-emerald-200/90 bg-white/90 hover:border-emerald-400 hover:bg-emerald-50/30 hover:shadow-md hover:shadow-emerald-500/5"
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

        {/* Cute Icon Badge */}
        <div className="relative mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100/80 text-emerald-600 shadow-inner group-hover:scale-105 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-200">
          <Upload className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-white">
            <Sparkles className="h-2.5 w-2.5" />
          </span>
        </div>

        <p className="text-base font-bold text-gray-800 tracking-tight">
          Drop your waste photo here, or <span className="text-emerald-600 underline decoration-emerald-300 underline-offset-2">browse</span>
        </p>
        <p className="mt-1 text-xs text-gray-500 max-w-sm">
          Snap a bottle, battery, paper, food scraps, or electronic waste for instant AI sorting
        </p>

        {/* Feature Badges */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] font-medium text-emerald-800">
          <span className="flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200/80 px-3 py-1">
            <Camera className="h-3 w-3 text-emerald-600" /> Camera &amp; Gallery
          </span>
          <span className="flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200/80 px-3 py-1">
            <ImageIcon className="h-3 w-3 text-emerald-600" /> JPG, PNG, WEBP
          </span>
          <span className="flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200/80 px-3 py-1">
            <Sparkles className="h-3 w-3 text-emerald-600" /> Instant Grad-CAM XAI
          </span>
        </div>
      </div>

      {/* Re-upload / Reset Pill */}
      {hasResult && (
        <div className="flex justify-center pt-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onReset();
            }}
            className="flex items-center gap-1.5 rounded-full bg-white border border-emerald-200 px-4 py-1.5 text-xs font-semibold text-emerald-800 shadow-xs hover:bg-emerald-50 hover:border-emerald-300 transition-all active:scale-95"
          >
            <RefreshCw className="h-3.5 w-3.5 text-emerald-600" /> Analyze Another Item
          </button>
        </div>
      )}
    </div>
  );
};
