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
    <div className="glass-card rounded-lg md:rounded-xl p-3 md:p-5 h-full">
      <div className="flex items-center justify-between mb-3 md:mb-4 gap-2">
        <h3 className="font-semibold text-foreground text-sm md:text-base">Recent Collaborations</h3>
        <button 
          onClick={() => navigate('/collaborations')} 
          className="text-xs md:text-sm text-primary hover:underline whitespace-nowrap"
        >
          View all
        </button>
      </div>
      
      <div className="space-y-2 md:space-y-3">
        {recentList.length === 0 ? (
           <p className="text-xs md:text-sm text-muted-foreground text-center py-4">No collaborations yet.</p>
        ) : (
          recentList.map((collab, index) => (
          <div
            key={collab.id}
            className="flex items-center justify-between gap-2 p-2 md:p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors animate-fade-in overflow-hidden"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <PlatformIcon platform={collab.platform} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground text-sm truncate">{collab.brand_name}</p>
                <p className="text-xs text-muted-foreground truncate">
                    {collab.deliverable}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
              <div className="text-right hidden sm:block">
                <p className="font-semibold text-foreground text-xs md:text-sm">
                  ₹{collab.amount ? collab.amount.toLocaleString() : 0}
                </p>
                <p className="text-xs text-muted-foreground">{collab.posting_date || 'No date'}</p>
              </div>
              <Badge
                variant="outline"
                className={cn('capitalize text-[10px] md:text-xs whitespace-nowrap', statusStyles[collab.payment_status] || statusStyles['Pending'])}
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