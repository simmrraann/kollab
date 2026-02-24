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
    <div className="glass-card rounded-lg md:rounded-xl p-3 md:p-5 h-full">
      <div className="flex items-center gap-2 mb-3 md:mb-4">
        <CalendarDays className="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0" />
        <h3 className="font-semibold text-foreground text-sm md:text-base">Upcoming Deadlines</h3>
      </div>
      
      <div className="space-y-2 md:space-y-3">
        {sortedDeadlines.length === 0 ? (
            <div className="text-xs md:text-sm text-muted-foreground text-center py-6 md:py-8">
                No upcoming deadlines! 🎉
            </div>
        ) : (
            sortedDeadlines.map((deadline, index) => (
          <div
            key={deadline.id}
            className={cn(
              'flex items-center justify-between gap-2 p-2 md:p-3 rounded-lg transition-all duration-200 animate-fade-in',
              deadline.isUrgent ? 'bg-red-500/5 border border-red-500/20' : 'bg-muted/30'
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
              {deadline.isUrgent && (
                <AlertCircle className="w-3 h-3 md:w-4 md:h-4 text-destructive animate-pulse-soft flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground text-sm truncate">{deadline.brand}</p>
                <span
                  className={cn(
                    'text-[9px] md:text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full inline-block',
                    typeStyles[deadline.type].bg,
                    typeStyles[deadline.type].text
                  )}
                >
                  {typeStyles[deadline.type].label}
                </span>
              </div>
            </div>
            
            <div className="text-right flex-shrink-0">
              <p className="font-medium text-foreground text-xs md:text-sm">
                {new Date(deadline.dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
              <p className={cn(
                'text-xs md:text-xs flex items-center gap-1 justify-end whitespace-nowrap',
                deadline.daysLeft <= 3 ? 'text-destructive font-medium' : 'text-muted-foreground'
              )}>
                <Clock className="w-3 h-3" />
                {deadline.daysLeft === 0 ? "Today" : `${deadline.daysLeft}d`}
              </p>
            </div>
          </div>
        )))}
      </div>
    </div>
  );
};