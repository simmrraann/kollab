import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X, Loader2, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner'; 

// --- TYPES ---
interface CalendarEvent {
  id: string;
  collabId: string;
  title: string;
  date: Date;
  type: 'posting' | 'payment';
  platform: string;
  status: string;
  amount: number;
}

// --- CREATIVE STYLING ---
const getPlatformStyle = (platform: string, type: 'posting' | 'payment') => {
  const p = platform.toLowerCase();
  
  const base = "text-[10px] px-1.5 py-1 rounded truncate font-medium shadow-sm border border-white/10 transition-transform hover:scale-105";

  if (type === 'payment') {
    return cn(base, "bg-gradient-to-r from-emerald-500 to-green-600 text-white");
  }

  if (p.includes('instagram')) return cn(base, "bg-gradient-to-r from-purple-500 to-pink-500 text-white");
  if (p.includes('youtube')) return cn(base, "bg-gradient-to-r from-red-500 to-red-700 text-white");
  if (p.includes('tiktok')) return cn(base, "bg-gradient-to-r from-slate-900 to-cyan-900 text-cyan-50");
  
  return cn(base, "bg-secondary text-secondary-foreground");
};

const Calendar = () => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // 🔍 NEW: Search State
  const [searchTerm, setSearchTerm] = useState('');
  
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  // Form State
  const [formData, setFormData] = useState({
    brand: '',
    platform: 'Instagram',
    deliverable: '',
    amount: '',
    status: 'Pending',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCalendarData();
  }, [user]); 

  const fetchCalendarData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('collaborations').select('*');
      
      if (error) throw error;

      const processedEvents: CalendarEvent[] = [];

      data?.forEach((collab) => {
        if (collab.posting_date) {
          processedEvents.push({
            id: `${collab.id}-post`,
            collabId: collab.id,
            title: collab.brand_name,
            date: new Date(collab.posting_date),
            type: 'posting',
            platform: collab.platform,
            status: collab.payment_status,
            amount: collab.amount
          });
        }
        if (collab.payment_due_date) {
           processedEvents.push({
            id: `${collab.id}-pay`,
            collabId: collab.id,
            title: `Pay: ${collab.brand_name}`,
            date: new Date(collab.payment_due_date),
            type: 'payment',
            platform: collab.platform,
            status: collab.payment_status,
            amount: collab.amount
          });
        }
      });

      setEvents(processedEvents);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !user) return;
    
    setSaving(true);
    const payload = {
      user_id: user.id,
      brand_name: formData.brand,
      platform: formData.platform,
      deliverable: formData.deliverable,
      amount: Number(formData.amount),
      payment_status: formData.status,
      posting_date: selectedDate.toISOString().split('T')[0],
      payment_due_date: new Date(selectedDate.getTime() + (30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]
    };

    const { error } = await supabase.from('collaborations').insert(payload);

    if (error) {
      toast.error("Failed to save collaboration");
    } else {
      toast.success("Collaboration added to calendar!");
      setIsModalOpen(false);
      setFormData({ brand: '', platform: 'Instagram', deliverable: '', amount: '', status: 'Pending' });
      fetchCalendarData(); 
    }
    setSaving(false);
  };

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const handleDateClick = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const getEventsForDay = (day: number) => {
    return events.filter(e => {
        return e.date.getDate() === day && 
               e.date.getMonth() === currentDate.getMonth() && 
               e.date.getFullYear() === currentDate.getFullYear();
    });
  };

  // 🔍 Helper: Check if a day has a matching search result
  const doesDayMatchSearch = (dayEvents: CalendarEvent[]) => {
    if (!searchTerm) return false;
    return dayEvents.some(e => e.title.toLowerCase().includes(searchTerm.toLowerCase()));
  };

  return (
    // 1. Pass setSearchTerm to AppLayout to show the bar
    <AppLayout 
        title="Calendar" 
        subtitle="Visualize your content & income timeline."
        onSearch={setSearchTerm} 
    >
      <div className="glass-card p-6 rounded-xl animate-fade-in">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
                {events.filter(e => e.date.getMonth() === currentDate.getMonth()).length} events this month
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}>
                <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}>
                <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-4 mb-6 text-xs text-muted-foreground">
             <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-purple-500"></div> Instagram</div>
             <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-600"></div> YouTube</div>
             <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Payment Due</div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-7 gap-4 mb-4 text-center text-sm font-medium text-muted-foreground uppercase tracking-wider">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day}>{day}</div>)}
        </div>
        
        <div className="grid grid-cols-7 gap-4">
          {/* Empty Slots */}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} className="min-h-[120px] bg-secondary/10 rounded-xl opacity-50" />)}
          
          {/* Days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dayEvents = getEventsForDay(day);
            const isToday = new Date().getDate() === day && new Date().getMonth() === currentDate.getMonth();
            
            // ✨ THE MAGIC: Check if this day matches the search
            const isMatch = doesDayMatchSearch(dayEvents);
            const isDimmed = searchTerm && !isMatch; // Dim days that don't match

            return (
              <div 
                key={day} 
                onClick={() => handleDateClick(day)}
                className={cn(
                    "min-h-[120px] p-3 rounded-xl border transition-all cursor-pointer relative group flex flex-col gap-1",
                    // Apply Glow if matched
                    isMatch ? "ring-2 ring-primary ring-offset-2 bg-primary/10 border-primary shadow-[0_0_15px_rgba(var(--primary),0.3)] z-10 scale-[1.02]" : "",
                    // Dim unrelated days
                    isDimmed ? "opacity-30 grayscale scale-95" : "",
                    // Standard styles
                    !isMatch && isToday ? "border-primary bg-primary/5 shadow-sm" : "bg-card hover:border-primary/50"
                )}
              >
                <span className={cn(
                    "text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full mb-1",
                    isToday ? "bg-primary text-white" : "text-muted-foreground group-hover:text-foreground"
                )}>
                    {day}
                </span>

                {/* Event Chips */}
                <div className="flex flex-col gap-1.5 overflow-y-auto custom-scrollbar max-h-[80px]">
                  {dayEvents.map((event, idx) => {
                     // Highlight specific chip if searching
                     const isChipMatch = searchTerm ? event.title.toLowerCase().includes(searchTerm.toLowerCase()) : true;
                     
                     return (
                        <div key={idx} className={cn(getPlatformStyle(event.platform, event.type), !isChipMatch && searchTerm && "opacity-50")}>
                        {event.title}
                        </div>
                     );
                  })}
                </div>
                
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Plus className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- ADD EVENT MODAL (Unchanged) --- */}
      {isModalOpen && selectedDate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-background border w-full max-w-md p-6 rounded-2xl shadow-2xl scale-100">
            <div className="flex justify-between items-center mb-6">
              <div>
                  <h3 className="text-xl font-bold">
                    {selectedDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}
                  </h3>
                  <p className="text-sm text-muted-foreground">Add new content scheduled for this day</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-secondary rounded-full transition-colors">
                  <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
               {/* Brand */}
               <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase text-muted-foreground">Brand Name</label>
                  <input required className="w-full rounded-lg border bg-secondary/30 px-3 py-2.5 text-sm focus:ring-2 ring-primary/20 outline-none transition-all" 
                         value={formData.brand} 
                         onChange={e => setFormData({...formData, brand: e.target.value})} 
                         placeholder="e.g. Nike" />
               </div>

               <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase text-muted-foreground">Platform</label>
                      <select className="w-full rounded-lg border bg-secondary/30 px-3 py-2.5 text-sm outline-none" 
                              value={formData.platform} 
                              onChange={e => setFormData({...formData, platform: e.target.value})}>
                        <option>Instagram</option>
                        <option>YouTube</option>
                        <option>TikTok</option>
                        <option>Other</option>
                      </select>
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase text-muted-foreground">Amount (₹)</label>
                      <input type="number" required className="w-full rounded-lg border bg-secondary/30 px-3 py-2.5 text-sm outline-none" 
                             value={formData.amount} 
                             onChange={e => setFormData({...formData, amount: e.target.value})} 
                             placeholder="5000" />
                   </div>
               </div>

               <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase text-muted-foreground">Deliverable</label>
                  <input className="w-full rounded-lg border bg-secondary/30 px-3 py-2.5 text-sm outline-none" 
                         value={formData.deliverable} 
                         onChange={e => setFormData({...formData, deliverable: e.target.value})} 
                         placeholder="e.g. Reel + Story" />
               </div>

               <Button type="submit" disabled={saving} className="w-full mt-4" size="lg">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                  Add to Calendar
               </Button>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default Calendar;