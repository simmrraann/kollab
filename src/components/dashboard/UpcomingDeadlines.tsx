import { CalendarDays, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Deadline {
  id: string;
  brand: string;
  type: 'posting' | 'payment' | 'recording';
  date: string;
  daysLeft: number;
  isUrgent: boolean;
}

const mockDeadlines: Deadline[] = [
  { id: '1', brand: 'Glossier', type: 'posting', date: 'Jan 20', daysLeft: 3, isUrgent: true },
  { id: '2', brand: 'Skillshare', type: 'recording', date: 'Jan 21', daysLeft: 4, isUrgent: false },
  { id: '3', brand: 'Notion', type: 'payment', date: 'Jan 22', daysLeft: 5, isUrgent: false },
  { id: '4', brand: 'Nike', type: 'posting', date: 'Jan 25', daysLeft: 8, isUrgent: false },
];

const typeStyles = {
  posting: { bg: 'bg-primary/10', text: 'text-primary', label: 'Post Due' },
  payment: { bg: 'bg-success/10', text: 'text-success', label: 'Payment Due' },
  recording: { bg: 'bg-warning/10', text: 'text-warning', label: 'Recording' },
};

export const UpcomingDeadlines = () => {
  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <CalendarDays className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Upcoming Deadlines</h3>
      </div>
      
      <div className="space-y-2">
        {mockDeadlines.map((deadline, index) => (
          <div
            key={deadline.id}
            className={cn(
              'flex items-center justify-between p-3 rounded-lg transition-all duration-200 animate-fade-in',
              deadline.isUrgent ? 'bg-destructive/5 border border-destructive/20' : 'bg-muted/30'
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center gap-3">
              {deadline.isUrgent && (
                <AlertCircle className="w-4 h-4 text-destructive animate-pulse-soft" />
              )}
              <div>
                <p className="font-medium text-foreground">{deadline.brand}</p>
                <span
                  className={cn(
                    'text-xs px-2 py-0.5 rounded-full',
                    typeStyles[deadline.type].bg,
                    typeStyles[deadline.type].text
                  )}
                >
                  {typeStyles[deadline.type].label}
                </span>
              </div>
            </div>
            
            <div className="text-right">
              <p className="font-medium text-foreground">{deadline.date}</p>
              <p className={cn(
                'text-xs flex items-center gap-1 justify-end',
                deadline.daysLeft <= 3 ? 'text-destructive' : 'text-muted-foreground'
              )}>
                <Clock className="w-3 h-3" />
                {deadline.daysLeft} days left
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
