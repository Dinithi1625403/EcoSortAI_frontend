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
    <div className="min-h-screen bg-slate-50/50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans">
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
            {/* Header Title Section */}
            <div className="text-center">
              <div className="inline-flex items-center gap-1.5 rounded border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                AI Inference &amp; Explainable Decision Support Engine
              </div>
              <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl text-slate-900 dark:text-white">
                Intelligent Waste Stream Classification &amp; Protocol Advisory
              </h1>
              <p className="mx-auto mt-2 max-w-2xl text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                Upload or capture any waste material. The neural network predicts the stream category,
                provides Grad-CAM visual feature attribution, prescribes standard disposal protocols, and locates
                open GIS collection nodes.
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
              <div className="mx-auto flex max-w-md flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-8 text-center shadow-xs dark:border-slate-800 dark:bg-slate-900">
                <Loader2 className="h-8 w-8 animate-spin text-slate-700 dark:text-slate-300" />
                <h3 className="mt-4 text-sm font-bold text-slate-900 dark:text-white">
                  Executing CNN Inference &amp; Grad-CAM Computation...
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Calculating convolutional activation tensors and retrieving protocol models.
                </p>
              </div>
            )}

            {/* Error Banner */}
            {errorMessage && (
              <div className="mx-auto flex max-w-3xl items-start gap-3 rounded-xl border border-rose-200 bg-rose-50/70 p-4 text-rose-950 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200">
                <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider">Inference Request Error</h4>
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
                <div className="flex flex-wrap items-center justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white dark:bg-emerald-600">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        Log Record in Environmental Audit Trail
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Record this verified classification session in your personal waste accounting dashboard to track carbon savings.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab("dashboard")}
                    className="mt-3 flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-xs transition-colors hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 sm:mt-0"
                  >
                    Open Audit Dashboard <ArrowRight className="h-3.5 w-3.5" />
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
              <div className="inline-flex items-center gap-1.5 rounded border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                <MapPin className="h-3.5 w-3.5" /> Geographic Information System
              </div>
              <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl text-slate-900 dark:text-white">
                Disposal Infrastructure &amp; Collection Point Locator
              </h1>
              <p className="mx-auto mt-2 max-w-2xl text-xs text-slate-500 dark:text-slate-400">
                Query verified e-waste collection points, municipal recycling centers, donation boxes, and organic composting drop-offs.
              </p>
            </div>

            <LocationFinder showAllInitially={true} />
          </div>
        )}

        {/* TAB 3: PERSONAL IMPACT DASHBOARD & AUDIT LOG */}
        {activeTab === "dashboard" && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <div className="inline-flex items-center gap-1.5 rounded border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                <Sparkles className="h-3.5 w-3.5" /> Personal Waste Accounting
              </div>
              <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl text-slate-900 dark:text-white">
                Personal Waste Management &amp; Impact Tracker
              </h1>
              <p className="mx-auto mt-2 max-w-2xl text-xs text-slate-500 dark:text-slate-400">
                Monitor cumulative diversion metrics, estimated carbon abatement, compliance milestones, and audit history.
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
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} EcoSortAI — Smart Waste Management Decision Support System Using Explainable AI.</p>
          <div className="flex items-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-300">
            <span>Identify &rarr; Explain &rarr; Recommend &rarr; Locate &rarr; Track</span>
          </div>
        </div>
      </footer>
    </div>
  );
}