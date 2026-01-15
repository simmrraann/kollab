import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Loader2, ArrowRight } from 'lucide-react';

export const SmartExtractor = () => {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<null | {
    brand: string;
    deliverable: string;
    amount: string;
    date: string;
  }>(null);

  const handleExtract = async () => {
    if (!input.trim()) return;
    
    setIsProcessing(true);
    
    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    setResult({
      brand: 'Glossier',
      deliverable: 'Instagram Reel',
      amount: '$2,500',
      date: 'January 25, 2024',
    });
    
    setIsProcessing(false);
  };

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Smart Collaboration Extractor</h3>
          <p className="text-sm text-muted-foreground">
            Paste DM or email text to auto-fill collaboration details
          </p>
        </div>
      </div>

      <Textarea
        placeholder="Paste your Instagram DM, email, or chat conversation here...

Example:
Hey! We'd love to work with you on a sponsored reel for our new product launch. We're offering $2,500 for one reel + 3 stories, posting date would be January 25th. Let us know if you're interested!"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="min-h-[150px] soft-input resize-none mb-4"
      />

      <Button
        onClick={handleExtract}
        disabled={!input.trim() || isProcessing}
        className="w-full btn-calm"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            Extract Details
          </>
        )}
      </Button>

      {result && (
        <div className="mt-6 p-4 rounded-lg bg-muted/50 animate-fade-in">
          <p className="text-sm font-medium text-foreground mb-3">Extracted Details:</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-muted-foreground">Brand:</span>
              <p className="font-medium text-foreground">{result.brand}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Deliverable:</span>
              <p className="font-medium text-foreground">{result.deliverable}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Amount:</span>
              <p className="font-medium text-foreground">{result.amount}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Posting Date:</span>
              <p className="font-medium text-foreground">{result.date}</p>
            </div>
          </div>
          <Button variant="outline" className="w-full mt-4" size="sm">
            <ArrowRight className="w-4 h-4 mr-2" />
            Add to Collaborations
          </Button>
        </div>
      )}
    </div>
  );
};
