import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Sparkles, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export const SmartExtractor = () => {
  const { user } = useAuth();
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<{
    brand: string;
    amount: number;
    platform: string;
    date: string;
    deliverable: string;
  } | null>(null);

  const handleExtract = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const text = inputText.toLowerCase();
      
      const moneyMatch = text.match(/[\₹\$]?\s?(\d{1,3}(,\d{3})*(\.\d+)?)[kK]?/);
      let amount = 0;
      if (moneyMatch) {
        amount = parseInt(moneyMatch[1].replace(/,/g, ''));
        if (text.includes('k')) amount *= 1000;
      }

      let platform = 'Instagram';
      if (text.includes('youtube') || text.includes('yt')) platform = 'YouTube';
      
      let deliverable = 'Post';
      if (text.includes('reel')) deliverable = 'Reel';
      
      const today = new Date();
      let date = today.toISOString().split('T')[0];

      setExtractedData({
        brand: "Unknown Brand",
        amount,
        platform,
        date,
        deliverable
      });
      setIsProcessing(false);
      toast.success("Details extracted!");
    }, 1500);
  };

  const handleSaveToSupabase = async () => {
    if (!extractedData || !user) return;
    const { error } = await supabase.from('collaborations').insert({
      user_id: user.id,
      brand_name: extractedData.brand === "Unknown Brand" ? "New Brand" : extractedData.brand,
      platform: extractedData.platform,
      deliverable: extractedData.deliverable,
      amount: extractedData.amount,
      payment_status: 'Pending',
      posting_date: extractedData.date,
    });

    if (!error) {
      toast.success("Saved to Dashboard!");
      setExtractedData(null);
      setInputText("");
    }
  };

  return (
    <div className="space-y-4">
        {/* Input Area */}
        <div className="space-y-4">
          <Card className="p-1 bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-0">
            <Textarea 
              placeholder="Paste DM text here... Example: 'Hey! We want a Reel for ₹5000'"
              className="min-h-[150px] bg-background/95 resize-none border-0 focus-visible:ring-0"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </Card>
          
          <Button onClick={handleExtract} disabled={!inputText || isProcessing} className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
            {isProcessing ? "Processing..." : <><Sparkles className="w-4 h-4 mr-2" /> Extract Details</>}
          </Button>
        </div>

        {/* Results Area */}
        {extractedData && (
            <Card className="p-4 space-y-3 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-2 text-green-600 font-medium text-sm">
                <CheckCircle2 className="w-4 h-4" /> <span>Extraction Successful</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                 <div><span className="text-xs text-muted-foreground uppercase">Amount</span><div className="font-bold">₹{extractedData.amount}</div></div>
                 <div><span className="text-xs text-muted-foreground uppercase">Platform</span><div className="font-medium">{extractedData.platform}</div></div>
              </div>
              <Button onClick={handleSaveToSupabase} size="sm" variant="outline" className="w-full">Add to Dashboard</Button>
            </Card>
        )}
    </div>
  );
};