import { CalendarDays, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const typeStyles: Record<string, any> = {
  posting: { bg: 'bg-blue-500/10', text: 'text-blue-600', label: 'Post Due' },
  payment: { bg: 'bg-green-500/10', text: 'text-green-600', label: 'Payment Due' },
};

export const UpcomingDeadlines = ({ data }: { data: any[] }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Process data to find deadlines
  const deadlines = data.flatMap((item) => {
    const events = [];

    // 1. Check Posting Deadline
    if (item.posting_date) {
      const pDate = new Date(item.posting_date);
      if (pDate >= today) {
        const diffTime = pDate.getTime() - today.getTime();
        const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        events.push({
          id: `${item.id}-post`,
          brand: item.brand_name,
          type: 'posting',
          dateObj: pDate,
          dateStr: item.posting_date,
          daysLeft,
          isUrgent: daysLeft <= 3
        });
      }
    }

    // 2. Check Payment Deadline (Only if Pending)
    if (item.payment_due_date && item.payment_status === 'Pending') {
      const pDate = new Date(item.payment_due_date);
      if (pDate >= today) {
        const diffTime = pDate.getTime() - today.getTime();
        const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        events.push({
          id: `${item.id}-pay`,
          brand: item.brand_name,
          type: 'payment',
          dateObj: pDate,
          dateStr: item.payment_due_date,
          daysLeft,
          isUrgent: daysLeft <= 3
        });
      }
    }

    return events;
  });

  // Sort by soonest date and take top 5
  const sortedDeadlines = deadlines
    .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime())
    .slice(0, 5);

  return (
    <div className="glass-card rounded-xl p-5 h-full">
      <div className="flex items-center gap-2 mb-4">
        <CalendarDays className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Upcoming Deadlines</h3>
      </div>
      
      <div className="space-y-2">
        {sortedDeadlines.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-8">
                No upcoming deadlines! 🎉
            </div>
        ) : (
            sortedDeadlines.map((deadline, index) => (
          <div
            key={deadline.id}
            className={cn(
              'flex items-center justify-between p-3 rounded-lg transition-all duration-200 animate-fade-in',
              deadline.isUrgent ? 'bg-red-500/5 border border-red-500/20' : 'bg-muted/30'
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
                    'text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full',
                    typeStyles[deadline.type].bg,
                    typeStyles[deadline.type].text
                  )}
                >
                  {typeStyles[deadline.type].label}
                </span>
              </div>
            </div>
            
            <div className="text-right">
              <p className="font-medium text-foreground text-sm">
                {new Date(deadline.dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
              <p className={cn(
                'text-xs flex items-center gap-1 justify-end',
                deadline.daysLeft <= 3 ? 'text-destructive font-medium' : 'text-muted-foreground'
              )}>
                <Clock className="w-3 h-3" />
                {deadline.daysLeft === 0 ? "Today" : `${deadline.daysLeft} days`}
              </p>
            </div>
          </div>
        )))}
      </div>
    </div>
  );
};