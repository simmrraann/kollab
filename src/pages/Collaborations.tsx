import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { AppLayout } from '@/components/layout/AppLayout';
import { CollabForm } from '@/components/collaborations/CollabForm';
import { CollabTable } from '@/components/collaborations/CollabTable';
import { CollabKanban } from '@/components/collaborations/CollabKanban';
import { Button } from '@/components/ui/button';
import { Plus, LayoutGrid, List } from 'lucide-react';
import { toast } from 'sonner';

const Collaborations = () => {
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [viewMode, setViewMode] = useState<'table' | 'board'>('table');
  const [allData, setAllData] = useState<any[]>([]);
  
  // 🆕 NEW: State to store the item we want to edit
  const [editingCollab, setEditingCollab] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from('collaborations').select('*').order('created_at', { ascending: false });
      if (data) setAllData(data);
    };
    fetchData();
  }, [refreshKey]);

  // 🆕 NEW: Handler for clicking "Edit"
  const handleEdit = (collab: any) => {
    setEditingCollab(collab); // Save the data
    setShowForm(true);        // Open the modal
  };

  const handleSuccess = () => {
    toast.success(editingCollab ? "Collaboration updated!" : "Collaboration saved!");
    setRefreshKey(prev => prev + 1);
    setShowForm(false);
    setEditingCollab(null); // Clear edit state
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingCollab(null); // Clear edit state on close
  };

  return (
    <AppLayout title="Collaborations" subtitle="Manage all your brand partnerships.">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex bg-secondary/50 p-1 rounded-lg w-fit">
            <button 
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-md transition-all ${viewMode === 'table' ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <List className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('board')}
              className={`p-2 rounded-md transition-all ${viewMode === 'board' ? 'bg-white shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <Button onClick={() => setShowForm(true)} className="btn-calm">
            <Plus className="w-4 h-4 mr-2" />
            Add Collaboration
          </Button>
        </div>

        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
             <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto">
               <CollabForm 
                 onClose={handleClose} 
                 onSuccess={handleSuccess} 
                 initialData={editingCollab} // 🆕 Pass the data to the form
               />
             </div>
          </div>
        )}

        {viewMode === 'table' ? (
           <CollabTable keyProp={refreshKey} onEdit={handleEdit} /> 
        ) : (
           <div className="animate-in fade-in slide-in-from-bottom-2">
             <CollabKanban data={allData} />
           </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Collaborations;