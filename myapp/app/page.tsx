"use client";

import { useState, type ChangeEvent } from "react";
import { isError, type PredictResponse } from "@/types/waste";

export default function Home() {
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<PredictResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showWhy, setShowWhy] = useState<boolean>(false);

  async function handleFile(e: ChangeEvent<HTMLInputElement>): Promise<void> {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setResult(null);
    setShowWhy(false);
    setLoading(true);

    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch("/api/predict", { method: "POST", body: form });
      setResult((await res.json()) as PredictResponse);
    } catch {
      setResult({ error: "Something went wrong. Is the Python server running?" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-bold">EcoSortAI</h1>

      <label className="mt-6 flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-8 hover:border-gray-400">
        <span className="text-gray-600">Tap to choose or take a photo</span>
        <input type="file" accept="image/*" capture="environment"
               onChange={handleFile} className="hidden" />
      </label>

      {preview && <img src={preview} alt="" className="mt-6 w-full rounded-lg" />}
      {loading && <p className="mt-4 text-gray-600">Analyzing...</p>}

      {result && isError(result) && (
        <p className="mt-4 text-red-600">{result.error}</p>
      )}

      {/* Bad photo or genuinely unsure */}
      {result && !isError(result) && !result.sure && (
        <div className="mt-6 rounded-lg bg-amber-50 p-4">
          <h2 className="font-semibold text-amber-900">
            {result.reason_code === "unsure" ? "I am not sure" : "Try another photo"}
          </h2>
          <p className="mt-1 text-amber-800">{result.message}</p>

          {result.tip && (
            <p className="mt-3 rounded bg-white p-3 text-sm">
              <strong>How to tell:</strong> {result.tip}
            </p>
          )}
        </div>
      )}

      {/* Confident answer */}
      {result && !isError(result) && result.sure && (
        <section className="mt-6 space-y-4">
          <div className="rounded-lg bg-green-50 p-4">
            <h2 className="text-xl font-semibold uppercase">{result.label}</h2>
            <p className="text-sm text-gray-600">
              {(result.confidence * 100).toFixed(1)}% confident
            </p>
            <p className="mt-2">{result.advice}</p>
          </div>

          {result.close_call && (
            <div className="rounded-lg bg-amber-50 p-4">
              <p className="text-sm text-amber-900">
                This was close. It could also be <strong>{result.runner_up}</strong>.
              </p>
              {result.tip && (
                <p className="mt-2 text-sm">
                  <strong>How to tell:</strong> {result.tip}
                </p>
              )}
            </div>
          )}

          <button
            onClick={() => setShowWhy(!showWhy)}
            className="w-full rounded-lg border border-gray-300 p-3 text-left text-sm hover:bg-gray-50"
          >
            {showWhy ? "Hide" : "Why did the AI say this?"}
          </button>

          {showWhy && (
            <div className="space-y-3 rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-700">{result.focus_note}</p>

              <img
                src={`data:image/png;base64,${result.heatmap}`}
                alt="heatmap"
                className="w-full rounded-lg"
              />
              <p className="text-xs text-gray-500">
                Red areas are what the AI focused on.
              </p>

              <div>
                <h3 className="text-sm font-semibold">All guesses</h3>
                <ul className="mt-2 space-y-1 text-sm">
                  {result.top3.map((t) => (
                    <li key={t.label} className="flex justify-between">
                      <span>{t.label}</span>
                      <span className="text-gray-500">
                        {(t.confidence * 100).toFixed(1)}%
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </section>
      )}
    </main>
  );
}