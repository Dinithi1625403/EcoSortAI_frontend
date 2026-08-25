"use client";

import { useState, useEffect } from "react";
import { isError, type PredictResponse, type WasteLogEntry, type WasteCategory } from "@/types/waste";
import { WASTE_KNOWLEDGE_BASE } from "@/data/wasteKnowledgeBase";
import { Navbar, NavTab } from "@/components/Navbar";
import { ImageUploader } from "@/components/ImageUploader";
import { ClassificationResult } from "@/components/ClassificationResult";
import { GradCamViewer } from "@/components/GradCamViewer";
import { DisposalGuide } from "@/components/DisposalGuide";
import { LocationFinder } from "@/components/LocationFinder";
import { ImpactDashboard } from "@/components/ImpactDashboard";
import { AboutModal } from "@/components/AboutModal";
import { AlertCircle, Loader2, Sparkles, ArrowRight, ShieldCheck, MapPin } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<NavTab>("classify");
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<PredictResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [savedLogs, setSavedLogs] = useState<WasteLogEntry[]>([]);
  const [isCurrentSaved, setIsCurrentSaved] = useState<boolean>(false);

  // Load persisted history from localStorage on initial render
  useEffect(() => {
    try {
      const stored = localStorage.getItem("ecosort_logs");
      if (stored) {
        setSavedLogs(JSON.parse(stored));
      }
    } catch {
      // Local storage fallback
    }
  }, []);

  // Save logs to localStorage whenever updated
  const saveLogsToStorage = (newLogs: WasteLogEntry[]) => {
    setSavedLogs(newLogs);
    try {
      localStorage.setItem("ecosort_logs", JSON.stringify(newLogs));
    } catch {
      // Ignore storage quota errors
    }
  };

  async function handleFile(file: File): Promise<void> {
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setResult(null);
    setErrorMessage(null);
    setIsCurrentSaved(false);
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
          : "Could not connect to model service. Ensure the backend FastAPI server is running.";
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
    setIsCurrentSaved(false);
  };

  const handleSaveToDashboard = () => {
    if (!result || isError(result) || isCurrentSaved) return;

    const category = (result.sure ? result.label : result.top3[0]?.label || "trash") as WasteCategory;
    const confidence = result.sure ? result.confidence : result.top3[0]?.confidence || 0;
    const knowledge = WASTE_KNOWLEDGE_BASE[category] || WASTE_KNOWLEDGE_BASE.trash;

    const newEntry: WasteLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      category,
      confidence,
      imagePreview: preview || undefined,
      status: "sorted",
      co2SavedKg: knowledge.environmentalImpact.co2OffsetKg,
    };

    const updated = [newEntry, ...savedLogs];
    saveLogsToStorage(updated);
    setIsCurrentSaved(true);
  };

  const handleClearLogs = () => {
    saveLogsToStorage([]);
  };

  const handleUpdateLogStatus = (id: string, status: WasteLogEntry["status"]) => {
    const updated = savedLogs.map((l) => (l.id === id ? { ...l, status } : l));
    saveLogsToStorage(updated);
  };

  const currentCategory: WasteCategory | undefined =
    result && !isError(result)
      ? ((result.sure ? result.label : result.top3[0]?.label) as WasteCategory)
      : undefined;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100 flex flex-col">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={savedLogs.length}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {/* TAB 1: IDENTIFY & SORT (Core Decision Support Flow) */}
        {activeTab === "classify" && (
          <div className="space-y-8 animate-fade-in">
            {/* Hero Subtitle */}
            <div className="text-center">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                <Sparkles className="h-3.5 w-3.5" /> AI-Powered Waste Classification &amp; Explainable Decision Support
              </div>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl text-slate-900 dark:text-white">
                Intelligent Waste Sorting &amp; Action Recommendation
              </h1>
              <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
                Upload or photograph any waste item. The system predicts the category, visually explains the AI reasoning with Grad-CAM saliency heatmaps, prescribes exact disposal actions, and locates local drop-off facilities.
              </p>
            </div>

            {/* Image Upload Zone */}
            <div className="mx-auto max-w-3xl">
              <ImageUploader
                onFileSelected={handleFile}
                loading={loading}
                onReset={handleReset}
                hasResult={!!result || !!preview}
              />
            </div>

            {/* Loading Spinner */}
            {loading && (
              <div className="mx-auto flex max-w-md flex-col items-center justify-center rounded-2xl border border-emerald-200/80 bg-emerald-50/70 p-8 text-center dark:border-emerald-900/50 dark:bg-emerald-950/40">
                <Loader2 className="h-10 w-10 animate-spin text-emerald-600 dark:text-emerald-400" />
                <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                  Executing CNN Inference &amp; Grad-CAM Computation...
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Computing convolutional feature maps, backpropagating gradients, and retrieving disposal protocols.
                </p>
              </div>
            )}

            {/* Error Banner */}
            {errorMessage && (
              <div className="mx-auto flex max-w-3xl items-start gap-3 rounded-2xl border border-rose-300 bg-rose-50 p-5 text-rose-900 dark:border-rose-900/60 dark:bg-rose-950/50 dark:text-rose-200">
                <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
                <div>
                  <h4 className="text-sm font-bold">Prediction Request Failed</h4>
                  <p className="mt-1 text-xs leading-relaxed">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Decision Support Output Suite */}
            {result && !isError(result) && (
              <div className="space-y-8 animate-fade-in">
                {/* 1. AI Result Section */}
                <ClassificationResult
                  result={result}
                  previewUrl={preview}
                  onSaveToDashboard={handleSaveToDashboard}
                  isSaved={isCurrentSaved}
                />

                {/* 2. Explainable AI Section */}
                <GradCamViewer
                  result={result}
                  originalPreview={preview}
                />

                {/* 3. Recommended Disposal Action */}
                {currentCategory && (
                  <DisposalGuide category={currentCategory} />
                )}

                {/* 4. Nearby Disposal Facilities */}
                {currentCategory && (
                  <LocationFinder highlightCategory={currentCategory} />
                )}

                {/* Next Step Call to Action */}
                <div className="flex flex-wrap items-center justify-between rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 p-6 dark:border-emerald-900/50">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
                      <ShieldCheck className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        Track Your Environmental Footprint
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Log this classification session in your Personal Impact Tracker to monitor carbon savings and earn sustainability badges.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab("dashboard")}
                    className="mt-3 flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-600/30 transition-all hover:bg-emerald-700 sm:mt-0"
                  >
                    Open Eco-Tracker <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: NEARBY FACILITIES & DIRECTORY */}
        {activeTab === "locations" && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                <MapPin className="h-3.5 w-3.5" /> Circular Waste Infrastructure
              </div>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl text-slate-900 dark:text-white">
                Verified Waste Disposal &amp; Collection Locator
              </h1>
              <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
                Explore verified e-waste collection points, municipal recycling centers, donation bins, and community composting facilities in your area.
              </p>
            </div>

            <LocationFinder showAllInitially={true} />
          </div>
        )}

        {/* TAB 3: PERSONAL IMPACT DASHBOARD & AUDIT LOG */}
        {activeTab === "dashboard" && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                <Sparkles className="h-3.5 w-3.5" /> Personal Waste Accounting
              </div>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl text-slate-900 dark:text-white">
                Personal Waste Management &amp; Impact Tracker
              </h1>
              <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
                Monitor your cumulative diversion metrics, estimated carbon offset, sustainability badges, and classification history.
              </p>
            </div>

            <ImpactDashboard
              logs={savedLogs}
              onClearLogs={handleClearLogs}
              onUpdateStatus={handleUpdateLogStatus}
            />
          </div>
        )}

        {/* TAB 4: ABOUT & SYSTEM METHODOLOGY */}
        {activeTab === "about" && (
          <div className="animate-fade-in">
            <AboutModal />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white/60 py-6 text-center text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} EcoSortAI — Smart Waste Management Decision Support System Using Explainable AI.</p>
          <div className="flex items-center gap-4 text-xs">
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">Identify → Explain → Recommend → Locate → Track</span>
          </div>
        </div>
      </footer>
    </div>
  );
}