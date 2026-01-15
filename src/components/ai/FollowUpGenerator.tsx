import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MessageSquare, Loader2, Copy, Check } from 'lucide-react';

export const FollowUpGenerator = () => {
  const [brand, setBrand] = useState('');
  const [messageType, setMessageType] = useState('payment');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!brand.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate AI generation
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const messages = {
      payment: `Hi there! 👋

I hope this message finds you well. I wanted to kindly follow up regarding the payment for our recent collaboration.

According to our agreement, the payment of the agreed amount was due on [date]. I understand that things can get busy, so I just wanted to check in on the status.

If there's anything you need from my end to process this, please don't hesitate to let me know.

Thank you so much for the partnership — I really enjoyed working with ${brand}!

Looking forward to hearing from you.

Best,
[Your Name]`,
      deliverable: `Hi team! 👋

Hope you're doing great! I wanted to touch base about the upcoming deliverable for our collaboration.

Just checking if there are any updates on the content guidelines or product samples. I want to make sure everything is aligned before the recording date.

Please let me know if there's anything specific you'd like me to include or any creative direction updates.

Excited to bring this to life!

Best,
[Your Name]`,
      onboarding: `Hi there! 👋

I'm excited about our upcoming collaboration and wanted to follow up on the onboarding process.

Could you please share the onboarding form and any brand guidelines when you have a chance? This will help me prepare and ensure the content aligns perfectly with ${brand}'s vision.

Thanks so much, and looking forward to getting started!

Best,
[Your Name]`,
    };
    
    setGeneratedMessage(messages[messageType as keyof typeof messages]);
    setIsGenerating(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <MessageSquare className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Follow-Up Message Generator</h3>
          <p className="text-sm text-muted-foreground">
            Generate polite, professional follow-up messages
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <Label htmlFor="brand" className="text-sm font-medium">Brand Name</Label>
          <Input
            id="brand"
            placeholder="e.g., Glossier"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="soft-input"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">Message Type</Label>
          <Select value={messageType} onValueChange={setMessageType}>
            <SelectTrigger className="soft-input">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="payment">Payment Follow-up</SelectItem>
              <SelectItem value="deliverable">Deliverable Check-in</SelectItem>
              <SelectItem value="onboarding">Onboarding Request</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        onClick={handleGenerate}
        disabled={!brand.trim() || isGenerating}
        className="w-full btn-calm mb-4"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <MessageSquare className="w-4 h-4 mr-2" />
            Generate Message
          </>
        )}
      </Button>

      {generatedMessage && (
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm font-medium">Generated Message</Label>
            <Button variant="ghost" size="sm" onClick={handleCopy}>
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-1 text-success" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </>
              )}
            </Button>
          </div>
          <div className="p-4 rounded-lg bg-muted/50 text-sm text-foreground whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto custom-scrollbar">
            {generatedMessage}
          </div>
        </div>
      )}
    </div>
  );
};
