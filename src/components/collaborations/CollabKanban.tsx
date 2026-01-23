import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Instagram, Youtube, Globe, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface Collaboration {
  id: string;
  brand_name: string;
  platform: string;
  amount: number;
  payment_status: string;
  payment_due_date: string;
  deliverable: string;
}

const PlatformIcon = ({ platform }: { platform: string }) => {
  const p = platform ? platform.toLowerCase() : "";
  if (p.includes('instagram')) return <Instagram className="w-3 h-3" />;
  if (p.includes('youtube')) return <Youtube className="w-3 h-3" />;
  return <Globe className="w-3 h-3" />;
};

export const CollabKanban = ({ data }: { data: Collaboration[] }) => {
  
  // Filter data into columns
  const pending = data.filter(c => c.payment_status === 'Pending');
  const delayed = data.filter(c => c.payment_status === 'Delayed');
  const paid = data.filter(c => c.payment_status === 'Paid');

  const Column = ({ title, items, color, icon: Icon }: any) => (
    <div className="flex-1 min-w-[300px]">
      <div className={cn("flex items-center gap-2 mb-4 px-2 py-1.5 rounded-lg border", color)}>
        <Icon className="w-4 h-4" />
        <h3 className="font-semibold text-sm uppercase tracking-wide">{title}</h3>
        <span className="ml-auto text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full">{items.length}</span>
      </div>
      
      <div className="space-y-3">
        {items.map((collab: Collaboration) => (
          <Card key={collab.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-transparent hover:border-l-primary group">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-foreground">{collab.brand_name}</h4>
              <Badge variant="secondary" className="text-[10px] flex gap-1 items-center">
                 <PlatformIcon platform={collab.platform} /> {collab.platform}
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground mb-3 line-clamp-1">{collab.deliverable}</p>
            
            <div className="flex justify-between items-center pt-3 border-t border-dashed">
              <span className="font-mono font-bold text-foreground">₹{collab.amount.toLocaleString()}</span>
              {collab.payment_due_date && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" /> 
                  {new Date(collab.payment_due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </span>
              )}
            </div>
          </Card>
        ))}
        {items.length === 0 && (
          <div className="h-24 border-2 border-dashed rounded-xl flex items-center justify-center text-muted-foreground text-sm opacity-50">
            Empty
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex gap-6 overflow-x-auto pb-6">
      <Column title="Pending Work" items={pending} color="bg-yellow-500/10 text-yellow-700 border-yellow-200" icon={Clock} />
      <Column title="Payment Delayed" items={delayed} color="bg-red-500/10 text-red-700 border-red-200" icon={AlertCircle} />
      <Column title="Completed & Paid" items={paid} color="bg-green-500/10 text-green-700 border-green-200" icon={CheckCircle2} />
    </div>
  );
};