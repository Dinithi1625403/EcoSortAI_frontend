"use client";
import { useState } from "react";

export default function Home() {
  // 1. The Website's Memory (Short-term memory)
  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [xaiHeatmap, setXaiHeatmap] = useState<string | null>(null); // <--- New state for XAI image!
  const [loading, setLoading] = useState(false);

  // 2. When the user selects a picture
  const handleFileChange = (e: any) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setImage(URL.createObjectURL(selected)); // Create a temporary link to show the picture
      setResult(null); // Clear the old answer
      setXaiHeatmap(null); // Clear the old XAI picture!
    }
  };

  // 3. When the user clicks "Ask the AI!"
  const handlePredict = async () => {
    if (!file) return;
    setLoading(true);

    // Pack the picture into a digital envelope
    const formData = new FormData();
    formData.append("file", file);

    try {
      // Send the envelope to the Python Backend Kitchen (Port 5000)
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      
      // Update memory with all the new info!
      setResult(data); 
      setXaiHeatmap(data.xai_image); // <--- Save the Base64 picture string into memory!
      
    } catch (error) {
      console.log("Connection error!");
      setResult({ error: "The website couldn't reach the AI! We need to fix the door!" });
    }
    setLoading(false);
  };

  // 4. Drawing the actual Screen
  return (
    <main className="min-h-screen bg-green-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center border-t-8 border-green-500">
        <h1 className="text-3xl font-bold text-green-700 mb-2">♻️Waste Sorter</h1>
        <p className="text-gray-500 mb-6">Upload a picture of garbage to get AI advice!</p>

        {/* The Upload Button */}
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
          className="mb-4 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-100 file:text-green-700 hover:file:bg-green-200 cursor-pointer" 
        />

        {/* Show the Picture - we'll show it side-by-side with the XAI one */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {image && (
            <div>
                <img src={image} alt="Original" className="w-full h-36 object-cover rounded-xl shadow-md" />
                <p className="text-xs text-gray-500 mt-1">Your Photo</p>
            </div>
          )}

          {/* --- UPGRADE: SHOW THE XAI DETECTIVE picture! 🕵️‍♀️ --- */}
          {xaiHeatmap && (
             <div>
                 {/* This img tag is special. Its src starts with 'data:image/jpg;base64,' to tell the browser how to read the Base64 string. */}
                <img 
                    src={`data:image/jpg;base64,${xaiHeatmap}`} 
                    alt="Where the AI Looked" 
                    className="w-full h-36 object-cover rounded-xl shadow-md border-2 border-red-300"
                />
                <p className="text-xs text-red-500 mt-1">Where the AI Looked</p>
             </div>
          )}
        </div>

        {/* The Magic Button */}
        <button 
          onClick={handlePredict} 
          disabled={!file || loading} 
          className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 disabled:bg-gray-300 transition-all"
        >
          {loading ? "Thinking... 🧠" : "Ask the AI!"}
        </button>

        {/* The Answer Box */}
        {result && result.class && (
          <div className="mt-6 p-5 bg-green-100 rounded-xl border border-green-200">
            <h2 className="text-2xl font-bold text-green-800 uppercase tracking-wide">
              {result.class} <span className="text-sm text-green-600">({result.confidence.toFixed(1)}%)</span>
            </h2>
            <p className="text-green-900 mt-2 font-medium">{result.advice}</p>
          </div>
        )}

        {/* The Error Box */}
        {result && result.error && (
          <div className="mt-6 p-4 bg-red-100 rounded-xl border border-red-200">
            <p className="text-red-900 font-bold">⚠️ {result.error}</p>
          </div>
        )}
      </div>
    </main>
  );
}