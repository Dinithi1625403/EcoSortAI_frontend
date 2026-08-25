"use client";

import { useState, type ChangeEvent } from "react";
import { isError, type PredictResponse } from "@/types/waste";

export default function Home() {
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<PredictResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  async function handleFile(e: ChangeEvent<HTMLInputElement>): Promise<void> {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setResult(null);
    setLoading(true);

    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch("/api/predict", { method: "POST", body: form });
      const data = (await res.json()) as PredictResponse;
      setResult(data);
    } catch {
      setResult({ error: "Something went wrong. Is the Python server running?" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="text-2xl font-bold">Waste Sorter</h1>
      <p className="mt-1 text-sm text-gray-500">
        Upload a photo and see what the AI looked at.
      </p>

      <label className="mt-6 flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-8 hover:border-gray-400">
        <span className="text-gray-600">Tap to choose or take a photo</span>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFile}
          className="hidden"
        />
      </label>

      {preview && <img src={preview} alt="" className="mt-6 w-full rounded-lg" />}

      {loading && <p className="mt-4 text-gray-600">Analyzing...</p>}

      {result && isError(result) && (
        <p className="mt-4 text-red-600">{result.error}</p>
      )}

      {result && !isError(result) && !result.sure && (
        <p className="mt-4 text-amber-700">{result.message}</p>
      )}

      {result && !isError(result) && result.sure && (
        <section className="mt-6 space-y-4">
          <div className="rounded-lg bg-green-50 p-4">
            <h2 className="text-xl font-semibold uppercase">{result.label}</h2>
            <p className="text-sm text-gray-600">
              {(result.confidence * 100).toFixed(1)}% confident
            </p>
            <p className="mt-2">{result.advice}</p>
          </div>

          <div>
            <h3 className="font-semibold">Why the AI thinks so</h3>
            <img
              src={`data:image/png;base64,${result.heatmap}`}
              alt="heatmap"
              className="mt-2 w-full rounded-lg"
            />
            <p className="mt-1 text-xs text-gray-500">
              Red areas are what the AI focused on.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">Other guesses</h3>
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
        </section>
      )}
    </main>
  );
}