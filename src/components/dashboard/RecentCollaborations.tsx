import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Calendar, DollarSign, Instagram, Youtube } from 'lucide-react';

interface Collaboration {
  id: string;
  brand: string;
  platform: 'instagram' | 'youtube' | 'other';
  deliverable: string;
  postingDate: string;
  amount: number;
  status: 'pending' | 'paid' | 'delayed';
}

const mockCollaborations: Collaboration[] = [
  {
    id: '1',
    brand: 'Glossier',
    platform: 'instagram',
    deliverable: 'Reel + Stories',
    postingDate: '2024-01-20',
    amount: 2500,
    status: 'pending',
  },
  {
    id: '2',
    brand: 'Nike',
    platform: 'youtube',
    deliverable: 'Dedicated Video',
    postingDate: '2024-01-18',
    amount: 8000,
    status: 'paid',
  },
  {
    id: '3',
    brand: 'Notion',
    platform: 'instagram',
    deliverable: 'Carousel Post',
    postingDate: '2024-01-15',
    amount: 1800,
    status: 'delayed',
  },
  {
    id: '4',
    brand: 'Skillshare',
    platform: 'youtube',
    deliverable: 'Integration',
    postingDate: '2024-01-22',
    amount: 3500,
    status: 'pending',
  },
];

const PlatformIcon = ({ platform }: { platform: string }) => {
  switch (platform) {
    case 'instagram':
      return <Instagram className="w-4 h-4" />;
    case 'youtube':
      return <Youtube className="w-4 h-4" />;
    default:
      return <Calendar className="w-4 h-4" />;
  }
};

const statusStyles = {
  pending: 'bg-warning/10 text-warning border-warning/20',
  paid: 'bg-success/10 text-success border-success/20',
  delayed: 'bg-destructive/10 text-destructive border-destructive/20',
};

export const RecentCollaborations = () => {
  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Recent Collaborations</h3>
        <button className="text-sm text-primary hover:underline">View all</button>
      </div>
      
      <div className="space-y-3">
        {mockCollaborations.map((collab, index) => (
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
                <p className="font-medium text-foreground">{collab.brand}</p>
                <p className="text-xs text-muted-foreground">{collab.deliverable}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-semibold text-foreground">
                  ₹{collab.amount.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">{collab.postingDate}</p>
              </div>
              <Badge
                variant="outline"
                className={cn('capitalize text-xs', statusStyles[collab.status])}
              >
                {collab.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
