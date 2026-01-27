import { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

export function PitchGenerator() {
  const [loading, setLoading] = useState(false);
  const [brand, setBrand] = useState('');
  const [platform, setPlatform] = useState('Instagram');
  const [tone, setTone] = useState('Professional');
  const [generatedPitch, setGeneratedPitch] = useState('');
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    // Debug: Check if key is loaded (Should print 'AIza...' in console)
    console.log("Key Check:", import.meta.env.VITE_GEMINI_API_KEY?.substring(0, 10) + "...");

    if (!brand) return;
    setLoading(true);
    setError('');
    setGeneratedPitch('');

    try {
      // 1. Initialize Gemini
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      
      // Use the specific '001' version which is often more stable for API connections
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });

      const prompt = `
        Act as a creator economy expert. Write a sponsorship pitch to "${brand}".
        Platform: ${platform}
        Tone: ${tone}
        Keep it under 150 words.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      setGeneratedPitch(response.text());
      
    } catch (err: any) {
      console.error("Gemini Error:", err);
      // Friendly error message
      setError("Error: " + (err.message || "Failed to generate pitch"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-card rounded-xl border border-border shadow-sm max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">✨ AI Pitch Generator</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Brand Name</label>
          <input 
            type="text" 
            placeholder="e.g. Nike"
            className="w-full p-2 rounded-md border bg-background"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Platform</label>
          <select 
            className="w-full p-2 rounded-md border bg-background"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
          >
            <option>Instagram Reel</option>
            <option>YouTube Video</option>
            <option>LinkedIn Post</option>
          </select>
        </div>
        
         <div className="space-y-2">
          <label className="text-sm font-medium">Tone</label>
          <select 
            className="w-full p-2 rounded-md border bg-background"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
          >
            <option>Professional</option>
            <option>Casual</option>
             <option>Bold</option>
          </select>
        </div>
      </div>

      <button 
        onClick={handleGenerate}
        disabled={loading || !brand}
        className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate Pitch 🚀"}
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-200">
          {error}
        </div>
      )}

      {generatedPitch && (
        <div className="mt-6">
          <div className="p-4 bg-muted/30 rounded-lg whitespace-pre-wrap font-mono text-sm leading-relaxed border border-border">
            {generatedPitch}
          </div>
        </div>
      )}
    </div>
  );
}