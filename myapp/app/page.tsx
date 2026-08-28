"use client";

import { useState } from "react";
import Image from "next/image";
import {
  isError,
  type PredictResponse,
  type SureResult,
  type UnsureResult,
  type WasteCategory,
} from "@/types/waste";
import { Navbar, NavTab } from "@/components/Navbar";
import { ImageUploader } from "@/components/ImageUploader";
import { ClassificationResult } from "@/components/ClassificationResult";
import { GradCamViewer } from "@/components/GradCamViewer";
import { DisposalGuide } from "@/components/DisposalGuide";
import { LocationFinder } from "@/components/LocationFinder";
import { AboutModal } from "@/components/AboutModal";
import { AlertCircle, Loader2, Sparkles, MapPin, ArrowRight } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<NavTab>("classify");
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<PredictResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleFile(file: File): Promise<void> {
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setResult(null);
    setErrorMessage(null);
    setLoading(true);

    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch("/api/predict", { method: "POST", body: form });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `Server returned error status ${res.status}`);
      }
      const data = (await res.json()) as PredictResponse;
      setResult(data);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Could not connect to model backend. Ensure FastAPI server is running.";
      setErrorMessage(msg);
      setResult({ error: msg });
    } finally {
      setLoading(false);
    }
  }

  const handleReset = () => {
    setPreview(null);
    setResult(null);
    setErrorMessage(null);
  };

  const currentCategory: WasteCategory | undefined =
    result && !isError(result)
      ? ((result.sure ? result.label : result.top3[0]?.label) as WasteCategory)
      : undefined;

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Frosted Glass Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 sm:px-6 py-6 sm:py-8">
        {/* ───────── TAB 1: CLASSIFY & EXPLAIN (Decision Support) ───────── */}
        {activeTab === "classify" && (
          <div className="space-y-6 animate-fade-in">
            {/* HERO BANNER */}
            {!result && (
              <div className="card-cute overflow-hidden p-6 sm:p-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  {/* Left Hero Text */}
                  <div className="md:col-span-7 space-y-3 text-center md:text-left">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100/90 border border-emerald-200 px-3 py-1 text-xs font-extrabold text-emerald-800">
                      <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                      🇱🇰 Sri Lanka CEA Waste Standard
                    </div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-gray-900 leading-tight">
                      Sort waste with confidence in <span className="text-emerald-600">Sri Lanka</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-700 max-w-xl leading-relaxed font-medium">
                      Take a quick photo of any household item. EcoSortAI identifies the material and tells you the exact bin according to <strong>Central Environmental Authority (CEA)</strong> guidelines and local municipal collection schedules.
                    </p>

                    <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-2 text-[11px] font-bold text-emerald-900">
                      <span className="rounded-full bg-white/95 border border-emerald-200 px-3 py-1 shadow-2xs">
                        🌿 CEA 10 Waste Streams
                      </span>
                      <span className="rounded-full bg-white/95 border border-emerald-200 px-3 py-1 shadow-2xs">
                        💡 1-Second Prep Rules
                      </span>
                      <span className="rounded-full bg-white/95 border border-emerald-200 px-3 py-1 shadow-2xs">
                        📍 Local Drop-off Hubs
                      </span>
                    </div>
                  </div>

                  {/* Right Cute Graphic */}
                  <div className="md:col-span-5 flex justify-center">
                    <div className="relative w-full max-w-[320px] aspect-[16/10] rounded-3xl overflow-hidden shadow-lg border-2 border-emerald-200 bg-white">
                      <Image
                        src="/images/eco_hero_banner.jpg"
                        alt="Eco Sorting Illustration"
                        fill
                        sizes="(max-width: 768px) 100vw, 320px"
                        className="object-cover"
                        priority
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* UPLOADER COMPONENT */}
            {!result && (
              <div className="max-w-2xl mx-auto">
                <ImageUploader
                  onFileSelected={handleFile}
                  loading={loading}
                  onReset={handleReset}
                  hasResult={!!result || !!preview}
                />
              </div>
            )}

            {/* LOADING STATE */}
            {loading && (
              <div className="card-cute mx-auto max-w-md p-8 text-center space-y-3">
                <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                  <Loader2 className="h-7 w-7 animate-spin" />
                </div>
                <h3 className="text-base font-extrabold text-gray-800">
                  Identifying your item...
                </h3>
                <p className="text-xs text-gray-600 font-medium">
                  Inspecting material features to find the right bin &amp; guidelines
                </p>
              </div>
            )}

            {/* ERROR BANNER */}
            {errorMessage && (
              <div className="mx-auto max-w-2xl flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50/90 p-4">
                <AlertCircle className="h-5 w-5 shrink-0 text-rose-500 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-rose-900">Inference Request Notice</h4>
                  <p className="mt-0.5 text-xs text-rose-700">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* ───────── RESULT DASHBOARD (2-COLUMN COMPACT LAYOUT) ───────── */}
            {result && !isError(result) && (
              <div className="space-y-4 animate-fade-in">
                {/* Action Bar with New Scan Button */}
                <div className="flex items-center justify-between card-cute px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-extrabold text-emerald-950">
                      ✓ Item Ready to Sort
                    </span>
                  </div>
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 px-4 py-1.5 text-xs font-bold text-white shadow-xs transition-all active:scale-95 cursor-pointer"
                  >
                    + Scan Another Item
                  </button>
                </div>

                {/* 2-Column Split View */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                  {/* LEFT COLUMN: AI Classification + Grad-CAM Heatmap */}
                  <div className="lg:col-span-6 space-y-4">
                    <ClassificationResult
                      result={result as SureResult | UnsureResult}
                      previewUrl={preview}
                    />

                    <GradCamViewer
                      result={result}
                      originalPreview={preview}
                    />
                  </div>

                  {/* RIGHT COLUMN: Disposal Protocol + Nearby Drop-off Shortcut */}
                  <div className="lg:col-span-6 space-y-4">
                    {currentCategory && <DisposalGuide category={currentCategory} />}

                    {/* Quick Drop-off Finder Card */}
                    <div className="card-cute p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                          <MapPin className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-gray-900">
                            Need a dedicated drop-off point?
                          </h4>
                          <p className="text-[11px] text-gray-500">
                            Find verified e-waste depots, battery bins &amp; recycling hubs
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveTab("locations")}
                        className="flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-white border border-emerald-200 px-3 py-1.5 rounded-full shadow-2xs shrink-0 hover:bg-emerald-50 transition-colors cursor-pointer"
                      >
                        Find on Map <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ───────── TAB 2: LOCATIONS (Drop-off locator) ───────── */}
        {activeTab === "locations" && <LocationFinder />}

        {/* ───────── TAB 3: ABOUT & GUIDE (Knowledge Encyclopedia) ───────── */}
        {activeTab === "about" && <AboutModal />}
      </main>

      {/* Clean Cute Frosted Footer */}
      <footer className="mt-auto border-t border-emerald-100/80 bg-white/75 backdrop-blur-md py-4 text-center">
        <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-600">
          <div className="flex items-center gap-1.5 font-bold text-emerald-900">
            <span>EcoSortAI</span>
            <span className="text-gray-300">•</span>
            <span className="font-semibold text-gray-600">Smart Waste &amp; Recycling Assistant</span>
          </div>
          <p className="text-[11px] text-gray-500 font-medium">
            Snap photo → See the right bin → Follow quick prep guide
          </p>
        </div>
      </footer>
    </div>
  );
}