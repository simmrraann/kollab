import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Calendar, DollarSign, Instagram, Youtube, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Define what we expect from Supabase
interface CollabData {
  id: string;
  brand_name: string;
  platform: string;
  deliverable: string;
  posting_date: string;
  amount: number;
  payment_status: string;
}

const PlatformIcon = ({ platform }: { platform: string }) => {
  const p = platform ? platform.toLowerCase() : "";
  if (p.includes('instagram')) return <Instagram className="w-4 h-4" />;
  if (p.includes('youtube')) return <Youtube className="w-4 h-4" />;
  return <Globe className="w-4 h-4" />;
};

const statusStyles: Record<string, string> = {
  Pending: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  Paid: 'bg-green-500/10 text-green-600 border-green-500/20',
  Delayed: 'bg-red-500/10 text-red-600 border-red-500/20',
  // Fallbacks for lowercase
  pending: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  paid: 'bg-green-500/10 text-green-600 border-green-500/20',
  delayed: 'bg-red-500/10 text-red-600 border-red-500/20',
};

export const RecentCollaborations = ({ data }: { data: CollabData[] }) => {
  const navigate = useNavigate();

  // Take the most recent 5 items
  const recentList = data.slice(0, 5);

  return (
    <div className="glass-card rounded-xl p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Recent Collaborations</h3>
        <button 
          onClick={() => navigate('/collaborations')} 
          className="text-sm text-primary hover:underline"
        >
          View all
        </button>
      </div>
      
      <div className="space-y-3">
        {recentList.length === 0 ? (
           <p className="text-sm text-muted-foreground text-center py-4">No collaborations yet.</p>
        ) : (
          recentList.map((collab, index) => (
          <div
            key={collab.id}
            className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <PlatformIcon platform={collab.platform} />
              </div>
              <div>
                <p className="font-medium text-foreground">{collab.brand_name}</p>
                <p className="text-xs text-muted-foreground truncate max-w-[120px]">
                    {collab.deliverable}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-semibold text-foreground">
                  ₹{collab.amount ? collab.amount.toLocaleString() : 0}
                </p>
                <p className="text-xs text-muted-foreground">{collab.posting_date || 'No date'}</p>
              </div>
              <Badge
                variant="outline"
                className={cn('capitalize text-xs', statusStyles[collab.payment_status] || statusStyles['Pending'])}
              >
                {collab.payment_status}
              </Badge>
            </div>
          </div>
        )))}
      </div>
    </div>
  );
};