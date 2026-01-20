import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

export const FollowUpGenerator = () => {
  const [overdueBrands, setOverdueBrands] = useState<any[]>([]);
  const [selectedCollabId, setSelectedCollabId] = useState('');
  const [tone, setTone] = useState('polite');
  const [generatedMessage, setGeneratedMessage] = useState('');

  // Fetch overdue brands on load
  useEffect(() => {
    const fetchOverdue = async () => {
      const { data } = await supabase
        .from('collaborations')
        .select('*')
        .neq('payment_status', 'Paid'); // Get pending/delayed
      
      if (data) {
        // Only keep ones with past due dates
        const today = new Date();
        const overdue = data.filter(item => item.payment_due_date && new Date(item.payment_due_date) < today);
        setOverdueBrands(overdue);
      }
    };
    fetchOverdue();
  }, []);

  const handleGenerate = () => {
    const collab = overdueBrands.find(c => c.id === selectedCollabId);
    if (!collab) return;

    const daysLate = Math.ceil((new Date().getTime() - new Date(collab.payment_due_date).getTime()) / (1000 * 3600 * 24));
    
    let msg = "";

    if (tone === 'polite') {
      msg = `Hi ${collab.brand_name} team,\n\nHope you're having a great week! Just wanted to quickly bump the invoice for the ${collab.deliverable} campaign (₹${collab.amount}). It looks like it was due on ${collab.payment_due_date}.\n\nLet me know if you need me to resend the invoice details.\n\nBest,\nSimran`;
    } else if (tone === 'firm') {
      msg = `Hi ${collab.brand_name},\n\nI'm following up on the outstanding payment of ₹${collab.amount} for the ${collab.deliverable} collaboration. This was due on ${collab.payment_due_date} (currently ${daysLate} days overdue).\n\nPlease let me know when this will be processed.\n\nRegards,\nSimran`;
    } else {
      msg = `URGENT: Overdue Payment - ${collab.brand_name}\n\nThis is a reminder that payment (₹${collab.amount}) is now significantly overdue. The due date was ${collab.payment_due_date}.\n\nPlease process this immediately to avoid further escalation.\n\nSimran`;
    }

    setGeneratedMessage(msg);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedMessage);
    toast.success("Message copied to clipboard!");
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 text-blue-600 font-medium mb-4">
        <MessageSquare className="w-5 h-5" />
        <span>Follow-Up Message Generator</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-muted-foreground">Select Overdue Brand</label>
            <Select onValueChange={setSelectedCollabId}>
              <SelectTrigger>
                <SelectValue placeholder={overdueBrands.length > 0 ? "Select a brand..." : "No overdue payments found"} />
              </SelectTrigger>
              <SelectContent>
                {overdueBrands.map(b => (
                  <SelectItem key={b.id} value={b.id}>{b.brand_name} (₹{b.amount})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase text-muted-foreground">Tone</label>
            <Select defaultValue="polite" onValueChange={setTone}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="polite">Polite Check-in</SelectItem>
                <SelectItem value="firm">Firm Reminder</SelectItem>
                <SelectItem value="urgent">Urgent / Final Notice</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleGenerate} disabled={!selectedCollabId} className="w-full">
            Generate Message
          </Button>
        </div>

        <div className="relative">
          <Textarea 
            className="h-full min-h-[150px] bg-secondary/30 resize-none font-mono text-sm p-4"
            placeholder="Generated message will appear here..."
            value={generatedMessage}
            readOnly
          />
          {generatedMessage && (
            <Button size="icon" variant="ghost" className="absolute top-2 right-2 h-8 w-8" onClick={copyToClipboard}>
              <Copy className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};