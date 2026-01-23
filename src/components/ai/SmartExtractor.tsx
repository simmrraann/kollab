import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Sparkles, CheckCircle2, Loader2, AlertTriangle, ServerCrash } from 'lucide-react';
import { toast } from 'sonner';

// --- TYPES ---
interface ExtractedData {
  brand: string;
  amount: number;
  platform: string;
  date: string;
  deliverable: string;
}

// --- HELPER: SYSTEM PROMPT ---
const SYSTEM_PROMPT = `
  You are an AI data extractor. Extract details from the text into JSON.
  RULES:
  - brand: Company name (or "Unknown Brand").
  - amount: Number only. Ignore 'S24' or 'v12'. Convert 'k' to 000.
  - platform: Default "Instagram".
  - deliverable: Default "Post".
  - date: YYYY-MM-DD. Calculate relative dates from today: ${new Date().toISOString().split('T')[0]}.
  
  Return ONLY raw JSON. No markdown formatting.
`;

export const SmartExtractor = () => {
  const { user } = useAuth();
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMsg, setStatusMsg] = useState(''); 
  const [providerUsed, setProviderUsed] = useState(''); // To show which AI worked
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);

  // --- API HANDLERS ---

  // 1. OpenAI Handler
  const callOpenAI = async (text: string) => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) throw new Error("Skipped (No Key)");

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "gpt-4o-mini", // Cost effective
        messages: [{ role: "system", content: SYSTEM_PROMPT }, { role: "user", content: text }],
        temperature: 0.1
      })
    });
    if (!response.ok) throw new Error(`OpenAI Error: ${response.status}`);
    const data = await response.json();
    return data.choices[0].message.content;
  };

  // 2. Gemini Handler
  const callGemini = async (text: string) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) throw new Error("Skipped (No Key)");

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: SYSTEM_PROMPT + `\nInput: "${text}"` }] }]
      })
    });
    if (!response.ok) throw new Error(`Gemini Error: ${response.status}`);
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  };

  // 3. Groq Handler (Fastest Fallback)
  const callGroq = async (text: string) => {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey) throw new Error("Skipped (No Key)");

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, { role: "user", content: text }],
        temperature: 0.1
      })
    });
    if (!response.ok) throw new Error(`Groq Error: ${response.status}`);
    const data = await response.json();
    return data.choices[0].message.content;
  };

  // --- MAIN LOGIC ---
  const handleExtract = async () => {
    if (!inputText) return;
    setIsProcessing(true);
    setExtractedData(null);
    setProviderUsed("");
    setStatusMsg("");

    let finalJson = null;

    try {
      // ATTEMPT 1: OpenAI
      try {
        setStatusMsg("Trying OpenAI...");
        finalJson = await callOpenAI(inputText);
        setProviderUsed("OpenAI (GPT-4o)");
      } catch (e) {
        console.warn("OpenAI Failed:", e);
        
        // ATTEMPT 2: Gemini
        try {
          setStatusMsg("OpenAI failed. Trying Gemini...");
          finalJson = await callGemini(inputText);
          setProviderUsed("Google Gemini");
        } catch (e) {
          console.warn("Gemini Failed:", e);

          // ATTEMPT 3: Groq
          try {
            setStatusMsg("Gemini failed. Trying Groq...");
            finalJson = await callGroq(inputText);
            setProviderUsed("Groq (Llama3)");
          } catch (e) {
            console.error("All Providers Failed");
            throw new Error("All AI services failed. Please check API keys.");
          }
        }
      }

      // --- PARSE & CLEAN RESPONSE ---
      if (finalJson) {
        const cleanJson = finalJson.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(cleanJson);
        
        setExtractedData({
            brand: data.brand || "Unknown Brand",
            amount: Number(data.amount) || 0,
            platform: data.platform || "Instagram",
            deliverable: data.deliverable || "Post",
            date: data.date || new Date().toISOString().split('T')[0]
        });
        toast.success("Details extracted successfully!");
      }

    } catch (error: any) {
      toast.error(error.message);
      setStatusMsg("Extraction Failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSave = async () => {
    if (!extractedData || !user) return;
    const { error } = await supabase.from('collaborations').insert({
      user_id: user.id,
      brand_name: extractedData.brand,
      payment_status: 'Pending',
      amount: extractedData.amount,
      platform: extractedData.platform,
      deliverable: extractedData.deliverable,
      posting_date: extractedData.date
    });
    
    if (error) toast.error("Database Error");
    else {
      toast.success("Saved!");
      setExtractedData(null);
      setInputText("");
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-1 border-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10">
        <Textarea 
          placeholder="Paste deal text here..." 
          className="min-h-[120px] bg-background/80 border-0 resize-none focus-visible:ring-0"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
        />
      </Card>

      <Button 
        onClick={handleExtract} 
        disabled={!inputText || isProcessing} 
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> 
            {statusMsg || "Processing..."}
          </>
        ) : (
          <><Sparkles className="w-4 h-4 mr-2" /> Extract Details</>
        )}
      </Button>

      {/* RESULT CARD */}
      {extractedData && (
        <Card className="p-4 animate-in fade-in slide-in-from-top-2 border-green-200 bg-green-50/50">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 text-green-700 font-medium text-sm">
              <CheckCircle2 className="w-4 h-4" /> Success
            </div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground bg-white px-2 py-1 rounded border">
              ⚡ {providerUsed}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div>
              <label className="text-xs text-muted-foreground uppercase">Brand</label>
              <div className="font-bold text-lg">{extractedData.brand}</div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground uppercase">Amount</label>
              <div className="font-bold text-lg">₹{extractedData.amount.toLocaleString()}</div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground uppercase">Date</label>
              <div>{extractedData.date}</div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground uppercase">Platform</label>
              <div>{extractedData.platform}</div>
            </div>
          </div>

          <Button onClick={handleSave} variant="outline" size="sm" className="w-full border-green-200 text-green-700 hover:bg-green-100 hover:text-green-800">
            Confirm & Save
          </Button>
        </Card>
      )}

      {/* ERROR STATE (If all failed) */}
      {!extractedData && !isProcessing && statusMsg === "Extraction Failed." && (
        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2 border border-red-100">
          <ServerCrash className="w-4 h-4" />
          All AI services failed. Check your API Keys.
        </div>
      )}
    </div>
  );
};