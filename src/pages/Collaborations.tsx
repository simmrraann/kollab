import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { AppLayout } from '@/components/layout/AppLayout';
import { CollabForm } from '@/components/collaborations/CollabForm';
import { CollabTable } from '@/components/collaborations/CollabTable';
import { CollabKanban } from '@/components/collaborations/CollabKanban';
import { Button } from '@/components/ui/button';
import { Plus, LayoutGrid, List, CheckCircle2, Clock } from 'lucide-react';
import { toast } from 'sonner';

const Collaborations = () => {
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [viewMode, setViewMode] = useState<'table' | 'board'>('table');
  const [allData, setAllData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCollab, setEditingCollab] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from('collaborations').select('*').order('created_at', { ascending: false });
      if (data) setAllData(data);
    };
    fetchData();
  }, [refreshKey]);

  // --- OPTIMISTIC UPDATE LOGIC ---
  const handleMove = (id: string, newStatus: string) => {
    setAllData(prev =>
      prev.map(item => item.id === id ? { ...item, payment_status: newStatus } : item)
    );
  };

  const filteredData = allData.filter(collab =>
    collab.brand_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    collab.platform?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (collab: any) => {
    setEditingCollab(collab);
    setShowForm(true);
  };

  const handleSuccess = () => {
    toast.success(editingCollab ? "Collaboration updated!" : "Collaboration saved!");
    setRefreshKey(prev => prev + 1);
    setShowForm(false);
    setEditingCollab(null);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingCollab(null);
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Paid' ? 'Pending' : 'Paid';
    setAllData(prev => prev.map(item => item.id === id ? { ...item, payment_status: newStatus } : item));
    const { error } = await supabase.from('collaborations').update({ payment_status: newStatus }).eq('id', id);
    if (error) toast.error("Failed to update status");
    else toast.success(newStatus === 'Paid' ? "Marked as Done! 🎉" : "Marked as Pending");
  };

  return (
    <AppLayout
      title="Collaborations"
      subtitle="Manage all your brand partnerships."
      onSearch={setSearchTerm}
    >
      <div className="space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 md:gap-4">
          <div className="hidden md:flex bg-secondary/50 p-1 rounded-lg w-fit">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-md transition-all ${viewMode === 'table' ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              title="Table view"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('board')}
              className={`p-2 rounded-md transition-all ${viewMode === 'board' ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              title="Board view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <Button onClick={() => setShowForm(true)} className="btn-calm w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            <span>Add Collaboration</span>
          </Button>
        </div>

        {showForm && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CollabForm
                onClose={handleClose}
                onSuccess={handleSuccess}
                initialData={editingCollab}
              />
            </div>
          </div>
        )}

        <div className="md:hidden space-y-3">
          {filteredData.map((collab) => (
            <div key={collab.id} className="bg-card border rounded-xl p-4 shadow-sm flex justify-between items-center active:scale-[0.98] transition-transform">
              <div onClick={() => handleEdit(collab)} className="flex-1 cursor-pointer">
                <h3 className="font-bold text-lg leading-none">{collab.brand_name}</h3>
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <span className="bg-secondary px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider text-foreground">
                    {collab.platform}
                  </span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Due: {new Date(collab.posting_date).toLocaleDateString()}</span>
                </div>
                <div className="mt-2 font-mono text-sm font-semibold text-primary">{collab.amount ? `₹${collab.amount}` : 'Barter'}</div>
              </div>
              <button
                onClick={() => toggleStatus(collab.id, collab.payment_status)}
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${collab.payment_status === 'Paid' ? 'bg-green-500 border-green-500 text-white' : 'border-muted-foreground/30 text-transparent hover:border-primary'}`}
              >
                <CheckCircle2 className="w-6 h-6 fill-current" />
              </button>
            </div>
          ))}
        </div>

        <div className="hidden md:block">
          {viewMode === 'table' ? (
            <CollabTable
              key={refreshKey}
              onEdit={handleEdit}
              data={filteredData}
            />
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-2">
              <CollabKanban
                data={filteredData}
                onMove={handleMove} // 👈 Added this prop
              />
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Collaborations;