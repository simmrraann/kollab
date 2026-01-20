<<<<<<< HEAD
import { AppLayout } from '@/components/layout/AppLayout';
import { CollabCalendar } from '@/components/calendar/CollabCalendar';

const Calendar = () => {
  return (
    <AppLayout title="Calendar" subtitle="Visualize your collaboration timeline.">
      <CollabCalendar />
=======
import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [collaborations, setCollaborations] = useState<Record<string, any[]>>({});
  const [formData, setFormData] = useState({
    brand: '',
    platform: 'Instagram',
    type: '',
    amount: '',
    status: 'Pending',
    notes: ''
  });

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const handleDateClick = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(date);
    setFormData({ brand: '', platform: 'Instagram', type: '', amount: '', status: 'Pending', notes: '' });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate) return;
    
    const dateKey = selectedDate.toDateString();
    const newCollab = { ...formData, id: Date.now() };
    
    setCollaborations(prev => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), newCollab]
    }));
    
    setIsModalOpen(false);
  };

  const formatCurrency = (amount: string) => {
    const num = parseFloat(amount);
    if (isNaN(num)) return '';
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num);
  };

  return (
    <AppLayout title="Calendar" subtitle="Visualize your collaboration timeline.">
      <div className="glass-card p-6 rounded-xl">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold gradient-text">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="flex gap-2">
            <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))} className="p-2 hover:bg-secondary rounded-lg transition-colors"><ChevronLeft className="w-5 h-5" /></button>
            <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))} className="p-2 hover:bg-secondary rounded-lg transition-colors"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-4 mb-4 text-center text-sm font-medium text-muted-foreground">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day}>{day}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-4">
          {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateKey = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
            const dayCollabs = collaborations[dateKey] || [];
            
            return (
              <div 
                key={day} 
                onClick={() => handleDateClick(day)}
                className="min-h-[100px] p-3 rounded-xl border bg-card/50 hover:bg-secondary/50 transition-all cursor-pointer relative group"
              >
                <span className="text-sm font-medium">{day}</span>
                <div className="mt-2 space-y-1">
                  {dayCollabs.map((collab, idx) => (
                    <div key={idx} className="text-[10px] truncate px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                      {collab.brand}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedDate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="glass-card w-full max-w-md p-6 rounded-xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">
                {selectedDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
            </div>

            {/* Existing List */}
            <div className="mb-6 space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
              {(collaborations[selectedDate.toDateString()] || []).map((c) => (
                <div key={c.id} className="flex justify-between items-center p-2 rounded-lg bg-secondary/50 text-sm">
                  <div>
                    <span className="font-medium block">{c.brand}</span>
                    <span className="text-xs text-muted-foreground">{c.platform} • {c.type}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(c.amount)}</div>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${c.status === 'Paid' ? 'status-paid' : c.status === 'Delayed' ? 'status-delayed' : 'status-pending'}`}>{c.status}</span>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Brand</label>
                  <input required className="soft-input w-full rounded-lg border bg-background px-3 py-2 text-sm" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} placeholder="e.g. Nike" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Platform</label>
                  <select className="soft-input w-full rounded-lg border bg-background px-3 py-2 text-sm" value={formData.platform} onChange={e => setFormData({...formData, platform: e.target.value})}>
                    <option>Instagram</option><option>YouTube</option><option>Other</option>
                  </select>
                </div>
                <div className="space-y-1"><label className="text-xs font-medium text-muted-foreground">Deliverable</label><input className="soft-input w-full rounded-lg border bg-background px-3 py-2 text-sm" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} placeholder="e.g. Reel" /></div>
                <div className="space-y-1"><label className="text-xs font-medium text-muted-foreground">Amount (₹)</label><input type="number" required className="soft-input w-full rounded-lg border bg-background px-3 py-2 text-sm" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} placeholder="2500" /></div>
                <div className="space-y-1"><label className="text-xs font-medium text-muted-foreground">Status</label><select className="soft-input w-full rounded-lg border bg-background px-3 py-2 text-sm" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}><option>Pending</option><option>Paid</option><option>Delayed</option></select></div>
              </div>
              <button type="submit" className="btn-calm w-full bg-primary text-primary-foreground rounded-lg py-2.5 text-sm font-medium mt-2">Add Collaboration</button>
            </form>
          </div>
        </div>
      )}
>>>>>>> 6ab6321 (inital kollab setup with Supabase Backend)
    </AppLayout>
  );
};

export default Calendar;
