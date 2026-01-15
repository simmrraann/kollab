import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CalendarEvent {
  id: string;
  brand: string;
  type: 'posting' | 'payment' | 'recording';
  date: string;
  status?: 'pending' | 'paid' | 'delayed';
}

const mockEvents: CalendarEvent[] = [
  { id: '1', brand: 'Glossier', type: 'posting', date: '2024-01-20', status: 'pending' },
  { id: '2', brand: 'Nike', type: 'payment', date: '2024-01-18', status: 'paid' },
  { id: '3', brand: 'Notion', type: 'recording', date: '2024-01-15' },
  { id: '4', brand: 'Skillshare', type: 'posting', date: '2024-01-22', status: 'pending' },
  { id: '5', brand: 'Figma', type: 'payment', date: '2024-01-25', status: 'pending' },
  { id: '6', brand: 'Notion', type: 'payment', date: '2024-01-20', status: 'delayed' },
  { id: '7', brand: 'Adobe', type: 'recording', date: '2024-01-28' },
  { id: '8', brand: 'Canva', type: 'posting', date: '2024-01-30', status: 'pending' },
];

const typeColors = {
  posting: 'bg-primary text-primary-foreground',
  payment: 'bg-success text-success-foreground',
  recording: 'bg-warning text-warning-foreground',
};

const statusIndicators = {
  pending: 'ring-2 ring-warning/50',
  paid: 'ring-2 ring-success/50',
  delayed: 'ring-2 ring-destructive/50',
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const CollabCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 0, 1)); // January 2024

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return mockEvents.filter((event) => event.date === dateStr);
  };

  const days = [];
  
  // Empty cells for days before the first day of month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="h-28 bg-muted/20 rounded-lg" />);
  }
  
  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const events = getEventsForDay(day);
    const isToday = day === 20 && month === 0; // Mock "today" as Jan 20
    
    days.push(
      <div
        key={day}
        className={cn(
          'h-28 p-2 rounded-lg border transition-all duration-200 hover:border-primary/30 overflow-hidden',
          isToday ? 'border-primary bg-primary/5' : 'border-border bg-card/50'
        )}
      >
        <div className="flex items-center justify-between mb-1">
          <span
            className={cn(
              'text-sm font-medium',
              isToday ? 'text-primary' : 'text-foreground'
            )}
          >
            {day}
          </span>
          {isToday && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary text-primary-foreground">
              Today
            </span>
          )}
        </div>
        <div className="space-y-1 overflow-y-auto max-h-16 custom-scrollbar">
          {events.map((event) => (
            <div
              key={event.id}
              className={cn(
                'text-[10px] px-1.5 py-1 rounded truncate font-medium',
                typeColors[event.type],
                event.status && statusIndicators[event.status]
              )}
              title={`${event.brand} - ${event.type}`}
            >
              {event.brand}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            {MONTHS[month]} {year}
          </h2>
          <p className="text-sm text-muted-foreground">
            View your collaboration timeline
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-primary" />
          <span className="text-xs text-muted-foreground">Posting</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-success" />
          <span className="text-xs text-muted-foreground">Payment</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-warning" />
          <span className="text-xs text-muted-foreground">Recording</span>
        </div>
      </div>

      {/* Days Header */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {DAYS.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">{days}</div>
    </div>
  );
};
